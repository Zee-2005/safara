// apps/backend/src/modules/tourist/tourist.controller.ts
import path from 'path';
import fs from 'fs/promises';
import type { Request, Response } from 'express';
import { TouristTrip } from './tourist.model.js';
import { PersonalIdApplication } from '../pid/pid.model.js';
import { encryptBuffer } from '../../utils/crypto.js';

const STORAGE_DIR = process.env.FILE_STORAGE_DIR || path.resolve(process.cwd(), 'secure_storage');

function computeStatus(start?: Date, end?: Date): 'active' | 'scheduled' | 'expired' {
  const now = new Date();
  if (start && end) {
    if (now < start) return 'scheduled';
    if (now > end) return 'expired';
    return 'active';
  }
  return 'scheduled';
}

function makeTid(): string {
  return `TID-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
}

export async function createTrip(req: Request, res: Response) {
  const {
    userId: userIdBody,
    holderPid,
    startDate,
    endDate,
    destination,
    itinerary,
    agencyId,
    homeCity,
    travelerType = 'indian',
  } = req.body as {
    userId?: string;
    holderPid?: string;
    startDate?: string;
    endDate?: string;
    destination?: string;
    itinerary?: string;
    agencyId?: string;
    homeCity?: string;
    travelerType?: 'indian' | 'international';
  };

  const userId = userIdBody || (req.headers['x-user-id'] as string);
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  if (!holderPid) return res.status(400).json({ error: 'holderPid (Personal ID) is required' });
  if (!startDate || !endDate) return res.status(400).json({ error: 'startDate and endDate are required (yyyy-mm-dd)' });

  // Validate PID reference exists (optional but recommended)
  const pidApp = await PersonalIdApplication.findOne({ _id: holderPid }).lean();
  if (!pidApp) return res.status(404).json({ error: 'Personal ID reference not found' });

  const s = new Date(startDate);
  const e = new Date(endDate);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return res.status(400).json({ error: 'Invalid dates' });
  if (e < s) return res.status(400).json({ error: 'endDate must be on/after startDate' });

  const tid = makeTid();
  const status = computeStatus(s, e);

  const doc = await TouristTrip.create({
    tid,
    userId,
    holderPid,
    travelerType,
    startDate: s,
    endDate: e,
    destination,
    itinerary,
    agencyId,
    homeCity,
    status,
  });

  return res.status(201).json({
    tid: doc.tid,
    status: doc.status,
    startDate: doc.startDate.toISOString().slice(0,10),
    endDate: doc.endDate.toISOString().slice(0,10),
    destination: doc.destination || null,
    itinerary: doc.itinerary || null,
    agencyId: doc.agencyId || null,
    homeCity: doc.homeCity || null,
    travelerType: doc.travelerType
  });
}

export async function getMyTrips(req: Request, res: Response) {
  const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const trips = await TouristTrip.find({ userId }).sort({ startDate: 1 }).lean();
  return res.json({
    trips: trips.map(t => ({
      tid: t.tid,
      status: t.status,
      startDate: t.startDate?.toISOString().slice(0,10),
      endDate: t.endDate?.toISOString().slice(0,10),
      destination: t.destination || null,
      itinerary: t.itinerary || null,
      agencyId: t.agencyId || null,
      homeCity: t.homeCity || null,
      travelerType: t.travelerType,
    }))
  });
}

export async function getTrip(req: Request, res: Response) {
  const { tid } = req.params as { tid: string };
  const trip = await TouristTrip.findOne({ tid }).lean();
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  return res.json({
    tid: trip.tid,
    status: trip.status,
    startDate: trip.startDate?.toISOString().slice(0,10),
    endDate: trip.endDate?.toISOString().slice(0,10),
    destination: trip.destination || null,
    itinerary: trip.itinerary || null,
    agencyId: trip.agencyId || null,
    homeCity: trip.homeCity || null,
    travelerType: trip.travelerType,
  });
}

async function saveEncrypted(file: Express.Multer.File, baseName: string) {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  const { enc, iv, tag } = encryptBuffer(file.buffer);
  const fileName = `${baseName}-${Date.now()}.bin`;
  const filePath = path.join(STORAGE_DIR, fileName);
  await fs.writeFile(filePath, enc, { flag: 'wx' });
  return {
    path: fileName,
    mime: file.mimetype,
    size: file.size,
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    uploadedAt: new Date(),
  };
}

// apps/backend/src/modules/tourist/tourist.controller.ts (inside uploadDocs)
export async function uploadDocs(req: Request, res: Response) {
  const { tid } = req.params as { tid: string };
  const trip = await TouristTrip.findOne({ tid });
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  const files = req.files as Record<string, Express.Multer.File[]> | undefined;

  if (trip.travelerType === 'international') {
    const passport = files?.['passport']?.[0];
    if (!passport) return res.status(400).json({ error: 'passport is required for international' });
  }

  const base = `${tid}`;

  // Prepare typed helpers to satisfy TS for possibly-undefined nested objects
  if (trip.travelerType === 'indian') {
    if (!trip.indian) (trip as any).indian = {};
    const indTicket = files?.['ticket']?.[0];
    const indHotel = files?.['hotel']?.[0];
    const indPermits = files?.['permits']?.[0];

    if (indTicket) trip.indian!.travelTicketDoc = await saveEncrypted(indTicket, `${base}-ticket`);
    if (indHotel) trip.indian!.hotelBookingDoc = await saveEncrypted(indHotel, `${base}-hotel`);
    if (indPermits) trip.indian!.specialPermitsDoc = await saveEncrypted(indPermits, `${base}-permits`);
  } else {
    if (!trip.international) (trip as any).international = {};
    const passport = files?.['passport']?.[0];
    const visa = files?.['visa']?.[0];
    const intlTicket = files?.['ticket']?.[0];
    const intlHotel = files?.['hotel']?.[0];

    if (passport) trip.international!.passportDoc = await saveEncrypted(passport, `${base}-passport`);
    if (visa) trip.international!.visaDoc = await saveEncrypted(visa, `${base}-visa`);
    if (intlTicket) trip.international!.travelTicketDoc = await saveEncrypted(intlTicket, `${base}-ticket`);
    if (intlHotel) trip.international!.hotelBookingDoc = await saveEncrypted(intlHotel, `${base}-hotel`);
  }

  await trip.save();
  return res.status(200).json({ ok: true, tid: trip.tid, travelerType: trip.travelerType });
}

