import { fines } from '../data/rules.js';
import { fineDeadlines } from '../engine/fines.js';
import { esc, sourcesHtml } from '../ui.js';

const euro = (n) => `${n.toFixed(2).replace('.', ',')} €`;
const fmt = ({ year, month, day }) =>
  new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' });
const todayYmd = () => {
  const [year, month, day] = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' }).split('-').map(Number);
  return { year, month, day };
};
const toIso = ({ year, month, day }) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export function render(el) {
  const t = fines.ztl;
  let notified = todayYmd();

  const draw = () => {
    const r = fineDeadlines(notified, t, todayYmd());
    el.innerHTML = `
      <div class="view-head">
        <h1>Multe</h1>
        <p class="muted">Quanto costa entrare senza permesso e cosa fare se ti arriva un verbale.</p>
      </div>

      <section class="amounts">
        <div class="amount-tile"><p>Entro ${t.reducedDays} giorni</p><p class="amount">${euro(r.reduced)}</p></div>
        <div class="amount-tile"><p>Entro ${t.payDays} giorni</p><p class="amount">${euro(t.min)}</p></div>
        <div class="amount-tile"><p>Dopo ${t.payDays} giorni</p><p class="amount">${euro(r.late)}</p></div>
      </section>
      <p class="small muted" style="margin-top:12px">${esc(t.summary)} Agli importi si aggiungono le spese di notifica indicate sul verbale.</p>
      ${sourcesHtml(t.sources)}

      <section class="section card">
        <h2>Ti è arrivato un verbale?</h2>
        <div class="field">
          <label for="notified">Data in cui l'hai ricevuto (notifica)</label>
          <input id="notified" type="date" value="${toIso(notified)}" max="${toIso(todayYmd())}" />
        </div>
        <ol class="timeline" aria-label="Scadenze">
          ${r.steps.map((s) => `<li class="${s.past ? 'past' : ''}"><p class="date">${esc(fmt(s.date))}</p><p>${esc(s.label)}${s.past ? ' (scaduto)' : ''}</p></li>`).join('')}
        </ol>
        <p class="small muted">Le scadenze contano i giorni dalla notifica. Se una cade di domenica o in un festivo, controlla sul verbale: fa fede quanto indicato lì.</p>
      </section>

      ${(fines.sections ?? [])
        .map(
          (s) => `<section class="section"><h2>${esc(s.title)}</h2><ul class="clean">${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>${sourcesHtml(s.sources)}</section>`,
        )
        .join('')}`;

    el.querySelector('#notified').addEventListener('change', (e) => {
      const [year, month, day] = e.target.value.split('-').map(Number);
      if (year && month && day) { notified = { year, month, day }; draw(); el.querySelector('#notified').focus(); }
    });
  };
  draw();
}
