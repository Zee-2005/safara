import React, { useEffect, useRef, useState } from "react";
// Type definition for ZoneData
type ZoneData = {
  id: string;
  name: string;
  type: "circle" | "polygon";
  coords: any;
  radius?: number;
  risk?: string;
};
// Type definition for BoundaryData
type BoundaryData = {
  id: string;
  name: string;
  type: "circle" | "polygon";
  coords: any;
  radius?: number;
};
import io, { Socket } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";import { Badge } from "@/components/ui/badge";
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

// ---------------- TYPES ----------------
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
  id: number | string;
  type: string;
  location: string;
  time: string;
}

const Dashboard: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef(new L.FeatureGroup());
  const markersRef = useRef<Record<string, L.Marker>>({});
  const zoneLayersRef = useRef<Record<string, L.Layer>>({});
  const boundaryLayersRef = useRef<Record<string, L.Layer>>({});
  const socketRef = useRef<Socket | null>(null);
  // Add heatLayerRef for heatmap
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

  const toggleFullscreen = () => setFullscreen(!fullscreen);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // ✅ Leaflet map init
    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    const street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const satellite = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "© Google Satellite",
      }
    );
    const hybrid = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "© Google Hybrid",
      }
    );

    L.control.layers({ Street: street, Satellite: satellite, Hybrid: hybrid }).addTo(map);

    // ✅ Draw controls
    // Draw controls and layer group
    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItemsRef.current);
    const drawControl = new (L.Control as any).Draw({
      edit: { featureGroup: drawnItems },
      draw: { circle: true, polygon: true, rectangle: true, polyline: false, marker: false },
    });
    map.addControl(drawControl);


    // ✅ Socket
    socketRef.current = io("http://localhost:5000");
    const socket = socketRef.current;
const onReceiveLocation = (data: LocationData) => {
      setTourists(prev => ({ ...prev, [data.id]: data }));
      if (!mapRef.current) return;
      const mk = markersRef.current;
      if (mk[data.id]) mk[data.id].setLatLng([data.latitude, data.longitude]);
      else {
        mk[data.id] = L.marker([data.latitude, data.longitude]).addTo(mapRef.current).bindPopup(`Tourist: ${data.id}`);
      }
    };
    const onUserDisconnected = (id: string) => {
      const mk = markersRef.current;
      if (mk[id] && mapRef.current) {
        mapRef.current.removeLayer(mk[id]);
        delete mk[id];
      }
      setTourists(prev => { const copy = { ...prev }; delete copy[id]; return copy; });
    };
    socket.on("user-disconnected", onUserDisconnected);
    
    // ------------- Render zones/boundaries when received -------------
    const drawZoneOnMap = (z: ZoneData) => {
      // remove existing layer (update)
      if (zoneLayersRef.current[z.id] && mapRef.current) {
        mapRef.current.removeLayer(zoneLayersRef.current[z.id]);
        delete zoneLayersRef.current[z.id];
      }
      let layer: L.Layer | null = null;
      if (z.type === "circle") {
        const latlng = (z.coords && z.coords.lat !== undefined) ? [z.coords.lat, z.coords.lng] : [z.coords[0], z.coords[1]];
        layer = L.circle(latlng as [number, number], { radius: z.radius ?? 50, color: riskToColor(z.risk), fillColor: riskToColor(z.risk), fillOpacity: 0.3 }).addTo(mapRef.current!);
      } else if (z.type === "polygon") {
        const latlngs = (z.coords as any[]).map((c: any) => [c[1] ?? c.lat, c[0] ?? c.lng].reverse ? [c.lat, c.lng] : (c.lat ? [c.lat, c.lng] : [c[1], c[0]]));
        // Normalize coords: accept both [lng,lat] or {lat,lng}
        const norm = (z.coords as any[]).map((c: any) => (typeof c[0] === "number" && typeof c[1] === "number") ? [c[1], c[0]] : (c.lat ? [c.lat, c.lng] : [c[1], c[0]]));
        layer = L.polygon(norm as any, { color: riskToColor(z.risk), fillColor: riskToColor(z.risk), fillOpacity: 0.3 }).addTo(mapRef.current!);
      }
      if (layer) {
        layer.bindPopup(`<b>${z.name}</b><br/>Risk: ${z.risk ?? "Low"}`);
        zoneLayersRef.current[z.id] = layer;
      }
    };

const drawBoundaryOnMap = (b: BoundaryData) => {
      if (boundaryLayersRef.current[b.id] && mapRef.current) {
        mapRef.current.removeLayer(boundaryLayersRef.current[b.id]);
        delete boundaryLayersRef.current[b.id];
      }
      let layer: L.Layer | null = null;
      if (b.type === "circle") {
        const latlng = (b.coords && b.coords.lat !== undefined) ? [b.coords.lat, b.coords.lng] : [b.coords[0], b.coords[1]];
        layer = L.circle(latlng as [number, number], { radius: b.radius ?? 50, color: "blue", fillOpacity: 0.08, dashArray: "5,5" }).addTo(mapRef.current!);
      } else if (b.type === "polygon") {
        const norm = (b.coords as any[]).map((c: any) => (typeof c[0] === "number" && typeof c[1] === "number") ? [c[1], c[0]] : (c.lat ? [c.lat, c.lng] : [c[1], c[0]]));
        layer = L.polygon(norm as any, { color: "blue", fillOpacity: 0.08, dashArray: "5,5" }).addTo(mapRef.current!);
      }
      if (layer) {
        layer.bindPopup(`<b>${b.name}</b><br/>(Boundary)`);
        boundaryLayersRef.current[b.id] = layer;
      }
    };
const onZoneUpdate = (data: ZoneData) => { drawZoneOnMap(data); };
    const onZoneDeleted = ({ id }: { id: string }) => {
      if (zoneLayersRef.current[id] && mapRef.current) {
        mapRef.current.removeLayer(zoneLayersRef.current[id]);
        delete zoneLayersRef.current[id];
      }
    };
    

const onBoundaryUpdate = (data: BoundaryData) => { drawBoundaryOnMap(data); };
    const onBoundaryDeleted = ({ id }: { id: string }) => {
      if (boundaryLayersRef.current[id] && mapRef.current) {
        mapRef.current.removeLayer(boundaryLayersRef.current[id]);
        delete boundaryLayersRef.current[id];
      }
    };

    socket.on("zone-update", onZoneUpdate);
    socket.on("zone-deleted", onZoneDeleted);
    socket.on("boundary-update", onBoundaryUpdate);
    socket.on("boundary-deleted", onBoundaryDeleted);

    // heatmap
    socket.on("heatmap-update", (points: [number, number][]) => {
      if (!mapRef.current) return;
      if (heatLayerRef.current) mapRef.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = (L as any).heatLayer(points.map(p => [p[0], p[1]]), { radius: 25, blur: 15 }).addTo(mapRef.current);
    });

const riskToColor = (risk: string) => {
  switch (risk.toLowerCase()) {
    case "high": return "red";
    case "medium": return "orange";
    default: return "green";
  }
};

const createDeleteButton = (label: string, onClick: () => void) => {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.style.marginTop = "6px";
  btn.style.padding = "5px 8px";
  btn.style.border = "none";
  btn.style.background = "#d32f2f";
  btn.style.color = "white";
  btn.style.borderRadius = "4px";
  btn.style.cursor = "pointer";
  btn.onclick = () => {
    onClick();
    btn.disabled = true;
    btn.style.background = "gray";
  };
  return btn;
};

const createSaveButton = (label: string, onClick: () => void) => {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.style.marginTop = "6px";
  btn.style.padding = "5px 8px";
  btn.style.border = "none";
  btn.style.background = "#388e3c";
  btn.style.color = "white";
  btn.style.borderRadius = "4px";
  btn.style.cursor = "pointer";
  btn.onclick = () => {
    onClick();
    btn.disabled = true;
    btn.style.background = "gray";
  };
  return btn;
};

// ✅ Main draw handler
const onDrawCreated = (e: any) => {
  const layer = e.layer;
  const id = Date.now().toString();

  const typeChoice = prompt("Enter Type (zone/boundary):", "zone");
  if (!typeChoice) return;
  const category = typeChoice.toLowerCase();

  const data: any = { id, name: "", category, type: "", coords: null, radius: undefined, risk: undefined };

  if (category === "zone") {
    const zoneName = prompt("Enter Zone Name:");
    const riskLevel = prompt("Enter Risk Level (Low/Medium/High):");
    if (!zoneName) return;

    data.name = zoneName;
    data.risk = riskLevel || "Low";

    let color = riskToColor(data.risk);

    if (layer instanceof L.Circle) {
      data.type = "circle";
      const latlng = layer.getLatLng();
      data.coords = { lat: latlng.lat, lng: latlng.lng };
      data.radius = layer.getRadius();
      layer.setStyle({ color, fillColor: color, fillOpacity: 0.4 });
    } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
      data.type = "polygon";
      const latlngs = (layer.getLatLngs()[0] as L.LatLng[]).map(p => ({ lat: p.lat, lng: p.lng }));
      data.coords = latlngs;
      layer.setStyle({ color, fillColor: color, fillOpacity: 0.4 });
    }

    const popup = document.createElement("div");
    popup.innerHTML = `<b>${data.name}</b><br/>Risk: ${data.risk}<br/>`;
    popup.appendChild(createSaveButton("💾 Save Zone", () => socket.emit("zone-update", data)));
    popup.appendChild(createDeleteButton("🗑️ Delete Zone", () => socket.emit("zone-deleted", { id: data.id })));
    layer.bindPopup(popup).openPopup();

  } else { // boundary
    const boundaryName = prompt("Enter Boundary Name:");
    if (!boundaryName) return;
    data.name = boundaryName;

    if (layer instanceof L.Circle) {
      data.type = "circle";
      const latlng = layer.getLatLng();
      data.coords = { lat: latlng.lat, lng: latlng.lng };
      data.radius = layer.getRadius();
      layer.setStyle({ color: "blue", fillColor: "white", fillOpacity: 0.1, dashArray: "5,5" });
    } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
      data.type = "polygon";
      const latlngs = (layer.getLatLngs()[0] as L.LatLng[]).map(p => ({ lat: p.lat, lng: p.lng }));
      data.coords = latlngs;
      layer.setStyle({ color: "blue", fillColor: "white", fillOpacity: 0.1, dashArray: "5,5" });
    }

    const popup = document.createElement("div");
    popup.innerHTML = `<b>${data.name}</b><br/>(Boundary)<br/>`;
    popup.appendChild(createSaveButton("💾 Save Boundary", () => socket.emit("boundary-update", data)));
    popup.appendChild(createDeleteButton("🗑️ Delete Boundary", () => socket.emit("boundary-deleted", { id: data.id })));
    layer.bindPopup(popup).openPopup();
  }

  drawnItemsRef.current.addLayer(layer); // ✅ ensure group exists & added to map
};

map.on(L.Draw.Event.CREATED, onDrawCreated);
map.on(L.Draw.Event.DELETED, createDeleteButton);
socket.on("zone-alert", (data: ZoneAlert) => {
  window.alert(`⚠️ Tourist ${data.touristId} entered zone "${data.zoneName}" (Risk: ${data.risk})`);
  setLiveAlerts((prev) => [
    {
      id: Date.now(),
      message: `Tourist ${data.touristId} entered ${data.zoneName}`,
      time: new Date().toLocaleTimeString(),
      type: "zone",
    },
    ...prev,
  ]);
});

    // ------------- Cleanup on unmount -------------
    return () => {
      // remove socket handlers
      socket.off("receive-location", onReceiveLocation);
      socket.off("user-disconnected", onUserDisconnected);
      socket.off("zone-update", onZoneUpdate);
      socket.off("zone-deleted", onZoneDeleted);
      socket.off("boundary-update", onBoundaryUpdate);
      socket.off("boundary-deleted", onBoundaryDeleted);
      socket.off("heatmap-update");

      // remove draw created handler
      map.off(L.Draw.Event.CREATED, onDrawCreated);

      // remove layers & map
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (err) { /* ignore */ }
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
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
            System Online
          </Badge>
          <Button className="authority-gradient text-white">
            <Zap className="w-4 h-4 mr-2" /> Emergency Protocol
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent>Active Tourists: {stats.activeTourists}</CardContent></Card>
        <Card><CardContent>Active Incidents: {stats.activeIncidents}</CardContent></Card>
        <Card><CardContent>Response Time: {stats.responseTime}m</CardContent></Card>
        <Card><CardContent>Officers On Duty: {stats.officersOnDuty}</CardContent></Card>
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
          {/* ✅ FIXED: map container ref */}
          <div ref={mapContainerRef} className="h-full w-full rounded-lg overflow-hidden"></div>
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
                  <p className="text-sm text-muted-foreground">{inc.location} • {inc.time}</p>
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