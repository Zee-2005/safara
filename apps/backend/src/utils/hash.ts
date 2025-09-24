import crypto from 'crypto';
export function sha256Hex(text: string) {
  return crypto.createHash('sha256').update(text).digest('hex');
}
