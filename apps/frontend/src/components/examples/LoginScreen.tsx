import LoginScreen from '../AuthScreen';

export default function LoginScreenExample() {
  return (
    <LoginScreen
      onLogin={(phone) => console.log('Login successful:', phone)}
      onGuestMode={() => console.log('Guest mode selected')}
    />
  );
}