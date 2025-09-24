import { Router } from 'express';
import { register } from './pid.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
// import { verifyEmail } from './pid.controller.js';

import { finalizePid } from './pid.controller.js';

export const router = Router();

// Step 1: Register basic details
router.post('/register', asyncHandler(register));
// router.post('/email/verify', asyncHandler(verifyEmail));
router.post('/finalize', asyncHandler(finalizePid));