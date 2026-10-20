import { zones } from '../data/rules.js';
import { esc, signHtml, stateLine, clock } from '../ui.js';
import { locate, mostSpecific } from '../geo-data.js';
import { getVehicle, getWhen, resolveWhen, getPlaces, onChange } from '../state.js';
import { personalVerdict, VERDICT_TEXT, VERDICT_TONE } from '../verdict.js';
import { openWhenPicker, whenLabel } from '../when-picker.js';

let heroId = null;
let locationNote = '';
let popped = false;

const ICON = {
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M9 10.5h6"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
};

export const vehicleLabel = (v) => (v ? (v.name?.trim() || 'la tua auto') : 'un\'auto qualsiasi');

function heroHtml(zone) {
  const when = resolveWhen();
  const v = getVehicle();
  const pv = personalVerdict(zone, when, v);
  const st = pv.status;
  const tone = VERDICT_TONE[pv.key];
  const live = !getWhen();
  const cd = live && st.nextChange
    ? `<p class="countdown">${st.active ? 'Si spegne tra' : 'Si accende tra'} <span data-clock="${st.nextChange.getTime()}">${esc(clock(st.nextChange, when))}</span></p>`
    : '';
  const anim = popped ? '' : ' pop-in';
  popped = true;
  return `
    <section class="status-card ${tone}" aria-live="polite" aria-label="Verdetto per ${esc(zone.name)}">
      <div class="sticker${anim}">${signHtml(zone, st, 'hero')}</div>
      <p class="zone-name">${esc(zone.name)}</p>
      <p class="status-word verdict-word">${esc(VERDICT_TEXT[pv.key])}</p>
      <div class="sentence">
        <button type="button" class="pick" id="pick-when" aria-label="Cambia quando, ora: ${esc(whenLabel())}">${esc(whenLabel())} <span aria-hidden="true">▾</span></button>
        <span>con</span>
        <a class="pick" href="#/veicolo" aria-label="Cambia veicolo, ora: ${esc(vehicleLabel(v))}">${esc(vehicleLabel(v))} <span aria-hidden="true">▾</span></a>
      </div>
      <p class="status-sub">${esc(pv.reason)}</p>
      <p class="small" style="font-weight:600">${esc(stateLine(zone, st, when))}</p>
      ${cd}
      <a class="more" href="#/zona/${esc(zone.id)}">Orari, costi e regole ↗</a>
    </section>`;
}

function chipsHtml(current) {
  const when = resolveWhen();
  const v = getVehicle();
  const featured = zones.filter((z) => z.featured || z.id === current.id);
  return `<div class="chips" role="group" aria-label="Scegli la zona">${featured
    .map((z) => `<button type="button" class="chip" data-pick="${esc(z.id)}" aria-pressed="${z.id === current.id}"><span class="dot ${VERDICT_TONE[personalVerdict(z, when, v).key]}" aria-hidden="true"></span>${esc(z.name)}</button>`)
    .join('')}</div>`;
}

function rowsHtml(list) {
  const when = resolveWhen();
  const v = getVehicle();
  return `<ul class="zone-list">${list
    .map((z) => {
      const pv = personalVerdict(z, when, v);
      return `<li><a class="zone-row" href="#/zona/${esc(z.id)}" data-zone="${esc(z.id)}">
        ${signHtml(z, pv.status, 'sm')}
        <span class="meta"><span class="name">${esc(z.name)}</span><br><span class="state">${esc(stateLine(z, pv.status, when))}</span></span>
        <span class="pill ${VERDICT_TONE[pv.key]}">${esc(VERDICT_TEXT[pv.key])}</span>
      </a></li>`;
    })
    .join('')}</ul>`;
}

const openGroups = new Set();
function listHtml() {
  const featured = zones.filter((z) => z.featured);
  const groups = [
    ['ztl', 'Altre ZTL', zones.filter((z) => !z.featured && z.type === 'ztl')],
    ['pedonale', 'Aree pedonali', zones.filter((z) => !z.featured && z.type === 'pedonale')],
  ].filter(([, , l]) => l.length);
  return `${rowsHtml(featured)}
    ${groups
      .map(([key, title, list]) => `<details class="group" data-group="${key}" ${openGroups.has(key) ? 'open' : ''}>
        <summary><span>${esc(title)}</span><span class="count">${list.length}</span></summary>
        ${rowsHtml(list)}
      </details>`)
      .join('')}
    <p class="small muted">"Orari non disponibili" vuol dire che le fonti ufficiali non riportano l'orario: segui il cartello all'ingresso.</p>`;
}

function placesHtml() {
  const places = getPlaces();
  if (!places.length) {
    return `<a class="zone-row" href="#/mappa?cerca=1"><span class="ico-inline">${ICON.search}</span><span class="meta"><span class="name">Salva i tuoi posti</span><br><span class="state">Cerca casa, ufficio o il ristorante e vedi subito se puoi arrivarci in auto.</span></span></a>`;
  }
  const when = resolveWhen();
  const v = getVehicle();
  return `<ul class="zone-list">${places
    .map((p) => {
      const inside = zones.filter((z) => p.zones?.includes(z.id));
      const top = mostSpecific(inside);
      const pv = top ? personalVerdict(top, when, v) : { key: 'si' };
      const where = inside.length ? inside.map((z) => z.name).join(', ') : 'Fuori dalle zone';
      return `<li><a class="zone-row" href="#/mappa?lat=${p.lat}&lng=${p.lng}&nome=${encodeURIComponent(p.label)}">
        <span class="ico-inline">${ICON.pin}</span>
        <span class="meta"><span class="name">${esc(p.label)}</span><br><span class="state">${esc(where)}</span></span>
        <span class="pill ${VERDICT_TONE[pv.key]}">${esc(VERDICT_TEXT[pv.key])}</span>
      </a></li>`;
    })
    .join('')}</ul>`;
}

export function render(el) {
  const draw = () => {
    const zone = zones.find((z) => z.id === heroId) ?? zones[0];
    const focusId = document.activeElement?.dataset?.pick ?? document.activeElement?.id;
    el.innerHTML = `
      <div class="view-head">
        <h1>Posso entrare?</h1>
      </div>
      ${heroHtml(zone)}
      ${chipsHtml(zone)}
      <p class="loc-note" id="loc-note" role="status">${esc(locationNote)}</p>
      <div class="bento">
        <button type="button" class="tile violet" id="locate"><span class="ico">${ICON.pin}</span><div><b>Dove sono?</b><br><span>Ti dico in che zona sei</span></div></button>
        <a class="tile pink" href="#/chiedi"><span class="ico">${ICON.chat}</span><div><b>Chiedi all'AI</b><br><span>"Area C domani alle 8?"</span></div></a>
        <a class="tile yellow" href="#/mappa?cerca=1"><span class="ico">${ICON.search}</span><div><b>Cerca una via</b><br><span>E scopri se ci entri</span></div></a>
        <a class="tile green" href="#/mappa"><span class="ico">${ICON.map}</span><div><b>Mappa live</b><br><span>Colorata per la tua auto</span></div></a>
      </div>
      <section class="section">
        <div class="section-head"><h2>I miei posti</h2></div>
        ${placesHtml()}
      </section>
      <section class="section">
        <div class="section-head"><h2>Tutte le zone</h2><span class="small muted">${esc(whenLabel())}, ${esc(vehicleLabel(getVehicle()))}</span></div>
        ${listHtml()}
      </section>`;
    el.querySelector('#locate').addEventListener('click', onLocate);
    el.querySelector('#pick-when').addEventListener('click', () => openWhenPicker());
    el.querySelectorAll('details.group').forEach((d) =>
      d.addEventListener('toggle', () => (d.open ? openGroups.add(d.dataset.group) : openGroups.delete(d.dataset.group))),
    );
    el.querySelectorAll('[data-pick]').forEach((b) =>
      b.addEventListener('click', () => { heroId = b.dataset.pick; draw(); }),
    );
    if (focusId) (el.querySelector(`[data-pick="${CSS.escape(focusId)}"]`) ?? el.querySelector(`#${CSS.escape(focusId)}`))?.focus({ preventScroll: true });
  };

  async function onLocate() {
    const note = el.querySelector('#loc-note');
    if (!('geolocation' in navigator)) {
      note.textContent = 'Questo dispositivo non può condividere la posizione.';
      return;
    }
    note.textContent = 'Cerco la tua posizione…';
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { inside, nearest } = await locate(coords.latitude, coords.longitude, zones);
        const top = mostSpecific(inside);
        if (top) {
          heroId = top.id;
          locationNote = `📍 Sei dentro: ${inside.map((z) => z.name).join(', ')}.`;
        } else if (nearest) {
          heroId = nearest.zone.id;
          const km = nearest.distance >= 1000 ? `${(nearest.distance / 1000).toFixed(1).replace('.', ',')} km` : `${Math.round(nearest.distance / 10) * 10} m`;
          locationNote = `📍 Sei fuori dalle zone. La più vicina è ${nearest.zone.name}, a circa ${km}.`;
        } else {
          locationNote = 'Non riesco a caricare i confini delle zone. Controlla la connessione e riprova.';
        }
        draw();
      },
      (err) => {
        note.textContent =
          err.code === 1
            ? 'Hai negato la posizione. Puoi attivarla dalle impostazioni del browser, oppure scegli una zona qui sopra.'
            : 'Non riesco a trovare la posizione. Riprova all\'aperto o scegli una zona qui sopra.';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  draw();
  const off = onChange(draw);
  const tick = setInterval(() => {
    const now = new Date();
    el.querySelectorAll('[data-clock]').forEach((s) => {
      const to = new Date(Number(s.dataset.clock));
      if (to <= now) draw();
      else s.textContent = clock(to, now);
    });
  }, 1000);
  const full = setInterval(draw, 60000);
  return () => { off(); clearInterval(tick); clearInterval(full); };
}
