// Verdetto "per te": zona + momento scelto + veicolo e permessi salvati.
// Usa lo stesso motore dell'assistente, così mappa, home e chat dicono sempre la stessa cosa.
import { zoneStatus } from './engine/status.js';
import { vehicleCheck } from './engine/answer.js';

export const VERDICT_TEXT = {
  si: 'Puoi entrare',
  pagamento: 'Puoi entrare pagando',
  no: 'Non puoi entrare',
  dipende: 'Dipende',
  unk: 'Orari non disponibili',
};
export const VERDICT_TONE = { si: 'go', pagamento: 'pay', no: 'stop', dipende: 'lez', unk: 'unk' };

const PERMIT_SOFTENS = { ztl: true, pedonale: true };

export function personalVerdict(zone, when, vehicle) {
  const st = zoneStatus(zone, when);
  if (st.active === null) return { key: 'unk', status: st, reason: 'Nessun orario nelle fonti ufficiali: segui il cartello.' };
  if (!st.active) return { key: 'si', status: st, reason: 'La zona non è attiva in questo momento.' };

  const check = vehicleCheck(zone, vehicle, when);
  const permits = vehicle?.permits ?? [];
  let key;
  let reason;
  if (zone.type === 'lez') {
    key = check.result === 'banned' ? 'no' : check.result === 'unknown' ? 'dipende' : 'si';
    reason = key === 'no' ? `Il tuo veicolo è vietato: ${check.ban.label}.` : key === 'dipende' ? (vehicle ? 'Completa il veicolo (classe Euro) per saperlo.' : 'Aggiungi il tuo veicolo per saperlo.') : 'Il tuo veicolo non rientra nei divieti.';
  } else if (zone.type === 'congestion') {
    if (check.result === 'banned') { key = 'no'; reason = `Il tuo veicolo è vietato: ${check.ban.label}.`; }
    else if (vehicle?.fuel && zone.freeFor?.includes(vehicle.fuel)) { key = 'si'; reason = 'Il tuo veicolo entra gratis.'; }
    else { key = 'pagamento'; reason = 'Serve il ticket giornaliero.'; }
  } else {
    key = 'no';
    reason = 'Entrano solo i veicoli autorizzati.';
  }
  const permitNote = permits.map((p) => zone.permitNotes?.[p]).find(Boolean);
  if ((key === 'no' || key === 'pagamento') && (permitNote || (PERMIT_SOFTENS[zone.type] && permits.length))) {
    key = permitNote?.verdict === 'pagamento' ? 'pagamento' : 'dipende';
    reason = permitNote?.text ?? 'Con il tuo permesso puoi entrare se la targa è registrata per questa zona.';
  }
  return { key, status: st, reason };
}
