import ActivatedTourMode from '../ActivatedTourMode';

export default function ActivatedTourModeExample() {
  // Mock tourist ID that expires in 2 days
  const mockTouristId = {
    id: 'TID-2024-001234',
    destination: 'Goa Tourism',
    validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    status: 'active' as const
  };

  return (
    <ActivatedTourMode
      touristId={mockTouristId}
      onSOS={() => console.log('SOS activated!')}
      onNavigate={(feature) => console.log('Navigate to feature:', feature)}
    />
  );
}