import bcrypt from 'bcryptjs';
export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);
export const hashCode = (code: string) => bcrypt.hash(code, 8);
export const verifyCode = (code: string, hash: string) => bcrypt.compare(code, hash);
