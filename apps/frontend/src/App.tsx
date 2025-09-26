import { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { queryClient } from './lib/queryClient';

// Session utilities
import {
  setSession,
  getSession,
  clearSession,
  clearUserPidData,
  getUserItem,
} from '@/lib/session';

// Component imports
import LanguageSelector from '@/components/LanguageSelector';
import AuthScreen from '@/components/AuthScreen';
import HomeScreen from '@/components/HomeScreen';
import ActivatedTourMode from '@/components/ActivatedTourMode';
import SOSEmergency from '@/components/SOSEmergency';
import PersonalIdCreation from '@/components/PersonalIdCreation';
import PersonalIdDocsUpload from '@/components/PersonalIdDocsUpload';
import JourneyPlanning from '@/components/JourneyPlanning';
import PersonalSafety from '@/components/PersonalSafety';
import FeedbackSystem from '@/components/FeedbackSystem';
import Leaderboard from '@/components/Leaderboard';
import MapComponent from '@/components/MapComponent';
import GuideChatbot from '@/components/GuideChatbot';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import PersonalIdDetails from '@/components/PersonalIdDetails';

// NEW trip planning pages
import PlanTripHub from '@/components/PlanTripHub';
import AgencyBrowse from '@/components/AgencyBrowse';
import DirectIdQuick from '@/components/DirectIdQuick';
import TouristIdGenerate from '@/components/TouristIdGenerate';

import { getMyTrips } from '@/lib/tourist.service';
import TouristIdDocs from '@/components/TouristIdDocs';
// Types
interface User {
  phone: string;
  isGuest: boolean;
  personalId?: {
    status: 'pending' | 'verified' | 'rejected';
    submittedAt: string;
  };
}

interface TouristId {
  id: string;
  destination: string;
  validUntil: Date;
  status: 'active' | 'expiring' | 'expired';
  holderName: string;
  issueDate: Date;
  itinerary?: any;
  agency?: any;
}

function Router() {
  const [location, navigate] = useLocation();

  // App state
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [user, setUser] = useState<User | null>(null);
  const [touristId, setTouristId] = useState<TouristId | null>(null);

  useEffect(() => {
  let cancelled = false;
  (async () => {
    if (!user) return;
    try {
      const data = await getMyTrips();
      const active = (data.trips || []).find(t => t.status === 'active');
      if (!active || cancelled) return;

      // Hydrate touristId state for ActivatedTourMode
      setTouristId({
        id: active.tid,
        destination: active.destination || '',
        validUntil: active.endDate ? new Date(active.endDate) : new Date(),
        status: 'active',
        holderName: user.isGuest ? 'Guest User' : (user.phone || 'User'),
        issueDate: new Date(), // server createdAt optional to map
        itinerary: undefined,
        agency: undefined,
      } as any);

      // Navigate to active mode
      navigate('/activated-mode');
    } catch {
      // ignore
    }
  })();
  return () => { cancelled = true; };
}, [user]); // runs on login/refresh
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  // Hydrate from session on load
  useEffect(() => {
    const s = getSession();
    if (s?.userId) {
      setUser({ phone: s.userId, isGuest: false });
    }
  }, []);

  // Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setUserLocation({ lat: 15.2993, lng: 74.1240 }) // Goa fallback
      );
    } else {
      setUserLocation({ lat: 15.2993, lng: 74.1240 });
    }
  }, []);

  useEffect(() => {
  const id = getUserItem('tourist_id');
  const start = getUserItem('tourist_id_start');
  const end = getUserItem('tourist_id_end');
  const dest = getUserItem('tourist_id_destination');
  const status = getUserItem('tourist_id_status') as 'active' | 'scheduled' | 'expired' | null;
  const created = getUserItem('tourist_id_created');
  if (id && status) {
    setTouristId({
      id,
      destination: dest || '',
      validUntil: end ? new Date(end) : new Date(),
      status,
      holderName: user?.isGuest ? 'Guest User' : (user?.phone || 'User'),
      issueDate: created ? new Date(created) : new Date(),
      itinerary: getUserItem('tourist_id_itinerary') || '',
      agency: getUserItem('tourist_id_agency') || '',
    } as any);
  }
}, [user]);

  // Activated mode check
  const isActivatedMode =
    !!touristId && touristId.status === 'active' && new Date() < touristId.validUntil;

  // Handlers
  const handleLanguageSelect = (language: string) => setCurrentLanguage(language);

  const handleLogin = (phoneOrEmail: string) => {
    setSession(phoneOrEmail);
    setUser({ phone: phoneOrEmail, isGuest: false });
    navigate('/home');
  };

  function handleLogout() {
    clearUserPidData();
    clearSession();
    setUser(null);
    navigate('/login');
  }

  const handleGuestMode = () => {
    clearSession();
    setUser({ phone: '', isGuest: true });
    navigate('/home');
  };

  const handlePersonalIdComplete = (idData: any) => {
    if (user) setUser({ ...user, personalId: idData });
    navigate('/home');
  };

  const handleTouristIdGenerated = (newTouristId: any) => {
    const holderName = user?.isGuest ? 'Guest User' : (user?.phone || 'User');
    const touristIdWithDetails: TouristId = { ...newTouristId, holderName };
    setTouristId(touristIdWithDetails);
    navigate('/activated-mode');
  };

  const handleSOSActivation = () => navigate('/sos-emergency');
  const handleSOSCancel = () => navigate(isActivatedMode ? '/activated-mode' : '/home');
  const handleSOSEscalate = () => {
    alert('Connecting to Emergency Services (112)...');
    navigate(isActivatedMode ? '/activated-mode' : '/home');
  };

  const handleNavigateToSection = (section: string) => {
    switch (section) {
      case 'personal-id': {
        const pid = getUserItem('pid_personal_id');
        navigate(pid ? '/personal-id-details' : '/personal-id-creation');
        break;
      }
      case 'plan-journey':
        navigate('/plan-trip'); // open trip hub
        break;
      case 'personal-safety':
        navigate('/personal-safety');
        break;
      case 'feedback':
        navigate('/feedback');
        break;
      case 'leaderboard':
        navigate('/leaderboard');
        break;
      case 'verify-identity':
        navigate('/qr-code');
        break;
      case 'track-location':
        navigate('/map');
        break;
      case 'guide-chatbot':
        navigate('/guide-chatbot');
        break;
      default:
        break;
    }
  };

  const handleGeofenceAlert = (geofence: any) => {
    if (geofence.type === 'danger') {
      alert(`Safety Alert!\n\nEntering: ${geofence.name}\n${geofence.description}`);
    }
  };

  // Default redirect
  useEffect(() => {
    if (location === '/' && !user) navigate('/language-select');
    else if (location === '/' && user) navigate(isActivatedMode ? '/activated-mode' : '/home');
  }, [location, user, isActivatedMode, navigate]);

  // Read user-scoped applicationId for docs route
  const applicationId = getUserItem('pid_application_id') || '';

  return (
    <Switch>
      <Route path="/language-select">
        <LanguageSelector onLanguageSelect={handleLanguageSelect} onContinue={() => navigate('/login')} />
      </Route>

      <Route path="/login">
        <AuthScreen onLogin={handleLogin} onGuestMode={handleGuestMode} />
      </Route>

      <Route path="/home">
        <HomeScreen
          userPhone={user?.phone}
          isGuest={user?.isGuest}
          onNavigate={handleNavigateToSection}
          onLogout={handleLogout}
        />
      </Route>

      <Route path="/personal-id-creation">
        <PersonalIdCreation onComplete={handlePersonalIdComplete} onBack={() => navigate('/home')} />
      </Route>

      <Route path="/personal-id-docs">
        <PersonalIdDocsUpload
          applicationId={applicationId}
          onBack={() => navigate('/personal-id-creation')}
          onDone={() => navigate('/home')}
        />
      </Route>

      <Route path="/personal-id-details">
        <PersonalIdDetails
          onBack={() => navigate('/home')}
          onShowQr={() => navigate('/qr-code')}
        />
      </Route>

      {/* New trip planning flow */}
      <Route path="/plan-trip">
        <PlanTripHub />
      </Route>

      <Route path="/plan-trip/agencies">
        <AgencyBrowse />
      </Route>

      <Route path="/plan-trip/direct">
        <DirectIdQuick />
      </Route>

      <Route path="/tourist-id-generate">
        <TouristIdGenerate />
      </Route>
      <Route path="/tourist-id-docs">
  <TouristIdDocs />
</Route>

      <Route path="/activated-mode">
        {isActivatedMode && touristId ? (
          <ActivatedTourMode
  touristId={touristId as any}
  onSOS={handleSOSActivation}
  onNavigate={handleNavigateToSection}
  onLogout={handleLogout} // NEW
/>
        ) : (
          <HomeScreen
            userPhone={user?.phone}
            isGuest={user?.isGuest}
            onNavigate={handleNavigateToSection}
            onLogout={handleLogout}
          />
        )}
      </Route>

      <Route path="/sos-emergency">
        <SOSEmergency
          userLocation={userLocation || undefined}
          onCancel={handleSOSCancel}
          onEscalate={handleSOSEscalate}
        />
      </Route>

      {/* Legacy route (optional to remove later) */}
      <Route path="/journey-planning">
        <JourneyPlanning
          onTouristIdGenerated={handleTouristIdGenerated}
          onBack={() => navigate('/home')}
        />
      </Route>

      <Route path="/personal-safety">
        <PersonalSafety
          isGuest={user?.isGuest}
          onBack={() => navigate(isActivatedMode ? '/activated-mode' : '/home')}
        />
      </Route>

      <Route path="/feedback">
        <FeedbackSystem onBack={() => navigate(isActivatedMode ? '/activated-mode' : '/home')} />
      </Route>

      <Route path="/leaderboard">
        <Leaderboard
          isGuest={user?.isGuest}
          onBack={() => navigate(isActivatedMode ? '/activated-mode' : '/home')}
        />
      </Route>

      <Route path="/map">
        <div className="h-screen">
          <MapComponent
            userLocation={userLocation || undefined}
            onGeofenceAlert={handleGeofenceAlert}
            isFullscreen={isMapFullscreen}
            onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
          />
          {!isMapFullscreen && (
            <div className="absolute top-4 left-4">
              <button
                onClick={() => navigate(isActivatedMode ? '/activated-mode' : '/home')}
                className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                ←
              </button>
            </div>
          )}
        </div>
      </Route>

      <Route path="/guide-chatbot">
        <div className="h-screen flex flex-col">
          <div className="bg-card border-b p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(isActivatedMode ? '/activated-mode' : '/home')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ←
              </button>
              <h1 className="text-xl font-bold">SaFara Guide</h1>
            </div>
          </div>
          <div className="flex-1">
            <GuideChatbot
              language={currentLanguage}
              userLocation={userLocation || undefined}
              onLocationRequest={() => {}}
            />
          </div>
        </div>
      </Route>

      <Route path="/qr-code">
        <div className="min-h-screen bg-background">
          <div className="bg-card border-b p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/activated-mode')}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ←
              </button>
              <h1 className="text-xl font-bold">Tourist ID Verification</h1>
            </div>
          </div>
          {touristId && <QRCodeDisplay touristId={touristId} />}
        </div>
      </Route>

      {/* Default route */}
      <Route>
        {!user ? (
          <LanguageSelector onLanguageSelect={handleLanguageSelect} onContinue={() => navigate('/login')} />
        ) : isActivatedMode ? (
          <ActivatedTourMode touristId={touristId!} onSOS={handleSOSActivation} onNavigate={handleNavigateToSection}
          onLogout={handleLogout} />
        ) : (
          <HomeScreen
            userPhone={user?.phone}
            isGuest={user?.isGuest}
            onNavigate={handleNavigateToSection}
            onLogout={handleLogout}
          />
        )}
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background font-sans">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
