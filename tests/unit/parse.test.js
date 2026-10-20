import { describe, it, expect } from 'vitest';
import { parseQuestion } from '../../src/engine/parse.js';
import { romeDate, romeParts } from '../../src/engine/time.js';
import { zones } from './fixtures.js';

const NOW = romeDate(2026, 10, 20, 10, 0); // martedì 20/10/2026 ore 10:00
const at = (q) => {
  const r = parseQuestion(q, NOW, zones);
  return { ...r, p: romeParts(r.when) };
};

describe('parseQuestion: zona', () => {
  it('riconosce "area c" con maiuscole e senza spazio', () => {
    expect(at('Posso entrare in AREA C?').zoneId).toBe('area-c');
    expect(at('areac alle 9').zoneId).toBe('area-c');
  });
  it('riconosce un alias più lungo prima di uno più corto', () => {
    expect(at('sono in via paolo sarpi').zoneId).toBe('sarpi');
  });
  it('restituisce null se non c\'è nessuna zona nota', () => {
    expect(at('posso entrare in zona pippo?').zoneId).toBeNull();
  });
  it('ignora gli accenti e la punteggiatura', () => {
    expect(at('Brerà, alle 21?').zoneId).toBe('brera');
  });
});

describe('parseQuestion: quando', () => {
  it('senza indicazioni usa adesso e lo segnala come non esplicito', () => {
    const r = at('posso entrare in area c?');
    expect(r.when.getTime()).toBe(NOW.getTime());
    expect(r.whenExplicit).toBe(false);
  });
  it('"alle 18" è oggi alle 18:00', () => {
    expect(at('area c alle 18').p).toMatchObject({ day: 20, hour: 18, minute: 0 });
  });
  it('accetta 18:30, 18.30 e "ore 9"', () => {
    expect(at('area c 18:30').p).toMatchObject({ hour: 18, minute: 30 });
    expect(at('area c 18.30').p).toMatchObject({ hour: 18, minute: 30 });
    expect(at('area c ore 9').p).toMatchObject({ day: 21, hour: 9 });
  });
  it('un\'ora già passata senza giorno indicato va al giorno dopo', () => {
    expect(at('area c alle 8').p).toMatchObject({ day: 21, hour: 8 });
  });
  it('"domani alle 8" e "dopodomani" ', () => {
    expect(at('area c domani alle 8').p).toMatchObject({ day: 21, hour: 8 });
    expect(at('area c dopodomani alle 8').p).toMatchObject({ day: 22, hour: 8 });
  });
  it('"sabato alle 21" è il prossimo sabato', () => {
    expect(at('brera sabato alle 21').p).toMatchObject({ day: 24, hour: 21, weekday: 6 });
  });
  it('"21 di sabato" e "alle 9 di sera"', () => {
    expect(at('e a brera alle 21 di sabato?').p).toMatchObject({ day: 24, hour: 21 });
    expect(at('brera alle 9 di sera').p).toMatchObject({ day: 20, hour: 21 });
  });
  it('"stasera" senza ora vale le 21:00 di oggi', () => {
    expect(at('brera stasera').p).toMatchObject({ day: 20, hour: 21 });
  });
  it('"stasera alle 10" sono le 22:00', () => {
    expect(at('brera stasera alle 10').p).toMatchObject({ day: 20, hour: 22 });
  });
  it('una data 25/12 diventa il 25 dicembre', () => {
    expect(at('area c il 25/12 alle 10').p).toMatchObject({ month: 12, day: 25, hour: 10 });
  });
  it('non scambia una data per un orario', () => {
    expect(at('area c il 25/12').p).toMatchObject({ month: 12, day: 25, hour: 10 });
  });
  it('"mezzanotte" e "mezzogiorno"', () => {
    expect(at('brera a mezzanotte').p).toMatchObject({ day: 21, hour: 0 });
    expect(at('area c a mezzogiorno').p).toMatchObject({ day: 20, hour: 12 });
  });
  it('un orario impossibile come 25:00 viene ignorato', () => {
    expect(at('area c alle 25').whenExplicit).toBe(false);
  });
});

describe('parseQuestion: intento', () => {
  it('riconosce le domande sulle multe', () => {
    expect(at('quanto è la multa in area c?').intent).toBe('fine');
  });
  it('una zona da sola è una domanda sugli orari', () => {
    expect(at('sarpi').intent).toBe('hours');
    expect(at('orari brera').intent).toBe('hours');
  });
  it('"posso entrare" è una domanda di accesso', () => {
    expect(at('posso entrare in brera?').intent).toBe('enter');
  });
});

describe('parseQuestion: veicolo', () => {
  it('non scambia "euro 5" per le 5 del mattino', () => {
    const r = at('ho un diesel euro 5, posso entrare in area b?');
    expect(r.whenExplicit).toBe(false);
  });
  it('estrae alimentazione e classe Euro dalla domanda', () => {
    expect(at('ho un diesel euro 5, posso entrare in area b?').vehicle).toEqual({ fuel: 'diesel', euro: 5 });
    expect(at('auto a benzina euro4 in area c domani').vehicle).toEqual({ fuel: 'benzina', euro: 4 });
    expect(at('ho un\'auto elettrica, area c alle 10').vehicle).toEqual({ fuel: 'elettrico', euro: null });
  });
  it('senza indicazioni il veicolo è null', () => {
    expect(at('area c alle 10').vehicle).toBeNull();
  });
});
