import { zones } from '../data/rules.js';
import { describeSchedule, formatWhenRel } from '../engine/format.js';
import { esc, signHtml, pillHtml, toneOf, stateLine, statusOf, sourcesHtml } from '../ui.js';

const list = (title, items) =>
  items?.length ? `<section class="section"><h2>${esc(title)}</h2><ul class="clean">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></section>` : '';

export function render(el, params, id) {
  const zone = zones.find((z) => z.id === id);
  if (!zone) {
    el.innerHTML = `<div class="view-head"><h1>Zona non trovata</h1><p>Questa zona non è nell'elenco. <a href="#/adesso">Torna a tutte le zone</a>.</p></div>`;
    return;
  }
  const now = new Date();
  const st = statusOf(zone, now);
  const next = st.nextChange ? `${st.active ? 'Si spegne' : 'Si attiva'} ${formatWhenRel(st.nextChange, now)}.` : '';
  el.innerHTML = `
    <a class="back" href="#/adesso">← Tutte le zone</a>
    <section class="zone-hero">
      ${signHtml(zone, st)}
      <div style="display:grid;gap:6px">
        <h1>${esc(zone.name)}</h1>
        ${pillHtml(zone, st)}
      </div>
    </section>
    <section class="status-card ${toneOf(zone, st)}" style="min-height:0;margin-top:18px">
      <p class="status-sub">${esc(stateLine(zone, st, now))}</p>
      <p class="small" style="font-weight:600">${esc(next)}</p>
    </section>
    ${zone.summary ? `<p style="margin-top:16px;font-size:1.05rem">${esc(zone.summary)}</p>` : ''}

    <section class="section card">
      <h2>Quando è attiva</h2>
      <p>${esc(describeSchedule(zone))}.</p>
      ${zone.scheduleNotes?.length ? `<ul class="clean small">${zone.scheduleNotes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
    </section>

    <section class="section card">
      <h2>Entrare e uscire</h2>
      <dl class="facts">
        ${zone.whoCanEnter ? `<div><dt>Chi entra</dt><dd>${esc(zone.whoCanEnter)}</dd></div>` : ''}
        ${zone.cost ? `<div><dt>Costo</dt><dd>${esc(zone.cost)}</dd></div>` : ''}
        ${zone.payment ? `<div><dt>Come pagare</dt><dd>${esc(zone.payment)}</dd></div>` : ''}
        ${zone.exitNote ? `<div><dt>Uscita</dt><dd>${esc(zone.exitNote)}</dd></div>` : ''}
        ${zone.gates ? `<div><dt>Varchi</dt><dd>${esc(zone.gates)}</dd></div>` : ''}
      </dl>
    </section>
    ${zone.vehicleBans?.length ? list('Veicoli vietati', zone.vehicleBans.map((b) => `${b.label}${b.since ? ` (dal ${new Date(`${b.since}T12:00:00Z`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })})` : ''}`)) : ''}
    ${list('Deroghe ed esenzioni', zone.exceptions)}
    ${list('Da sapere', zone.notes)}
    <div class="btn-row" style="margin-top:26px">
      <a class="btn" href="#/chiedi?zona=${esc(zone.id)}">Chiedi su ${esc(zone.name)}</a>
      <a class="btn ghost" href="#/mappa">Vedi sulla mappa</a>
    </div>
    <section class="section">
      <h2>Fonti ufficiali</h2>
      ${sourcesHtml(zone.sources)}
      ${zone.checkedOn ? `<p class="small muted">Verificato il ${esc(zone.checkedOn)}.</p>` : ''}
    </section>`;
}
