// src/components/PlanTripHub.tsx
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Sparkles, Rocket, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PlanTripHub() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => history.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">←</button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Plan your trip</h1>
            <p className="text-sm text-muted-foreground">Choose how to plan your time-bound journey, then generate a Tourist ID.</p>
          </div>
        </div>
      </div>

      <div className="p-4 grid gap-4 md:grid-cols-3">
        {/* 1. Agencies */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-safety-green/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-safety-green" />
              </div>
              <div>
                <h2 className="font-semibold">Browse trusted agencies</h2>
                <p className="text-sm text-muted-foreground">Curated operators, safe itineraries, transparent pricing.</p>
              </div>
            </div>
            <Badge variant="secondary">Recommended</Badge>
          </div>
          <div className="mt-4">
            <Button className="w-full" onClick={() => navigate('/plan-trip/agencies')}>
              Explore agencies <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>

        {/* 2. AI planning */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-safety-yellow/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-safety-yellow" />
            </div>
            <div>
              <h2 className="font-semibold">Personalised trip with AI</h2>
              <p className="text-sm text-muted-foreground">Get a tailored itinerary with safety guidance.</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm p-3 rounded-md bg-muted">
              Coming soon — AI‑assisted routes, activities, and live safety insights.
            </div>
          </div>
        </Card>

        {/* 3. Direct ID */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-safety-red/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-safety-red" />
            </div>
            <div>
              <h2 className="font-semibold">Direct Tourist ID</h2>
              <p className="text-sm text-muted-foreground">Set dates and go — we’ll skip hometown as destination.</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="secondary" className="w-full" onClick={() => navigate('/plan-trip/direct')}>
              Generate quickly <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
