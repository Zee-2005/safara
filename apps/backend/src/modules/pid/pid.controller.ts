import { Request, Response } from 'express';
import { registerSchema } from './pid.schema.js';

import { finalizePersonalId } from './pid.service.js';
import * as svc from './pid.service.js';
import { z } from 'zod';

export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body);
  const result = await svc.registerBasic(input);
  res.status(201).json(result);
}
const VerifyEmailBody = z.object({
  applicationId: z.string(),
  idToken: z.string().min(10)
});

// export async function verifyEmail(req: Request, res: Response) {
//   const { applicationId, idToken } = VerifyEmailBody.parse(req.body);
//   const result = await svc.verifyEmailWithFirebase(applicationId, idToken);
//   res.json(result);
// }

const FinalizeBody = z.object({ applicationId: z.string() });

export async function finalizePid(req: Request, res: Response) {
  const { applicationId } = FinalizeBody.parse(req.body);
  const result = await finalizePersonalId(applicationId);
  res.json(result);
}