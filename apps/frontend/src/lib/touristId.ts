// src/lib/touristId.ts
import { getUserItem, setUserItem } from '@/lib/session';
import { readTripDraft } from '@/lib/trip';

export type TouristIdRecord = {
  id: string;
  holderPid: string | null;
  destination: string | null;
  startDate: string | null; // yyyy-mm-dd
  endDate: string | null;   // yyyy-mm-dd
  status: 'active' | 'scheduled' | 'expired';
  createdAt: string;
  itinerary?: string | null;
  agencyId?: string | null;
  homeCity?: string | null;
};

function computeStatus(start?: string | null, end?: string | null): 'active' | 'scheduled' | 'expired' {
  const now = new Date();
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;
  if (s && e) {
    if (now < s) return 'scheduled';
    if (now > e) return 'expired';
    return 'active';
  }
  return 'scheduled';
}

export function saveTouristIdFromDraft(): TouristIdRecord {
  const draft = readTripDraft();
  const pid = getUserItem('pid_personal_id');
  const start = draft.startNow ? new Date().toISOString().slice(0, 10) : (draft.startDate || null);
  const end = draft.endDate || null;

  const id = `TID-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  const status = computeStatus(start, end);

  const rec: TouristIdRecord = {
    id,
    holderPid: pid || null,
    destination: draft.destination || null,
    startDate: start,
    endDate: end,
    status,
    createdAt: new Date().toISOString(),
    itinerary: draft.itinerary || null,
    agencyId: draft.agencyId || null,
    homeCity: draft.homeCity || null,
  };

  // Persist under user namespace
  setUserItem('tourist_id', rec.id);
  setUserItem('tourist_id_start', rec.startDate || '');
  setUserItem('tourist_id_end', rec.endDate || '');
  setUserItem('tourist_id_destination', rec.destination || '');
  setUserItem('tourist_id_status', rec.status);
  setUserItem('tourist_id_created', rec.createdAt);
  setUserItem('tourist_id_itinerary', rec.itinerary || '');
  setUserItem('tourist_id_agency', rec.agencyId || '');
  setUserItem('tourist_id_home', rec.homeCity || '');

  return rec;
}
