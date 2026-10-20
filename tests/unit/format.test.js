import { describe, it, expect } from 'vitest';
import { formatWhenRel, describeDays, describeSchedule } from '../../src/engine/format.js';
import { romeDate } from '../../src/engine/time.js';

describe('formatWhenRel', () => {
  it('riconosce "domani" anche la notte del passaggio all\'ora legale (29/03/2026)', () => {
    const now = romeDate(2026, 3, 28, 23, 30);
    expect(formatWhenRel(romeDate(2026, 3, 29, 23, 45), now)).toMatch(/^domani/);
    expect(formatWhenRel(romeDate(2026, 3, 30, 0, 30), now)).toMatch(/^lunedì 30 marzo/);
  });
  it('usa "oggi" per lo stesso giorno', () => {
    expect(formatWhenRel(romeDate(2026, 10, 20, 19, 30), romeDate(2026, 10, 20, 10, 0))).toBe('oggi alle 19:30');
  });
});

describe('describeDays / describeSchedule', () => {
  it('nomina gli intervalli comuni in italiano', () => {
    expect(describeDays([1, 2, 3, 4, 5])).toBe('dal lunedì al venerdì');
    expect(describeDays([7, 6])).toBe('sabato e domenica');
    expect(describeDays([1, 3])).toBe('lunedì e mercoledì');
  });
  it('descrive gli orari con i festivi esclusi', () => {
    const z = { schedule: [{ days: [1, 2, 3, 4, 5], from: '07:30', to: '19:30' }], holidaysOff: true };
    expect(describeSchedule(z)).toBe('Dal lunedì al venerdì dalle 07:30 alle 19:30, esclusi i festivi');
  });
});
