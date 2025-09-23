import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Camera, 
  Mic, 
  Clock,
  ExternalLink,
  Shield
} from 'lucide-react';

interface SOSEmergencyProps {
  userLocation?: { lat: number; lng: number };
  onCancel: () => void;
  onEscalate: () => void;
}

export default function SOSEmergency({ userLocation, onCancel, onEscalate }: SOSEmergencyProps) {
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [stage, setStage] = useState<'confirmation' | 'details' | 'escalation'>('confirmation');

  useEffect(() => {
    if (stage === 'escalation' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'escalation' && countdown === 0) {
      handleEscalateToERSS();
    }
  }, [countdown, stage]);

  const handleConfirmSOS = () => {
    console.log('SOS confirmed - collecting details');
    setStage('details');
  };

  const handleSubmitDetails = async () => {
    try {
      // Create real SOS emergency via API
      const response = await fetch('/api/sos/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPhone: '+91-9876543210', // In real app, get from user context
          location: userLocation,
          description,
          emergencyContacts: [
            { name: 'Emergency Contact', phone: '+91-9876543210', relationship: 'Family' }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create emergency');
      }

      const result = await response.json();
      console.log('✅ SOS Emergency Created:', result);
      
      // Store emergency ID for escalation
      setStage('escalation');
      (window as any).currentEmergencyId = result.emergencyId;
      
    } catch (error) {
      console.error('❌ Error creating SOS emergency:', error);
      alert('Failed to create emergency alert. Please call 112 directly.');
    }
  };

  const handleEscalateToERSS = async () => {
    try {
      const emergencyId = (window as any).currentEmergencyId;
      
      if (emergencyId) {
        const response = await fetch(`/api/sos/${emergencyId}/escalate`, {
          method: 'POST',
        });

        if (response.ok) {
          const result = await response.json();
          console.log('🚨 Emergency escalated:', result);
        }
      }

      // Attempt to open phone dialer for emergency call
      const phoneNumber = '112';
      const telUrl = `tel:${phoneNumber}`;
      
      // Try to open the phone dialer
      window.location.href = telUrl;
      
      // Fallback: Show emergency information
      setTimeout(() => {
        const emergencyInfo = `
🚨 EMERGENCY - Call Immediately:
• India Emergency: 112
• Tourist Helpline: 1363
• Your location has been shared with authorities
• Emergency contacts have been notified

This is a real emergency alert - authorities are being contacted.
        `.trim();
        
        if (confirm(emergencyInfo + '\n\nPress OK to continue calling 112')) {
          window.open(telUrl, '_self');
        }
        
        onEscalate();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error escalating emergency:', error);
      // Fallback to direct call
      window.location.href = 'tel:112';
      onEscalate();
    }
  };

  const handleRecording = async () => {
    if (!isRecording) {
      try {
        // Request microphone permission and start recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: BlobPart[] = [];
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          console.log('🎙️ Audio recording completed:', audioBlob);
          
          // In real implementation, upload to server
          // For now, store locally
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('Audio URL:', audioUrl);
        };
        
        mediaRecorder.start();
        setIsRecording(true);
        console.log('🎙️ Started recording audio evidence');
        
        // Store recorder reference for stopping
        (window as any).mediaRecorder = mediaRecorder;
        
      } catch (error) {
        console.error('❌ Error accessing microphone:', error);
        alert('Could not access microphone for audio recording');
      }
    } else {
      // Stop recording
      const mediaRecorder = (window as any).mediaRecorder;
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      setIsRecording(false);
      console.log('🎙️ Stopped recording');
    }
  };

  const handleCamera = async () => {
    try {
      // Request camera permission and take photo
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Back camera preferred
        } 
      });
      
      // Create video element to capture frame
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.srcObject = stream;
      video.play();
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          
          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              console.log('📷 Photo captured:', blob);
              
              // In real implementation, upload to server
              const photoUrl = URL.createObjectURL(blob);
              console.log('Photo URL:', photoUrl);
              
              // Show success feedback
              alert('Photo captured successfully for emergency evidence');
            }
          }, 'image/jpeg', 0.8);
        }
        
        // Stop camera stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      console.log('📷 Camera activated for evidence capture');
      
    } catch (error) {
      console.error('❌ Error accessing camera:', error);
      alert('Could not access camera for photo evidence');
    }
  };

  if (stage === 'confirmation') {
    return (
      <div className="min-h-screen bg-safety-red/10 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="p-6 border-safety-red">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-safety-red rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-safety-red">Emergency Alert</h1>
                <p className="text-muted-foreground mt-2">
                  You are about to activate emergency protocols
                </p>
              </div>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-safety-red" />
                  <span>Location will be shared with emergency services</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-safety-red" />
                  <span>Emergency contacts will be notified</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-safety-red" />
                  <span>Incident will be logged with authorities</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button 
              size="lg"
              className="w-full bg-safety-red hover:bg-safety-red/90 text-white"
              onClick={handleConfirmSOS}
              data-testid="button-confirm-sos"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Confirm Emergency
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="w-full"
              onClick={onCancel}
              data-testid="button-cancel-sos"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'details') {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-safety-red text-white p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">Emergency Details</h1>
              <p className="text-sm opacity-90">Provide information about the situation</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Current Location</h3>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-safety-red" />
              <span>
                {userLocation 
                  ? `${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`
                  : 'Location being determined...'
                }
              </span>
              <Badge variant="secondary" className="ml-auto">Live</Badge>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Describe the Situation</h3>
            <Textarea
              placeholder="Briefly describe what happened or what help you need..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24"
              data-testid="textarea-description"
            />
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Add Evidence (Optional)</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleCamera}
                data-testid="button-camera"
              >
                <Camera className="w-4 h-4 mr-2" />
                Photo
              </Button>
              <Button 
                variant="outline"
                onClick={handleRecording}
                data-testid="button-recording"
                className={isRecording ? 'bg-safety-red/10 border-safety-red' : ''}
              >
                <Mic className="w-4 h-4 mr-2" />
                {isRecording ? 'Recording...' : 'Audio'}
              </Button>
            </div>
          </Card>

          <div className="space-y-2">
            <Button 
              size="lg"
              className="w-full bg-safety-red hover:bg-safety-red/90 text-white"
              onClick={handleSubmitDetails}
              data-testid="button-submit-details"
            >
              Send Emergency Alert
            </Button>
            <Button 
              variant="ghost"
              className="w-full"
              onClick={onCancel}
              data-testid="button-cancel-details"
            >
              Cancel Emergency
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-safety-red text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="animate-pulse">
          <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <Phone className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold mb-2">Connecting to Emergency Services</h1>
          <p className="text-white/80">Escalating to ERSS-112 system...</p>
        </div>

        <Card className="p-4 bg-white/10 border-white/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-mono">{countdown}s</span>
          </div>
          <p className="text-sm text-white/80">
            Automatically connecting to emergency services
          </p>
        </Card>

        <Button 
          size="lg"
          className="w-full bg-white text-safety-red hover:bg-white/90"
          onClick={handleEscalateToERSS}
          data-testid="button-connect-now"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Connect Now
        </Button>
      </div>
    </div>
  );
}