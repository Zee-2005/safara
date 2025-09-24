// src/components/TouristIdGenerate.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { readTripDraft } from '@/lib/trip';
import { useLocation } from 'wouter';
import { getUserItem } from '@/lib/session';
import { createTrip } from '@/lib/tourist.service';


export default function TouristIdGenerate() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const trip = readTripDraft();
  const start: Date | null = trip.startNow
  ? new Date()
  : (trip.startDate ? new Date(trip.startDate) : null);
  const end: Date | null = trip.endDate ? new Date(trip.endDate) : null;

const days: number | null =
  start && end
    ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000)) // 86,400,000 ms/day
    : null;

  async function handleGenerate() {
  try {
    setLoading(true);
    // Use the Mongo ObjectId stored at login / PID flow
    const pidApplicationId = getUserItem('pid_application_id'); // <-- this is ObjectId
    if (!pidApplicationId) {
      alert('Personal ID not found. Please complete Personal ID first.');
      return;
    }

    const startDate = trip.startNow ? new Date().toISOString().slice(0,10) : (trip.startDate || '');
    const endDate = trip.endDate || '';

    const res = await createTrip({
      holderPid: pidApplicationId, // <-- send ObjectId reference
      startDate,
      endDate,
      destination: trip.destination || null,
      itinerary: trip.itinerary || null,
      agencyId: trip.agencyId || null,
      homeCity: trip.homeCity || null,
      travelerType: 'indian',
    });

    localStorage.setItem('current_tid', res.tid);
    localStorage.setItem('current_tid_status', res.status);
    navigate('/tourist-id-docs');
  } catch (e: any) {
    alert(e?.message || 'Failed to create Tourist ID');
  } finally {
    setLoading(false);
  }
}
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
      <Button onClick={handleGenerate} disabled={loading}>{loading ? 'Creating…' : 'Generate ID'}</Button>
    </div>
        </Card>
      </div>
    </div>
  );
}
