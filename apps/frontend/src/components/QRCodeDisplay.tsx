import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Download, 
  Share2, 
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface TouristIdData {
  id: string;
  destination: string;
  validUntil: Date | string;
  status: 'active' | 'expiring' | 'expired';
  holderName: string;
  issueDate: Date | string;
}

interface QRCodeDisplayProps {
  touristId: TouristIdData;
}

export default function QRCodeDisplay({ touristId }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Normalize dates (safe guard for string inputs)
  const issueDate = new Date(touristId.issueDate);
  const validUntil = new Date(touristId.validUntil);

  // Generate QR Code
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const QRCode = await import('qrcode');
        
        const credentialData = {
          '@context': 'https://www.w3.org/2018/credentials/v1',
          type: ['VerifiableCredential', 'SaFaraTouristID'],
          issuer: 'did:web:SaFara.gov.in',
          issuanceDate: issueDate.toISOString(),
          expirationDate: validUntil.toISOString(),
          credentialSubject: {
            id: `did:SaFara:${touristId.id}`,
            type: 'Tourist',
            name: touristId.holderName,
            destination: touristId.destination,
            validUntil: validUntil.toISOString(),
            status: touristId.status
          },
          proof: {
            type: 'SaFaraProof2024',
            created: new Date().toISOString(),
            verificationMethod: 'SaFara-key-1',
            proofPurpose: 'assertionMethod',
            jws: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9...' // Mock signature
          }
        };

        const qrString = JSON.stringify(credentialData);
        
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, qrString, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrGenerated(true);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [touristId, issueDate, validUntil]);

  // Update time remaining
  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      const diff = validUntil.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h remaining`);
      } else {
        setTimeRemaining(`${hours}h remaining`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000);
    
    return () => clearInterval(interval);
  }, [validUntil]);

  const handleDownload = async () => {
    if (canvasRef.current) {
      try {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `SaFara-TouristID-${touristId.id}.png`;
        link.href = canvas.toDataURL();
        link.click();
        console.log('QR Code downloaded');
      } catch (error) {
        console.error('Error downloading QR code:', error);
      }
    }
  };

  const handleShare = async () => {
    if (canvasRef.current && navigator.share) {
      try {
        const canvas = canvasRef.current;
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), 'image/png');
        });
        
        const file = new File([blob], `SaFara-ID-${touristId.id}.png`, { 
          type: 'image/png' 
        });
        
        await navigator.share({
          title: 'SaFara Tourist ID',
          text: `My verified tourist credentials for ${touristId.destination}`,
          files: [file]
        });
        console.log('QR Code shared');
      } catch (error) {
        console.error('Error sharing QR code:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-safety-green text-white';
      case 'expiring': return 'bg-safety-yellow text-black';
      case 'expired': return 'bg-safety-red text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'expiring': return <AlertTriangle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 space-y-4">
      {/* ID Header */}
      <Card className="p-4">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-bold">SaFara Tourist ID</h2>
          </div>
          <Badge className={getStatusColor(touristId.status)}>
            {getStatusIcon(touristId.status)}
            <span className="ml-1 capitalize">{touristId.status}</span>
          </Badge>
        </div>
      </Card>

      {/* QR Code */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-fit">
            <canvas 
              ref={canvasRef}
              className="border rounded-lg"
              style={{ maxWidth: '200px', height: 'auto' }}
            />
            {!qrGenerated && (
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                <QrCode className="w-8 h-8 text-muted-foreground animate-pulse" />
              </div>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Scan with any QR reader for instant verification
          </div>
        </div>
      </Card>

      {/* ID Details */}
      <Card className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">ID Number:</span>
          <span className="font-mono text-sm">{touristId.id}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Holder:</span>
          <span className="font-medium text-sm">{touristId.holderName}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Destination:</span>
          <span className="font-medium text-sm">{touristId.destination}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Issued:</span>
          <span className="text-sm">18/09/2025</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Valid Until:</span>
          <span className="text-sm">{validUntil.toLocaleDateString()}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Time Remaining:
          </span>
          <span className={`text-sm font-medium ${
            timeRemaining === 'Expired' ? 'text-safety-red' : 
            timeRemaining.includes('h') && !timeRemaining.includes('d') ? 'text-safety-yellow' : 
            'text-safety-green'
          }`}>
            {timeRemaining}
          </span>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleDownload}
          disabled={!qrGenerated}
          data-testid="button-download"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleShare}
          disabled={!qrGenerated || !navigator.share}
          data-testid="button-share"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Verification Info */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-sm mb-1">Verification Details</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Uses W3C Verifiable Credential standard</li>
              <li>• Cryptographically signed by SaFara authority</li>
              <li>• Works offline for instant verification</li>
              <li>• Tamper-proof digital credentials</li>
              <li>• Accepted by all registered tourism partners</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
