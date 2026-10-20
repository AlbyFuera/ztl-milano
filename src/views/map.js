import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { zones } from '../data/rules.js';
import { isActiveAt, zoneStatus } from '../engine/status.js';
import { romeParts, romeDate, addDaysRome } from '../engine/time.js';
import { formatDay, formatTime, formatWhenRel } from '../engine/format.js';
import { describeSchedule } from '../engine/format.js';
import { loadZoneGeo } from '../geo-data.js';
import { esc, signHtml, sourcesHtml } from '../ui.js';

const MILANO = [45.4642, 9.19];
const ORDER = { lez: 0, congestion: 1, ztl: 2, pedonale: 3 };
const TYPE_COLOR = { lez: '#1F4E9C', congestion: '#B98900', ztl: '#C8102E', pedonale: '#7A2E8C' };
const FREE = '#1E7A46';

function styleFor(zone, active) {
  const color = TYPE_COLOR[zone.type] ?? '#1C232B';
  return active
    ? { color, weight: zone.type === 'lez' ? 2 : 3, fillColor: color, fillOpacity: zone.type === 'lez' ? 0.08 : 0.3, dashArray: null }
    : { color, weight: 2, fillColor: FREE, fillOpacity: 0.06, dashArray: '6 6' };
}

export function render(el) {
  el.classList.add('full');
  const today = romeParts(new Date());
  let dayOffset = 0;
  let minutes = Math.floor(today.minutesOfDay / 15) * 15;
  let openZoneId = null;

  const days = Array.from({ length: 7 }, (_, i) => addDaysRome(today, i));
  const chip = (d, i) => {
    const date = romeDate(d.year, d.month, d.day, 12, 0);
    const label = i === 0 ? 'Oggi' : i === 1 ? 'Domani' : formatDay(date).replace(/ \d+ \w+$/, '');
    return `<button type="button" data-day="${i}" aria-pressed="${i === dayOffset}">${esc(label.charAt(0).toUpperCase() + label.slice(1))}</button>`;
  };

  el.innerHTML = `
    <h1 class="skip">Mappa delle zone</h1>
    <div class="map-wrap">
      <div id="map" role="application" aria-label="Mappa delle zone a traffico limitato di Milano"></div>
      <div class="map-tools">
        <button type="button" id="map-locate" aria-label="Mostra la mia posizione"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></button>
        <button type="button" id="map-now" aria-label="Torna a adesso"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg></button>
      </div>
      <div class="map-msg" id="map-msg" role="status"></div>
      <div class="map-panel" id="map-panel">
        <div class="when"><b id="when-label"></b><span class="small muted" id="active-count"></span></div>
        <div class="day-chips" role="group" aria-label="Giorno">${days.map(chip).join('')}</div>
        <label class="skip" for="time-range">Ora</label>
        <input id="time-range" type="range" min="0" max="1425" step="15" value="${minutes}" aria-describedby="when-label" />
        <div class="legend"><span><i style="background:${TYPE_COLOR.congestion}"></i>Area C</span><span><i style="background:${TYPE_COLOR.lez}"></i>Area B</span><span><i style="background:${TYPE_COLOR.ztl}"></i>ZTL</span><span><i style="background:${TYPE_COLOR.pedonale}"></i>Area pedonale</span><span><i style="border:2px dashed ${FREE}"></i>Non attiva</span></div>
      </div>
      <section class="sheet" id="sheet" aria-label="Dettaglio zona" aria-hidden="true"></section>
    </div>`;

  const map = L.map(el.querySelector('#map'), { zoomControl: false, attributionControl: true }).setView(MILANO, 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(map);
  L.control.zoom({ position: 'topleft' }).addTo(map);

  const layers = new Map();
  const selectedDate = () => {
    const d = days[dayOffset];
    return romeDate(d.year, d.month, d.day, Math.floor(minutes / 60), minutes % 60);
  };

  function refresh() {
    const when = selectedDate();
    let active = 0;
    for (const [id, layer] of layers) {
      const zone = zones.find((z) => z.id === id);
      const on = isActiveAt(zone, when);
      if (on) active++;
      layer.setStyle(styleFor(zone, on));
    }
    el.querySelector('#when-label').textContent = `${formatDay(when).replace(/^\w/, (c) => c.toUpperCase())}, ${formatTime(when)}`;
    el.querySelector('#active-count').textContent = layers.size ? `${active} zone attive su ${layers.size}` : '';
    el.querySelectorAll('[data-day]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.day) === dayOffset)));
    if (openZoneId) openSheet(openZoneId);
  }

  const sheet = el.querySelector('#sheet');
  function openSheet(id) {
    const zone = zones.find((z) => z.id === id);
    const when = selectedDate();
    const st = zoneStatus(zone, when);
    openZoneId = id;
    const next = st.nextChange ? `${st.active ? 'Si spegne' : 'Si attiva'} ${formatWhenRel(st.nextChange, when)}.` : '';
    sheet.innerHTML = `
      <div class="grab" aria-hidden="true"></div>
      <div class="sheet-head">
        ${signHtml(zone, st, 'sm')}
        <div><h2>${esc(zone.name)}</h2><p class="small muted">Alle ${esc(formatTime(when))} del giorno scelto</p></div>
        <button class="sheet-close" type="button" aria-label="Chiudi">✕</button>
      </div>
      <p><strong>${st.active ? 'Attiva' : 'Non attiva'}.</strong> ${esc(next)}</p>
      <p class="small">${esc(describeSchedule(zone))}.</p>
      ${zone.summary ? `<p class="small">${esc(zone.summary)}</p>` : ''}
      <div class="btn-row"><a class="btn" href="#/zona/${esc(zone.id)}">Scheda completa</a><a class="btn ghost" href="#/chiedi?zona=${esc(zone.id)}">Chiedi</a></div>
      ${sourcesHtml(zone.sources?.slice(0, 2))}`;
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    sheet.querySelector('.sheet-close').addEventListener('click', closeSheet);
  }
  function closeSheet() {
    openZoneId = null;
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
  }

  const msg = el.querySelector('#map-msg');
  const sorted = [...zones].sort((a, b) => (ORDER[a.type] ?? 9) - (ORDER[b.type] ?? 9));
  Promise.all(sorted.map((z) => loadZoneGeo(z).then((fc) => [z, fc]))).then((pairs) => {
    let missing = 0;
    for (const [zone, fc] of pairs) {
      if (!fc) { missing++; continue; }
      const layer = L.geoJSON(fc, { style: styleFor(zone, false) })
        .on('click', (e) => { L.DomEvent.stopPropagation(e); openSheet(zone.id); })
        .addTo(map);
      layer.bindTooltip(zone.name, { sticky: true, direction: 'top' });
      layers.set(zone.id, layer);
    }
    if (missing === pairs.length) msg.innerHTML = '<p class="notice red">Non riesco a caricare i confini delle zone. Controlla la connessione: orari e assistente funzionano lo stesso.</p>';
    refresh();
  });

  map.on('click', closeSheet);
  el.querySelector('#time-range').addEventListener('input', (e) => { minutes = Number(e.target.value); refresh(); });
  el.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => { dayOffset = Number(b.dataset.day); refresh(); }));
  el.querySelector('#map-now').addEventListener('click', () => {
    const p = romeParts(new Date());
    dayOffset = 0;
    minutes = Math.floor(p.minutesOfDay / 15) * 15;
    el.querySelector('#time-range').value = minutes;
    refresh();
  });

  let me = null;
  el.querySelector('#map-locate').addEventListener('click', () => {
    if (!('geolocation' in navigator)) { msg.innerHTML = '<p class="notice">Posizione non disponibile su questo dispositivo.</p>'; return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        msg.innerHTML = '';
        const ll = [coords.latitude, coords.longitude];
        me?.remove();
        me = L.circleMarker(ll, { radius: 8, color: '#fff', weight: 3, fillColor: '#1F4E9C', fillOpacity: 1 }).addTo(map);
        map.setView(ll, 15);
      },
      () => { msg.innerHTML = '<p class="notice">Posizione non concessa. Puoi attivarla dalle impostazioni del browser.</p>'; },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });

  // la mappa va ridimensionata quando la vista diventa visibile
  setTimeout(() => map.invalidateSize(), 0);
  return () => { map.remove(); el.classList.remove('full'); };
}
