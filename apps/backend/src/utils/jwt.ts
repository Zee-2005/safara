import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type JwtPayload = { sub: string };

export function signAccess(userId: string) {
  return jwt.sign({ sub: userId } as JwtPayload, env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}
export function signRefresh(userId: string) {
  return jwt.sign({ sub: userId } as JwtPayload, env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}
export function verifyAccess(token: string) {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
}
export function verifyRefresh(token: string) {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JwtPayload;
}
