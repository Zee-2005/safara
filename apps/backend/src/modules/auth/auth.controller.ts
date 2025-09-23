import { Request, Response } from 'express';
import { signupSchema, loginSchema, requestOtpSchema, verifyOtpSchema } from './auth.schema.js';
import * as svc from './auth.service.js';

export async function signup(req: Request, res: Response) {
  const { email, password, phone } = signupSchema.parse(req.body);
  const result = await svc.signup(email, password, phone);
  res.status(201).json(result);
}
export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);
  const result = await svc.login(email, password);
  res.json(result);
}
export async function requestOtp(req: Request, res: Response) {
  const { phone } = requestOtpSchema.parse(req.body);
  const result = await svc.requestOtp(phone.startsWith('+') ? phone : `+91${phone}`);
  res.json(result);
}
export async function verifyOtp(req: Request, res: Response) {
  const { requestId, code } = verifyOtpSchema.parse(req.body);
  const result = await svc.verifyOtp(requestId, code);
  res.json(result);
}
export async function me(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const result = await svc.me(userId);
  res.json({ user: result });
}
