import { zoneStatus } from './engine/status.js';
import { formatWhenRel, formatTime } from './engine/format.js';

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const sourceUrl = (s) => (typeof s === 'string' ? s : s?.url);
export const sourceTitle = (s) => (typeof s === 'string' ? new URL(s).hostname.replace('www.', '') : s?.title ?? sourceUrl(s));

export function sourcesHtml(sources = []) {
  if (!sources.length) return '';
  const links = sources
    .map((s) => `<a href="${esc(sourceUrl(s))}" target="_blank" rel="noopener">${esc(sourceTitle(s))}</a>`)
    .join('');
  return `<p class="sources"><span class="muted">Fonte:</span> ${links}</p>`;
}

// Etichetta del disco in base a tipo zona e stato.
export function signInfo(zone, status) {
  if (status.active === null) return { cls: 'unk', big: 'Orari n.d.', small: 'vedi cartello' };
  if (!status.active) return { cls: 'free', big: 'Libera', small: 'si entra' };
  if (zone.type === 'congestion') return { cls: 'paid', big: 'Attiva', small: 'a pagamento' };
  if (zone.type === 'lez') return { cls: 'lez', big: 'Attiva', small: 'divieti veicoli' };
  return { cls: '', big: 'Attiva', small: 'solo autorizzati' };
}

export function signHtml(zone, status, size = '') {
  const s = signInfo(zone, status);
  if (size === 'hero') {
    return `<span class="sign sign-hero ${s.cls}" aria-hidden="true"><b>${esc(zone.short ?? '')}</b></span>`;
  }
  if (size === 'sm') {
    return `<span class="sign sign-sm ${s.cls}" aria-hidden="true"><b>${esc(zone.short ?? '')}</b></span>`;
  }
  return `<div class="sign ${s.cls}" role="img" aria-label="${esc(zone.name)}: ${esc(s.big)}, ${esc(s.small)}"><b>${esc(s.big)}</b><small>${esc(s.small)}</small></div>`;
}

export function pillHtml(zone, status) {
  if (status.active === null) return '<span class="pill unk">Orari n.d.</span>';
  if (!status.active) return '<span class="pill off">Libera</span>';
  if (zone.type === 'congestion') return '<span class="pill paid">A pagamento</span>';
  if (zone.type === 'lez') return '<span class="pill lez">Attiva</span>';
  return '<span class="pill on">Attiva</span>';
}

// Tono di colore dello stato: go (lime), pay (giallo), lez (pervinca), stop (corallo).
export function toneOf(zone, status) {
  if (status.active === null) return 'unk';
  if (!status.active) return 'go';
  if (zone.type === 'congestion') return 'pay';
  if (zone.type === 'lez') return 'lez';
  return 'stop';
}

// Conto alla rovescia ai secondi: "02:14:33", oltre le 24 ore "3 giorni e 4 h".
export function clock(to, now) {
  const s = Math.max(0, Math.floor((to.getTime() - now.getTime()) / 1000));
  if (s >= 86400) {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    return `${d} ${d === 1 ? 'giorno' : 'giorni'}${h ? ` e ${h} h` : ''}`;
  }
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function stateLine(zone, status, now) {
  if (status.active === null) return 'Orari non disponibili nelle fonti ufficiali';
  if (zone.alwaysActive) return 'Attiva 24 ore su 24';
  if (status.active && status.nextChange) return `Attiva fino alle ${formatTime(status.nextChange)}`;
  if (status.nextChange) return `Si attiva ${formatWhenRel(status.nextChange, now)}`;
  return status.reason;
}

export function countdown(to, now) {
  const ms = to.getTime() - now.getTime();
  if (ms <= 0) return 'adesso';
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 48) return m ? `${h} h ${m} min` : `${h} h`;
  return `${Math.round(h / 24)} giorni`;
}

export const statusOf = (zone, now) => zoneStatus(zone, now);
