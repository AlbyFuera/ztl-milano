import { parseQuestion } from './parse.js';
import { zoneStatus } from './status.js';
import { romeParts } from './time.js';
import { formatWhenRel, formatTime, describeSchedule, capitalize } from './format.js';

const pad = (n) => String(n).padStart(2, '0');
const isoDayOf = (date) => {
  const p = romeParts(date);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
};

const VERDICT_LABEL = {
  si: 'Sì.',
  pagamento: 'Sì, ma a pagamento.',
  no: 'No.',
  dipende: 'Dipende dal tuo veicolo.',
};

// 'banned' | 'allowed' | 'unknown' rispetto ai divieti in vigore in quella data.
export function vehicleCheck(zone, vehicle, when) {
  const bans = (zone.vehicleBans ?? []).filter((b) => !b.since || b.since <= isoDayOf(when));
  if (!bans.length) return { result: 'allowed', ban: null };
  if (!vehicle?.fuel) return { result: 'unknown', ban: null };
  for (const ban of bans) {
    if (!ban.fuel.includes(vehicle.fuel)) continue;
    if (ban.maxEuro == null) return { result: 'banned', ban };
    if (vehicle.euro == null) return { result: 'unknown', ban };
    if (vehicle.euro <= ban.maxEuro) return { result: 'banned', ban };
  }
  return { result: 'allowed', ban: null };
}

export function describeBans(zone, when) {
  const bans = (zone.vehicleBans ?? []).filter((b) => !b.since || b.since <= isoDayOf(when));
  return bans.map((b) => b.label).join('; ');
}

function zoneNames(zones) {
  return zones.map((z) => z.name).join(', ');
}

function clarify(zones, text) {
  return {
    ok: false, zoneId: null, verdict: 'chiarire',
    text: `${text} Puoi chiedere di: ${zoneNames(zones)}. Esempio: "Posso entrare in Area C domani alle 8?"`,
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

function accessLines(zone, status, when, now, v) {
  const lines = [];
  const at = capitalize(formatWhenRel(when, now));
  if (status.active && zone.alwaysActive) {
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
    if (v.verdict === 'pagamento' && zone.payment) lines.push(zone.payment);
    if (v.free) lines.push(zone.freeNote ?? 'Il tuo veicolo entra senza pagare.');
    if (v.verdict === 'dipende') {
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

  if (q.intent === 'hours') {
    const now_ = status.active ? 'Adesso è attiva.' : 'Adesso non è attiva.';
    const next = status.nextChange ? ` ${status.active ? 'Si disattiva' : 'Si attiva'} ${formatWhenRel(status.nextChange, now)}.` : '';
    const nowLine = q.whenExplicit ? '' : ` ${now_}${next}`;
    return { ...base, verdict: 'info', text: `${zone.name}: ${describeSchedule(zone)}.${nowLine}`, status };
  }

  const v = accessVerdict(zone, status, vehicle, q.when);
  const lines = [VERDICT_LABEL[v.verdict], ...accessLines(zone, status, q.when, now, v)];
  return { ...base, verdict: v.verdict, text: lines.join(' '), status, vehicle: vehicle ?? null };
}
