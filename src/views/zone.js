import { zones } from '../data/rules.js';
import { describeSchedule, formatWhenRel } from '../engine/format.js';
import { esc, signHtml, stateLine, statusOf, sourcesHtml } from '../ui.js';

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
    <p><a href="#/adesso">← Tutte le zone</a></p>
    <section class="hero">
      ${signHtml(zone, st)}
      <div class="hero-body">
        <h1>${esc(zone.name)}</h1>
        <p class="hero-state">${esc(stateLine(zone, st, now))}</p>
        <p class="small muted">${esc(next)}</p>
      </div>
    </section>
    ${zone.summary ? `<p>${esc(zone.summary)}</p>` : ''}

    <section class="section card">
      <h2>Quando è attiva</h2>
      <p>${esc(describeSchedule(zone))}.</p>
      ${zone.scheduleNotes?.length ? `<ul class="clean small">${zone.scheduleNotes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
    </section>

    <section class="section card">
      <h2>Entrare e uscire</h2>
      <dl class="facts">
        ${zone.whoCanEnter ? `<dt>Chi entra</dt><dd>${esc(zone.whoCanEnter)}</dd>` : ''}
        ${zone.cost ? `<dt>Costo</dt><dd>${esc(zone.cost)}</dd>` : ''}
        ${zone.payment ? `<dt>Come pagare</dt><dd>${esc(zone.payment)}</dd>` : ''}
        ${zone.exitNote ? `<dt>Uscita</dt><dd>${esc(zone.exitNote)}</dd>` : ''}
        ${zone.gates ? `<dt>Varchi</dt><dd>${esc(zone.gates)}</dd>` : ''}
      </dl>
    </section>
    ${zone.vehicleBans?.length ? list('Veicoli vietati', zone.vehicleBans.map((b) => `${b.label}${b.since ? ` (dal ${new Date(`${b.since}T12:00:00Z`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })})` : ''}`)) : ''}
    ${list('Deroghe ed esenzioni', zone.exceptions)}
    ${list('Da sapere', zone.notes)}
    <div class="btn-row section">
      <a class="btn" href="#/chiedi?zona=${esc(zone.id)}">Chiedi su ${esc(zone.name)}</a>
      <a class="btn ghost" href="#/mappa">Vedi sulla mappa</a>
    </div>
    <section class="section">
      <h2>Fonti ufficiali</h2>
      ${sourcesHtml(zone.sources)}
      ${zone.checkedOn ? `<p class="small muted">Verificato il ${esc(zone.checkedOn)}.</p>` : ''}
    </section>`;
}
