import { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { queryClient } from './lib/queryClient';

// Component imports
import LanguageSelector from '@/components/LanguageSelector';
import AuthScreen from '@/components/AuthScreen'; // Replaces LoginScreen
import HomeScreen from '@/components/HomeScreen';
import ActivatedTourMode from '@/components/ActivatedTourMode';
import SOSEmergency from '@/components/SOSEmergency';
import PersonalIdCreation from '@/components/PersonalIdCreation';
import JourneyPlanning from '@/components/JourneyPlanning';
import PersonalSafety from '@/components/PersonalSafety';
import FeedbackSystem from '@/components/FeedbackSystem';
import Leaderboard from '@/components/Leaderboard';
import MapComponent from '@/components/MapComponent';
import GuideChatbot from '@/components/GuideChatbot';
import QRCodeDisplay from '@/components/QRCodeDisplay';

// Define the main application state types
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

  // Application state
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [user, setUser] = useState<User | null>(null);
  const [touristId, setTouristId] = useState<TouristId | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  // Get user location on app start
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log('User location obtained');
        },
        (_error) => {
          // Default to Goa coordinates if location access denied
          console.log('Location access denied, using default location');
          setUserLocation({ lat: 15.2993, lng: 74.1240 });
        }
      );
    } else {
      setUserLocation({ lat: 15.2993, lng: 74.1240 });
    }
  }, []);

  // Check for valid Tourist ID and determine mode
  const isActivatedMode =
    touristId && touristId.status === 'active' && new Date() < touristId.validUntil;

  // Navigation handlers
  const handleLanguageSelect = (language: string) => {
    setCurrentLanguage(language);
    console.log('Language set to:', language);
  };

  const handleLogin = (phoneOrEmail: string) => {
    setUser({ phone: phoneOrEmail, isGuest: false });
    navigate('/home');
  };

  const handleGuestMode = () => {
    setUser({ phone: '', isGuest: true });
    navigate('/home');
  };

  const handlePersonalIdComplete = (idData: any) => {
    if (user) {
      setUser({ ...user, personalId: idData });
    }
    navigate('/home');
  };

  const handleTouristIdGenerated = (newTouristId: any) => {
    const touristIdWithDetails: TouristId = {
      ...newTouristId,
      holderName: user?.isGuest ? 'Guest User' : 'Raul Handa', // Example; replace with profile data
    };
    setTouristId(touristIdWithDetails);
    navigate('/activated-mode');
  };

  const handleSOSActivation = () => {
    navigate('/sos-emergency');
  };

  const handleSOSCancel = () => {
    navigate(isActivatedMode ? '/activated-mode' : '/home');
  };

  const handleSOSEscalate = () => {
    console.log('SOS escalated to ERSS-112');
    alert('Connecting to Emergency Services (112)...\n\nIn a real emergency, this would:\n• Open the official 112 India app\n• Share your location with authorities\n• Connect you to emergency services');
    navigate(isActivatedMode ? '/activated-mode' : '/home');
  };

  const handleNavigateToSection = (section: string) => {
    switch (section) {
      case 'personal-id':
        navigate('/personal-id-creation');
        break;
      case 'plan-journey':
        navigate('/journey-planning');
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
      case 'family-circle':
        alert('Family Circle feature would allow:\n• Real-time location sharing with trusted contacts\n• Offline peer-to-peer communication via WebRTC\n• Emergency notifications to family members\n• Group safety check-ins');
        break;
      case 'guide-chatbot':
        navigate('/guide-chatbot');
        break;
      default:
        console.log('Navigation to:', section);
    }
  };

  const handleGeofenceAlert = (geofence: any) => {
    console.log('Geofence alert:', geofence);
    if (geofence.type === 'danger') {
      alert(`⚠️ Safety Alert!\n\nYou are entering: ${geofence.name}\n${geofence.description}\n\nPlease exercise caution and consider alternative routes.`);
    }
  };

  // Auto-redirect logic
  useEffect(() => {
    if (location === '/' && !user) {
      navigate('/language-select');
    } else if (location === '/' && user) {
      navigate(isActivatedMode ? '/activated-mode' : '/home');
    }
  }, [location, user, isActivatedMode, navigate]);

  return (
    <Switch>
      <Route path="/language-select">
        <LanguageSelector
          onLanguageSelect={handleLanguageSelect}
          onContinue={() => navigate('/login')}
        />
      </Route>

      <Route path="/login">
        <AuthScreen
          onLogin={handleLogin}
          onGuestMode={handleGuestMode}
        />
      </Route>

      <Route path="/home">
        <HomeScreen
          userPhone={user?.phone}
          isGuest={user?.isGuest}
          onNavigate={handleNavigateToSection}
        />
      </Route>

      <Route path="/activated-mode">
        {isActivatedMode && touristId ? (
          <ActivatedTourMode
            touristId={touristId}
            onSOS={handleSOSActivation}
            onNavigate={handleNavigateToSection}
          />
        ) : (
          <HomeScreen
            userPhone={user?.phone}
            isGuest={user?.isGuest}
            onNavigate={handleNavigateToSection}
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

      <Route path="/personal-id-creation">
        <PersonalIdCreation
          onComplete={handlePersonalIdComplete}
          onBack={() => navigate('/home')}
        />
      </Route>

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
        <FeedbackSystem
          onBack={() => navigate(isActivatedMode ? '/activated-mode' : '/home')}
        />
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
              onLocationRequest={() => console.log('Location requested')}
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

      {/* Default route - redirect to appropriate screen */}
      <Route>
        {!user ? (
          <LanguageSelector
            onLanguageSelect={handleLanguageSelect}
            onContinue={() => navigate('/login')}
          />
        ) : isActivatedMode ? (
          <ActivatedTourMode
            touristId={touristId!}
            onSOS={handleSOSActivation}
            onNavigate={handleNavigateToSection}
          />
        ) : (
          <HomeScreen
            userPhone={user?.phone}
            isGuest={user?.isGuest}
            onNavigate={handleNavigateToSection}
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
