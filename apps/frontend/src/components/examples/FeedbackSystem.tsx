import FeedbackSystem from '../FeedbackSystem';

export default function FeedbackSystemExample() {
  return (
    <FeedbackSystem
      onBack={() => console.log('Back to home')}
    />
  );
}