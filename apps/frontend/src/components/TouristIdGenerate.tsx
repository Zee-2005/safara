// src/components/TouristIdGenerate.tsx
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { readTripDraft } from '@/lib/trip';
import { useLocation } from 'wouter';

export default function TouristIdGenerate() {
  const [, navigate] = useLocation();
  const trip = readTripDraft();

  const days = trip.startDate && trip.endDate
    ? Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000*60*60*24)))
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => history.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">←</button>
          <h1 className="text-xl font-bold">Tourist ID generation</h1>
        </div>
      </div>

      <div className="p-4">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Trip summary</h2>
            <Badge variant="secondary">{trip.mode.toUpperCase()}</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Start</div>
              <div className="text-sm">{trip.startNow ? 'Right now' : (trip.startDate || '—')}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">End</div>
              <div className="text-sm">{trip.endDate || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Destination</div>
              <div className="text-sm">{trip.destination || 'Auto-assign (not hometown)'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Agency</div>
              <div className="text-sm">{trip.agencyId || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Hometown</div>
              <div className="text-sm">{trip.homeCity || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="text-sm">{days ? `${days} day${days>1?'s':''}` : '—'}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Itinerary / notes</div>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">{trip.itinerary || '—'}</pre>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/plan-trip')}>Edit</Button>
            <Button disabled>Generate ID (coming soon)</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
