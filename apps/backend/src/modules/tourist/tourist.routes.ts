// apps/backend/src/modules/tourist/tourist.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createTrip, getMyTrips, getTrip, uploadDocs } from './tourist.controller.js';

export const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Create a time-bound tourist trip (Tourist ID)
router.post('/trips', asyncHandler(createTrip));

// List my trips
router.get('/trips', asyncHandler(getMyTrips));

// Get one trip by TID
router.get('/trips/:tid', asyncHandler(getTrip));

// Upload docs for a trip (Indian: ticket,hotel,permits; International: passport,visa,ticket,hotel)
router.post(
  '/trips/:tid/docs',
  upload.fields([
    { name: 'passport', maxCount: 1 },
    { name: 'visa', maxCount: 1 },
    { name: 'ticket', maxCount: 1 },
    { name: 'hotel', maxCount: 1 },
    { name: 'permits', maxCount: 1 },
  ]),
  asyncHandler(uploadDocs)
);
