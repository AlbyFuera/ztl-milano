import { describe, it, expect } from 'vitest';
import { fineDeadlines } from '../../src/engine/fines.js';

const rules = { min: 83, max: 332, reducedPct: 30, reducedDays: 5, payDays: 60, prefettoDays: 60, giudiceDays: 30 };

describe('fineDeadlines', () => {
  it('calcola importo ridotto del 30% arrotondato al centesimo', () => {
    const r = fineDeadlines({ year: 2026, month: 10, day: 20 }, rules);
    expect(r.reduced).toBe(58.1);
    expect(r.ordinary).toBe(83);
  });
  it('mette le scadenze nell\'ordine giusto a partire dalla notifica', () => {
    const r = fineDeadlines({ year: 2026, month: 10, day: 20 }, rules);
    expect(r.steps.map((s) => s.id)).toEqual(['ridotto', 'giudice', 'ordinario', 'prefetto']);
    expect(r.steps[0].date).toEqual({ year: 2026, month: 10, day: 25 });
    expect(r.steps[1].date).toEqual({ year: 2026, month: 11, day: 19 });
    expect(r.steps[2].date).toEqual({ year: 2026, month: 12, day: 19 });
  });
  it('dopo i 60 giorni l\'importo dovuto è la metà del massimo', () => {
    expect(fineDeadlines({ year: 2026, month: 10, day: 20 }, rules).late).toBe(166);
  });
  it('segna come passate le scadenze prima di oggi', () => {
    const r = fineDeadlines({ year: 2026, month: 10, day: 1 }, rules, { year: 2026, month: 10, day: 20 });
    expect(r.steps.find((s) => s.id === 'ridotto').past).toBe(true);
    expect(r.steps.find((s) => s.id === 'ordinario').past).toBe(false);
  });
  it('restituisce null se mancano gli importi', () => {
    expect(fineDeadlines({ year: 2026, month: 10, day: 20 }, {})).toBeNull();
  });
});
