// src/components/AgencyBrowse.tsx
import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { MapPin, Calendar, Star, Building2, ChevronRight } from 'lucide-react';
import { saveTripDraft } from '@/lib/trip';

type Agency = {
  id: string;
  name: string;
  rating: number;
  durationDays: number;
  places: string[];
  destination: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
  price: string;     // e.g., "₹24,999"
  style: string;
  region: string;
};

const DESTINATIONS = ['Delhi','Mumbai','Leh','Kathmandu','Jaipur','Goa','Varanasi'];
const REGIONS = ['Southern India','Himalayan Mountains','Kashmir','Western Ghats','Golden Triangle'];
const GUIDES = ['Arun Mehta','Sana Iqbal','Tashi Dorje','Rhea Sen','Govt. Tourist Helpdesk'];
const STYLES = ['Festival & Events','Food & Culinary','Hiking & Trekking','River Cruise','Culture & Heritage'];

const AGENCIES: Agency[] = [
  {
    id: 'safe-gt-01',
    name: 'SafeTrail Expeditions',
    rating: 4.8,
    durationDays: 6,
    places: ['Delhi','Agra','Jaipur'],
    destination: 'Golden Triangle',
    startDate: '2025-10-05',
    endDate: '2025-10-10',
    price: '₹24,999',
    style: 'Culture & Heritage',
    region: 'Golden Triangle',
  },
  {
    id: 'coast-goa-02',
    name: 'CoastalCare Trips',
    rating: 4.6,
    durationDays: 4,
    places: ['Panaji','Old Goa','Palolem'],
    destination: 'Goa',
    startDate: '2025-11-12',
    endDate: '2025-11-15',
    price: '₹14,950',
    style: 'Food & Culinary',
    region: 'Western Ghats',
  },
  {
    id: 'hike-leh-03',
    name: 'HimalayaSecure',
    rating: 4.7,
    durationDays: 7,
    places: ['Leh','Nubra','Pangong'],
    destination: 'Leh',
    startDate: '2025-09-29',
    endDate: '2025-10-05',
    price: '₹32,500',
    style: 'Hiking & Trekking',
    region: 'Himalayan Mountains',
  },
  {
    id: 'kashmir-fest-04',
    name: 'ValleyGuard Tours',
    rating: 4.5,
    durationDays: 5,
    places: ['Srinagar','Gulmarg','Pahalgam'],
    destination: 'Kashmir',
    startDate: '2025-12-03',
    endDate: '2025-12-07',
    price: '₹26,400',
    style: 'Festival & Events',
    region: 'Kashmir',
  },
];

export default function AgencyBrowse() {
  const [, navigate] = useLocation();
  const [destination, setDestination] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [guide, setGuide] = useState<string>('');
  const [style, setStyle] = useState<string>('');

  const filtered = useMemo(() => {
    return AGENCIES.filter(a =>
      (!destination || a.destination.toLowerCase().includes(destination.toLowerCase()) || a.places.some(p => p.toLowerCase().includes(destination.toLowerCase()))) &&
      (!region || a.region === region) &&
      (!style || a.style === style)
    );
  }, [destination, region, style]);

  function proceed(a: Agency) {
    saveTripDraft({
      mode: 'agencies',
      startNow: false,
      startDate: a.startDate,
      endDate: a.endDate,
      destination: a.destination,
      itinerary: a.places.join(' • '),
      agencyId: a.id,
    });
    navigate('/tourist-id-generate');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with horizontal filters */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => history.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">←</button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Browse agencies</h1>
            <p className="text-sm text-muted-foreground">Filter by destination, region, guide, and travel style.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <div>
            <Label>Destinations</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger><SelectValue placeholder="Any destination" /></SelectTrigger>
              <SelectContent>
                {DESTINATIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Regions</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger><SelectValue placeholder="Any region" /></SelectTrigger>
              <SelectContent>
                {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Travel guides</Label>
            <Select value={guide} onValueChange={setGuide}>
              <SelectTrigger><SelectValue placeholder="Any guide" /></SelectTrigger>
              <SelectContent>
                {GUIDES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Travel styles</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger><SelectValue placeholder="Any style" /></SelectTrigger>
              <SelectContent>
                {STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-4 grid gap-4 md:grid-cols-2">
        {filtered.map(a => (
          <Card key={a.id} className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-safety-blue/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-safety-blue" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{a.name}</h3>
                    <Badge variant="outline">{a.region}</Badge>
                    <Badge variant="secondary">{a.style}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-yellow-500" /> {a.rating.toFixed(1)}
                    <span>•</span>
                    <Calendar className="w-3.5 h-3.5" /> {a.durationDays} days
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{a.price}</div>
                <div className="text-xs text-muted-foreground">per person</div>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="text-sm">
                <div className="text-muted-foreground">Destination</div>
                <div>{a.destination}</div>
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground">Dates</div>
                <div>{a.startDate} → {a.endDate}</div>
              </div>
              <div className="text-sm sm:col-span-1">
                <div className="text-muted-foreground">Visits</div>
                <div className="truncate" title={a.places.join(', ')}>{a.places.join(' • ')}</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={() => proceed(a)}>
                Proceed <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">No agencies match the current filters.</div>
          </Card>
        )}
      </div>
    </div>
  );
}
