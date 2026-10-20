import { describe, it, expect } from 'vitest';
import { romeParts, romeDate, addDaysRome } from '../../src/engine/time.js';
import { easterSunday, italianHoliday } from '../../src/engine/holidays.js';

describe('romeParts', () => {
  it('converte UTC in ora di Roma in ora legale (UTC+2)', () => {
    const p = romeParts(new Date('2026-10-20T05:30:00Z'));
    expect(p).toMatchObject({ year: 2026, month: 10, day: 20, hour: 7, minute: 30, weekday: 2 });
    expect(p.minutesOfDay).toBe(7 * 60 + 30);
  });

  it('converte UTC in ora di Roma in ora solare (UTC+1) dopo il 25/10/2026', () => {
    const p = romeParts(new Date('2026-10-26T06:30:00Z'));
    expect(p.hour).toBe(7);
    expect(p.weekday).toBe(1);
  });

  it('gestisce la mezzanotte: 22:30 UTC di sabato è domenica 00:30 a Roma in estate', () => {
    const p = romeParts(new Date('2026-07-04T22:30:00Z'));
    expect(p).toMatchObject({ day: 5, hour: 0, minute: 30, weekday: 7 });
  });
});

describe('romeDate', () => {
  it('restituisce l\'istante giusto per un\'ora di Roma in estate', () => {
    expect(romeDate(2026, 7, 1, 19, 30).toISOString()).toBe('2026-07-01T17:30:00.000Z');
  });

  it('restituisce l\'istante giusto per un\'ora di Roma in inverno', () => {
    expect(romeDate(2026, 12, 7, 7, 30).toISOString()).toBe('2026-12-07T06:30:00.000Z');
  });

  it('è l\'inverso di romeParts nel giorno del cambio ora', () => {
    const d = romeDate(2026, 10, 25, 12, 0);
    expect(romeParts(d)).toMatchObject({ day: 25, hour: 12, minute: 0 });
  });
});

describe('addDaysRome', () => {
  it('somma giorni di calendario anche attraverso il cambio ora', () => {
    const p = addDaysRome({ year: 2026, month: 10, day: 24 }, 2);
    expect(p).toEqual({ year: 2026, month: 10, day: 26 });
  });

  it('passa al mese e all\'anno successivo', () => {
    expect(addDaysRome({ year: 2026, month: 12, day: 31 }, 1)).toEqual({ year: 2027, month: 1, day: 1 });
  });
});

describe('festivi', () => {
  it('calcola la Pasqua 2026 al 5 aprile e 2027 al 28 marzo', () => {
    expect(easterSunday(2026)).toEqual({ month: 4, day: 5 });
    expect(easterSunday(2027)).toEqual({ month: 3, day: 28 });
  });

  it('riconosce Pasquetta, Sant\'Ambrogio e Natale', () => {
    expect(italianHoliday(2026, 4, 6)).toBe("Lunedì dell'Angelo");
    expect(italianHoliday(2026, 12, 7)).toBe("Sant'Ambrogio");
    expect(italianHoliday(2026, 12, 25)).toBe('Natale');
  });

  it('restituisce null in un giorno feriale normale', () => {
    expect(italianHoliday(2026, 10, 20)).toBeNull();
  });
});
