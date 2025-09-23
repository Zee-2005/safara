import { useState } from 'react';
import MapComponent from '../MapComponent';

export default function MapComponentExample() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="p-4">
      <MapComponent
        userLocation={{ lat: 15.2993, lng: 74.1240 }} // Goa coordinates
        onGeofenceAlert={(geofence) => console.log('Geofence alert:', geofence)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      />
    </div>
  );
}