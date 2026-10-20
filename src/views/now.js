import { zones } from '../data/rules.js';
import { esc, signHtml, pillHtml, stateLine, countdown, statusOf } from '../ui.js';
import { locate, mostSpecific } from '../geo-data.js';
import { getVehicle } from '../state.js';
import { vehicleCheck } from '../engine/answer.js';

let heroId = null;
let locationNote = '';

function vehicleLine(zone, now) {
  const v = getVehicle();
  if (!v || !zone.vehicleBans?.length) return '';
  const { result } = vehicleCheck(zone, v, now);
  if (result === 'banned') return '<p class="notice red small">Il tuo veicolo non può entrare quando la zona è attiva.</p>';
  if (result === 'unknown') return '';
  return '<p class="small muted">Il tuo veicolo non rientra nei divieti di questa zona.</p>';
}

function heroHtml(zone, now) {
  const st = statusOf(zone, now);
  const label = st.active ? 'Si spegne tra' : 'Si attiva tra';
  const cd = st.nextChange
    ? `<p class="countdown" data-countdown>${label} ${esc(countdown(st.nextChange, now))}</p>`
    : '';
  return `
    <section class="hero" aria-live="polite">
      ${signHtml(zone, st)}
      <div class="hero-body">
        <p class="hero-zone">${esc(zone.name)}</p>
        <p class="hero-state">${esc(stateLine(zone, st, now))}</p>
        ${cd}
        ${vehicleLine(zone, now)}
        <a href="#/zona/${esc(zone.id)}">Orari, costi e regole</a>
      </div>
    </section>`;
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
    el.innerHTML = `
      <div class="view-head">
        <h1>Posso entrare adesso?</h1>
        <p class="muted">Lo stato di ogni zona in questo momento, aggiornato da solo.</p>
      </div>
      ${heroHtml(zone, now)}
      <div class="btn-row">
        <button class="btn" id="locate"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>Dove sono?</button>
        <a class="btn ghost" href="#/chiedi">Chiedi per un altro orario</a>
      </div>
      <p class="small muted" id="loc-note" role="status">${esc(locationNote)}</p>
      <section class="section">
        <h2>Tutte le zone</h2>
        ${listHtml(now)}
      </section>`;
    el.querySelector('#locate').addEventListener('click', onLocate);
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
          locationNote = `Sei dentro: ${inside.map((z) => z.name).join(', ')}.`;
        } else if (nearest) {
          heroId = nearest.zone.id;
          const km = nearest.distance >= 1000 ? `${(nearest.distance / 1000).toFixed(1).replace('.', ',')} km` : `${Math.round(nearest.distance / 10) * 10} m`;
          locationNote = `Sei fuori dalle zone. La più vicina è ${nearest.zone.name}, a circa ${km}.`;
        } else {
          locationNote = 'Non riesco a caricare i confini delle zone. Controlla la connessione e riprova.';
        }
        draw();
      },
      (err) => {
        note.textContent =
          err.code === 1
            ? 'Hai negato la posizione. Puoi attivarla dalle impostazioni del browser, oppure scegli una zona dall\'elenco.'
            : 'Non riesco a trovare la posizione. Riprova all\'aperto o scegli una zona dall\'elenco.';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  draw();
  const timer = setInterval(draw, 30000);
  return () => clearInterval(timer);
}
