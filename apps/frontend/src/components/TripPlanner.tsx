import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, MapPin, Building2, Rocket, Sparkles } from 'lucide-react';
import { saveTripDraft, readTripDraft, TripMode } from '@/lib/trip';

type Agency = { id: string; name: string; badge?: string; rating?: number; };

const AGENCIES: Agency[] = [
  { id: 'agx1', name: 'SafeTrail Expeditions', badge: 'Trusted', rating: 4.8 },
  { id: 'agx2', name: 'Goa Secure Journeys', badge: 'Govt Listed', rating: 4.6 },
  { id: 'agx3', name: 'CoastalCare Trips', badge: 'Family Friendly', rating: 4.7 },
];

export default function TripPlanner() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<TripMode>('direct');
  const [startNow, setStartNow] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [itinerary, setItinerary] = useState<string>('');
  const [agencyId, setAgencyId] = useState<string>('');

  // Hydrate draft if user navigates back
  useEffect(() => {
    const d = readTripDraft();
    if (d.mode) setMode(d.mode);
    if (typeof d.startNow === 'boolean') setStartNow(d.startNow);
    if (d.startDate) setStartDate(d.startDate);
    if (d.endDate) setEndDate(d.endDate);
    if (d.destination) setDestination(d.destination);
    if (d.itinerary) setItinerary(d.itinerary);
    if (d.agencyId) setAgencyId(d.agencyId);
  }, []);

  const validDates = startNow ? Boolean(endDate) : Boolean(startDate && endDate);
  const validDirect = validDates && (!!destination || !!itinerary);
  const validAI = validDates && (!!destination || !!itinerary);
  const validAgency = validDates && !!agencyId;

  function handleContinue() {
    saveTripDraft({
      mode,
      startNow,
      startDate: startNow ? new Date().toISOString().slice(0,10) : (startDate || null),
      endDate: endDate || null,
      destination: destination || null,
      itinerary: itinerary || null,
      agencyId: agencyId || null,
    });
    navigate('/tourist-id-generate');
  }

  // Shared dates block
  const Dates = (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-safety-blue" />
        <h3 className="font-medium">Trip duration</h3>
        <Badge variant="secondary" className="ml-auto">Required</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <input
            id="start-now"
            type="checkbox"
            checked={startNow}
            onChange={(e) => setStartNow(e.target.checked)}
          />
          <Label htmlFor="start-now" className="cursor-pointer">Start right now</Label>
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="start">Start date</Label>
          <Input
            id="start"
            type="date"
            disabled={startNow}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="end">End date</Label>
          <Input
            id="end"
            type="date"
            value={endDate}
            min={startNow ? new Date().toISOString().slice(0,10) : startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => history.back()} className="p-2 hover:bg-muted rounded-lg">←</button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Plan a time-bound trip</h1>
            <p className="text-sm text-muted-foreground">
              Choose a planning mode, set dates, and capture destination or itinerary for Tourist ID creation later.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {Dates}

        <Tabs value={mode} onValueChange={(v) => setMode(v as TripMode)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="agencies" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Agencies
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI planning
            </TabsTrigger>
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" /> Direct ID
            </TabsTrigger>
          </TabsList>

          {/* Agencies */}
          <TabsContent value="agencies" className="mt-4 space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-safety-green" />
                <h3 className="font-medium">Browse trusted agencies</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {AGENCIES.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAgencyId(a.id)}
                    className={`p-3 rounded-md border text-left hover:bg-muted ${agencyId === a.id ? 'border-safety-green ring-2 ring-safety-green/30' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{a.name}</span>
                      {a.badge && <Badge variant="outline">{a.badge}</Badge>}
                    </div>
                    {a.rating && <div className="text-xs text-muted-foreground mt-1">Rating {a.rating.toFixed(1)}</div>}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-safety-blue" />
                <h3 className="font-medium">Optional: destination or notes</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dest-a">Destination</Label>
                  <Input id="dest-a" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Goa" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="itin-a">Itinerary notes</Label>
                  <Textarea id="itin-a" value={itinerary} onChange={(e) => setItinerary(e.target.value)} placeholder="High-level activities or constraints (optional)" />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button disabled={!validAgency} onClick={handleContinue}>Continue</Button>
            </div>
          </TabsContent>

          {/* AI planning */}
          <TabsContent value="ai" className="mt-4 space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-safety-yellow" />
                <h3 className="font-medium">AI powered planner</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dest-ai">Destination</Label>
                  <Input id="dest-ai" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Jaipur" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="itin-ai">Preferences / itinerary</Label>
                  <Textarea id="itin-ai" value={itinerary} onChange={(e) => setItinerary(e.target.value)} placeholder="Interests, constraints, budget, mobility, etc." />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button disabled={!validAI} onClick={handleContinue}>Continue</Button>
            </div>
          </TabsContent>

          {/* Direct */}
          <TabsContent value="direct" className="mt-4 space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-4 h-4 text-safety-red" />
                <h3 className="font-medium">Direct Tourist ID</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dest-d">Destination (optional)</Label>
                  <Input id="dest-d" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Auto-assigned if empty (not hometown)" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="itin-d">Itinerary (optional)</Label>
                  <Textarea id="itin-d" value={itinerary} onChange={(e) => setItinerary(e.target.value)} placeholder="Free-form notes" />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button disabled={!validDirect} onClick={handleContinue}>Continue</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
