// Selettore del momento ("adesso ▾"): foglio dal basso con scelte rapide e data/ora libera.
import { romeParts, romeDate, addDaysRome } from './engine/time.js';
import { formatTime, TZ_SHORT } from './engine/format.js';
import { getWhen, setWhen } from './state.js';
import { esc } from './ui.js';

// Etichetta corta per il selettore: "adesso", "oggi 21:00", "domani 08:00", "sab 24 ott, 12:00".
export function whenLabel() {
  const w = getWhen();
  if (!w) return 'adesso';
  const p = romeParts(w);
  const t = romeParts(new Date());
  const key = (x) => `${x.year}-${x.month}-${x.day}`;
  if (key(p) === key(t)) return `oggi ${formatTime(w)}`;
  if (key(p) === key(addDaysRome(t, 1))) return `domani ${formatTime(w)}`;
  return `${TZ_SHORT.format(w).replace('.', '')}, ${formatTime(w)}`;
}

function quickOptions() {
  const now = new Date();
  const p = romeParts(now);
  const at = (ymd, h, m = 0) => romeDate(ymd.year, ymd.month, ymd.day, h, m);
  const tomorrow = addDaysRome(p, 1);
  const daysToSat = (6 - p.weekday + 7) % 7 || 7;
  const sat = addDaysRome(p, daysToSat);
  const opts = [
    ['Adesso', null],
    ['Tra un\'ora', new Date(now.getTime() + 3600000)],
    p.hour < 20 ? ['Stasera alle 21', at(p, 21)] : ['Stanotte all\'1', at(tomorrow, 1)],
    ['Domani alle 8', at(tomorrow, 8)],
    ['Domani alle 18', at(tomorrow, 18)],
    ['Sabato alle 12', at(sat, 12)],
  ];
  return opts;
}

const toLocalInput = (d) => {
  const p = romeParts(d);
  const pad = (n) => String(n).padStart(2, '0');
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
};

export function openWhenPicker(onDone) {
  document.getElementById('when-dialog')?.remove();
  const dlg = document.createElement('dialog');
  dlg.id = 'when-dialog';
  dlg.className = 'bottom-sheet';
  const current = getWhen() ?? new Date();
  dlg.innerHTML = `
    <form method="dialog" class="sheet-body">
      <div class="grab" aria-hidden="true"></div>
      <h2>Quando vuoi entrare?</h2>
      <div class="quick">${quickOptions()
        .map(([label, d], i) => `<button type="button" class="chip" data-i="${i}">${esc(label)}</button>`)
        .join('')}</div>
      <div class="field">
        <label for="when-input">Oppure scegli giorno e ora</label>
        <input id="when-input" type="datetime-local" value="${toLocalInput(current)}" step="300" />
      </div>
      <div class="btn-row">
        <button type="button" class="btn" id="when-ok">Conferma</button>
        <button type="button" class="btn ghost" id="when-cancel">Annulla</button>
      </div>
    </form>`;
  document.body.appendChild(dlg);
  const opts = quickOptions();
  const close = (value) => {
    if (value !== undefined) setWhen(value);
    dlg.close();
    dlg.remove();
    onDone?.();
  };
  dlg.querySelectorAll('[data-i]').forEach((b) => b.addEventListener('click', () => close(opts[Number(b.dataset.i)][1])));
  dlg.querySelector('#when-ok').addEventListener('click', () => {
    const v = dlg.querySelector('#when-input').value;
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    close(m ? romeDate(+m[1], +m[2], +m[3], +m[4], +m[5]) : undefined);
  });
  dlg.querySelector('#when-cancel').addEventListener('click', () => close(undefined));
  dlg.addEventListener('cancel', () => { dlg.remove(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(undefined); });
  dlg.showModal();
}
