// src/components/TouristIdDocs.tsx
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileUp, Plane, Hotel, FileCheck, IdCard, BadgeCheck } from 'lucide-react';
import { saveTouristIdFromDraft } from '@/lib/touristId';
import { uploadTripDocs, getTrip } from '@/lib/tourist.service';

type TabValue = 'indian' | 'international';

export default function TouristIdDocs() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<TabValue>('indian');

  // Indian (all optional)
  const [indTicket, setIndTicket] = useState<File | null>(null);
  const [indHotel, setIndHotel] = useState<File | null>(null);
  const [indPermits, setIndPermits] = useState<File | null>(null);

  // International (passport required; others optional)
  const [intlPassport, setIntlPassport] = useState<File | null>(null);
  const [intlVisa, setIntlVisa] = useState<File | null>(null);
  const [intlTicket, setIntlTicket] = useState<File | null>(null);
  const [intlHotel, setIntlHotel] = useState<File | null>(null);

  function labelForFile(f: File | null) { return f ? `${f.name} (${(f.size/1024).toFixed(1)} KB)` : 'No file chosen'; }

  async function handleSubmit() {
  try {
    const tid = localStorage.getItem('current_tid') || '';
    if (!tid) { alert('Trip not found. Please generate ID again.'); return; }

    // Build file map based on tab selection (existing state remains)
    const files =
      tab === 'indian'
        ? { ticket: indTicket, hotel: indHotel, permits: indPermits }
        : { passport: intlPassport, visa: intlVisa, ticket: intlTicket, hotel: intlHotel };

    await uploadTripDocs(tid, tab, files as any);

    // Fetch current status from backend and route
    const latest = await getTrip(tid);
    if (latest.status === 'active') {
      // Optional: clear temp storage
      localStorage.removeItem('current_tid');
      localStorage.removeItem('current_tid_status');
      navigate('/activated-mode');
    } else {
      navigate('/home');
    } 
  } catch (e: any) {
    alert(e?.message || 'Failed to upload documents');
  }
}

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => history.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">←</button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Upload documents</h1>
            <p className="text-sm text-muted-foreground">Provide relevant documents to finalize a time‑bound Tourist ID.</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="indian" className="gap-2">
              <BadgeCheck className="w-4 h-4" /> Indian
            </TabsTrigger>
            <TabsTrigger value="international" className="gap-2">
              <IdCard className="w-4 h-4" /> International
            </TabsTrigger>
          </TabsList>

          {/* INDIAN */}
          <TabsContent value="indian" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-4 h-4 text-safety-blue" />
                <h3 className="font-medium">Travel ticket</h3>
                <Badge variant="outline" className="ml-auto">Optional</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="text-sm text-muted-foreground">{labelForFile(indTicket)}</div>
                <div>
                  <Label htmlFor="ind-ticket" className="sr-only">Upload ticket</Label>
                  <Input id="ind-ticket" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIndTicket(e.target.files?.[0] || null)} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Hotel className="w-4 h-4 text-safety-green" />
                <h3 className="font-medium">Hotel booking</h3>
                <Badge variant="outline" className="ml-auto">Optional</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="text-sm text-muted-foreground">{labelForFile(indHotel)}</div>
                <div>
                  <Label htmlFor="ind-hotel" className="sr-only">Upload hotel booking</Label>
                  <Input id="ind-hotel" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIndHotel(e.target.files?.[0] || null)} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-safety-yellow" />
                <h3 className="font-medium">Special permits</h3>
                <Badge variant="outline" className="ml-auto">Optional</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="text-sm text-muted-foreground">{labelForFile(indPermits)}</div>
                <div>
                  <Label htmlFor="ind-permits" className="sr-only">Upload special permits</Label>
                  <Input id="ind-permits" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIndPermits(e.target.files?.[0] || null)} />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSubmit} className="gap-2">
                Submit / Skip and generate <FileUp className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          {/* INTERNATIONAL */}
          <TabsContent value="international" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <IdCard className="w-4 h-4 text-safety-red" />
                <h3 className="font-medium">Passport</h3>
                <Badge variant="secondary" className="ml-auto">Required</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="text-sm text-muted-foreground">{labelForFile(intlPassport)}</div>
                <div>
                  <Label htmlFor="intl-passport" className="sr-only">Upload passport</Label>
                  <Input id="intl-passport" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIntlPassport(e.target.files?.[0] || null)} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-safety-blue" />
                <h3 className="font-medium">Visa</h3>
                <Badge variant="outline" className="ml-auto">Optional</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="text-sm text-muted-foreground">{labelForFile(intlVisa)}</div>
                <div>
                  <Label htmlFor="intl-visa" className="sr-only">Upload visa</Label>
                  <Input id="intl-visa" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIntlVisa(e.target.files?.[0] || null)} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-4 h-4 text-safety-blue" />
                <h3 className="font-medium">Travel ticket</h3>
                <Badge variant="outline" className="ml-auto">Optional</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="text-sm text-muted-foreground">{labelForFile(intlTicket)}</div>
                <div>
                  <Label htmlFor="intl-ticket" className="sr-only">Upload ticket</Label>
                  <Input id="intl-ticket" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIntlTicket(e.target.files?.[0] || null)} />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Hotel className="w-4 h-4 text-safety-green" />
                <h3 className="font-medium">Hotel booking</h3>
                <Badge variant="outline" className="ml-auto">Optional</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="text-sm text-muted-foreground">{labelForFile(intlHotel)}</div>
                <div>
                  <Label htmlFor="intl-hotel" className="sr-only">Upload hotel booking</Label>
                  <Input id="intl-hotel" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setIntlHotel(e.target.files?.[0] || null)} />
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSubmit} className="gap-2">
                Submit and generate <FileUp className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
