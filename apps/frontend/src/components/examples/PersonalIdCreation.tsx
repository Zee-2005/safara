import PersonalIdCreation from '../PersonalIdCreation';

export default function PersonalIdCreationExample() {
  return (
    <PersonalIdCreation
      onComplete={(idData) => console.log('Personal ID created:', idData)}
      onBack={() => console.log('Back to home')}
    />
  );
}