// src/lib/trip.ts
import { getSession, setUserItem, getUserItem, removeUserItem } from '@/lib/session';
export type TripMode = 'agencies' | 'ai' | 'direct';

export type TripDraft = {
  mode: TripMode;
  startNow?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  destination?: string | null;
  itinerary?: string | null;
  agencyId?: string | null;
  homeCity?: string | null;
};

const KEYS = ['trip_mode','trip_start_now','trip_start','trip_end','trip_destination','trip_itinerary','trip_agency','trip_home_city'];

export function saveTripDraft(d: TripDraft) {
  setUserItem('trip_mode', d.mode);
  setUserItem('trip_start_now', d.startNow ? '1' : '0');
  setUserItem('trip_start', d.startDate || '');
  setUserItem('trip_end', d.endDate || '');
  setUserItem('trip_destination', d.destination || '');
  setUserItem('trip_itinerary', d.itinerary || '');
  setUserItem('trip_agency', d.agencyId || '');
  if (d.homeCity !== undefined) setUserItem('trip_home_city', d.homeCity || '');
}

export function readTripDraft(): TripDraft {
  return {
    mode: (getUserItem('trip_mode') as TripMode) || 'direct',
    startNow: getUserItem('trip_start_now') === '1',
    startDate: getUserItem('trip_start') || null,
    endDate: getUserItem('trip_end') || null,
    destination: getUserItem('trip_destination') || null,
    itinerary: getUserItem('trip_itinerary') || null,
    agencyId: getUserItem('trip_agency') || null,
    homeCity: getUserItem('trip_home_city') || null,
  };
}

export function clearTripDraft() {
  const s = getSession();
  KEYS.forEach(k => removeUserItem(k, s));
}
