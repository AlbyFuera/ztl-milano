import { parseQuestion } from './parse.js';
import { zoneStatus } from './status.js';
import { romeParts } from './time.js';
import { formatWhenRel, formatTime, describeSchedule, capitalize } from './format.js';

const pad = (n) => String(n).padStart(2, '0');
const isoDayOf = (date) => {
  const p = romeParts(date);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
};

// Permessi: rendono "condizionale" un divieto, non lo trasformano mai in un sì.
const DEFAULT_PERMIT = {
  ztl: {
    cude: { verdict: 'dipende', text: 'Con il contrassegno disabili (CUDE) e il titolare a bordo di solito puoi entrare, se la targa è registrata per questa zona.' },
    residente: { verdict: 'dipende', text: 'Se sei residente o dimorante in questa zona e hai il pass, puoi entrare.' },
  },
  pedonale: {
    cude: { verdict: 'dipende', text: 'Con il contrassegno disabili (CUDE) l\'accesso dipende dalle deroghe dell\'area: controlla il cartello o chiedi al Comune.' },
    residente: { verdict: 'dipende', text: 'Se sei residente e l\'area prevede la deroga per i residenti, puoi entrare: controlla il cartello.' },
  },
};

function applyPermits(zone, v, vehicle) {
  const notes = [];
  if (v.verdict !== 'no' && v.verdict !== 'pagamento') return notes;
  for (const p of vehicle?.permits ?? []) {
    const note = zone.permitNotes?.[p] ?? DEFAULT_PERMIT[zone.type]?.[p];
    if (!note) continue;
    notes.push(note.text);
    const rank = { no: 0, pagamento: 1, dipende: 2 };
    if (v.verdict in rank && note.verdict in rank && rank[note.verdict] > rank[v.verdict]) v.verdict = note.verdict;
  }
  return notes;
}

const VERDICT_LABEL = {
  si: 'Sì.',
  pagamento: 'Sì, ma a pagamento.',
  no: 'No.',
  dipende: 'Dipende dal tuo veicolo.',
};

// 'banned' | 'allowed' | 'unknown' rispetto ai divieti in vigore in quella data.
// Un divieto ha `maxEuro` (vietato se euro <= maxEuro) oppure `euro6` ('abc' | 'd') per le sottoclassi Euro 6.
function banApplies(ban, vehicle) {
  if (ban.euro6) {
    if (vehicle.euro == null) return 'unknown';
    if (vehicle.euro !== 6) return 'no';
    if (!vehicle.euro6) return 'unknown';
    return vehicle.euro6 === ban.euro6 ? 'yes' : 'no';
  }
  if (ban.maxEuro == null) return 'yes';
  if (vehicle.euro == null) return 'unknown';
  return vehicle.euro <= ban.maxEuro ? 'yes' : 'no';
}

export function vehicleCheck(zone, vehicle, when) {
  const bans = (zone.vehicleBans ?? []).filter((b) => !b.since || b.since <= isoDayOf(when));
  if (!bans.length) return { result: 'allowed', ban: null };
  if (!vehicle?.fuel) return { result: 'unknown', ban: null };
  if (zone.uncertainFuels?.includes(vehicle.fuel)) return { result: 'unknown', ban: null };
  let unknown = null;
  for (const ban of bans) {
    if (!ban.fuel.includes(vehicle.fuel)) continue;
    const a = banApplies(ban, vehicle);
    if (a === 'yes') return { result: 'banned', ban };
    if (a === 'unknown') unknown ??= ban;
  }
  return unknown ? { result: 'unknown', ban: unknown } : { result: 'allowed', ban: null };
}

export function describeBans(zone, when) {
  const bans = (zone.vehicleBans ?? []).filter((b) => !b.since || b.since <= isoDayOf(when));
  return bans.map((b) => b.label).join('; ');
}

function zoneNames(zones) {
  const main = zones.filter((z) => z.featured);
  return (main.length ? main : zones.slice(0, 4)).map((z) => z.name).join(', ');
}

function clarify(zones, text) {
  return {
    ok: false, zoneId: null, verdict: 'chiarire',
    text: `${text} Prova con una zona come ${zoneNames(zones)}. Esempio: "Posso entrare in Area C domani alle 8?"`,
    sources: [],
  };
}

function accessVerdict(zone, status, vehicle, when) {
  const check = vehicleCheck(zone, vehicle, when);
  if (!status.active) return { verdict: 'si', check };
  if (zone.type === 'lez') {
    if (check.result === 'banned') return { verdict: 'no', check };
    if (check.result === 'unknown') return { verdict: 'dipende', check };
    return { verdict: 'si', check };
  }
  if (zone.type === 'congestion') {
    if (check.result === 'banned') return { verdict: 'no', check };
    if (vehicle?.fuel && zone.freeFor?.includes(vehicle.fuel)) return { verdict: 'si', check, free: true };
    return { verdict: 'pagamento', check };
  }
  return { verdict: 'no', check }; // ztl, pedonale: solo autorizzati
}

const FREE_ENTRY = {
  congestion: 'Senza pagare entri',
  lez: 'Senza limiti entri',
  ztl: 'Senza permesso entri',
  pedonale: 'Senza permesso entri',
};

function accessLines(zone, status, when, now, v, vehicle) {
  const lines = [];
  const at = capitalize(formatWhenRel(when, now));
  if (status.active && zone.type === 'pedonale') {
    lines.push(zone.alwaysActive
      ? `${zone.name} è chiusa alle auto 24 ore su 24, tutti i giorni.`
      : `${at} ${zone.name} è chiusa alle auto (dalle ${formatTime(status.currentWindow.start)} alle ${formatTime(status.currentWindow.end)}).`);
  } else if (status.active && zone.alwaysActive) {
    lines.push(`${zone.name} è attiva 24 ore su 24, tutti i giorni.`);
  } else if (status.active) {
    const { start, end } = status.currentWindow;
    lines.push(`${at} ${zone.name} è attiva (dalle ${formatTime(start)} alle ${formatTime(end)}).`);
  } else {
    lines.push(`${at} ${zone.name} non è attiva: ${status.reason}.`);
  }

  if (status.active && status.nextChange) {
    lines.push(`${FREE_ENTRY[zone.type] ?? 'Liberamente entri'} da ${formatWhenRel(status.nextChange, now)}.`);
  }
  if (!status.active && status.nextChange) {
    lines.push(`Si riattiva ${formatWhenRel(status.nextChange, now)}.`);
  }

  if (status.active) {
    if (v.verdict === 'pagamento' && (zone.paymentShort ?? zone.payment)) lines.push(zone.paymentShort ?? zone.payment);
    if (v.free) lines.push(zone.freeNote ?? 'Il tuo veicolo entra senza pagare.');
    if (vehicle?.fuel && zone.fuelNotes?.[vehicle.fuel]) lines.push(zone.fuelNotes[vehicle.fuel]);
    if (v.verdict === 'dipende' && v.check.result === 'unknown' && zone.vehicleBans?.length) {
      lines.push(`Sono vietati: ${describeBans(zone, when)}. Dimmi alimentazione e classe Euro (es. "diesel Euro 5") per una risposta precisa.`);
    }
    if (v.verdict === 'no' && v.check.ban) lines.push(`Il tuo veicolo rientra nel divieto: ${v.check.ban.label}.`);
    if ((zone.type === 'ztl' || zone.type === 'pedonale') && zone.whoCanEnter) lines.push(`Possono entrare solo: ${zone.whoCanEnter}`);
  }
  return lines;
}

export function answerQuestion(question, now, ctx) {
  const zones = ctx?.zones ?? [];
  const text = String(question ?? '').trim();
  if (!text) return clarify(zones, 'Scrivi la zona e, se vuoi, il giorno e l\'ora.');

  const q = parseQuestion(text, now, zones);
  const vehicle = q.vehicle?.fuel ? q.vehicle : ctx.vehicle ?? q.vehicle;

  if (q.intent === 'fine' && !q.zoneId) {
    return { ok: true, zoneId: null, verdict: 'info', text: ctx.fines?.summary ?? '', sources: ctx.fines?.sources ?? [], when: q.when };
  }
  if (!q.zoneId) return clarify(zones, 'Non ho capito di quale zona parli.');

  const zone = zones.find((z) => z.id === q.zoneId);
  const base = { ok: true, zoneId: zone.id, zoneName: zone.name, sources: zone.sources ?? [], when: q.when };

  if (q.intent === 'fine') {
    const fineText = [zone.fine, ctx.fines?.summary].filter(Boolean).join(' ');
    return { ...base, verdict: 'info', text: fineText, sources: [...base.sources, ...(ctx.fines?.sources ?? [])] };
  }

  if (q.intent === 'exit') {
    const exitText = zone.exitNote ?? ctx.defaultExitNote ?? 'I varchi controllano gli ingressi nella zona.';
    return { ...base, verdict: 'si', text: `Sì. ${exitText}` };
  }

  const status = zoneStatus(zone, q.when);
  const caveat = zone.verified === false
    ? ' Attenzione: orario preso dagli Open Data del Comune, non da una pagina aggiornata. Controlla il cartello all\'ingresso.'
    : '';

  if (status.active === null) {
    return {
      ...base, verdict: 'info', status,
      detail: `Per ${zone.name} gli orari non sono disponibili nelle fonti ufficiali consultate. Controlla il cartello all'ingresso o la pagina del Comune.`,
      text: `Per ${zone.name} gli orari non sono disponibili nelle fonti ufficiali consultate. Controlla il cartello all'ingresso o la pagina del Comune.`,
    };
  }

  if (q.intent === 'hours') {
    const now_ = status.active ? 'Adesso è attiva.' : 'Adesso non è attiva.';
    const next = status.nextChange ? ` ${status.active ? 'Si disattiva' : 'Si attiva'} ${formatWhenRel(status.nextChange, now)}.` : '';
    const nowLine = q.whenExplicit ? '' : ` ${now_}${next}`;
    const t = `${zone.name}: ${describeSchedule(zone)}.${nowLine}${caveat}`;
    return { ...base, verdict: 'info', text: t, detail: t, status };
  }

  const v = accessVerdict(zone, status, vehicle, q.when);
  const permitLines = status.active ? applyPermits(zone, v, vehicle) : [];
  const detail = [...accessLines(zone, status, q.when, now, v, vehicle), ...permitLines].join(' ') + caveat;
  return { ...base, verdict: v.verdict, text: `${VERDICT_LABEL[v.verdict]} ${detail}`, detail, status, vehicle: vehicle ?? null };
}
