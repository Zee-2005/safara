// src/types/leaflet-heat.d.ts
declare module 'leaflet.heat' {
  import * as L from 'leaflet';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function heatLayer(latlngs: Array<[number, number] | L.LatLng | any>, options?: any): L.Layer;
  const _default: unknown;
  export default _default;
}
