// apps/backend/src/utils/crypto.ts
import crypto from 'crypto';

const KEY = Buffer.from((process.env.ENCRYPTION_KEY || ''), 'base64'); // 32 bytes in base64

export function encryptBuffer(buf: Buffer) {
  if (KEY.length !== 32) throw new Error('Invalid ENCRYPTION_KEY length');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const enc = Buffer.concat([cipher.update(buf), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { enc, iv, tag };
}

export function decryptBuffer(enc: Buffer, ivB64: string, tagB64: string) {
  if (KEY.length !== 32) throw new Error('Invalid ENCRYPTION_KEY length');
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec;
}
