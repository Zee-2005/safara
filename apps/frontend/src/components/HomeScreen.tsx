import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  MapPin, 
  Heart, 
  MessageSquare, 
  Trophy, 
  ChevronRight,
  User,
  Settings
} from 'lucide-react';

interface HomeScreenProps {
  userPhone?: string;
  isGuest?: boolean;
  onNavigate: (section: string) => void;
}

export default function HomeScreen({ userPhone, isGuest = false, onNavigate }: HomeScreenProps) {
  const sections = [
    {
      id: 'personal-id',
      title: 'Create Personal ID',
      description: 'Verify your identity for secure travel',
      icon: Shield,
      status: isGuest ? 'disabled' : 'available',
      color: 'bg-safety-blue',
      badge: isGuest ? null : 'Required'
    },
    {
      id: 'plan-journey',
      title: 'Plan Journey',
      description: 'Discover safe travel routes and destinations',
      icon: MapPin,
      status: 'available',
      color: 'bg-safety-green',
      badge: null
    },
    {
      id: 'personal-safety',
      title: 'Personal Safety',
      description: 'Emergency contacts and safety preferences',
      icon: Heart,
      status: isGuest ? 'limited' : 'available',
      color: 'bg-safety-red',
      badge: null
    },
    {
      id: 'feedback',
      title: 'Feedback',
      description: 'Share your travel experiences',
      icon: MessageSquare,
      status: 'available',
      color: 'bg-safety-yellow',
      badge: null
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      description: 'View safety achievements and rewards',
      icon: Trophy,
      status: isGuest ? 'view-only' : 'available',
      color: 'bg-primary',
      badge: null
    }
  ];

  const handleSectionClick = (sectionId: string, status: string) => {
    if (status === 'disabled') {
      console.log('Feature requires login');
      return;
    }
    onNavigate(sectionId);
    console.log('Navigating to:', sectionId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">SaFara</h1>
            <p className="text-sm text-muted-foreground">
              {isGuest ? 'Guest Mode' : `Welcome, +91 ${userPhone}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isGuest && (
              <Button size="icon" variant="ghost" data-testid="button-profile">
                <User className="w-5 h-5" />
              </Button>
            )}
            <Button size="icon" variant="ghost" data-testid="button-settings">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {isGuest && (
          <div className="mt-3 p-3 bg-safety-blue/10 rounded-lg">
            <p className="text-sm text-safety-blue">
              Sign in to access all features including Personal ID creation and full safety tools.
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-3">Travel Safety Hub</h2>
          <div className="space-y-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Card 
                  key={section.id}
                  className={`p-4 hover-elevate cursor-pointer ${
                    section.status === 'disabled' ? 'opacity-60' : ''
                  }`}
                  onClick={() => handleSectionClick(section.id, section.status)}
                  data-testid={`card-${section.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{section.title}</h3>
                        {section.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {section.badge}
                          </Badge>
                        )}
                        {section.status === 'disabled' && (
                          <Badge variant="destructive" className="text-xs">
                            Login Required
                          </Badge>
                        )}
                        {section.status === 'limited' && (
                          <Badge variant="outline" className="text-xs">
                            Limited Access
                          </Badge>
                        )}
                        {section.status === 'view-only' && (
                          <Badge variant="outline" className="text-xs">
                            View Only
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {section.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Tips */}
        <Card className="p-4 mt-6">
          <h3 className="font-medium mb-2">Safety Tip of the Day</h3>
          <p className="text-sm text-muted-foreground">
            Always inform a trusted contact about your travel plans and expected return time. 
            Keep emergency contacts easily accessible.
          </p>
        </Card>
      </div>
    </div>
  );
}