import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(3),
  mobile: z.string().regex(/^\+?\d{10,15}$/),
  email: z.string().email()
});

export type RegisterInput = z.infer<typeof registerSchema>;
