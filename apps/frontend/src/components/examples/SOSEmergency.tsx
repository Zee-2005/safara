import SOSEmergency from '../SOSEmergency';

export default function SOSEmergencyExample() {
  return (
    <SOSEmergency
      userLocation={{ lat: 15.2993, lng: 74.1240 }} // Goa coordinates
      onCancel={() => console.log('SOS cancelled')}
      onEscalate={() => console.log('Escalated to ERSS-112')}
    />
  );
}