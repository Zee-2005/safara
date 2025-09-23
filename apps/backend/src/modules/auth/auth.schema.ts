import { z } from 'zod';
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().regex(/^\+?\d{10,15}$/).optional()
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
export const requestOtpSchema = z.object({
  phone: z.string().regex(/^\+?\d{10,15}$/)
});
export const verifyOtpSchema = z.object({
  requestId: z.string(),
  code: z.string().length(6)
});
