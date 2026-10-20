import { sources, updated } from '../data/rules.js';
import { esc } from '../ui.js';

export function render(el) {
  el.innerHTML = `
    <div class="view-head">
      <h1>Fonti</h1>
      <p class="muted">Tutti i dati dell'app vengono da qui. Solo siti ufficiali del Comune di Milano, di AMAT (l'agenzia del Comune per la mobilità) e del Codice della Strada.</p>
    </div>
    <ul class="zone-list">
      ${sources
        .map((s) => `<li><a class="zone-row" href="${esc(s.url)}" target="_blank" rel="noopener"><span class="meta"><span class="name">${esc(s.title)}</span><br><span class="state">${esc(s.note ?? new URL(s.url).hostname)}</span></span><span class="chev" aria-hidden="true">↗</span></a></li>`)
        .join('')}
    </ul>
    <section class="section card">
      <h2>Come leggere queste informazioni</h2>
      <p>Dati verificati il ${esc(updated)}. Le regole possono cambiare per ordinanza (eventi, cantieri, emergenze smog). Prima di entrare fa fede la segnaletica sul posto e la pagina ufficiale del Comune.</p>
      <p>Mappa: confini delle zone dagli Open Data del Comune di Milano; base cartografica © OpenStreetMap e CARTO.</p>
      <p class="small muted">App non ufficiale, realizzata per informare. Non è collegata al Comune di Milano.</p>
    </section>`;
}
