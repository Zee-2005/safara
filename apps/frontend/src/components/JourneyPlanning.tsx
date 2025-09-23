import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Clock,
  CheckCircle,
  ArrowRight,
  Bot,
  Building2,
  ChevronRight
} from 'lucide-react';

interface TravelAgency {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  verified: boolean;
  priceRange: string;
}

const mockAgencies: TravelAgency[] = [
  {
    id: '1',
    name: 'Goa Adventures',
    rating: 4.8,
    reviewCount: 156,
    specialties: ['Beach Tours', 'Water Sports', 'Cultural Sites'],
    verified: true,
    priceRange: '₹2,000-5,000'
  },
  {
    id: '2', 
    name: 'SafeTravel Goa',
    rating: 4.9,
    reviewCount: 203,
    specialties: ['Family Tours', 'Heritage Walks', 'Food Tours'],
    verified: true,
    priceRange: '₹1,500-4,000'
  },
  {
    id: '3',
    name: 'Coastal Explorers',
    rating: 4.6,
    reviewCount: 89,
    specialties: ['Adventure Sports', 'Backpacking', 'Wildlife'],
    verified: true,
    priceRange: '₹3,000-7,000'
  }
];

interface JourneyPlanningProps {
  onTouristIdGenerated: (touristId: any) => void;
  onBack: () => void;
}

export default function JourneyPlanning({ onTouristIdGenerated, onBack }: JourneyPlanningProps) {
  const [mode, setMode] = useState<'select' | 'agency' | 'ai' | 'confirm'>('select');
  const [selectedAgency, setSelectedAgency] = useState<TravelAgency | null>(null);
  const [aiPreferences, setAiPreferences] = useState({
    destination: '',
    duration: '',
    budget: '',
    interests: '',
    groupSize: '1'
  });
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAgencySelect = (agency: TravelAgency) => {
    setSelectedAgency(agency);
    setMode('confirm');
    console.log('Agency selected:', agency.name);
  };

  const handleAiSubmit = async () => {
    setIsLoading(true);
    // Simulate AI itinerary generation
    setTimeout(() => {
      const mockItinerary = {
        title: `${aiPreferences.destination} ${aiPreferences.duration}-Day Adventure`,
        days: [
          {
            day: 1,
            title: 'Arrival & Beach Exploration',
            activities: ['Check-in at hotel', 'Baga Beach visit', 'Local market tour'],
            safetyNotes: 'Stay in groups, avoid isolated areas after sunset'
          },
          {
            day: 2,
            title: 'Cultural Heritage Tour',
            activities: ['Old Goa churches', 'Spice plantation visit', 'Traditional lunch'],
            safetyNotes: 'Dress modestly for religious sites, stay hydrated'
          },
          {
            day: 3,
            title: 'Adventure & Departure',
            activities: ['Water sports', 'Fort Aguada', 'Shopping'],
            safetyNotes: 'Use certified operators for water sports'
          }
        ],
        totalBudget: `₹${parseInt(aiPreferences.budget) || 5000}`,
        safetyRating: 4.5
      };
      setGeneratedItinerary(mockItinerary);
      setMode('confirm');
      setIsLoading(false);
    }, 2000);
  };

  const handleConfirmJourney = () => {
    const touristId = {
      id: `TID-${Date.now()}`,
      destination: selectedAgency ? 'Goa with ' + selectedAgency.name : generatedItinerary.title,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'active',
      itinerary: generatedItinerary,
      agency: selectedAgency
    };
    
    onTouristIdGenerated(touristId);
    console.log('Tourist ID generated:', touristId);
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b p-4">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={onBack} data-testid="button-back">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Plan Your Journey</h1>
              <p className="text-sm text-muted-foreground">Choose how to create your travel plan</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <Card 
            className="p-6 hover-elevate cursor-pointer"
            onClick={() => setMode('agency')}
            data-testid="card-agency-mode"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-safety-blue rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Browse Trusted Agencies</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from verified travel partners with proven safety records
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          <Card 
            className="p-6 hover-elevate cursor-pointer"
            onClick={() => setMode('ai')}
            data-testid="card-ai-mode"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-safety-green rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">AI-Powered Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Let AI create a personalized itinerary based on your preferences
                </p>
                <Badge className="mt-2 bg-safety-green text-white">Smart & Safe</Badge>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-4 bg-safety-blue/5 border-safety-blue/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-safety-blue mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Safety Guarantee</h4>
                <p className="text-xs text-muted-foreground">
                  All plans include safety monitoring, emergency contacts, and real-time geofence alerts. 
                  Your Tourist ID will be valid throughout the planned journey.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'agency') {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b p-4">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => setMode('select')} data-testid="button-back-agency">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Trusted Travel Agencies</h1>
              <p className="text-sm text-muted-foreground">SaFara verified partners</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {mockAgencies.map((agency) => (
            <Card 
              key={agency.id}
              className="p-4 hover-elevate cursor-pointer"
              onClick={() => handleAgencySelect(agency)}
              data-testid={`card-agency-${agency.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{agency.name}</h3>
                    {agency.verified && (
                      <Badge className="bg-safety-green text-white text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span>{agency.rating}</span>
                      <span>({agency.reviewCount} reviews)</span>
                    </div>
                    <span>{agency.priceRange}/person</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {agency.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'ai') {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b p-4">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => setMode('select')} data-testid="button-back-ai">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">AI Journey Planning</h1>
              <p className="text-sm text-muted-foreground">Tell us your preferences</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <Card className="p-4 space-y-4">
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Goa, Kerala, Rajasthan"
                value={aiPreferences.destination}
                onChange={(e) => setAiPreferences(prev => ({...prev, destination: e.target.value}))}
                data-testid="input-destination"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="3"
                  value={aiPreferences.duration}
                  onChange={(e) => setAiPreferences(prev => ({...prev, duration: e.target.value}))}
                  data-testid="input-duration"
                />
              </div>
              <div>
                <Label htmlFor="groupSize">Group Size</Label>
                <Input
                  id="groupSize"
                  type="number"
                  placeholder="2"
                  value={aiPreferences.groupSize}
                  onChange={(e) => setAiPreferences(prev => ({...prev, groupSize: e.target.value}))}
                  data-testid="input-group-size"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="budget">Budget per person (₹)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="5000"
                value={aiPreferences.budget}
                onChange={(e) => setAiPreferences(prev => ({...prev, budget: e.target.value}))}
                data-testid="input-budget"
              />
            </div>

            <div>
              <Label htmlFor="interests">Interests & Preferences</Label>
              <Textarea
                id="interests"
                placeholder="e.g., beaches, culture, adventure, food, nightlife, nature..."
                value={aiPreferences.interests}
                onChange={(e) => setAiPreferences(prev => ({...prev, interests: e.target.value}))}
                data-testid="textarea-interests"
              />
            </div>
          </Card>

          <Button 
            size="lg" 
            className="w-full"
            onClick={handleAiSubmit}
            disabled={!aiPreferences.destination || !aiPreferences.duration || isLoading}
            data-testid="button-generate-ai"
          >
            {isLoading ? (
              <>
                <Bot className="w-5 h-5 mr-2 animate-pulse" />
                Generating Your Perfect Journey...
              </>
            ) : (
              <>
                <Bot className="w-5 h-5 mr-2" />
                Generate AI Itinerary
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'confirm') {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b p-4">
          <div className="flex items-center gap-3">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setMode(selectedAgency ? 'agency' : 'ai')}
              data-testid="button-back-confirm"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Confirm Your Journey</h1>
              <p className="text-sm text-muted-foreground">Review and create Tourist ID</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {selectedAgency ? (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Selected Agency</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-safety-blue rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">{selectedAgency.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedAgency.priceRange} • {selectedAgency.rating}⭐
                  </div>
                </div>
              </div>
            </Card>
          ) : generatedItinerary ? (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">{generatedItinerary.title}</h3>
              <div className="space-y-3">
                {generatedItinerary.days.map((day: any) => (
                  <div key={day.day} className="border-l-2 border-safety-blue pl-3">
                    <div className="font-medium text-sm">Day {day.day}: {day.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {day.activities.join(' • ')}
                    </div>
                    <div className="text-xs text-safety-blue mt-1">
                      ⚠️ {day.safetyNotes}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span>Estimated Budget:</span>
                  <span className="font-medium">{generatedItinerary.totalBudget}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Safety Rating:</span>
                  <span className="font-medium text-safety-green">
                    {generatedItinerary.safetyRating}⭐
                  </span>
                </div>
              </div>
            </Card>
          ) : null}

          <Card className="p-4 bg-safety-green/5 border-safety-green/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-safety-green mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-2">Tourist ID Benefits</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Valid government-issued travel credentials</li>
                  <li>• 24/7 emergency support and monitoring</li>
                  <li>• Real-time safety alerts and geofencing</li>
                  <li>• Instant verification with local authorities</li>
                  <li>• Access to registered tour guides and services</li>
                </ul>
              </div>
            </div>
          </Card>

          <Button 
            size="lg" 
            className="w-full bg-safety-green hover:bg-safety-green/90 text-white"
            onClick={handleConfirmJourney}
            data-testid="button-confirm-journey"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Create Tourist ID & Start Journey
          </Button>
        </div>
      </div>
    );
  }

  return null;
}