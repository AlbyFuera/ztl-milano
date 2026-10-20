import { romeParts, romeDate, addDaysRome, weekdayOf } from './time.js';

const WEEKDAYS = ['lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato', 'domenica'];

export function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9:./\s]/g, ' ')
    .replace(/(\D)[.]/g, '$1 ') // il punto resta solo dentro "18.30"
    .replace(/\s+/g, ' ')
    .trim();
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function findZone(text, zones) {
  const t = ` ${normalize(text)} `;
  const candidates = zones
    .flatMap((z) => [z.name, ...(z.aliases ?? [])].map((a) => ({ id: z.id, alias: normalize(a) })))
    .filter((c) => c.alias)
    .sort((a, b) => b.alias.length - a.alias.length);
  for (const c of candidates) {
    if (new RegExp(`\\s${escapeRe(c.alias)}\\s`).test(t)) return c.id;
  }
  return null;
}

function validTime(h, m) {
  return h >= 0 && h <= 24 && m >= 0 && m <= 59 && !(h === 24 && m > 0);
}

function extractDate(t, today) {
  const m = t.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (!m) return { rest: t, ymd: null };
  const day = Number(m[1]);
  const month = Number(m[2]);
  let year = m[3] ? Number(m[3].length === 2 ? `20${m[3]}` : m[3]) : today.year;
  if (month < 1 || month > 12 || day < 1 || day > 31) return { rest: t.replace(m[0], ' '), ymd: null };
  if (!m[3]) {
    const before = month < today.month || (month === today.month && day < today.day);
    if (before) year += 1;
  }
  return { rest: t.replace(m[0], ' '), ymd: { year, month, day } };
}

function extractTime(t) {
  if (/\bmezzanotte\b/.test(t)) return { h: 0, m: 0 };
  if (/\bmezzogiorno\b/.test(t)) return { h: 12, m: 0 };
  const patterns = [
    /\b(\d{1,2})[:.](\d{2})\b/,
    /\b(?:alle|ore|le|h|dalle|verso|per)\s+(\d{1,2})\b/,
    /(?:^|\s)(\d{1,2})(?=\s|$)/,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (!m) continue;
    const h = Number(m[1]);
    const min = m[2] ? Number(m[2]) : 0;
    if (validTime(h, min)) return { h: h % 24, m: min };
    return null;
  }
  return null;
}

function extractDay(t, today) {
  if (/\bdopodomani\b/.test(t)) return addDaysRome(today, 2);
  if (/\bdomani\b/.test(t)) return addDaysRome(today, 1);
  if (/\b(oggi|stasera|stamattina|stamani|stanotte|stavolta)\b/.test(t)) return { ...today };
  const todayWd = weekdayOf(today);
  for (let i = 0; i < WEEKDAYS.length; i++) {
    if (new RegExp(`\\b${WEEKDAYS[i]}\\b`).test(t)) {
      const offset = (i + 1 - todayWd + 7) % 7;
      return addDaysRome(today, offset);
    }
  }
  return null;
}

function defaultTimeFor(t) {
  if (/\b(stasera|sera)\b/.test(t)) return { h: 21, m: 0 };
  if (/\b(stanotte|notte)\b/.test(t)) return { h: 23, m: 0 };
  if (/\bpomeriggio\b/.test(t)) return { h: 15, m: 0 };
  if (/\b(stamattina|stamani|mattina)\b/.test(t)) return { h: 9, m: 0 };
  return null;
}

function adjustForPeriod(time, t) {
  if (time.h >= 1 && time.h < 12 && /\b(stasera|sera|pomeriggio)\b/.test(t)) return { ...time, h: time.h + 12 };
  if (time.h >= 8 && time.h < 12 && /\b(stanotte|notte)\b/.test(t)) return { ...time, h: time.h + 12 };
  return time;
}

const FUELS = [
  ['elettrico', /\belettric/],
  ['ibrido', /\bibrid/],
  ['metano', /\bmetano\b/],
  ['gpl', /\bgpl\b/],
  ['diesel', /\b(diesel|gasolio)\b/],
  ['benzina', /\bbenzina\b/],
];

export function extractVehicle(t) {
  const fuel = FUELS.find(([, re]) => re.test(t))?.[0] ?? null;
  const m = t.match(/\beuro\s?([0-6])\b/);
  const euro = m ? Number(m[1]) : null;
  if (!fuel && euro === null) return null;
  return { fuel, euro };
}

function detectIntent(t, hasZone, whenExplicit) {
  if (/\b(mult|sanzion|verbal|ricors|contravvenz)/.test(t)) return 'fine';
  if (/\b(uscir|esco|uscita)/.test(t)) return 'exit';
  if (/\b(entrar|entro|accedere|accesso|passar|passo|transitar|andare|vado|posso|si puo)/.test(t)) return 'enter';
  if (/\b(orar|quando|attiv|apre|chiude|fino a)/.test(t)) return 'hours';
  if (!hasZone && !whenExplicit) return 'unknown';
  return whenExplicit ? 'enter' : 'hours';
}

export function parseQuestion(text, now, zones) {
  const today = romeParts(now);
  const normalized = normalize(text);
  const vehicle = extractVehicle(normalized);
  const { rest, ymd: dateYmd } = extractDate(normalized.replace(/\beuro\s?\d\b/g, ' '), today);
  const dayYmd = dateYmd ?? extractDay(rest, today);
  let time = extractTime(rest);
  const timeExplicit = Boolean(time);
  time = time ? adjustForPeriod(time, rest) : defaultTimeFor(rest);

  let when = now;
  if (dayYmd || time) {
    const ymd = dayYmd ?? today;
    const tm = time ?? { h: today.hour, m: today.minute };
    when = romeDate(ymd.year, ymd.month, ymd.day, tm.h, tm.m);
    if (!dayYmd && when.getTime() < now.getTime() - 60000) {
      const next = addDaysRome(today, 1);
      when = romeDate(next.year, next.month, next.day, tm.h, tm.m);
    }
  }
  const whenExplicit = Boolean(dayYmd || time);
  const zoneId = findZone(text, zones);
  return { zoneId, when, whenExplicit, timeExplicit, vehicle, intent: detectIntent(rest, Boolean(zoneId), whenExplicit) };
}
