import './styles.css';
import { registerSW } from 'virtual:pwa-register';
import { formatTime } from './engine/format.js';
import * as now from './views/now.js';
import * as map from './views/map.js';
import * as ask from './views/ask.js';
import * as vehicle from './views/vehicle.js';
import * as fines from './views/fines.js';
import * as zone from './views/zone.js';
import * as sources from './views/sources.js';

const ROUTES = {
  adesso: { view: now, title: 'Adesso' },
  mappa: { view: map, title: 'Mappa' },
  chiedi: { view: ask, title: 'Chiedi' },
  veicolo: { view: vehicle, title: 'Il mio veicolo' },
  multe: { view: fines, title: 'Multe' },
  zona: { view: zone, title: 'Zona', tab: 'adesso' },
  fonti: { view: sources, title: 'Fonti', tab: null },
};

const main = document.getElementById('view');
let cleanup = null;

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  const [name, id] = path.split('/');
  return { name: ROUTES[name] ? name : 'adesso', id: id ? decodeURIComponent(id) : null, params: new URLSearchParams(query) };
}

function route() {
  const { name, id, params } = parseHash();
  const r = ROUTES[name];
  cleanup?.();
  main.className = '';
  main.innerHTML = '';
  cleanup = r.view.render(main, params, id) ?? null;
  const tab = r.tab === undefined ? name : r.tab;
  document.querySelectorAll('.tabbar a').forEach((a) => {
    if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = `${r.title} · ZTL Milano`;
  window.scrollTo(0, 0);
  if (location.hash && document.activeElement?.closest('.tabbar, .topbar')) main.focus({ preventScroll: true });
}

function tick() {
  const el = document.getElementById('clock');
  const t = new Date();
  el.textContent = formatTime(t);
  el.dateTime = t.toISOString();
}

window.addEventListener('hashchange', route);
route();
tick();
setInterval(tick, 15000);

registerSW({ immediate: true });
