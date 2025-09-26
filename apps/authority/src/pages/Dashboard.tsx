// src/pages/Dashboard.tsx
import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "leaflet.heat";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  AlertTriangle,
  Clock,
  Shield,
  Zap,
  MapPin,
  Minimize2,
  Maximize2,
  Phone,
  TrendingUp,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

// ---------------- TYPES ----------------
interface Incident {
  id: string;
  touristSocketId?: string;
  touristId?: string;
  touristName?: string;
  touristPhone?: string;
  location?: { lat: number; lng: number };
  description?: string;
  media?: { audio?: string; video?: string; photo?: string };
  createdAt: number;
  status: 'new' | 'acknowledged' | 'resolved';
  officer?: { id?: string; name?: string };
}

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
}
interface ZoneAlert {
  touristId: string;
  zoneName: string;
  risk: string;
}
interface LiveAlert {
  id: number;
  message: string;
  time: string;
  type: "zone" | "incident" | "system";
}
interface Incident {
  id: string;
  type: string;
  location?: { lat: number; lng: number };
  time: string;
}
interface ZoneData {
  id: string;
  name: string;
  type: "circle" | "polygon";
  coords: any;
  radius?: number;
  risk?: string;
}
interface BoundaryData {
  id: string;
  name: string;
  type: "circle" | "polygon";
  coords: any;
  radius?: number;
  // circle boundary uses center in payload for tourist app
  center?: { lat: number; lng: number };
}

// ---------------- HELPERS ----------------
const toLatLng = (c: any): [number, number] =>
  Array.isArray(c) ? [Number(c[1]), Number(c[0])] : [Number(c.lat), Number(c.lng)];

const normalize = (coords: any[]): [number, number][] => coords.map(toLatLng);

const riskToColor = (risk?: string) => {
  const r = (risk || "low").toLowerCase();
  if (r === "high") return "red";
  if (r === "medium") return "orange";
  return "green";
};

const Dashboard: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef(new L.FeatureGroup());
  const markersRef = useRef<Record<string, L.Marker>>({});
  const zoneLayersRef = useRef<Record<string, L.Layer>>({});
  const boundaryLayersRef = useRef<Record<string, L.Layer>>({});
  const socketRef = useRef<Socket | null>(null);
  const heatLayerRef = useRef<any>(null);

  const [tourists, setTourists] = useState<Record<string, LocationData>>({});
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState({
    activeTourists: 0,
    activeIncidents: 0,
    responseTime: 5,
    officersOnDuty: 10,
  });
  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => setFullscreen((v) => !v);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Map init
    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    const street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const satellite = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      { maxZoom: 20, subdomains: ["mt0", "mt1", "mt2", "mt3"], attribution: "© Google Satellite" }
    );
    const hybrid = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
      { maxZoom: 20, subdomains: ["mt0", "mt1", "mt2", "mt3"], attribution: "© Google Hybrid" }
    );

    L.control.layers({ Street: street, Satellite: satellite, Hybrid: hybrid }).addTo(map);

    // Draw controls
    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);
    const drawControl = new (L.Control as any).Draw({
      edit: { featureGroup: drawnItems },
      draw: { circle: true, polygon: true, rectangle: true, polyline: false, marker: false },
    });
    map.addControl(drawControl);

    // Socket
    const SOCKET_URL = (import.meta as any).env?.VITE_AUTHORITY_SOCKET_URL || "http://localhost:3000";
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 10000,
      forceNew: true,
    });
    const socket = socketRef.current;

    // Tourist live locations
    const onReceiveLocation = (data: LocationData) => {
      setTourists((prev) => {
        const next = { ...prev, [data.id]: data };
        setStats((s) => ({ ...s, activeTourists: Object.keys(next).length }));
        return next;
      });
      if (!mapRef.current) return;
      const mk = markersRef.current;
      if (mk[data.id]) mk[data.id].setLatLng([data.latitude, data.longitude]);
      else mk[data.id] = L.marker([data.latitude, data.longitude]).addTo(mapRef.current).bindPopup(`Tourist: ${data.id}`);
    };
    const onUserDisconnected = (id: string) => {
      const mk = markersRef.current;
      if (mk[id] && mapRef.current) {
        mapRef.current.removeLayer(mk[id]);
        delete mk[id];
      }
      setTourists((prev) => {
        const copy = { ...prev };
        delete copy[id];
        setStats((s) => ({ ...s, activeTourists: Object.keys(copy).length }));
        return copy;
      });
    };
    socket.on("receive-location", onReceiveLocation);
    socket.on("user-disconnected", onUserDisconnected);

    // INCIDENTS: sync, list, new, updated
    socket.emit('incident-sync');
    socket.on('incident-list', (list: Incident[]) => {
      setRecentIncidents(list);
      setStats((s) => ({ ...s, activeIncidents: list.filter(i => i.status !== 'resolved').length }));
    });
    socket.on('incident-new', (inc: Incident) => {
      setRecentIncidents((prev) => [inc, ...prev]);
      setLiveAlerts((prev) => [{ id: Date.now(), message: `New SOS from ${inc.touristName || inc.touristPhone || inc.touristId || 'Tourist'}`, time: new Date().toLocaleTimeString(), type: 'incident' }, ...prev]);
    });
    socket.on('incident-updated', (inc: Incident) => {
      setRecentIncidents((prev) => prev.map(p => p.id === inc.id ? inc : p));
    });

    // Zones and boundaries: draw helpers
    const drawZoneOnMap = (z: ZoneData) => {
      if (!mapRef.current) return;
      // clear existing
      if (zoneLayersRef.current[z.id]) {
        drawnItems.removeLayer(zoneLayersRef.current[z.id]);
        delete zoneLayersRef.current[z.id];
      }
      let layer: L.Layer | null = null;
      if (z.type === "circle") {
        const ll = toLatLng(z.coords);
        layer = L.circle(ll, {
          radius: z.radius ?? 50,
          color: riskToColor(z.risk),
          fillColor: riskToColor(z.risk),
          fillOpacity: 0.3,
        });
      } else {
        const latlngs = normalize(z.coords);
        layer = L.polygon(latlngs, {
          color: riskToColor(z.risk),
          fillColor: riskToColor(z.risk),
          fillOpacity: 0.3,
        });
      }
      (layer as any).customId = z.id;
      (layer as any).category = "zone";
      (layer as any).bindPopup(`<b>${z.name}</b><br/>Risk: ${z.risk ?? "Low"}`);
      zoneLayersRef.current[z.id] = layer!;
      drawnItems.addLayer(layer!); // make editable
    };

    const drawBoundaryOnMap = (b: BoundaryData) => {
      if (!mapRef.current) return;
      if (boundaryLayersRef.current[b.id]) {
        drawnItems.removeLayer(boundaryLayersRef.current[b.id]);
        delete boundaryLayersRef.current[b.id];
      }
      let layer: L.Layer | null = null;
      if (b.type === "circle") {
        // prefer center if provided (tourist app expects boundary circle as {center, radius})
        const ll = (b as any).center ? [(b as any).center.lat, (b as any).center.lng] : toLatLng(b.coords);
        layer = L.circle([Number(ll[0]), Number(ll[1])], {
          radius: b.radius ?? 50,
          color: "blue",
          fillOpacity: 0.08,
          dashArray: "5,5",
        });
      } else {
        const latlngs = normalize(b.coords);
        layer = L.polygon(latlngs, { color: "blue", fillOpacity: 0.08, dashArray: "5,5" });
      }
      (layer as any).customId = b.id;
      (layer as any).category = "boundary";
      (layer as any).bindPopup(`<b>${b.name}</b><br/>(Boundary)`);
      boundaryLayersRef.current[b.id] = layer!;
      drawnItems.addLayer(layer!); // make editable
    };

    const onZoneUpdate = (data: ZoneData) => drawZoneOnMap(data);
    const onZoneDeleted = ({ id }: { id: string }) => {
      if (!mapRef.current) return;
      const layer = zoneLayersRef.current[id];
      if (layer) {
        drawnItems.removeLayer(layer);
        delete zoneLayersRef.current[id];
      }
    };
    const onBoundaryUpdate = (data: BoundaryData) => drawBoundaryOnMap(data);
    const onBoundaryDeleted = ({ id }: { id: string }) => {
      if (!mapRef.current) return;
      const layer = boundaryLayersRef.current[id];
      if (layer) {
        drawnItems.removeLayer(layer);
        delete boundaryLayersRef.current[id];
      }
    };

    socket.on("zone-update", onZoneUpdate);
    socket.on("zone-deleted", onZoneDeleted);
    socket.on("boundary-update", onBoundaryUpdate);
    socket.on("boundary-deleted", onBoundaryDeleted);

    // Heatmap from server: points are [lng, lat] -> convert to [lat, lng]
    socket.on("heatmap-update", (points: [number, number][]) => {
      if (!mapRef.current) return;
      if (heatLayerRef.current) mapRef.current.removeLayer(heatLayerRef.current);
      const heatLatLngs = points.map(([lng, lat]) => [lat, lng] as [number, number]);
      heatLayerRef.current = (L as any).heatLayer(heatLatLngs, { radius: 25, blur: 15 }).addTo(mapRef.current);
    });

    // Alerts
    socket.on("zone-alert", (data: ZoneAlert) => {
      window.alert(`⚠️ Tourist ${data.touristId} entered zone "${data.zoneName}" (Risk: ${data.risk})`);
      setLiveAlerts((prev) => [
        { id: Date.now(), message: `Tourist ${data.touristId} entered ${data.zoneName}`, time: new Date().toLocaleTimeString(), type: "zone" },
        ...prev,
      ]);
    });

    // Draw handlers (create/edit/delete)
    const onDrawCreated = (e: any) => {
      const layer: L.Layer = e.layer;
      const id = Date.now().toString();

      const typeChoice = prompt("Enter Type (zone/boundary):", "zone");
      if (!typeChoice) return;
      const category = typeChoice.toLowerCase() === "boundary" ? "boundary" : "zone";

      const data: any = { id, name: "", category, type: "", coords: null, radius: undefined, risk: undefined };

      if (category === "zone") {
        const zoneName = prompt("Enter Zone Name:");
        const riskLevel = (prompt("Enter Risk Level (Low/Medium/High):", "Low") || "Low").toLowerCase();
        if (!zoneName) return;
        data.name = zoneName;
        data.risk = riskLevel;

        const color = riskToColor(data.risk);
        if (layer instanceof L.Circle) {
          // circle zone
          data.type = "circle";
          const ll = (layer as L.Circle).getLatLng();
          data.coords = { lat: ll.lat, lng: ll.lng };
          data.radius = (layer as L.Circle).getRadius();
          (layer as any).setStyle?.({ color, fillColor: color, fillOpacity: 0.4 });
        } else {
          // polygon zone
          data.type = "polygon";
          const latlngs = ((layer as L.Polygon).getLatLngs()[0] as L.LatLng[]).map((p) => ({ lat: p.lat, lng: p.lng }));
          data.coords = latlngs;
          (layer as any).setStyle?.({ color, fillColor: color, fillOpacity: 0.4 });
        }

        const popup = document.createElement("div");
        popup.innerHTML = `<b>${data.name}</b><br/>Risk: ${data.risk}<br/>`;
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "💾 Save Zone";
        saveBtn.onclick = () => {
          socket.emit("zone-update", data);
          drawnItems.removeLayer(layer); // rely on server echo to re-add
        };
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️ Delete Zone";
        delBtn.onclick = () => {
          socket.emit("zone-deleted", { id: data.id });
          drawnItems.removeLayer(layer);
        };
        popup.appendChild(saveBtn);
        popup.appendChild(document.createTextNode(" "));
        popup.appendChild(delBtn);
        (layer as any).bindPopup(popup).openPopup();
      } else {
        const boundaryName = prompt("Enter Boundary Name:");
        if (!boundaryName) return;
        data.name = boundaryName;

        if (layer instanceof L.Circle) {
          // circle boundary uses center for downstream tourist app
          data.type = "circle";
          const ll = (layer as L.Circle).getLatLng();
          data.center = { lat: ll.lat, lng: ll.lng };
          data.radius = (layer as L.Circle).getRadius();
          (layer as any).setStyle?.({ color: "blue", fillColor: "white", fillOpacity: 0.1, dashArray: "5,5" });
        } else {
          // polygon boundary
          data.type = "polygon";
          const latlngs = ((layer as L.Polygon).getLatLngs()[0] as L.LatLng[]).map((p) => ({ lat: p.lat, lng: p.lng }));
          data.coords = latlngs;
          (layer as any).setStyle?.({ color: "blue", fillColor: "white", fillOpacity: 0.1, dashArray: "5,5" });
        }

        const popup = document.createElement("div");
        popup.innerHTML = `<b>${data.name}</b><br/>(Boundary)<br/>`;
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "💾 Save Boundary";
        saveBtn.onclick = () => {
          socket.emit("boundary-update", data);
          drawnItems.removeLayer(layer);
        };
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️ Delete Boundary";
        delBtn.onclick = () => {
          socket.emit("boundary-deleted", { id: data.id });
          drawnItems.removeLayer(layer);
        };
        popup.appendChild(saveBtn);
        popup.appendChild(document.createTextNode(" "));
        popup.appendChild(delBtn);
        (layer as any).bindPopup(popup).openPopup();
      }

      // tag and add to editable group
      (layer as any).customId = id;
      (layer as any).category = category;
      drawnItems.addLayer(layer);
    };

    const onDrawEdited = (e: any) => {
      e.layers.eachLayer((layer: any) => {
        const id = layer.customId;
        const category = layer.category;
        if (!id || !category) return;

        if (layer instanceof L.Circle) {
          const ll = layer.getLatLng();
          if (category === "zone") {
            // circle zone uses coords
            const payload = { id, name: "", category, type: "circle", coords: { lat: ll.lat, lng: ll.lng }, radius: layer.getRadius() };
            socket.emit("zone-update", payload);
          } else {
            // circle boundary uses center
            const payload = { id, name: "", category, type: "circle", center: { lat: ll.lat, lng: ll.lng }, radius: layer.getRadius() };
            socket.emit("boundary-update", payload);
          }
        } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          const latlngs = (layer.getLatLngs()[0] as L.LatLng[]).map((p) => ({ lat: p.lat, lng: p.lng }));
          const payload = { id, name: "", category, type: "polygon", coords: latlngs };
          if (category === "zone") socket.emit("zone-update", payload);
          else socket.emit("boundary-update", payload);
        }
      });
    };

    const onDrawDeleted = (e: any) => {
      e.layers.eachLayer((layer: any) => {
        const id = layer.customId;
        const category = layer.category;
        if (!id || !category) return;
        if (category === "zone") socket.emit("zone-deleted", { id });
        else socket.emit("boundary-deleted", { id });
        if (zoneLayersRef.current[id]) delete zoneLayersRef.current[id];
        if (boundaryLayersRef.current[id]) delete boundaryLayersRef.current[id];
      });
    };

    map.on(L.Draw.Event.CREATED, onDrawCreated);
    map.on(L.Draw.Event.EDITED, onDrawEdited);
    map.on(L.Draw.Event.DELETED, onDrawDeleted);

    // Cleanup
    return () => {
  socket.off("receive-location", onReceiveLocation);
  socket.off("user-disconnected", onUserDisconnected);
  socket.off("zone-update", onZoneUpdate);
  socket.off("zone-deleted", onZoneDeleted);
  socket.off("boundary-update", onBoundaryUpdate);
  socket.off("boundary-deleted", onBoundaryDeleted);
  socket.off("heatmap-update");
  socket.off("zone-alert");
  socket.off('incident-list');
  socket.off('incident-new');
  socket.off('incident-updated');

      map.off(L.Draw.Event.CREATED, onDrawCreated);
      map.off(L.Draw.Event.EDITED, onDrawEdited);
      map.off(L.Draw.Event.DELETED, onDrawDeleted);

      if (heatLayerRef.current && mapRef.current) {
        try {
          mapRef.current.removeLayer(heatLayerRef.current);
        } catch {}
        heatLayerRef.current = null;
      }
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {}
      }
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Authority Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-600 text-white">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
            System Online
          </Badge>
          <Button className="authority-gradient text-white">
            <Zap className="w-4 h-4 mr-2" /> Emergency Protocol
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Tourists" value={stats.activeTourists} change="+Live" changeType="positive" icon={Users} status="info" />
        <StatsCard title="Active Incidents" value={stats.activeIncidents} change="-Live" changeType="negative" icon={AlertTriangle} status="emergency" />
        <StatsCard title="Response Time" value={`${stats.responseTime}m`} change="-Live" changeType="positive" icon={Clock} status="success" />
        <StatsCard title="Officers On Duty" value={stats.officersOnDuty} change="Live" changeType="positive" icon={Shield} status="success" />
      </div>

      {/* Map */}
      <Card className={`relative ${fullscreen ? "h-screen" : "h-96"}`}>
        <div className="absolute top-2 right-2 z-10">
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Live Map
          </CardTitle>
          <CardDescription>Zones, Tourists, Responders, Heatmap</CardDescription>
        </CardHeader>
        <CardContent className="h-full w-full">
          <div ref={mapContainerRef} className="h-full w-full rounded-lg overflow-hidden" />
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Live Alerts
          </CardTitle>
          <CardDescription>Notifications from system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {liveAlerts.map((a) => (
            <div key={a.id} className="p-3 border rounded hover:bg-muted/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.message}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">{a.type}</Badge>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-4">View All</Button>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" /> Recent Incidents
              </CardTitle>
              <CardDescription>Latest SOS / events</CardDescription>
            </div>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" /> View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIncidents.map((inc) => (
              <div key={inc.id} className="flex items-center justify-between p-4 border rounded hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{inc.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
  {inc.location ? `${inc.location.lat}, ${inc.location.lng}` : "Unknown location"} • {inc.time}
</p>

                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
