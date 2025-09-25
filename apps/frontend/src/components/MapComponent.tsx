// src/components/MapComponent.tsx
import { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, Layer, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
  userLocation?: { lat: number; lng: number };
  onGeofenceAlert?: (payload: { type: 'zone' | 'boundary'; name: string; risk?: string }) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
};

// IMPORTANT: no fallback — undefined means “offline mode”
const SOCKET_URL = (import.meta as any).env?.VITE_TOURIST_SOCKET_URL as string | undefined;
const MAPTILER_KEY = (import.meta as any).env?.VITE_MAPTILER_KEY || 'K183PqmMToR2O89INJ40';

// Leaflet icon fix for Vite
// @ts-ignore
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapComponent({ userLocation, onGeofenceAlert, isFullscreen, onToggleFullscreen }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const meMarkerRef = useRef<Marker | null>(null);
  const meCenteredRef = useRef(false);

  // Optional realtime bits
  const socketRef = useRef<import('socket.io-client').Socket | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const zonesRef = useRef<Record<string, { layer: Layer }>>({});
  const boundariesRef = useRef<Record<string, Layer>>({});
  const heatLayerRef = useRef<Layer | null>(null);
  const geoWatchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const map = L.map('map', { zoomControl: true }).setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    const street = L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
      { attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>' }
    );
    const satellite = L.tileLayer(
      `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`,
      { attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>' }
    );
    const hybrid = L.tileLayer(
      `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
      { attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>' }
    );
    street.addTo(map);
    L.control.layers({ 'Street View': street, 'Satellite (No Labels)': satellite, 'Satellite + Labels (Hybrid)': hybrid }).addTo(map);

    // Always center from the browser GPS (works with no backend)
    if ('geolocation' in navigator) {
      geoWatchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const ll = L.latLng(latitude, longitude);

          if (meMarkerRef.current) meMarkerRef.current.setLatLng(ll);
          else meMarkerRef.current = L.marker(ll).addTo(mapRef.current!);

          if (!meCenteredRef.current) {
            mapRef.current?.setView(ll, 14);
            meCenteredRef.current = true;
          }

          if (socketRef.current?.connected) {
            socketRef.current.emit('send-location', { latitude, longitude });
          }
        },
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }

    // Only initialize Socket.IO when a server URL is provided
    (async () => {
      if (!SOCKET_URL) {
        console.info('[map] Offline mode (no VITE_TOURIST_SOCKET_URL); skipping Socket.IO connect');
        return;
      }
      const { io } = await import('socket.io-client');
      const socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 8000,
        timeout: 10000,
        forceNew: true,
      });
      socketRef.current = socket;

      socket.on('connect', () => console.log('[socket] connected', socket.id));
      socket.on('connect_error', (err) => console.warn('[socket] connect_error', err.message));
      socket.on('disconnect', (reason) => console.log('[socket] disconnected', reason));

      socket.on('receive-location', ({ id, latitude, longitude }: { id: string; latitude: number; longitude: number }) => {
        if (!mapRef.current) return;
        const ll = L.latLng(latitude, longitude);
        if (markersRef.current[id]) markersRef.current[id].setLatLng(ll);
        else markersRef.current[id] = L.marker(ll).addTo(mapRef.current);
      });

      socket.on('user-disconnected', (id: string) => {
        if (!mapRef.current) return;
        const mk = markersRef.current[id];
        if (mk) {
          mapRef.current.removeLayer(mk);
          delete markersRef.current[id];
        }
      });

      socket.on('zone-update', (data: any) => {
        if (!mapRef.current) return;
        const { id, name, risk, type, coords, radius } = data;
        const old = zonesRef.current[id]?.layer;
        if (old) mapRef.current.removeLayer(old);
        let layer: Layer | null = null;
        if (type === 'circle') {
          layer = L.circle([coords.lat, coords.lng], { radius, color: riskColor(risk), fillColor: riskColor(risk), fillOpacity: 0.3 }).addTo(mapRef.current);
        } else if (type === 'polygon') {
          const latlngs = coords.map((c: any) => [c.lat, c.lng]) as [number, number][];
          layer = L.polygon(latlngs, { color: riskColor(risk), fillColor: riskColor(risk), fillOpacity: 0.3 }).addTo(mapRef.current);
        }
        if (layer) (layer as any).bindPopup(`Zone: ${name} | Risk: ${risk}`);
        zonesRef.current[id] = { layer: layer! };
      });

      socket.on('zone-alert', ({ touristId, zoneName, risk }: { touristId: string; zoneName: string; risk: string }) => {
        if (touristId !== socket.id) return;
        try { new Audio(alertSound(risk)).play().catch(() => {}); } catch {}
        onGeofenceAlert?.({ type: 'zone', name: zoneName, risk });
        alert(`⚠️ You entered zone "${zoneName}" (Risk: ${risk})`);
      });

      socket.on('heatmap-update', async (points: Array<[number, number]>) => {
        if (!mapRef.current) return;
        const plugin = await import('leaflet.heat').catch(() => null);
        if (!plugin) return;
        if (heatLayerRef.current) mapRef.current.removeLayer(heatLayerRef.current);
        const latlngs = points.map(([lng, lat]) => [lat, lng]) as [number, number][];
        // @ts-ignore
        heatLayerRef.current = (L as any).heatLayer(latlngs, { radius: 25, blur: 15, maxZoom: 10 }).addTo(mapRef.current);
      });

      socket.on('boundary-update', (b: any) => {
        if (!mapRef.current) return;
        const prev = boundariesRef.current[b.id];
        if (prev) mapRef.current.removeLayer(prev);
        let layer: Layer | null = null;
        if (b.type === 'circle') layer = L.circle([b.center.lat, b.center.lng], { radius: b.radius, color: 'blue', fillOpacity: 0.1 }).addTo(mapRef.current);
        else if (b.type === 'polygon') {
          const latlngs = b.coords.map((c: any) => [c.lat, c.lng]) as [number, number][];
          layer = L.polygon(latlngs, { color: 'blue', fillOpacity: 0.1 }).addTo(mapRef.current);
        }
        if (layer) boundariesRef.current[b.id] = layer;
      });

      socket.on('outside-boundary-alert', (data: { touristId: string; boundaryName: string }) => {
        if (data.touristId !== socket.id) return;
        try { new Audio('/sounds/alert-boundary.mp3').play().catch(() => {}); } catch {}
        onGeofenceAlert?.({ type: 'boundary', name: data.boundaryName });
        alert(`🚨 You went outside allowed boundary: ${data.boundaryName}`);
      });
    })();

    return () => {
      try { if (geoWatchIdRef.current !== null) navigator.geolocation.clearWatch(geoWatchIdRef.current); } catch {}
      if (socketRef.current) { try { socketRef.current.disconnect(); } catch {} socketRef.current = null; }
      if (mapRef.current) {
        Object.values(markersRef.current).forEach((mk) => mapRef.current?.removeLayer(mk));
        Object.values(zonesRef.current).forEach((z) => z.layer && mapRef.current?.removeLayer(z.layer));
        Object.values(boundariesRef.current).forEach((b) => mapRef.current?.removeLayer(b));
        if (heatLayerRef.current) mapRef.current.removeLayer(heatLayerRef.current);
        if (meMarkerRef.current) mapRef.current.removeLayer(meMarkerRef.current);
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = {};
      zonesRef.current = {};
      boundariesRef.current = {};
      heatLayerRef.current = null;
      meMarkerRef.current = null;
      meCenteredRef.current = false;
    };
  }, [onGeofenceAlert]);

  return <div id="map" className="h-full w-full" />;
}

function riskColor(risk?: string) {
  if (!risk) return 'green';
  const r = risk.toLowerCase();
  if (r === 'high') return 'red';
  if (r === 'medium') return 'orange';
  return 'green';
}
function alertSound(risk?: string) {
  if (!risk) return '/sounds/soft-alert.mp3';
  const r = risk.toLowerCase();
  if (r === 'high') return '/sounds/loud-alert.mp3';
  if (r === 'medium') return '/sounds/medium-alert.mp3';
  return '/sounds/soft-alert.mp3';
}
