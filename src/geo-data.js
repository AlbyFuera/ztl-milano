import { pointInGeometry, distanceToGeometryM } from './engine/geo.js';

const cache = new Map();

// Carica il GeoJSON di una zona (file in /public/geo). Restituisce null se non disponibile.
export async function loadZoneGeo(zone) {
  if (!zone.geo) return null;
  if (!cache.has(zone.id)) {
    cache.set(
      zone.id,
      fetch(zone.geo)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    );
  }
  return cache.get(zone.id);
}

// Zone che contengono il punto e la più vicina tra quelle che non lo contengono.
export async function locate(lat, lng, zones) {
  const inside = [];
  let nearest = null;
  for (const zone of zones) {
    const fc = await loadZoneGeo(zone);
    if (!fc) continue;
    let best = Infinity;
    for (const f of fc.features ?? []) {
      if (pointInGeometry(lat, lng, f.geometry)) { best = 0; break; }
      best = Math.min(best, distanceToGeometryM(lat, lng, f.geometry));
    }
    if (best === 0) inside.push(zone);
    else if (Number.isFinite(best) && (!nearest || best < nearest.distance)) nearest = { zone, distance: best };
  }
  return { inside, nearest };
}

// Ordine di specificità: una ZTL dentro Area C dentro Area B.
const RANK = { pedonale: 0, ztl: 1, congestion: 2, lez: 3 };
export const mostSpecific = (list) => [...list].sort((a, b) => (RANK[a.type] ?? 9) - (RANK[b.type] ?? 9))[0] ?? null;
