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
  if (!status.active) return { cls: 'free', big: 'Libera', small: 'si entra' };
  if (zone.type === 'congestion') return { cls: 'paid', big: 'Attiva', small: 'a pagamento' };
  if (zone.type === 'lez') return { cls: 'lez', big: 'Attiva', small: 'divieti veicoli' };
  return { cls: '', big: 'Attiva', small: 'solo autorizzati' };
}

export function signHtml(zone, status, size = '') {
  const s = signInfo(zone, status);
  if (size === 'sm') {
    return `<span class="sign sign-sm ${s.cls}" aria-hidden="true"><b>${esc(zone.short ?? '')}</b></span>`;
  }
  return `<div class="sign ${s.cls}" role="img" aria-label="${esc(zone.name)}: ${esc(s.big)}, ${esc(s.small)}"><b>${esc(s.big)}</b><small>${esc(s.small)}</small></div>`;
}

export function pillHtml(zone, status) {
  if (!status.active) return '<span class="pill off">Libera</span>';
  if (zone.type === 'congestion') return '<span class="pill paid">A pagamento</span>';
  return '<span class="pill on">Attiva</span>';
}

export function stateLine(zone, status, now) {
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
