// apps/backend/src/config/storage.ts
import path from 'path';

export const STORAGE_DIR =
  process.env.FILE_STORAGE_DIR || path.resolve(process.cwd(), 'secure_storage');
