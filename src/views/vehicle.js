import { zones, vehicleNotes } from '../data/rules.js';
import { vehicleCheck } from '../engine/answer.js';
import { getVehicle, setVehicle } from '../state.js';
import { esc, sourcesHtml } from '../ui.js';

const FUELS = [
  ['benzina', 'Benzina'],
  ['diesel', 'Diesel'],
  ['gpl', 'GPL'],
  ['metano', 'Metano'],
  ['ibrido', 'Ibrido'],
  ['elettrico', 'Elettrico'],
];

const fmtDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' });
const todayIso = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });

function resultFor(zone, v) {
  const now = new Date();
  const { result, ban } = vehicleCheck(zone, v, now);
  if (result === 'banned') return { cls: 'on', label: 'Non puoi entrare', detail: `Quando la zona è attiva. Divieto: ${ban.label}.` };
  if (result === 'unknown') return { cls: 'paid', label: 'Indica la classe Euro', detail: 'Serve la classe Euro per verificare i divieti.' };
  if (zone.type === 'congestion') {
    const free = zone.freeFor?.includes(v.fuel);
    return { cls: free ? 'off' : 'paid', label: free ? 'Puoi entrare, gratis' : 'Puoi entrare, a pagamento', detail: free ? zone.freeNote ?? '' : 'Quando la zona è attiva serve il ticket.' };
  }
  return { cls: 'off', label: 'Puoi entrare', detail: 'Il tuo veicolo non rientra nei divieti in vigore oggi.' };
}

function futureBans(v) {
  const today = todayIso();
  const items = [];
  for (const z of zones) {
    for (const b of z.vehicleBans ?? []) {
      if (!b.since || b.since <= today) continue;
      const hits = v && b.fuel.includes(v.fuel) && (b.maxEuro == null || (v.euro != null && v.euro <= b.maxEuro));
      items.push({ date: b.since, zone: z.name, label: b.label, hits });
    }
  }
  return items.sort((a, b) => a.date.localeCompare(b.date));
}

export function render(el) {
  const draw = () => {
    const v = getVehicle();
    const affected = zones.filter((z) => z.vehicleBans?.length || z.type === 'congestion');
    const future = futureBans(v);
    el.innerHTML = `
      <div class="view-head">
        <h1>Il mio veicolo</h1>
        <p class="muted">Dimmi che auto hai: ti dico dove puoi entrare oggi e quali divieti arrivano. Resta salvato solo su questo telefono.</p>
      </div>
      <form class="card" id="vform">
        <fieldset class="field">
          <legend>Alimentazione</legend>
          <div class="seg">${FUELS.map(([k, l]) => `<label><input type="radio" name="fuel" value="${k}" ${v?.fuel === k ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>
        </fieldset>
        <div class="field">
          <label for="euro">Classe Euro (la trovi sul libretto, voce V.9)</label>
          <select id="euro" name="euro">
            <option value="">Non la so</option>
            ${[0, 1, 2, 3, 4, 5, 6].map((n) => `<option value="${n}" ${v?.euro === n ? 'selected' : ''}>Euro ${n}</option>`).join('')}
          </select>
        </div>
        <div class="btn-row">
          <button class="btn" type="submit">Salva veicolo</button>
          ${v ? '<button class="btn ghost" type="button" id="vclear">Cancella</button>' : ''}
        </div>
        <p class="small muted" id="vsaved" role="status"></p>
      </form>

      ${
        v
          ? `<section class="section"><h2>Dove puoi entrare oggi</h2>
            <ul class="zone-list">${affected
              .map((z) => {
                const r = resultFor(z, v);
                return `<li><a class="zone-row" href="#/zona/${esc(z.id)}"><span class="meta"><span class="name">${esc(z.name)}</span><br><span class="state">${esc(r.detail)}</span></span><span class="pill ${r.cls}">${esc(r.label)}</span></a></li>`;
              })
              .join('')}
              <li><div class="zone-row"><span class="meta"><span class="name">Altre ZTL</span><br><span class="state">Quando sono attive entrano solo i veicoli autorizzati, qualunque sia l'alimentazione.</span></span></div></li>
            </ul></section>`
          : ''
      }

      <section class="section">
        <h2>Divieti in arrivo</h2>
        ${
          future.length
            ? `<ol class="timeline">${future
                .map((f) => `<li class="${f.hits ? 'alert' : ''}"><p class="date">Dal ${esc(fmtDate(f.date))}</p><p>${esc(f.zone)}: ${esc(f.label)}.</p>${f.hits ? '<p class="small" style="color:var(--red);font-weight:600">Riguarda il tuo veicolo.</p>' : ''}</li>`)
                .join('')}</ol>`
            : '<p class="muted">Nessun nuovo divieto annunciato dal Comune nelle fonti consultate.</p>'
        }
      </section>
      ${vehicleNotes?.length ? `<section class="section"><h2>Da sapere</h2><ul class="clean">${vehicleNotes.map((n) => `<li>${esc(n.text)}</li>`).join('')}</ul>${sourcesHtml([...new Set(vehicleNotes.flatMap((n) => n.sources ?? []))])}</section>` : ''}`;

    el.querySelector('#vform').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const fuel = fd.get('fuel');
      if (!fuel) { el.querySelector('#vsaved').textContent = 'Scegli l\'alimentazione.'; return; }
      const euroRaw = fd.get('euro');
      setVehicle({ fuel, euro: euroRaw === '' ? null : Number(euroRaw) });
      draw();
      el.querySelector('#vsaved').textContent = 'Veicolo salvato. Lo uso anche nell\'assistente.';
    });
    el.querySelector('#vclear')?.addEventListener('click', () => { setVehicle(null); draw(); });
  };
  draw();
}
