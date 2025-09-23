import { Router } from 'express';
import { signup, login, requestOtp, verifyOtp, me } from './auth.controller.js';
import { requireAuth } from '../../middlewares/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const router = Router();
router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.post('/otp/request', asyncHandler(requestOtp));
router.post('/otp/verify', asyncHandler(verifyOtp));
router.get('/me', requireAuth, asyncHandler(me));
