import GuideChatbot from '../GuideChatbot';

export default function GuideChatbotExample() {
  return (
    <div className="h-[600px] max-w-md mx-auto border rounded-lg overflow-hidden">
      <GuideChatbot
        language="en"
        userLocation={{ lat: 15.2993, lng: 74.1240 }} // Goa coordinates
        onLocationRequest={() => console.log('Location requested')}
      />
    </div>
  );
}