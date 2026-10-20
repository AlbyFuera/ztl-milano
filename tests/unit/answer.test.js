import { describe, it, expect } from 'vitest';
import { answerQuestion } from '../../src/engine/answer.js';
import { romeDate } from '../../src/engine/time.js';
import { zones, fines } from './fixtures.js';

const NOW = romeDate(2026, 10, 20, 10, 0); // martedì 20/10/2026 10:00
const ask = (q, extra = {}) => answerQuestion(q, NOW, { zones, fines, ...extra });

describe('answerQuestion: Area C (a pagamento)', () => {
  it('alle 18 di un feriale si entra solo a pagamento e dice quando torna libera', () => {
    const r = ask('posso entrare in area c alle 18?');
    expect(r.verdict).toBe('pagamento');
    expect(r.text).toMatch(/07:30/);
    expect(r.text).toMatch(/19:30/);
    expect(r.zoneId).toBe('area-c');
    expect(r.sources.length).toBeGreaterThan(0);
  });
  it('alle 20 si entra liberamente fino alla riattivazione di mercoledì', () => {
    const r = ask('area c alle 20');
    expect(r.verdict).toBe('si');
    expect(r.text).toMatch(/mercoledì 21 ottobre/);
    expect(r.text).toMatch(/07:30/);
  });
  it('a Natale non è attiva e dice perché', () => {
    const r = ask('area c il 25/12 alle 11');
    expect(r.verdict).toBe('si');
    expect(r.text).toMatch(/Natale/);
  });
});

describe('answerQuestion: ZTL con accesso solo per autorizzati', () => {
  it('sabato alle 21 Brera è chiusa e dice da che ora si può entrare', () => {
    const r = ask('posso entrare a brera sabato alle 21?');
    expect(r.verdict).toBe('no');
    expect(r.text).toMatch(/02:00/);
  });
  it('una ZTL sempre attiva risponde no e lo spiega', () => {
    const r = ask('posso entrare in sarpi?');
    expect(r.verdict).toBe('no');
    expect(r.text).toMatch(/24 ore su 24/);
  });
});

describe('answerQuestion: Area B (dipende dal veicolo)', () => {
  it('senza veicolo risponde "dipende" e chiede alimentazione ed Euro', () => {
    const r = ask('posso entrare in area b alle 11?');
    expect(r.verdict).toBe('dipende');
    expect(r.text).toMatch(/Euro/);
  });
  it('un diesel Euro 5 non può entrare quando è attiva', () => {
    expect(ask('ho un diesel euro 5, posso entrare in area b alle 11?').verdict).toBe('no');
  });
  it('un benzina Euro 6 può entrare', () => {
    expect(ask('area b alle 11', { vehicle: { fuel: 'benzina', euro: 6 } }).verdict).toBe('si');
  });
  it('fuori orario chiunque può entrare', () => {
    expect(ask('diesel euro 3 in area b alle 21').verdict).toBe('si');
  });
  it('il veicolo scritto nella domanda vince su quello salvato', () => {
    const r = ask('diesel euro 5 area b alle 11', { vehicle: { fuel: 'benzina', euro: 6 } });
    expect(r.verdict).toBe('no');
  });
});

describe('answerQuestion: casi limite', () => {
  it('una zona sconosciuta chiede di scegliere e propone le zone vere', () => {
    const r = ask('posso entrare in zona pippo?');
    expect(r.verdict).toBe('chiarire');
    expect(r.text).toMatch(/Area C/);
  });
  it('una domanda vuota non va in errore', () => {
    expect(ask('').verdict).toBe('chiarire');
    expect(ask(undefined).verdict).toBe('chiarire');
  });
  it('le domande sulle multe rispondono con gli importi', () => {
    const r = ask('quanto è la multa in area c?');
    expect(r.verdict).toBe('info');
    expect(r.text).toMatch(/83/);
  });
  it('l\'uscita da Area C è sempre libera', () => {
    const r = ask('quando posso uscire da area c?');
    expect(r.verdict).toBe('si');
    expect(r.text).toMatch(/uscita/i);
  });
  it('una domanda solo sugli orari restituisce gli orari senza verdetto di accesso', () => {
    const r = ask('orari brera');
    expect(r.verdict).toBe('info');
    expect(r.text).toMatch(/20:00/);
  });
});

describe('answerQuestion: qualità del testo', () => {
  it('scrive i nomi dei festivi con la maiuscola', () => {
    expect(ask('area c il 25/12 alle 11').text).toMatch(/Natale/);
  });
  it('ogni frase inizia con la maiuscola', () => {
    const r = ask('area c alle 18');
    expect(r.text).toMatch(/^Sì, ma a pagamento\. Oggi/);
  });
  it('dice "oggi" e "domani" quando serve', () => {
    expect(ask('area c alle 18').text).toMatch(/oggi alle 19:30/);
    expect(ask('area c alle 20').text).toMatch(/domani, mercoledì 21 ottobre, alle 07:30/);
  });
  it('una fascia notturna si legge come un\'unica fascia', () => {
    const r = ask('posso entrare a brera sabato alle 21?');
    expect(r.text).toMatch(/dalle 20:00 alle 02:00/);
    expect(r.text).not.toMatch(/24:00/);
  });
});

describe('answerQuestion: orario non confermato e testo separato dal verdetto', () => {
  const extra = [...zones, { id: 'ignota', name: 'ZTL Ignota', type: 'ztl', aliases: ['ignota'], schedule: [], scheduleUnknown: true, sources: ['https://dati.comune.milano.it/x'] }];
  it('per una zona senza orario risponde "info" e non inventa un verdetto', () => {
    const r = answerQuestion('posso entrare in ignota alle 10?', NOW, { zones: extra, fines });
    expect(r.verdict).toBe('info');
    expect(r.text).toMatch(/orari/i);
  });
  it('restituisce il dettaglio senza ripetere il verdetto', () => {
    const r = ask('area c alle 18');
    expect(r.detail).not.toMatch(/^Sì/);
    expect(r.text.startsWith('Sì, ma a pagamento.')).toBe(true);
  });
  it('per un orario da Open Data aggiunge l\'avviso di verifica', () => {
    const z = [...zones, { id: 'od', name: 'ZTL Od', type: 'ztl', aliases: ['zona od'], alwaysActive: true, verified: false, sources: ['https://dati.comune.milano.it/x'] }];
    const r = answerQuestion('posso entrare in zona od?', NOW, { zones: z, fines });
    expect(r.text).toMatch(/cartello/);
  });
});

describe('answerQuestion: frasi per tipo di zona', () => {
  const ped = [...zones, { id: 'ped', name: 'Area pedonale Prova', type: 'pedonale', aliases: ['pedonale prova'], alwaysActive: true, sources: ['https://www.comune.milano.it/x'] }];
  it('per un\'area pedonale dice che è chiusa alle auto', () => {
    const r = answerQuestion('posso entrare in pedonale prova?', NOW, { zones: ped, fines });
    expect(r.verdict).toBe('no');
    expect(r.text).toMatch(/chiusa alle auto/);
  });
  it('usa la versione breve delle istruzioni di pagamento se c\'è', () => {
    const z = zones.map((x) => (x.id === 'area-c' ? { ...x, payment: 'lungo '.repeat(50), paymentShort: 'Paga il ticket entro domani.' } : x));
    const r = answerQuestion('area c alle 18', NOW, { zones: z, fines });
    expect(r.text).toMatch(/Paga il ticket entro domani\./);
    expect(r.text).not.toMatch(/lungo/);
  });
});

describe('answerQuestion: note per alimentazione', () => {
  it('per un\'ibrida in Area C ricorda la regola dei 100 g/km', () => {
    const z = zones.map((x) => (x.id === 'area-c' ? { ...x, fuelNotes: { ibrido: 'Ibride fino a 100 g/km gratis.' } } : x));
    const r = answerQuestion('ho un\'auto ibrida, area c alle 11', NOW, { zones: z, fines });
    expect(r.text).toMatch(/100 g\/km/);
  });
});
