import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  AlertTriangle, 
  Shield, 
  Navigation, 
  Layers,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Mock geofence data
interface Geofence {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  type: 'danger' | 'caution' | 'safe' | 'restricted';
  description: string;
}

const mockGeofences: Geofence[] = [
  {
    id: 'gf1',
    name: 'High Crime Area',
    center: [15.2993, 74.1240],
    radius: 500,
    type: 'danger',
    description: 'Avoid this area especially after sunset'
  },
  {
    id: 'gf2', 
    name: 'Tourist Safe Zone',
    center: [15.2895, 74.1345],
    radius: 800,
    type: 'safe',
    description: 'Well-patrolled tourist area with good lighting'
  },
  {
    id: 'gf3',
    name: 'Construction Zone',
    center: [15.3100, 74.1180],
    radius: 300,
    type: 'caution',
    description: 'Active construction - watch for vehicles'
  },
  {
    id: 'gf4',
    name: 'Military Area',
    center: [15.2800, 74.1400],
    radius: 1000,
    type: 'restricted',
    description: 'Photography prohibited - restricted access'
  }
];

interface MapComponentProps {
  userLocation?: { lat: number; lng: number };
  onGeofenceAlert: (geofence: Geofence) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function MapComponent({ 
  userLocation, 
  onGeofenceAlert, 
  isFullscreen = false,
  onToggleFullscreen 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [activeGeofences, setActiveGeofences] = useState<Geofence[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        // Import Leaflet dynamically to avoid SSR issues
        const L = await import('leaflet');
        
        // Fix default marker icons for Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const mapInstance = L.map(mapRef.current).setView(
          userLocation ? [userLocation.lat, userLocation.lng] : [15.2993, 74.1240], 
          13
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        // Add user location marker
        if (userLocation) {
          const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
            color: '#2563eb',
            fillColor: '#2563eb',
            fillOpacity: 0.8,
            radius: 8
          }).addTo(mapInstance);

          userMarker.bindPopup('<b>Your Location</b>');

          // Add pulsing animation
          const pulseMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
            color: '#2563eb',
            fillColor: '#2563eb',
            fillOpacity: 0.2,
            radius: 15,
            className: 'pulse-marker'
          }).addTo(mapInstance);
        }

        // Add geofences
        mockGeofences.forEach(geofence => {
          const color = {
            danger: '#dc2626',
            caution: '#f59e0b', 
            safe: '#16a34a',
            restricted: '#7c2d12'
          }[geofence.type];

          const circle = L.circle(geofence.center, {
            color: color,
            fillColor: color,
            fillOpacity: 0.2,
            radius: geofence.radius
          }).addTo(mapInstance);

          const icon = {
            danger: '⚠️',
            caution: '⚡',
            safe: '✅',
            restricted: '🚫'
          }[geofence.type];

          circle.bindPopup(`
            <div>
              <b>${icon} ${geofence.name}</b><br>
              <small>${geofence.description}</small>
            </div>
          `);

          // Check if user is within geofence
          if (userLocation) {
            const distance = mapInstance.distance(
              [userLocation.lat, userLocation.lng], 
              geofence.center
            );
            
            if (distance <= geofence.radius && geofence.type !== 'safe') {
              setActiveGeofences(prev => [...prev, geofence]);
              onGeofenceAlert(geofence);
            }
          }
        });

        setMap(mapInstance);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [userLocation]);

  const handleCenterOnUser = () => {
    if (map && userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15);
      console.log('Centered on user location');
    }
  };

  const getGeofenceColor = (type: string) => {
    switch (type) {
      case 'danger': return 'bg-safety-red';
      case 'caution': return 'bg-safety-yellow';
      case 'safe': return 'bg-safety-green';
      case 'restricted': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-96'} bg-background`}>
      <div className="relative h-full">
        {/* Map Container */}
        <div 
          ref={mapRef} 
          className="w-full h-full rounded-lg"
          style={{ minHeight: '300px' }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto text-muted-foreground mb-2 animate-pulse" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {onToggleFullscreen && (
            <Button 
              size="icon" 
              variant="secondary"
              onClick={onToggleFullscreen}
              data-testid="button-toggle-fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          )}
          
          <Button 
            size="icon" 
            variant="secondary"
            onClick={handleCenterOnUser}
            disabled={!userLocation}
            data-testid="button-center-user"
          >
            <Navigation className="w-4 h-4" />
          </Button>
          
          <Button 
            size="icon" 
            variant="secondary"
            onClick={() => console.log('Layer options')}
            data-testid="button-layers"
          >
            <Layers className="w-4 h-4" />
          </Button>
        </div>

        {/* Active Geofence Alerts */}
        {activeGeofences.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-3 bg-background/95 backdrop-blur">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-safety-red flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">Active Geofence Alerts</h4>
                  <div className="space-y-1">
                    {activeGeofences.map(geofence => (
                      <div key={geofence.id} className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getGeofenceColor(geofence.type)} text-white`}
                        >
                          {geofence.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {geofence.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4">
          <Card className="p-2 bg-background/95 backdrop-blur">
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-safety-red rounded-full"></div>
                <span>Danger</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-safety-yellow rounded-full"></div>
                <span>Caution</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-safety-green rounded-full"></div>
                <span>Safe Zone</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .pulse-marker {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}