import { addDaysRome } from './time.js';

const cmp = (a, b) => a.year - b.year || a.month - b.month || a.day - b.day;
const round2 = (n) => Math.round(n * 100) / 100;

// Scadenze dalla data di notifica del verbale (artt. 202, 203, 204-bis del Codice della Strada).
export function fineDeadlines(notified, rules, today = null) {
  if (!rules?.min || !rules?.max) return null;
  const reduced = round2(rules.min * (1 - rules.reducedPct / 100));
  const steps = [
    { id: 'ridotto', days: rules.reducedDays, label: `Paghi ${reduced.toFixed(2).replace('.', ',')} € (sconto del ${rules.reducedPct}%)` },
    { id: 'giudice', days: rules.giudiceDays, label: 'Ultimo giorno per il ricorso al Giudice di pace' },
    { id: 'ordinario', days: rules.payDays, label: `Ultimo giorno per pagare il minimo, ${rules.min} €` },
    { id: 'prefetto', days: rules.prefettoDays, label: 'Ultimo giorno per il ricorso al Prefetto' },
  ]
    .map((s) => ({ ...s, date: addDaysRome(notified, s.days) }))
    .sort((a, b) => cmp(a.date, b.date) || a.days - b.days || (a.id === 'ordinario' ? -1 : 1));
  const ref = today ?? notified;
  for (const s of steps) s.past = cmp(s.date, ref) < 0;
  return { reduced, ordinary: rules.min, late: round2(rules.max / 2), steps };
}
