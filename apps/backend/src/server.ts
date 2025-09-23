import { env } from './config/env.js';
import { buildApp } from './app.js';
import { connectMongo, disconnectMongo } from './db/mongoose.js';

const start = async () => {
  await connectMongo();
  const app = buildApp();
  const server = app.listen(env.PORT, () =>
    console.log(`API listening on http://localhost:${env.PORT}`)
  );
  const shutdown = () => server.close(async () => { await disconnectMongo(); process.exit(0); });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};
start();
