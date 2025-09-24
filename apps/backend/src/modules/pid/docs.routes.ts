// apps/backend/src/modules/pid/docs.routes.ts
import { Router } from 'express';
import multer from 'multer';
import { uploadAadhaar, verifyAadhaar } from './docs.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB cap
export const router = Router();

// POST /api/v1/pid/docs/aadhaar
router.post(
  '/aadhaar',
  (req, res, next) => upload.single('file')(req, res, (err) => (err ? next(err) : next())),
  asyncHandler(uploadAadhaar)
);

router.post('/verify', asyncHandler(verifyAadhaar));