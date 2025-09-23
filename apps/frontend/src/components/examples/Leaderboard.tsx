import Leaderboard from '../Leaderboard';

export default function LeaderboardExample() {
  return (
    <Leaderboard
      isGuest={false}
      onBack={() => console.log('Back to home')}
    />
  );
}