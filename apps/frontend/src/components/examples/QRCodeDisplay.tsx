import QRCodeDisplay from '../QRCodeDisplay';

export default function QRCodeDisplayExample() {
  // Mock tourist ID data
  const mockTouristId = {
    id: 'TID-2024-001234',
    destination: 'Goa Tourism',
    validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    status: 'active' as const,
    holderName: 'Raul Handa',
    issueDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  };

  return (
    <QRCodeDisplay touristId={mockTouristId} />
  );
}