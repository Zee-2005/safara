import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Users, 
  MessageCircle, 
  Clock,
  QrCode,
  ChevronRight
} from 'lucide-react';

interface TouristId {
  id: string;
  destination: string;
  validUntil: Date;
  status: 'active' | 'expiring' | 'expired';
}

interface ActivatedTourModeProps {
  touristId: TouristId;
  onSOS: () => void;
  onNavigate: (feature: string) => void;
}

export default function ActivatedTourMode({ touristId, onSOS, onNavigate }: ActivatedTourModeProps) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const diff = touristId.validUntil.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeRemaining(`${minutes}m remaining`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [touristId.validUntil]);

  const features = [
    {
      id: 'verify-identity',
      title: 'Verify Identity',
      description: 'Show QR code for offline verification',
      icon: QrCode,
      color: 'bg-safety-blue',
      urgent: false
    },
    {
      id: 'track-location',
      title: 'Track Location',
      description: 'View map with geofence alerts',
      icon: MapPin,
      color: 'bg-safety-green',
      urgent: false
    },
    {
      id: 'family-circle',
      title: 'Family Circle',
      description: 'Share location with trusted contacts',
      icon: Users,
      color: 'bg-primary',
      urgent: false
    },
    {
      id: 'guide-chatbot',
      title: 'Guide Chatbot',
      description: 'Get local safety information',
      icon: MessageCircle,
      color: 'bg-safety-yellow',
      urgent: false
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    onNavigate(featureId);
    console.log('Navigating to feature:', featureId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Tourist ID Status */}
      <div className="bg-safety-blue text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Tour Mode Active</h1>
            <p className="text-sm opacity-90">{touristId.destination}</p>
          </div>
          <div className="text-right">
            <Badge 
              variant={touristId.status === 'active' ? 'secondary' : 'destructive'}
              className="mb-1"
            >
              {touristId.status.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{timeRemaining}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Button - Prominent */}
      <div className="p-4">
        <Button
          size="lg"
          className="w-full h-16 bg-safety-red hover:bg-safety-red/90 text-white text-lg font-bold"
          onClick={onSOS}
          data-testid="button-sos"
        >
          <AlertTriangle className="w-6 h-6 mr-2" />
          EMERGENCY SOS
        </Button>
        
        <p className="text-center text-sm text-muted-foreground mt-2">
          Press and hold for 3 seconds to activate emergency protocols
        </p>
      </div>

      {/* Feature Grid */}
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Safety Features</h2>
        
        <div className="grid grid-cols-1 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="p-4 hover-elevate cursor-pointer"
                onClick={() => handleFeatureClick(feature.id)}
                data-testid={`card-${feature.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-safety-green rounded-full"></div>
              <span className="text-sm font-medium">Location Tracking</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active</p>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-safety-blue rounded-full"></div>
              <span className="text-sm font-medium">Safety Alerts</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Monitoring</p>
          </Card>
        </div>
      </div>
    </div>
  );
}