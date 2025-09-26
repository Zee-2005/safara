import { env } from './config/env.js';
import { buildApp } from './app.js';
import { connectMongo, disconnectMongo } from './db/mongoose.js';
import { Server as SocketIOServer } from 'socket.io';
const start = async () => {
  await connectMongo();
  const app = buildApp();
  const server = app.listen(env.PORT,  () =>
    console.log(`API listening on http://localhost:${env.PORT}`)
  );
 const io = new SocketIOServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling'],
  });

  // server.ts — inside start() after io = new SocketIOServer(...)
type LatLng = { lat: number; lng: number };
type Zone = { id: string; name: string; type: 'circle'|'polygon'; coords?: LatLng[]; radius?: number; risk?: string };
type Boundary = { id: string; name: string; type: 'circle'|'polygon'; center?: LatLng; coords?: LatLng[]; radius?: number };

// In-memory state
const zones = new Map<string, Zone>();
const boundaries = new Map<string, Boundary>();

// Track per-socket entry state to avoid repeated alerts
const insideZonesBySocket = new Map<string, Set<string>>();
const boundaryInsideBySocket = new Map<string, boolean>();

const haversine = (a: LatLng, b: LatLng) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};
const pointInPolygon = (pt: LatLng, poly: LatLng[]) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].lng, yi = poly[i].lat;
    const xj = poly[j].lng, yj = poly[j].lat;
    const intersect =
      yi > pt.lat !== yj > pt.lat &&
      pt.lng < ((xj - xi) * (pt.lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

io.on('connection', (socket) => {
  console.log('client connected', socket.id);

  // 1) Sync current shapes to the newly connected client
  for (const z of zones.values()) socket.emit('zone-update', z);
  for (const b of boundaries.values()) socket.emit('boundary-update', b);

  // 2) Tourist -> all: live location
  socket.on('send-location', ({ latitude, longitude }) => {
    io.emit('receive-location', { id: socket.id, latitude, longitude });

    // Geofence checks
    const here: LatLng = { lat: latitude, lng: longitude };
    const prevSet = insideZonesBySocket.get(socket.id) ?? new Set<string>();
    const nextSet = new Set<string>();

    // Zones: enter alerts
    for (const z of zones.values()) {
      let inside = false;
      if (z.type === 'circle' && z.coords && z.radius) {
        const center = z.coords[0] || z.coords; // tolerate legacy {lat,lng} in coords[0]
        const centerLL = Array.isArray(center) ? { lat: center[0], lng: center[1] } : (center as LatLng);
        inside = haversine(here, centerLL) <= (z.radius ?? 0);
      } else if (z.type === 'polygon' && z.coords?.length) {
        inside = pointInPolygon(here, z.coords);
      }
      if (inside) {
        nextSet.add(z.id);
        if (!prevSet.has(z.id)) {
          io.emit('zone-alert', { touristId: socket.id, zoneName: z.name, risk: z.risk ?? 'low' });
        }
      }
    }
    insideZonesBySocket.set(socket.id, nextSet);

    // Boundaries: outside alerts (assume at most one active boundary; if many, treat union-of-inside)
    let insideAnyBoundary = true;
    if (boundaries.size > 0) {
      insideAnyBoundary = false;
      for (const b of boundaries.values()) {
        let inside = false;
        if (b.type === 'circle' && b.center && b.radius) {
          inside = haversine(here, b.center) <= b.radius;
        } else if (b.type === 'polygon' && b.coords?.length) {
          inside = pointInPolygon(here, b.coords);
        }
        if (inside) { insideAnyBoundary = true; break; }
      }
    }
    const prevInside = boundaryInsideBySocket.get(socket.id);
    if (prevInside === undefined || (prevInside && !insideAnyBoundary)) {
      if (!insideAnyBoundary) io.emit('outside-boundary-alert', { touristId: socket.id, boundaryName: 'Area' });
    }
    boundaryInsideBySocket.set(socket.id, insideAnyBoundary);
  });

  // 3) Authority -> all: zones
  socket.on('zone-update', (z: Zone) => {
    zones.set(z.id, z);
    io.emit('zone-update', z);
  });
  socket.on('zone-deleted', ({ id }: { id: string }) => {
    zones.delete(id);
    io.emit('zone-deleted', { id });
  });

  // 4) Authority -> all: boundaries (circle uses center)
  socket.on('boundary-update', (b: Boundary) => {
    boundaries.set(b.id, b);
    io.emit('boundary-update', b);
  });
  socket.on('boundary-deleted', ({ id }: { id: string }) => {
    boundaries.delete(id);
    io.emit('boundary-deleted', { id });
  });

  // Optional analytics
  socket.on('heatmap-update', (points: [number, number][]) => io.emit('heatmap-update', points));

  socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id);
    insideZonesBySocket.delete(socket.id);
    boundaryInsideBySocket.delete(socket.id);
  });
});


  const shutdown = () => server.close(async () => { await disconnectMongo(); process.exit(0); });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};
start();
