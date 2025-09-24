// src/components/DirectIdQuick.tsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Home } from 'lucide-react';
import { saveTripDraft } from '@/lib/trip';

export default function DirectIdQuick() {
  const [, navigate] = useLocation();
  const [startNow, setStartNow] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [homeCity, setHomeCity] = useState('');

  const valid = (startNow || !!start) && !!end && !!homeCity;

  function proceed() {
    saveTripDraft({
      mode: 'direct',
      startNow,
      startDate: startNow ? new Date().toISOString().slice(0,10) : (start || null),
      endDate: end || null,
      destination: '', // will be auto-assigned later (not hometown)
      itinerary: null,
      agencyId: null,
      // homeCity persisted in lib/trip
    } as any);
    // Append homeCity via localStorage key extension
    localStorage.setItem('' + (localStorage.getItem('session_user') ? JSON.parse(localStorage.getItem('session_user')!).userId + ':' : '') + 'trip_home_city', homeCity);
    navigate('/tourist-id-generate');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => history.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">←</button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Direct Tourist ID</h1>
            <p className="text-sm text-muted-foreground">Set trip duration and hometown; destination will exclude hometown.</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-safety-blue" />
            <h2 className="font-medium">Time window</h2>
            <Badge variant="secondary">Required</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <input id="start-now" type="checkbox" checked={startNow} onChange={(e) => setStartNow(e.target.checked)} />
              <Label htmlFor="start-now" className="cursor-pointer">Start right now</Label>
            </div>
            <div>
              <Label htmlFor="start">Start date</Label>
              <Input id="start" type="date" disabled={startNow} value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end">End date</Label>
              <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-safety-red" />
            <h2 className="font-medium">Hometown</h2>
            <Badge variant="outline">Required</Badge>
          </div>
          <div>
            <Label htmlFor="home">City / Town</Label>
            <Input id="home" placeholder="e.g., Bengaluru" value={homeCity} onChange={(e) => setHomeCity(e.target.value)} />
          </div>

          <div className="pt-2 flex justify-end">
            <Button onClick={proceed} disabled={!valid}>Proceed to summary</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
