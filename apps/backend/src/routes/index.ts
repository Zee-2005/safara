import { Router } from 'express';
import { router as auth } from '../modules/auth/auth.routes.js';
export const router = Router();
router.use('/v1/auth', auth);
