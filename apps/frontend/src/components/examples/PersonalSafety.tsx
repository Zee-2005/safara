import PersonalSafety from '../PersonalSafety';

export default function PersonalSafetyExample() {
  return (
    <PersonalSafety
      isGuest={false}
      onBack={() => console.log('Back to home')}
    />
  );
}