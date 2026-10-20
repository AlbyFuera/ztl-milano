import { romeParts, romeDate, addDaysRome, weekdayOf, parseHHMM, formatHHMM } from './time.js';
import { italianHoliday } from './holidays.js';

const pad = (n) => String(n).padStart(2, '0');
const mmdd = ({ month, day }) => `${pad(month)}-${pad(day)}`;
const isoDay = (ymd) => `${ymd.year}-${mmdd(ymd)}`;

// Perché la zona è spenta tutto il giorno (festivo, periodo di sospensione…), oppure null.
export function dayOffReason(zone, ymd) {
  const special = zone.specialDays?.find((s) => s.date === isoDay(ymd));
  if (special) return special.off ? special.label : null;
  if (zone.holidaysOff) {
    const h = italianHoliday(ymd.year, ymd.month, ymd.day);
    if (h) return `${h} (festivo)`;
  }
  for (const p of zone.periodsOff ?? []) {
    const d = mmdd(ymd);
    const inside = p.from <= p.to ? d >= p.from && d <= p.to : d >= p.from || d <= p.to;
    if (inside) return p.label;
  }
  return null;
}

// Fasce che INIZIANO in quel giorno, come [inizio, fine] in minuti; fine può superare 1440.
function startingSegments(zone, ymd) {
  if (dayOffReason(zone, ymd)) return [];
  const wd = weekdayOf(ymd);
  const out = [];
  for (const rule of zone.schedule ?? []) {
    if (!rule.days.includes(wd)) continue;
    const from = parseHHMM(rule.from);
    let to = parseHHMM(rule.to);
    if (to <= from) to += 1440; // fascia che passa la mezzanotte (o 24h se uguali)
    out.push([from, to]);
  }
  return out;
}

function merge(segments) {
  const sorted = [...segments].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s[0] <= last[1]) last[1] = Math.max(last[1], s[1]);
    else out.push([...s]);
  }
  return out;
}

// Fasce attive dentro il giorno di calendario (0-1440), compresa la coda del giorno prima.
export function windowsForDay(zone, ymd) {
  if (zone.alwaysActive) return [[0, 1440]];
  const own = startingSegments(zone, ymd).map(([a, b]) => [a, Math.min(b, 1440)]);
  const spill = startingSegments(zone, addDaysRome(ymd, -1))
    .filter(([, b]) => b > 1440)
    .map(([, b]) => [0, b - 1440]);
  return merge([...spill, ...own]);
}

function toInstant(ymd, minutes) {
  const extra = Math.floor(minutes / 1440);
  const d = addDaysRome(ymd, extra);
  const m = minutes - extra * 1440;
  return romeDate(d.year, d.month, d.day, Math.floor(m / 60), m % 60);
}

// Intervalli assoluti [Date, Date) da `fromDay - 1` per `days` giorni, uniti.
function intervals(zone, fromYmd, days) {
  const list = [];
  for (let i = -1; i < days; i++) {
    const ymd = addDaysRome(fromYmd, i);
    for (const [a, b] of startingSegments(zone, ymd)) {
      list.push([toInstant(ymd, a).getTime(), toInstant(ymd, b).getTime()]);
    }
  }
  return merge(list);
}

const HORIZON_DAYS = 21;

const UNKNOWN_REASON = 'orari non disponibili nelle fonti ufficiali consultate';
const DAY_NAMES = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];

export function isActiveAt(zone, date) {
  if (zone.scheduleUnknown) return null;
  if (zone.alwaysActive) return true;
  const p = romeParts(date);
  return windowsForDay(zone, p).some(([a, b]) => p.minutesOfDay >= a && p.minutesOfDay < b);
}

export function zoneStatus(zone, date) {
  const p = romeParts(date);
  const todayWindows = windowsForDay(zone, p).map(([a, b]) => ({ from: formatHHMM(a), to: b === 1440 ? '24:00' : formatHHMM(b) }));
  if (zone.scheduleUnknown) {
    return { active: null, reason: UNKNOWN_REASON, nextChange: null, todayWindows: [], currentWindow: null };
  }
  if (zone.alwaysActive) {
    return { active: true, reason: 'Sempre attiva, 24 ore su 24', nextChange: null, todayWindows, currentWindow: null };
  }
  const t = date.getTime();
  const list = intervals(zone, p, HORIZON_DAYS);
  const current = list.find(([a, b]) => t >= a && t < b);
  if (current) {
    return {
      active: true,
      reason: 'Attiva in questa fascia oraria',
      nextChange: new Date(current[1]),
      todayWindows,
      currentWindow: { start: new Date(current[0]), end: new Date(current[1]) },
    };
  }
  const next = list.find(([a]) => a > t);
  const off = dayOffReason(zone, p);
  const reason = off ?? (todayWindows.length ? 'è fuori orario' : `è ${DAY_NAMES[p.weekday - 1]}`);
  return { active: false, reason, nextChange: next ? new Date(next[0]) : null, todayWindows, currentWindow: null };
}

// Prossimo intervallo in cui si entra senza restrizioni a partire da `date`.
export function nextFreeWindow(zone, date) {
  if (zone.alwaysActive) return null;
  const s = zoneStatus(zone, date);
  if (!s.active) return { from: date, to: s.nextChange };
  const after = zoneStatus(zone, s.nextChange);
  return { from: s.nextChange, to: after.nextChange };
}
