import { describe, it, expect } from 'vitest';
import { pointInGeometry, distanceToGeometryM } from '../../src/engine/geo.js';

// Quadrato attorno al Duomo (lng, lat come in GeoJSON) con un buco al centro.
const square = {
  type: 'Polygon',
  coordinates: [
    [[9.18, 45.46], [9.20, 45.46], [9.20, 45.47], [9.18, 45.47], [9.18, 45.46]],
    [[9.188, 45.464], [9.192, 45.464], [9.192, 45.466], [9.188, 45.466], [9.188, 45.464]],
  ],
};
const multi = { type: 'MultiPolygon', coordinates: [square.coordinates, [[[9.0, 45.0], [9.01, 45.0], [9.01, 45.01], [9.0, 45.0]]]] };

describe('pointInGeometry', () => {
  it('un punto dentro il poligono è dentro', () => {
    expect(pointInGeometry(45.461, 9.181, square)).toBe(true);
  });
  it('un punto nel buco è fuori', () => {
    expect(pointInGeometry(45.465, 9.19, square)).toBe(false);
  });
  it('un punto lontano è fuori', () => {
    expect(pointInGeometry(45.5, 9.3, square)).toBe(false);
  });
  it('funziona con i MultiPolygon', () => {
    expect(pointInGeometry(45.461, 9.181, multi)).toBe(true);
  });
  it('geometria nulla o di altro tipo → false', () => {
    expect(pointInGeometry(45.461, 9.181, null)).toBe(false);
    expect(pointInGeometry(45.461, 9.181, { type: 'Point', coordinates: [9.18, 45.46] })).toBe(false);
  });
});

describe('distanceToGeometryM', () => {
  it('è 0 dentro e circa 1100 m a 0.01° di latitudine dal bordo', () => {
    expect(distanceToGeometryM(45.461, 9.181, square)).toBe(0);
    const d = distanceToGeometryM(45.48, 9.19, square);
    expect(d).toBeGreaterThan(1000);
    expect(d).toBeLessThan(1200);
  });
});
