import { describe, it, expect } from 'vitest';
import { answerQuestion } from '../../src/engine/answer.js';
import { romeDate } from '../../src/engine/time.js';
import { zones, fines } from './fixtures.js';

const NOW = romeDate(2026, 10, 20, 10, 0);
const ask = (q, vehicle) => answerQuestion(q, NOW, { zones, fines, vehicle });

describe('permessi', () => {
  it('con il contrassegno disabili una ZTL attiva diventa "dipende" con la condizione', () => {
    const r = ask('posso entrare in sarpi?', { fuel: 'benzina', euro: 6, permits: ['cude'] });
    expect(r.verdict).toBe('dipende');
    expect(r.text).toMatch(/contrassegno/i);
  });
  it('da residente una ZTL attiva diventa "dipende"', () => {
    const r = ask('posso entrare in sarpi?', { fuel: 'benzina', euro: 6, permits: ['residente'] });
    expect(r.verdict).toBe('dipende');
    expect(r.text).toMatch(/resident/i);
  });
  it('un permesso non cambia mai un "sì" (zona spenta)', () => {
    const r = ask('area c domenica alle 12', { fuel: 'benzina', euro: 6, permits: ['cude'] });
    expect(r.verdict).toBe('si');
  });
  it('usa la nota specifica della zona se c\'è', () => {
    const z = zones.map((x) => (x.id === 'area-c' ? { ...x, permitNotes: { residente: { verdict: 'pagamento', text: 'Da residente hai 50 ingressi gratis.' } } } : x));
    const r = answerQuestion('area c alle 11', NOW, { zones: z, fines, vehicle: { fuel: 'benzina', euro: 6, permits: ['residente'] } });
    expect(r.verdict).toBe('pagamento');
    expect(r.text).toMatch(/50 ingressi/);
  });
  it('senza permessi il verdetto resta "no"', () => {
    expect(ask('posso entrare in sarpi?', { fuel: 'benzina', euro: 6, permits: [] }).verdict).toBe('no');
  });
});

describe('permessi: testo pulito', () => {
  it('non chiede la classe Euro se la zona non ha divieti per veicolo', () => {
    const r = ask('posso entrare in sarpi?', { fuel: 'benzina', euro: 6, permits: ['cude'] });
    expect(r.text).not.toMatch(/Sono vietati/);
  });
});
