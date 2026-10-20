import { describe, it, expect } from 'vitest';
import { vehicleCheck } from '../../src/engine/answer.js';
import { romeDate } from '../../src/engine/time.js';

// Calendario di prova con la stessa forma di quello di Area B.
const zone = {
  vehicleBans: [
    { fuel: ['benzina'], maxEuro: 2, since: null, label: 'Benzina Euro 0, 1, 2' },
    { fuel: ['diesel'], maxEuro: 5, since: null, label: 'Diesel Euro 0-5' },
    { fuel: ['benzina'], maxEuro: 3, since: '2025-10-01', label: 'Benzina Euro 3' },
    { fuel: ['diesel'], euro6: 'abc', since: '2028-10-01', label: 'Diesel Euro 6 A, B, C' },
    { fuel: ['diesel'], euro6: 'd', since: '2030-10-01', label: 'Diesel Euro 6 D-TEMP e D' },
  ],
};
const OGGI = romeDate(2026, 10, 20, 10, 0);
const NEL_2029 = romeDate(2029, 1, 10, 10, 0);

describe('vehicleCheck con sottoclassi Euro 6', () => {
  it('diesel Euro 5 vietato oggi (divieto già in vigore, senza data)', () => {
    expect(vehicleCheck(zone, { fuel: 'diesel', euro: 5 }, OGGI).result).toBe('banned');
  });
  it('diesel Euro 6 ammesso oggi anche senza sottoclasse', () => {
    expect(vehicleCheck(zone, { fuel: 'diesel', euro: 6 }, OGGI).result).toBe('allowed');
  });
  it('nel 2029 un diesel Euro 6 A-B-C è vietato, un D no', () => {
    expect(vehicleCheck(zone, { fuel: 'diesel', euro: 6, euro6: 'abc' }, NEL_2029).result).toBe('banned');
    expect(vehicleCheck(zone, { fuel: 'diesel', euro: 6, euro6: 'd' }, NEL_2029).result).toBe('allowed');
  });
  it('nel 2029 un diesel Euro 6 senza sottoclasse è "da verificare"', () => {
    expect(vehicleCheck(zone, { fuel: 'diesel', euro: 6 }, NEL_2029).result).toBe('unknown');
  });
  it('benzina Euro 3 vietata dal 1/10/2025', () => {
    expect(vehicleCheck(zone, { fuel: 'benzina', euro: 3 }, romeDate(2025, 9, 30, 10, 0)).result).toBe('allowed');
    expect(vehicleCheck(zone, { fuel: 'benzina', euro: 3 }, romeDate(2025, 10, 1, 10, 0)).result).toBe('banned');
  });
  it('elettrico e ibrido non rientrano nei divieti', () => {
    expect(vehicleCheck(zone, { fuel: 'elettrico', euro: null }, NEL_2029).result).toBe('allowed');
    expect(vehicleCheck(zone, { fuel: 'ibrido', euro: null }, NEL_2029).result).toBe('allowed');
  });
  it('alimentazioni con regole non chiare restano "da verificare"', () => {
    const z = { ...zone, uncertainFuels: ['gpl', 'metano'] };
    expect(vehicleCheck(z, { fuel: 'gpl', euro: 4 }, OGGI).result).toBe('unknown');
  });
});
