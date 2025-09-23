import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt.js';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  try {
    const token = hdr.slice(7);
    const payload = verifyAccess(token);
    (req as any).userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
