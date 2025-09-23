import JourneyPlanning from '../JourneyPlanning';

export default function JourneyPlanningExample() {
  return (
    <JourneyPlanning
      onTouristIdGenerated={(touristId) => console.log('Tourist ID generated:', touristId)}
      onBack={() => console.log('Back to home')}
    />
  );
}