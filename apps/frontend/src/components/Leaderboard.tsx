import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Trophy, 
  ArrowLeft,
  Medal,
  Star,
  Shield,
  MapPin,
  MessageSquare,
  Award,
  Crown,
  TrendingUp
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  badges: string[];
  achievements: string[];
  monthlyPoints: number;
  safetyScore: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

const mockLeaderboard: LeaderboardUser[] = [
  {
    id: '1',
    name: 'Sarah Explorer',
    points: 2450,
    rank: 1,
    badges: ['Safety Champion', 'Cultural Guide', 'Feedback Hero'],
    achievements: ['First SOS Helper', 'Cultural Ambassador', '100 Safe Check-ins'],
    monthlyPoints: 680,
    safetyScore: 98
  },
  {
    id: '2',
    name: 'Alex Wanderer',
    points: 2180,
    rank: 2,
    badges: ['Adventure Seeker', 'Community Helper'],
    achievements: ['Mountain Guide', 'Beach Safety Expert'],
    monthlyPoints: 520,
    safetyScore: 95
  },
  {
    id: '3',
    name: 'Maya Traveler',
    points: 1950,
    rank: 3,
    badges: ['Safety First', 'Local Expert'],
    achievements: ['Heritage Guardian', 'Night Safety Guide'],
    monthlyPoints: 445,
    safetyScore: 92
  },
  {
    id: 'current',
    name: 'You',
    points: 850,
    rank: 12,
    badges: ['New Explorer'],
    achievements: ['First Journey', 'Safety Aware'],
    monthlyPoints: 180,
    safetyScore: 78
  }
];

const achievements: Achievement[] = [
  {
    id: '1',
    name: 'Safety Champion',
    description: 'Complete 50 safe check-ins without issues',
    icon: '🛡️',
    rarity: 'epic',
    points: 500
  },
  {
    id: '2',
    name: 'Cultural Ambassador',
    description: 'Share feedback on 10 cultural sites',
    icon: '🏛️',
    rarity: 'rare',
    points: 250
  },
  {
    id: '3',
    name: 'Community Helper',
    description: 'Help 5 travelers with emergency assistance',
    icon: '🤝',
    rarity: 'legendary',
    points: 1000
  },
  {
    id: '4',
    name: 'Feedback Hero',
    description: 'Provide 25 detailed travel reviews',
    icon: '💬',
    rarity: 'rare',
    points: 300
  }
];

interface LeaderboardProps {
  isGuest?: boolean;
  onBack: () => void;
}

export default function Leaderboard({ isGuest = false, onBack }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements' | 'profile'>('leaderboard');
  
  const currentUser = mockLeaderboard.find(user => user.id === 'current')!;
  const topUsers = mockLeaderboard.filter(user => user.id !== 'current').slice(0, 10);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-500';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-500" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium">#{rank}</span>;
  };

  const getBadgeColor = (badge: string) => {
    const colors = {
      'Safety Champion': 'bg-safety-green text-white',
      'Cultural Guide': 'bg-purple-500 text-white',
      'Feedback Hero': 'bg-blue-500 text-white',
      'Adventure Seeker': 'bg-orange-500 text-white',
      'Community Helper': 'bg-pink-500 text-white',
      'Safety First': 'bg-safety-blue text-white',
      'Local Expert': 'bg-emerald-500 text-white',
      'New Explorer': 'bg-gray-500 text-white'
    };
    return colors[badge as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const renderLeaderboardTab = () => (
    <div className="space-y-4">
      {/* Current User Stats */}
      {!isGuest && (
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{currentUser.name}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Rank #{currentUser.rank}</span>
                  <span>•</span>
                  <span>{currentUser.points} points</span>
                </div>
              </div>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{currentUser.monthlyPoints} this month
            </Badge>
          </div>
        </Card>
      )}

      {/* Top 3 Podium */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Safety Champions
        </h3>
        
        <div className="flex justify-center items-end gap-4 mb-6">
          {/* 2nd Place */}
          {topUsers[1] && (
            <div className="text-center">
              <Avatar className="w-12 h-12 mx-auto mb-2">
                <AvatarFallback className="bg-gray-500 text-white">
                  {topUsers[1].name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="w-16 h-12 bg-gray-200 rounded-t flex items-center justify-center">
                <Medal className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-xs font-medium mt-1">{topUsers[1].name.split(' ')[0]}</div>
              <div className="text-xs text-muted-foreground">{topUsers[1].points}</div>
            </div>
          )}
          
          {/* 1st Place */}
          {topUsers[0] && (
            <div className="text-center">
              <Avatar className="w-14 h-14 mx-auto mb-2">
                <AvatarFallback className="bg-yellow-500 text-white">
                  {topUsers[0].name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="w-16 h-16 bg-yellow-200 rounded-t flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-xs font-medium mt-1">{topUsers[0].name.split(' ')[0]}</div>
              <div className="text-xs text-muted-foreground">{topUsers[0].points}</div>
            </div>
          )}
          
          {/* 3rd Place */}
          {topUsers[2] && (
            <div className="text-center">
              <Avatar className="w-12 h-12 mx-auto mb-2">
                <AvatarFallback className="bg-amber-600 text-white">
                  {topUsers[2].name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="w-16 h-10 bg-amber-200 rounded-t flex items-center justify-center">
                <Medal className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-xs font-medium mt-1">{topUsers[2].name.split(' ')[0]}</div>
              <div className="text-xs text-muted-foreground">{topUsers[2].points}</div>
            </div>
          )}
        </div>
      </Card>

      {/* Full Leaderboard */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Full Rankings</h3>
        <div className="space-y-3">
          {topUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center justify-center w-8">
                {getRankIcon(user.rank)}
              </div>
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-sm">{user.name}</div>
                <div className="flex gap-1 mt-1">
                  {user.badges.slice(0, 2).map((badge) => (
                    <Badge key={badge} className={`text-xs ${getBadgeColor(badge)}`}>
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{user.points.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  {user.safetyScore}% safety
                </div>
              </div>
            </div>
          ))}
          
          {/* Current User in List */}
          {!isGuest && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-center w-8">
                <span className="text-sm font-medium">#{currentUser.rank}</span>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-sm">{currentUser.name} (You)</div>
                <div className="flex gap-1 mt-1">
                  {currentUser.badges.map((badge) => (
                    <Badge key={badge} className={`text-xs ${getBadgeColor(badge)}`}>
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{currentUser.points.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  {currentUser.safetyScore}% safety
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-yellow-600" />
          <div>
            <h3 className="font-semibold">Achievement Progress</h3>
            <p className="text-sm text-muted-foreground">
              Complete challenges to earn points and badges
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-3">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`p-4 ${getRarityColor(achievement.rarity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{achievement.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs capitalize ${
                      achievement.rarity === 'legendary' ? 'border-yellow-400 text-yellow-700' :
                      achievement.rarity === 'epic' ? 'border-purple-400 text-purple-700' :
                      achievement.rarity === 'rare' ? 'border-blue-400 text-blue-700' :
                      'border-gray-400 text-gray-700'
                    }`}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {achievement.description}
                </p>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">+{achievement.points} points</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={onBack} data-testid="button-back">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Safety Leaderboard</h1>
            <p className="text-sm text-muted-foreground">
              {isGuest ? 'Sign in to see your ranking' : 'Your safety achievements and ranking'}
            </p>
          </div>
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card border-b">
        <div className="flex">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'leaderboard' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('leaderboard')}
            data-testid="tab-leaderboard"
          >
            <Trophy className="w-4 h-4 mx-auto mb-1" />
            Rankings
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'achievements' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('achievements')}
            data-testid="tab-achievements"
          >
            <Award className="w-4 h-4 mx-auto mb-1" />
            Achievements
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'leaderboard' && renderLeaderboardTab()}
        {activeTab === 'achievements' && renderAchievementsTab()}

        {isGuest && (
          <Card className="p-4 mt-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Join the Safety Community</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Sign in to compete in the leaderboard, earn achievements, and help make travel safer for everyone.
              </p>
              <Button className="w-full">
                Sign In to Participate
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}