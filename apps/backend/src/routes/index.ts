import { Router } from 'express';
import { router as auth } from '../modules/auth/auth.routes.js';
import { router as pid } from '../modules/pid/pid.routes.js';
import { router as pidDocs } from '../modules/pid/docs.routes.js';
import { router as tourist } from '../modules/tourist/tourist.routes.js';

export const router = Router();
router.use('/v1/auth', auth);
router.use('/v1/pid', pid); // NEW

router.use('/v1/tourist', tourist);
router.use('/v1/pid/docs', pidDocs);