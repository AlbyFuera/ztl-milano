import { describe, it, expect } from 'vitest';
import * as data from '../../src/data/rules.js';

const OFFICIAL = /^https:\/\/([a-z0-9-]+\.)*(comune\.milano\.it|amat-mi\.it|areac\.atm-mi\.it|areab\.atm\.it|normattiva\.it|gazzettaufficiale\.it|mit\.gov\.it)\//;
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$|^24:00$/;
const urls = (list) => (list ?? []).map((s) => (typeof s === 'string' ? s : s.url));

describe('dati ufficiali', () => {
  it('non sono i dati provvisori dell\'anteprima', () => {
    expect(data.provisional).toBe(false);
  });
  it('ogni zona ha id unico, nome, tipo valido e almeno una fonte ufficiale', () => {
    const ids = new Set();
    for (const z of data.zones) {
      expect(ids.has(z.id), z.id).toBe(false);
      ids.add(z.id);
      expect(z.name).toBeTruthy();
      expect(['congestion', 'lez', 'ztl', 'pedonale']).toContain(z.type);
      expect(urls(z.sources).length, z.id).toBeGreaterThan(0);
      for (const u of urls(z.sources)) expect(u, z.id).toMatch(OFFICIAL);
    }
  });
  it('gli orari sono validi e i giorni vanno da 1 a 7', () => {
    for (const z of data.zones) {
      expect(Boolean(z.alwaysActive || z.scheduleUnknown || z.schedule?.length > 0), z.id).toBe(true);
      for (const r of z.schedule ?? []) {
        expect(r.from, z.id).toMatch(HHMM);
        expect(r.to, z.id).toMatch(HHMM);
        expect(r.days.every((d) => Number.isInteger(d) && d >= 1 && d <= 7), z.id).toBe(true);
      }
    }
  });
  it('i divieti per veicolo hanno date ISO e alimentazioni note', () => {
    const fuels = ['benzina', 'diesel', 'gpl', 'metano', 'ibrido', 'elettrico'];
    for (const z of data.zones) {
      for (const b of z.vehicleBans ?? []) {
        if (b.since !== null) expect(b.since, z.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(b.fuel.every((f) => fuels.includes(f)), z.id).toBe(true);
      }
    }
  });
  it('le multe hanno importi e fonti ufficiali', () => {
    expect(data.fines.ztl.min).toBeGreaterThan(0);
    expect(data.fines.ztl.max).toBeGreaterThan(data.fines.ztl.min);
    for (const u of urls(data.fines.ztl.sources)) expect(u).toMatch(OFFICIAL);
    expect(urls(data.fines.ztl.sources).length).toBeGreaterThan(0);
  });
  it('l\'elenco delle fonti contiene solo domini ufficiali', () => {
    expect(data.sources.length).toBeGreaterThan(0);
    for (const s of data.sources) expect(s.url).toMatch(OFFICIAL);
  });
  it('ogni zona con un file geo lo ha davvero in public/', async () => {
    const fs = await import('node:fs');
    for (const z of data.zones) if (z.geo) expect(fs.existsSync(`public${z.geo}`), z.geo).toBe(true);
  });
});
