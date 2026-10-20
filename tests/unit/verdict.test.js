import { describe, it, expect } from 'vitest';
import { personalVerdict } from '../../src/verdict.js';
import { romeDate } from '../../src/engine/time.js';
import { zones } from './fixtures.js';

const z = (id) => zones.find((x) => x.id === id);
const MAR_11 = romeDate(2026, 10, 20, 11, 0);
const DOM_12 = romeDate(2026, 10, 25, 12, 0);

describe('personalVerdict', () => {
  it('Area C attiva senza veicolo: a pagamento', () => {
    expect(personalVerdict(z('area-c'), MAR_11, null).key).toBe('pagamento');
  });
  it('Area C la domenica: puoi entrare', () => {
    expect(personalVerdict(z('area-c'), DOM_12, null).key).toBe('si');
  });
  it('Area B attiva senza veicolo: dipende', () => {
    expect(personalVerdict(z('area-b'), MAR_11, null).key).toBe('dipende');
  });
  it('Area B con diesel Euro 5: non puoi', () => {
    expect(personalVerdict(z('area-b'), MAR_11, { fuel: 'diesel', euro: 5 }).key).toBe('no');
  });
  it('ZTL sempre attiva: non puoi, con CUDE dipende', () => {
    expect(personalVerdict(z('sarpi'), MAR_11, { fuel: 'benzina', euro: 6 }).key).toBe('no');
    expect(personalVerdict(z('sarpi'), MAR_11, { fuel: 'benzina', euro: 6, permits: ['cude'] }).key).toBe('dipende');
  });
  it('zona senza orari: unk', () => {
    expect(personalVerdict({ id: 'x', type: 'ztl', scheduleUnknown: true, schedule: [] }, MAR_11, null).key).toBe('unk');
  });
  it('coincide con il verdetto dell\'assistente', async () => {
    const { answerQuestion } = await import('../../src/engine/answer.js');
    const v = { fuel: 'diesel', euro: 5 };
    expect(personalVerdict(z('area-b'), MAR_11, v).key).toBe(answerQuestion('area b alle 11', romeDate(2026, 10, 20, 9, 0), { zones, vehicle: v }).verdict);
  });
});
