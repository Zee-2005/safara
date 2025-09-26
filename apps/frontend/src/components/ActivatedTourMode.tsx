// src/components/ActivatedTourMode.tsx
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
  ChevronRight,
  LogOut
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
  onLogout: () => void; // NEW
}

export default function ActivatedTourMode({
  touristId,
  onSOS,
  onNavigate,
  onLogout, // NEW
}: ActivatedTourModeProps) {
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
      if (hours > 0) setTimeRemaining(`${hours}h ${minutes}m remaining`);
      else setTimeRemaining(`${minutes}m remaining`);
    };
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, [touristId.validUntil]);

  const features = [
    { id: 'verify-identity', title: 'Verify Identity', description: 'Show QR code for offline verification', icon: QrCode, color: 'bg-safety-blue', urgent: false },
    { id: 'track-location', title: 'Track Location', description: 'View map with geofence alerts', icon: MapPin, color: 'bg-safety-green', urgent: false },
    { id: 'family-circle', title: 'Family Circle', description: 'Share location with trusted contacts', icon: Users, color: 'bg-primary', urgent: false },
    { id: 'guide-chatbot', title: 'Guide Chatbot', description: 'Get local safety information', icon: MessageCircle, color: 'bg-safety-yellow', urgent: false },
  ];

  const handleFeatureClick = (featureId: string) => {
    onNavigate(featureId);
    console.log('Navigating to feature:', featureId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar with logout */}
      <div className="sticky top-0 z-10 bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-safety-blue" />
          <div className="text-sm">
            <div className="font-semibold">Tour Mode</div>
            <div className="text-muted-foreground">Active</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout} title="Logout">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Status card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Destination</div>
              <div className="text-lg font-semibold">{touristId.destination}</div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Clock className="w-3 h-3" />
              {timeRemaining || '—'}
            </Badge>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Press and hold for 3 seconds to activate emergency protocols
          </div>
          <div className="mt-3">
            <Button variant="destructive" className="w-full" onClick={onSOS}>
              SOS Emergency
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="space-y-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{feature.title}</h3>
                      {feature.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
