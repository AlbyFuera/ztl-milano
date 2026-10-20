// Geometrie GeoJSON: coordinate [lng, lat].
function inRing(lat, lng, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function polygons(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}

export function pointInGeometry(lat, lng, geometry) {
  return polygons(geometry).some(
    ([outer, ...holes]) => inRing(lat, lng, outer) && !holes.some((h) => inRing(lat, lng, h)),
  );
}

// Distanza approssimata (proiezione equirettangolare, ottima alla scala di una città).
function segmentDistanceM(lat, lng, [x1, y1], [x2, y2]) {
  const k = Math.cos((lat * Math.PI) / 180);
  const px = lng * k, py = lat;
  const ax = x1 * k, ay = y1, bx = x2 * k, by = y2;
  const dx = bx - ax, dy = by - ay;
  const t = dx || dy ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))) : 0;
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy) * 111320;
}

export function distanceToGeometryM(lat, lng, geometry) {
  if (pointInGeometry(lat, lng, geometry)) return 0;
  let best = Infinity;
  for (const poly of polygons(geometry)) {
    for (const ring of poly) {
      for (let i = 1; i < ring.length; i++) best = Math.min(best, segmentDistanceM(lat, lng, ring[i - 1], ring[i]));
    }
  }
  return best;
}
