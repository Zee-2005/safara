import HomeScreen from '../HomeScreen';

export default function HomeScreenExample() {
  return (
    <HomeScreen
      userPhone="9876543210"
      isGuest={false}
      onNavigate={(section) => console.log('Navigate to:', section)}
    />
  );
}