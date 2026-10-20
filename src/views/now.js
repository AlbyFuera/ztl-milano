import { zones } from '../data/rules.js';
import { esc, signHtml, pillHtml, stateLine, statusOf, toneOf, clock } from '../ui.js';
import { locate, mostSpecific } from '../geo-data.js';
import { getVehicle } from '../state.js';
import { vehicleCheck } from '../engine/answer.js';

let heroId = null;
let locationNote = '';
let popped = false;

const SUB = {
  go: 'Puoi entrare e uscire liberamente.',
  pay: 'Entri solo pagando il ticket giornaliero.',
  lez: 'Vietata ai veicoli più inquinanti.',
  stop: 'Entrano solo i veicoli autorizzati.',
};

const ICON = {
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M9 10.5h6"/></svg>',
  car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16v-4l2-5h12l2 5v4H4Z"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>',
};

function vehicleLine(zone, now) {
  const v = getVehicle();
  if (!v || !zone.vehicleBans?.length) return '';
  const { result } = vehicleCheck(zone, v, now);
  if (result === 'banned') return '<p class="status-sub">Il tuo veicolo qui non può entrare quando è attiva.</p>';
  if (result === 'allowed') return '<p class="small" style="font-weight:600">Il tuo veicolo non rientra nei divieti.</p>';
  return '';
}

function heroHtml(zone, now) {
  const st = statusOf(zone, now);
  const tone = toneOf(zone, st);
  const word = st.active ? 'Attiva' : 'Libera';
  const cd = st.nextChange
    ? `<p class="countdown">${st.active ? 'Si spegne tra' : 'Si accende tra'} <span data-clock="${st.nextChange.getTime()}">${esc(clock(st.nextChange, now))}</span></p>`
    : '';
  const anim = popped ? '' : ' pop-in';
  popped = true;
  return `
    <section class="status-card ${tone}" aria-live="polite" aria-label="Stato di ${esc(zone.name)}">
      <div class="sticker${anim}">${signHtml(zone, st, 'hero')}</div>
      <p class="zone-name">${esc(zone.name)}</p>
      <p class="status-word">${word}</p>
      <p class="status-sub">${esc(st.active ? SUB[tone] : SUB.go)}</p>
      <p class="small" style="font-weight:600">${esc(stateLine(zone, st, now))}</p>
      ${cd}
      ${vehicleLine(zone, now)}
      <a class="more" href="#/zona/${esc(zone.id)}">Orari, costi e regole ↗</a>
    </section>`;
}

function chipsHtml(current, now) {
  return `<div class="chips" role="group" aria-label="Scegli la zona">${zones
    .map((z) => {
      const st = statusOf(z, now);
      return `<button type="button" class="chip" data-pick="${esc(z.id)}" aria-pressed="${z.id === current.id}"><span class="dot ${toneOf(z, st)}" aria-hidden="true"></span>${esc(z.name)}</button>`;
    })
    .join('')}</div>`;
}

function listHtml(now) {
  return `<ul class="zone-list">${zones
    .map((z) => {
      const st = statusOf(z, now);
      return `<li><a class="zone-row" href="#/zona/${esc(z.id)}" data-zone="${esc(z.id)}">
        ${signHtml(z, st, 'sm')}
        <span class="meta"><span class="name">${esc(z.name)}</span><br><span class="state">${esc(stateLine(z, st, now))}</span></span>
        ${pillHtml(z, st)}
      </a></li>`;
    })
    .join('')}</ul>`;
}

export function render(el) {
  const draw = () => {
    const now = new Date();
    const zone = zones.find((z) => z.id === heroId) ?? zones[0];
    const focusId = document.activeElement?.dataset?.pick ?? document.activeElement?.id;
    el.innerHTML = `
      <div class="view-head">
        <h1>Posso entrare adesso?</h1>
      </div>
      ${heroHtml(zone, now)}
      ${chipsHtml(zone, now)}
      <p class="loc-note" id="loc-note" role="status">${esc(locationNote)}</p>
      <div class="bento">
        <button type="button" class="tile violet" id="locate"><span class="ico">${ICON.pin}</span><div><b>Dove sono?</b><br><span>Ti dico in che zona sei</span></div></button>
        <a class="tile pink" href="#/chiedi"><span class="ico">${ICON.chat}</span><div><b>Chiedi all'AI</b><br><span>"Area C domani alle 8?"</span></div></a>
        <a class="tile yellow" href="#/veicolo"><span class="ico">${ICON.car}</span><div><b>La mia auto</b><br><span>Dove può entrare</span></div></a>
        <a class="tile" style="background:var(--lez)" href="#/mappa"><span class="ico">${ICON.map}</span><div><b>Mappa live</b><br><span>Scorri le ore</span></div></a>
      </div>
      <section class="section">
        <div class="section-head"><h2>Tutte le zone</h2><span class="small muted">si aggiorna da sola</span></div>
        ${listHtml(now)}
      </section>`;
    el.querySelector('#locate').addEventListener('click', onLocate);
    el.querySelectorAll('[data-pick]').forEach((b) =>
      b.addEventListener('click', () => { heroId = b.dataset.pick; draw(); }),
    );
    if (focusId) (el.querySelector(`[data-pick="${focusId}"]`) ?? el.querySelector(`#${CSS.escape(focusId)}`))?.focus({ preventScroll: true });
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
  // ogni secondo: solo il conto alla rovescia; al cambio di stato ridisegna tutto
  const tick = setInterval(() => {
    const now = new Date();
    el.querySelectorAll('[data-clock]').forEach((s) => {
      const to = new Date(Number(s.dataset.clock));
      if (to <= now) draw();
      else s.textContent = clock(to, now);
    });
  }, 1000);
  const full = setInterval(draw, 60000);
  return () => { clearInterval(tick); clearInterval(full); };
}
