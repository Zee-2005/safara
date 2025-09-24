// src/components/HomeScreen.tsx
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield, MapPin, Heart, MessageSquare, Trophy, ChevronRight,
  User, Settings, CheckCircle, Copy, LogOut, Bell
} from 'lucide-react';
import { getSession, getUserItem } from '@/lib/session';
import { readTripDraft, clearTripDraft } from '@/lib/trip';
import { getMyTrips } from '@/lib/tourist.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface HomeScreenProps {
  userPhone?: string;
  isGuest?: boolean;
  onNavigate: (section: string) => void;
  onLogout?: () => void;
}

type TripItem = {
  tid: string;
  status: 'active' | 'scheduled' | 'expired';
  startDate: string;
  endDate: string;
  destination: string | null;
  travelerType: 'indian' | 'international';
};

export default function HomeScreen({ userPhone, isGuest = false, onNavigate, onLogout }: HomeScreenProps) {
  const s = getSession();
  const [personalId, setPersonalId] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [mobile, setMobile] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Trip draft preview (from TripPlanner)
  const [tripDraft, setTripDraft] = useState<ReturnType<typeof readTripDraft> | null>(null);

  // Backend trips for header bell
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [showTrips, setShowTrips] = useState(false);

  useEffect(() => {
    setPersonalId(getUserItem('pid_personal_id', s));
    setFullName(getUserItem('pid_full_name', s));
    setMobile(getUserItem('pid_mobile', s));
    setEmail(getUserItem('pid_email', s));
    const d = readTripDraft();
    if (d.endDate || d.destination || d.itinerary || d.mode) setTripDraft(d);
  }, [s]);

  useEffect(() => {
    if (isGuest) return;
    (async () => {
      try {
        const data = await getMyTrips();
        setTrips((data?.trips || []) as TripItem[]);
      } catch {
        // silent fail for now
      }
    })();
  }, [isGuest]);

  const sections = [
    { id: 'personal-id', title: 'Create Personal ID', description: 'Verify your identity for secure travel', icon: Shield, status: isGuest ? 'disabled' : 'available', color: 'bg-safety-blue', badge: isGuest ? null : 'Required' },
    { id: 'plan-journey', title: 'Plan Journey', description: 'Discover safe travel routes and destinations', icon: MapPin, status: 'available', color: 'bg-safety-green', badge: tripDraft ? 'Draft' : null },
    { id: 'personal-safety', title: 'Personal Safety', description: 'Emergency contacts and safety preferences', icon: Heart, status: isGuest ? 'limited' : 'available', color: 'bg-safety-red', badge: null },
    { id: 'feedback', title: 'Feedback', description: 'Share your travel experiences', icon: MessageSquare, status: 'available', color: 'bg-safety-yellow', badge: null },
    { id: 'leaderboard', title: 'Leaderboard', description: 'View safety achievements and rewards', icon: Trophy, status: isGuest ? 'view-only' : 'available', color: 'bg-primary', badge: null },
  ];

  const handleSectionClick = (id: string, status: string) => {
    if (status === 'disabled') return;
    if (id === 'personal-id') {
      if (personalId) onNavigate('personal-id-details');
      else onNavigate('personal-id');
      return;
    }
    onNavigate(id);
  };

  const copy = async (value?: string | null) => {
    if (!value) return;
    try { await navigator.clipboard.writeText(value); } catch {}
  };

  const hasPid = Boolean(personalId);
  const visibleSections = hasPid ? sections.filter(sx => sx.id !== 'personal-id') : sections;

  const resumeTrip = () => onNavigate('plan-journey');
  const clearTrip = () => { clearTripDraft(); setTripDraft(null); };

  const active = trips.filter(t => t.status === 'active');
  const upcoming = trips.filter(t => t.status === 'scheduled');
  const bellCount = active.length + upcoming.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">SaFara</h1>
            <p className="text-sm text-muted-foreground">{isGuest ? 'Guest Mode' : `Welcome, +91 ${userPhone}`}</p>
          </div>
          <div className="flex items-center gap-2">
            {!isGuest && (
              <Button size="icon" variant="ghost" onClick={() => setShowTrips(true)} title="Trips">
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {bellCount > 0 && (
                    <span className="absolute -top-1 -right-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1">
                      {bellCount}
                    </span>
                  )}
                </div>
              </Button>
            )}
            {!isGuest && (
              <Button size="icon" variant="ghost" data-testid="button-profile">
                <User className="w-5 h-5" />
              </Button>
            )}
            {!isGuest && (
              <Button size="icon" variant="ghost" onClick={onLogout} title="Logout">
                <LogOut className="w-5 h-5" />
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
              Sign in to access Personal ID and full safety tools.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Trip draft quick access (optional – re-enable if desired)
        {tripDraft && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-safety-green" />
                <h2 className="text-lg font-semibold">Trip draft in progress</h2>
                <Badge variant="secondary">{(tripDraft.mode || 'direct').toUpperCase()}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearTrip}>Clear</Button>
                <Button onClick={resumeTrip}>Resume</Button>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground">Start</div>
                <div className="text-sm">{tripDraft.startNow ? 'Right now' : (tripDraft.startDate || '—')}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">End</div>
                <div className="text-sm">{tripDraft.endDate || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Destination</div>
                <div className="text-sm">{tripDraft.destination || 'Auto-assign (not hometown)'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Agency</div>
                <div className="text-sm">{tripDraft.agencyId || '—'}</div>
              </div>
            </div>
          </Card>
        )} */}

        {/* Personal ID card */}
        {hasPid && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Digital Personal ID</h2>
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Verified
              </Badge>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Personal ID</div>
                <div className="flex items-center gap-2">
                  <code className="text-sm">{personalId}</code>
                  <Button variant="ghost" size="icon" onClick={() => copy(personalId)} title="Copy ID">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="text-sm">{fullName || '—'}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Mobile</div>
                <div className="text-sm">{mobile || userPhone || '—'}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-sm">{email || '—'}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => onNavigate('verify-identity')}>Show QR</Button>
              <Button variant="secondary" onClick={() => onNavigate('personal-id-details')}>View details</Button>
            </div>
          </Card>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-3">Travel Safety Hub</h2>
          <div className="space-y-3">
            {visibleSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card
                  key={section.id}
                  className={`p-4 hover-elevate cursor-pointer ${section.status === 'disabled' ? 'opacity-60' : ''}`}
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
                        {section.badge && <Badge variant="secondary" className="text-xs">{section.badge}</Badge>}
                        {section.status === 'disabled' && <Badge variant="destructive" className="text-xs">Login Required</Badge>}
                        {section.status === 'limited' && <Badge variant="outline" className="text-xs">Limited Access</Badge>}
                        {section.status === 'view-only' && <Badge variant="outline" className="text-xs">View Only</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="p-4 mt-6">
          <h3 className="font-medium mb-2">Safety Tip of the Day</h3>
          <p className="text-sm text-muted-foreground">
            Always inform a trusted contact about your travel plans and expected return time.
          </p>
        </Card>
      </div>

      {/* Trips dialog */}
      <Dialog open={showTrips} onOpenChange={setShowTrips}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your trips</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {[...active, ...upcoming].map(t => (
              <div key={t.tid} className="p-3 rounded-md border">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t.destination || 'Undisclosed'}</div>
                  <Badge variant={t.status === 'active' ? 'secondary' : 'outline'}>{t.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.startDate} → {t.endDate} • {t.travelerType.toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">TID: {t.tid}</div>
              </div>
            ))}
            {active.length === 0 && upcoming.length === 0 && (
              <div className="text-sm text-muted-foreground">No active or upcoming trips.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
