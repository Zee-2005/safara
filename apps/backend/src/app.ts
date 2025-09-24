import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { router as api } from './routes/index.js';

export const buildApp = () => {
  const app = express();
  app.set('trust proxy', true);
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(helmet());
  app.use(compression());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', api);

  // ... previous middleware and routes
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err); // helpful during dev
  // Map common Mongo duplicate key to 409
  const isDupKey = err?.name === 'MongoServerError' && (err?.code === 11000);
  const status = err?.status || (err?.code === 'LIMIT_FILE_SIZE' ? 413 : 500);
  const message = err?.message || (isDupKey ? 'Duplicate key' : 'Server Error');
  res.status(status).json({ error: message });
});

  
  return app;
};
