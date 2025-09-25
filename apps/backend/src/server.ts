import { env } from './config/env.js';
import { buildApp } from './app.js';
import { connectMongo, disconnectMongo } from './db/mongoose.js';
import { Server as SocketIOServer } from 'socket.io';
const start = async () => {
  await connectMongo();
  const app = buildApp();
  const server = app.listen(env.PORT, () =>
    console.log(`API listening on http://localhost:${env.PORT}`)
  );
 const io = new SocketIOServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log('tourist connected', socket.id);

    socket.on('send-location', ({ latitude, longitude }) => {
      io.emit('receive-location', { id: socket.id, latitude, longitude });
    });

    // Admin pushes (from another app/process)
    // io.emit('zone-update', {...});
    // io.emit('boundary-update', {...});
    // io.emit('heatmap-update', [...]);
    // io.emit('zone-alert', {...});
    // io.emit('outside-boundary-alert', {...});

    socket.on('disconnect', () => {
      io.emit('user-disconnected', socket.id);
    });
  });
  const shutdown = () => server.close(async () => { await disconnectMongo(); process.exit(0); });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};
start();
