import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { zones } from '../data/rules.js';
import { romeParts, romeDate, addDaysRome } from '../engine/time.js';
import { formatDay, formatTime, formatWhenRel, describeSchedule } from '../engine/format.js';
import { loadZoneGeo, locate, mostSpecific } from '../geo-data.js';
import { esc, signHtml, sourcesHtml } from '../ui.js';
import { getVehicle, getWhen, setWhen, addPlace, onChange } from '../state.js';
import { personalVerdict, VERDICT_TEXT, VERDICT_TONE } from '../verdict.js';

const MILANO = [45.4642, 9.19];
const ORDER = { lez: 0, congestion: 1, ztl: 2, pedonale: 3 };
const COLOR = { go: '#30d158', pay: '#ff9f0a', stop: '#ff453a', lez: '#5e5ce6', unk: '#8e8e93' };
const VIEWBOX = '9.04,45.54,9.28,45.38';

function styleFor(zone, pv) {
  const tone = VERDICT_TONE[pv.key];
  const color = COLOR[tone];
  const inactive = pv.status.active === false;
  const big = zone.type === 'lez';
  return {
    color,
    weight: big ? 2.5 : 3,
    fillColor: color,
    fillOpacity: inactive ? 0.05 : big ? 0.1 : 0.32,
    dashArray: inactive || tone === 'unk' ? '6 6' : null,
  };
}

// Ricerca indirizzi con Nominatim (OpenStreetMap), solo nell'area di Milano.
let lastSearch = 0;
async function searchPlaces(q, signal) {
  const wait = Math.max(0, 1100 - (Date.now() - lastSearch)); // max 1 richiesta al secondo
  if (wait) await new Promise((r) => setTimeout(r, wait));
  lastSearch = Date.now();
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&countrycodes=it&bounded=1&viewbox=${VIEWBOX}&accept-language=it&q=${encodeURIComponent(q)}`;
  const r = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()).map((x) => ({
    lat: Number(x.lat),
    lng: Number(x.lon),
    label: x.name || x.display_name.split(',')[0],
    sub: x.display_name.split(',').slice(1, 4).join(',').trim(),
  }));
}

export function render(el, params) {
  el.classList.add('full');
  const today = romeParts(new Date());
  const initial = getWhen() ? romeParts(getWhen()) : today;
  let dayOffset = Math.max(0, Math.min(6, Math.round((Date.UTC(initial.year, initial.month - 1, initial.day) - Date.UTC(today.year, today.month - 1, today.day)) / 86400000)));
  let minutes = Math.floor(initial.minutesOfDay / 15) * 15;
  let openZoneId = null;
  let openPlace = null;

  const days = Array.from({ length: 7 }, (_, i) => addDaysRome(today, i));
  const chip = (d, i) => {
    const label = i === 0 ? 'Oggi' : i === 1 ? 'Domani' : formatDay(romeDate(d.year, d.month, d.day, 12, 0)).split(' ')[0];
    return `<button type="button" data-day="${i}" aria-pressed="${i === dayOffset}">${esc(label.charAt(0).toUpperCase() + label.slice(1))}</button>`;
  };
  const vName = getVehicle() ? getVehicle().name?.trim() || 'la tua auto' : 'un\'auto qualsiasi';

  el.innerHTML = `
    <h1 class="skip">Mappa delle zone</h1>
    <div class="map-wrap">
      <div id="map" role="application" aria-label="Mappa delle zone a traffico limitato di Milano"></div>
      <form class="map-search" id="map-search" role="search">
        <label class="skip" for="place-q">Cerca una via o un posto a Milano</label>
        <input id="place-q" type="search" autocomplete="off" placeholder="Cerca una via o un posto" enterkeyhint="search" />
        <ul class="map-results" id="map-results" hidden></ul>
      </form>
      <div class="map-tools">
        <button type="button" id="map-locate" aria-label="Mostra la mia posizione"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></button>
        <button type="button" id="map-gates" aria-label="Mostra i varchi con telecamera" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="13" height="10" rx="2"/><path d="m16 11 5-3v8l-5-3"/></svg></button>
        <button type="button" id="map-now" aria-label="Torna a adesso"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg></button>
      </div>
      <div class="map-msg" id="map-msg" role="status"></div>
      <div class="map-panel" id="map-panel">
        <div class="when"><b id="when-label"></b><span class="small muted" id="active-count"></span></div>
        <div class="day-chips" role="group" aria-label="Giorno">${days.map(chip).join('')}</div>
        <label class="skip" for="time-range">Ora</label>
        <input id="time-range" type="range" min="0" max="1425" step="15" value="${minutes}" aria-describedby="when-label" />
        <details class="legend-box"><summary>Colori per ${esc(vName)}</summary>
          <div class="legend">
            <span><i style="background:${COLOR.go}"></i>Puoi entrare</span><span><i style="background:${COLOR.pay}"></i>A pagamento</span>
            <span><i style="background:${COLOR.lez}"></i>Dipende</span><span><i style="background:${COLOR.stop}"></i>Non puoi</span>
            <span><i style="border:2px dashed ${COLOR.unk}"></i>Orari n.d.</span><span><i style="border:2px dashed ${COLOR.go}"></i>Zona spenta</span>
          </div>
          <p class="small muted" id="map-missing"></p>
        </details>
      </div>
      <section class="sheet" id="sheet" aria-label="Dettaglio" aria-hidden="true"></section>
    </div>`;

  const map = L.map(el.querySelector('#map'), { zoomControl: false }).setView(MILANO, 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    className: 'osm-tiles',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  let disposed = false; // la vista può chiudersi mentre i dati sono ancora in arrivo
  const layers = new Map();
  const selectedDate = () => {
    const d = days[dayOffset];
    return romeDate(d.year, d.month, d.day, Math.floor(minutes / 60), minutes % 60);
  };

  function refresh() {
    const when = selectedDate();
    const v = getVehicle();
    let active = 0;
    for (const [id, layer] of layers) {
      const zone = zones.find((z) => z.id === id);
      const pv = personalVerdict(zone, when, v);
      if (pv.status.active) active++;
      layer.setStyle(styleFor(zone, pv));
    }
    el.querySelector('#when-label').textContent = `${formatDay(when).replace(/^\w/, (c) => c.toUpperCase())}, ${formatTime(when)}`;
    el.querySelector('#active-count').textContent = layers.size ? `${active} attive su ${layers.size}` : '';
    el.querySelectorAll('[data-day]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.day) === dayOffset)));
    if (openZoneId) openZone(openZoneId);
    if (openPlace) openPlaceSheet(openPlace);
  }

  const sheet = el.querySelector('#sheet');
  function showSheet(html) {
    sheet.innerHTML = `<div class="grab" aria-hidden="true"></div>${html}`;
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    sheet.querySelector('.sheet-close')?.addEventListener('click', closeSheet);
  }
  function closeSheet() {
    openZoneId = null;
    openPlace = null;
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
  }

  function openZone(id) {
    const zone = zones.find((z) => z.id === id);
    const when = selectedDate();
    const pv = personalVerdict(zone, when, getVehicle());
    const st = pv.status;
    openZoneId = id;
    openPlace = null;
    const next = st.nextChange ? `${st.active ? 'Si spegne' : 'Si attiva'} ${formatWhenRel(st.nextChange, when)}.` : '';
    showSheet(`
      <div class="sheet-head">
        ${signHtml(zone, st, 'sm')}
        <div><h2>${esc(zone.name)}</h2><p class="small muted">${esc(formatWhenRel(when, new Date()))}</p></div>
        <button class="sheet-close" type="button" aria-label="Chiudi">✕</button>
      </div>
      <p><span class="pill ${VERDICT_TONE[pv.key]}">${esc(VERDICT_TEXT[pv.key])}</span></p>
      <p>${esc(pv.reason)} ${esc(next)}</p>
      <p class="small">${esc(describeSchedule(zone))}.</p>
      <div class="btn-row"><a class="btn" href="#/zona/${esc(zone.id)}">Scheda completa</a><a class="btn ghost" href="#/chiedi?zona=${esc(zone.id)}">Chiedi</a></div>
      ${sourcesHtml(zone.sources?.slice(0, 2))}`);
  }

  let placeMarker = null;
  async function openPlaceSheet(place) {
    openPlace = place;
    openZoneId = null;
    placeMarker?.remove();
    placeMarker = L.circleMarker([place.lat, place.lng], { radius: 10, color: '#ffffff', weight: 3, fillColor: '#0a84ff', fillOpacity: 1 }).addTo(map);
    const { inside } = await locate(place.lat, place.lng, zones);
    if (disposed || openPlace !== place) return;
    place.zones = inside.map((z) => z.id);
    const when = selectedDate();
    const v = getVehicle();
    const rows = [...inside]
      .sort((a, b) => (ORDER[b.type] ?? 0) - (ORDER[a.type] ?? 0))
      .map((z) => {
        const pv = personalVerdict(z, when, v);
        return `<li><span><span class="name">${esc(z.name)}</span><br><span class="small muted">${esc(pv.reason)}</span></span><span class="pill ${VERDICT_TONE[pv.key]}">${esc(VERDICT_TEXT[pv.key])}</span></li>`;
      })
      .join('');
    const top = mostSpecific(inside);
    const overall = top ? personalVerdict(top, when, v) : null;
    showSheet(`
      <div class="sheet-head">
        <span class="ico-inline" aria-hidden="true">📍</span>
        <div><h2>${esc(place.label)}</h2><p class="small muted">${esc(place.sub ?? '')}</p></div>
        <button class="sheet-close" type="button" aria-label="Chiudi">✕</button>
      </div>
      ${overall ? `<p><span class="pill ${VERDICT_TONE[overall.key]}">${esc(VERDICT_TEXT[overall.key])}</span> <span class="small muted">${esc(formatWhenRel(when, new Date()))}</span></p>` : '<p class="notice ok">Questo posto è fuori da Area C, Area B e dalle ZTL presenti nei dati: puoi arrivarci liberamente.</p>'}
      ${rows ? `<ul class="verdict-list">${rows}</ul>` : ''}
      <div class="btn-row"><button type="button" class="btn lime" id="save-place">Salva nei miei posti</button></div>
      <p class="small muted">Quadrilatero della Moda e Isola non hanno ancora il perimetro negli Open Data: se il posto è lì, controlla la scheda della zona.</p>`);
    sheet.querySelector('#save-place').addEventListener('click', (e) => {
      addPlace({ label: place.label, lat: place.lat, lng: place.lng, zones: place.zones });
      e.target.textContent = 'Salvato ✓';
      e.target.disabled = true;
    });
  }

  const msg = el.querySelector('#map-msg');
  const sorted = [...zones].sort((a, b) => (ORDER[a.type] ?? 9) - (ORDER[b.type] ?? 9));
  Promise.all(sorted.map((z) => loadZoneGeo(z).then((fc) => [z, fc]))).then((pairs) => {
    if (disposed) return;
    const withGeo = pairs.filter(([z]) => z.geo);
    for (const [zone, fc] of withGeo) {
      if (!fc) continue;
      const layer = L.geoJSON(fc, { style: { weight: 2 } })
        .on('click', (e) => { L.DomEvent.stopPropagation(e); openZone(zone.id); })
        .addTo(map);
      layer.bindTooltip(zone.name, { sticky: true, direction: 'top' });
      layers.set(zone.id, layer);
    }
    if (withGeo.length && !layers.size) {
      msg.innerHTML = '<p class="notice red">Non riesco a caricare i confini delle zone. Controlla la connessione: orari e assistente funzionano lo stesso.</p>';
    }
    refresh();
    const lat = Number(params.get('lat'));
    const lng = Number(params.get('lng'));
    if (lat && lng) {
      map.setView([lat, lng], 16);
      openPlaceSheet({ lat, lng, label: params.get('nome') || 'Posto salvato' });
    }
  });

  const missingGeo = zones.filter((z) => !z.geo).map((z) => z.name);
  if (missingGeo.length) el.querySelector('#map-missing').textContent = `Non ancora sulla mappa (perimetro non negli Open Data): ${missingGeo.join(', ')}.`;

  // --- ricerca indirizzi
  const input = el.querySelector('#place-q');
  const results = el.querySelector('#map-results');
  let ctrl = null;
  let timer = null;
  let found = [];
  const paintResults = (html) => { results.innerHTML = html; results.hidden = !html; };
  async function runSearch(q) {
    ctrl?.abort();
    ctrl = new AbortController();
    paintResults('<li class="small muted" style="padding:10px 12px">Cerco…</li>');
    try {
      found = await searchPlaces(q, ctrl.signal);
      if (disposed) return;
      paintResults(found.length
        ? found.map((r, i) => `<li><button type="button" data-r="${i}">${esc(r.label)}<span class="sub">${esc(r.sub)}</span></button></li>`).join('')
        : '<li class="small muted" style="padding:10px 12px">Nessun risultato a Milano. Prova con via e numero civico.</li>');
      results.querySelectorAll('[data-r]').forEach((b) => b.addEventListener('click', () => {
        const r = found[Number(b.dataset.r)];
        paintResults('');
        input.value = r.label;
        input.blur();
        map.setView([r.lat, r.lng], 16);
        openPlaceSheet(r);
      }));
    } catch (e) {
      if (e.name !== 'AbortError') paintResults('<li class="small muted" style="padding:10px 12px">Ricerca non disponibile adesso. Controlla la connessione.</li>');
    }
  }
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (q.length < 3) { paintResults(''); return; }
    timer = setTimeout(() => runSearch(q), 650);
  });
  el.querySelector('#map-search').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q.length >= 2) { clearTimeout(timer); runSearch(q); }
  });
  if (params.get('cerca')) setTimeout(() => input.focus(), 300);

  // --- tempo (condiviso con la home)
  const commitWhen = () => {
    const d = selectedDate();
    setWhen(Math.abs(d - Date.now()) < 15 * 60000 ? null : d);
  };
  map.on('click', () => { closeSheet(); paintResults(''); });
  el.querySelector('#time-range').addEventListener('input', (e) => { minutes = Number(e.target.value); refresh(); });
  el.querySelector('#time-range').addEventListener('change', commitWhen);
  el.querySelectorAll('[data-day]').forEach((b) => b.addEventListener('click', () => { dayOffset = Number(b.dataset.day); refresh(); commitWhen(); }));
  el.querySelector('#map-now').addEventListener('click', () => {
    const p = romeParts(new Date());
    dayOffset = 0;
    minutes = Math.floor(p.minutesOfDay / 15) * 15;
    el.querySelector('#time-range').value = minutes;
    setWhen(null);
  });

  // --- varchi
  let gates = null;
  const gatesBtn = el.querySelector('#map-gates');
  gatesBtn.addEventListener('click', async () => {
    if (gates) { gates.remove(); gates = null; gatesBtn.setAttribute('aria-pressed', 'false'); return; }
    gatesBtn.setAttribute('aria-pressed', 'true');
    gates = L.layerGroup().addTo(map);
    for (const z of zones.filter((x) => x.gatesGeo)) {
      const fc = await fetch(z.gatesGeo).then((r) => (r.ok ? r.json() : null)).catch(() => null);
      if (disposed || !fc || !gates) continue;
      L.geoJSON(fc, {
        pointToLayer: (f, ll) => L.circleMarker(ll, { radius: 5, color: '#17131f', weight: 2, fillColor: z.type === 'lez' ? COLOR.lez : COLOR.pay, fillOpacity: 1 }),
        onEachFeature: (f, layer) => layer.bindTooltip(`Varco ${z.name}${f.properties?.nome || f.properties?.label ? `: ${f.properties.nome ?? f.properties.label}` : ''}`),
      }).addTo(gates);
    }
  });

  // --- posizione
  let me = null;
  el.querySelector('#map-locate').addEventListener('click', () => {
    if (!('geolocation' in navigator)) { msg.innerHTML = '<p class="notice">Posizione non disponibile su questo dispositivo.</p>'; return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (disposed) return;
        msg.innerHTML = '';
        const ll = [coords.latitude, coords.longitude];
        me?.remove();
        me = L.circleMarker(ll, { radius: 9, color: '#ffffff', weight: 3, fillColor: '#0a84ff', fillOpacity: 1 }).addTo(map);
        map.setView(ll, 15);
        openPlaceSheet({ lat: ll[0], lng: ll[1], label: 'Sei qui' });
      },
      () => { msg.innerHTML = '<p class="notice">Posizione non concessa. Puoi attivarla dalle impostazioni del browser.</p>'; },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });

  const off = onChange(() => {
    const w = getWhen();
    if (!w) {
      const p = romeParts(new Date());
      dayOffset = 0;
      minutes = Math.floor(p.minutesOfDay / 15) * 15;
      el.querySelector('#time-range').value = minutes;
    }
    refresh();
  });
  setTimeout(() => { if (!disposed) map.invalidateSize(); }, 0);
  return () => { disposed = true; off(); ctrl?.abort(); clearTimeout(timer); map.remove(); el.classList.remove('full'); };
}
