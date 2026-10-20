import { TZ, romeParts, addDaysRome } from './time.js';

const dayFmt = new Intl.DateTimeFormat('it-IT', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' });
const timeFmt = new Intl.DateTimeFormat('it-IT', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

export const formatDay = (date) => dayFmt.format(date);
export const formatTime = (date) => timeFmt.format(date);
export const formatWhen = (date) => `${formatDay(date)} alle ${formatTime(date)}`;

const ymdKey = ({ year, month, day }) => `${year}-${month}-${day}`;

// "oggi alle 19:30", "domani, mercoledì 21 ottobre, alle 07:30", "lunedì 28 dicembre alle 07:30".
export function formatWhenRel(date, now) {
  const d = ymdKey(romeParts(date));
  const today = romeParts(now);
  if (d === ymdKey(today)) return `oggi alle ${formatTime(date)}`;
  if (d === ymdKey(addDaysRome(today, 1))) return `domani, ${formatDay(date)}, alle ${formatTime(date)}`;
  return formatWhen(date);
}

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const DAY_NAMES = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];

export function describeDays(days) {
  const d = [...new Set(days)].sort((a, b) => a - b);
  const key = d.join(',');
  if (key === '1,2,3,4,5,6,7') return 'tutti i giorni';
  if (key === '1,2,3,4,5') return 'dal lunedì al venerdì';
  if (key === '1,2,3,4,5,6') return 'dal lunedì al sabato';
  if (key === '6,7') return 'sabato e domenica';
  const contiguous = d.every((v, i) => i === 0 || v === d[i - 1] + 1);
  if (contiguous && d.length > 2) return `da ${DAY_NAMES[d[0] - 1]} a ${DAY_NAMES[d[d.length - 1] - 1]}`;
  const names = d.map((v) => DAY_NAMES[v - 1]);
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}` : names[0];
}

export function describeSchedule(zone) {
  if (zone.alwaysActive) return 'Sempre attiva, 24 ore su 24, tutti i giorni';
  if (!zone.schedule?.length) return 'Orari non disponibili';
  const parts = zone.schedule.map((r) => `${describeDays(r.days)} dalle ${r.from} alle ${r.to}`);
  const text = parts.join('; ');
  return text.charAt(0).toUpperCase() + text.slice(1) + (zone.holidaysOff ? ', esclusi i festivi' : '');
}
