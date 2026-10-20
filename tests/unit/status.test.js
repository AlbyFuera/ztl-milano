import { describe, it, expect } from 'vitest';
import { zoneStatus, isActiveAt, windowsForDay } from '../../src/engine/status.js';
import { romeDate } from '../../src/engine/time.js';

const feriale = {
  id: 'test-feriale',
  name: 'Zona feriale',
  schedule: [{ days: [1, 2, 3, 4, 5], from: '07:30', to: '19:30' }],
  holidaysOff: true,
};
const sempre = { id: 'test-sempre', name: 'Zona sempre', alwaysActive: true };
const notturna = {
  id: 'test-notte',
  name: 'Zona notte',
  schedule: [{ days: [5, 6], from: '20:00', to: '02:00' }],
};

// 20/10/2026 è martedì, 23/10 venerdì, 26/10 lunedì.
describe('isActiveAt', () => {
  it('martedì 7:29 la zona non è ancora attiva', () => {
    expect(isActiveAt(feriale, romeDate(2026, 10, 20, 7, 29))).toBe(false);
  });
  it('martedì 7:30 la zona è attiva', () => {
    expect(isActiveAt(feriale, romeDate(2026, 10, 20, 7, 30))).toBe(true);
  });
  it('martedì 19:30 la zona è già spenta', () => {
    expect(isActiveAt(feriale, romeDate(2026, 10, 20, 19, 30))).toBe(false);
  });
  it('sabato a mezzogiorno la zona feriale è spenta', () => {
    expect(isActiveAt(feriale, romeDate(2026, 10, 24, 12, 0))).toBe(false);
  });
  it('Natale (venerdì 25/12/2026) la zona con holidaysOff è spenta', () => {
    expect(isActiveAt(feriale, romeDate(2026, 12, 25, 10, 0))).toBe(false);
  });
  it('una fascia che passa la mezzanotte resta attiva sabato all\'1:00', () => {
    expect(isActiveAt(notturna, romeDate(2026, 10, 24, 1, 0))).toBe(true);
    expect(isActiveAt(notturna, romeDate(2026, 10, 24, 2, 0))).toBe(false);
  });
});

describe('zoneStatus', () => {
  it('prima dell\'apertura indica il prossimo cambio alle 7:30 dello stesso giorno', () => {
    const s = zoneStatus(feriale, romeDate(2026, 10, 20, 7, 0));
    expect(s.active).toBe(false);
    expect(s.nextChange.toISOString()).toBe(romeDate(2026, 10, 20, 7, 30).toISOString());
  });
  it('durante l\'attivazione il prossimo cambio è la chiusura alle 19:30', () => {
    const s = zoneStatus(feriale, romeDate(2026, 10, 20, 12, 0));
    expect(s.active).toBe(true);
    expect(s.nextChange.toISOString()).toBe(romeDate(2026, 10, 20, 19, 30).toISOString());
  });
  it('venerdì sera il prossimo cambio è lunedì alle 7:30, dopo il cambio ora', () => {
    const s = zoneStatus(feriale, romeDate(2026, 10, 23, 20, 0));
    expect(s.active).toBe(false);
    expect(s.nextChange.toISOString()).toBe(romeDate(2026, 10, 26, 7, 30).toISOString());
  });
  it('il giorno festivo spiega il motivo nominando la festa', () => {
    const s = zoneStatus(feriale, romeDate(2026, 12, 25, 10, 0));
    expect(s.reason).toMatch(/Natale/);
  });
  it('una zona sempre attiva non ha prossimo cambio', () => {
    const s = zoneStatus(sempre, romeDate(2026, 10, 20, 3, 0));
    expect(s.active).toBe(true);
    expect(s.nextChange).toBeNull();
  });
  it('elenca le fasce del giorno in formato HH:MM', () => {
    const s = zoneStatus(feriale, romeDate(2026, 10, 20, 12, 0));
    expect(s.todayWindows).toEqual([{ from: '07:30', to: '19:30' }]);
  });
});

describe('windowsForDay', () => {
  it('include la coda notturna del giorno precedente', () => {
    // sabato 24/10: coda di venerdì 00:00-02:00 + fascia di sabato 20:00-24:00
    expect(windowsForDay(notturna, { year: 2026, month: 10, day: 24 })).toEqual([
      [0, 120],
      [1200, 1440],
    ]);
  });
  it('un periodo di sospensione spegne la zona', () => {
    const agosto = { ...feriale, periodsOff: [{ from: '08-10', to: '08-21', label: 'sospensione estiva' }] };
    expect(windowsForDay(agosto, { year: 2026, month: 8, day: 12 })).toEqual([]);
  });
});

describe('zoneStatus: fascia corrente', () => {
  it('restituisce inizio e fine della fascia in corso anche oltre la mezzanotte', () => {
    const s = zoneStatus(notturna, romeDate(2026, 10, 24, 1, 0));
    expect(s.currentWindow.start.toISOString()).toBe(romeDate(2026, 10, 23, 20, 0).toISOString());
    expect(s.currentWindow.end.toISOString()).toBe(romeDate(2026, 10, 24, 2, 0).toISOString());
  });
  it('è null quando la zona non è attiva', () => {
    expect(zoneStatus(feriale, romeDate(2026, 10, 20, 21, 0)).currentWindow).toBeNull();
  });
});

describe('zone con orario non confermato', () => {
  const ignota = { id: 'ignota', name: 'ZTL Ignota', type: 'ztl', schedule: [], scheduleUnknown: true };
  it('lo stato è sconosciuto (active null) e non c\'è prossimo cambio', () => {
    const s = zoneStatus(ignota, romeDate(2026, 10, 20, 12, 0));
    expect(s.active).toBeNull();
    expect(s.nextChange).toBeNull();
    expect(s.reason).toMatch(/non disponibili/);
  });
  it('isActiveAt restituisce null', () => {
    expect(isActiveAt(ignota, romeDate(2026, 10, 20, 12, 0))).toBeNull();
  });
});

describe('motivo quando la zona è spenta tutto il giorno', () => {
  it('nomina il giorno della settimana invece di "oggi"', () => {
    const s = zoneStatus(feriale, romeDate(2026, 10, 25, 12, 0)); // domenica
    expect(s.reason).toBe('la domenica non è attiva');
  });
});
