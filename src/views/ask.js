import { zones, fines, defaultExitNote } from '../data/rules.js';
import { answerQuestion } from '../engine/answer.js';
import { getVehicle } from '../state.js';
import { esc, sourcesHtml } from '../ui.js';

const VERDICT_TITLE = {
  si: 'Sì',
  no: 'No',
  pagamento: 'Sì, a pagamento',
  dipende: 'Dipende dal veicolo',
  info: 'Informazioni',
  chiarire: 'Mi serve un dettaglio',
};

// La conversazione resta finché l'app è aperta.
const history = [];

function suggestions(zoneId) {
  const z = zones.find((x) => x.id === zoneId);
  const name = z?.name ?? 'Area C';
  return [
    `Posso entrare in ${name} adesso?`,
    `${name} domani alle 8?`,
    `Posso entrare in ${zones.find((x) => x.type === 'ztl')?.name ?? 'ZTL Brera'} sabato alle 22?`,
    'Ho un diesel Euro 5, posso entrare in Area B?',
    'Quanto è la multa se entro senza permesso?',
  ];
}

async function ask(question) {
  const vehicle = getVehicle();
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    const r = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, vehicle }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (r.status === 400 || r.status === 429) {
      const { error } = await r.json();
      return { verdict: 'chiarire', text: error, sources: [], engine: 'regole' };
    }
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch {
    // offline o API non raggiungibile: lo stesso motore gira nel browser
    const res = answerQuestion(question, new Date(), { zones, fines, defaultExitNote, vehicle });
    return { ...res, engine: 'locale' };
  }
}

function botHtml(a) {
  const by = a.engine === 'claude' ? 'Calcolato dalle regole ufficiali, scritto da Claude' : 'Calcolato dalle regole ufficiali';
  const link = a.zoneId ? `<a href="#/zona/${esc(a.zoneId)}">Apri la scheda della zona</a>` : '';
  return `<div class="msg bot">
    <p class="verdict ${esc(a.verdict)}">${esc(VERDICT_TITLE[a.verdict] ?? '')}</p>
    <p>${esc(a.detail ?? a.text)}</p>
    ${link}
    ${sourcesHtml(a.sources?.slice(0, 2))}
    <p class="by">${by}${a.engine === 'locale' ? ' (senza connessione)' : ''}</p>
  </div>`;
}

export function render(el, params) {
  const zoneId = params.get('zona');
  el.innerHTML = `
    <div class="view-head">
      <span class="ai-badge">✦ Assistente ZTL</span>
      <h1>Chiedi</h1>
      <p class="muted">Scrivi zona, giorno e ora. Ti dico se puoi entrare e da quando.</p>
    </div>
    <div class="chat" id="chat" aria-live="polite"></div>
    <div class="suggest" id="suggest"></div>
    <form class="composer" id="composer">
      <label class="skip" for="q">La tua domanda</label>
      <input id="q" name="q" autocomplete="off" maxlength="500" placeholder="Es. posso entrare in Area C alle 18?" enterkeyhint="send" />
      <button class="btn" type="submit">Chiedi</button>
    </form>
    <p class="small muted" style="margin-top:12px">Le risposte si basano sulle regole pubblicate dal Comune di Milano e sono indicative. Prima di entrare fa fede la segnaletica sul posto e il sito del Comune.</p>`;

  const chat = el.querySelector('#chat');
  const input = el.querySelector('#q');
  const sug = el.querySelector('#suggest');

  const paint = () => {
    chat.innerHTML = history.map((m) => (m.role === 'user' ? `<p class="msg user">${esc(m.text)}</p>` : botHtml(m.answer))).join('');
    sug.innerHTML = history.length ? '' : suggestions(zoneId).map((s) => `<button type="button">${esc(s)}</button>`).join('');
    sug.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => send(b.textContent)));
  };

  let busy = false;
  async function send(text) {
    const q = text.trim();
    if (!q || busy) return;
    busy = true;
    history.push({ role: 'user', text: q });
    paint();
    chat.insertAdjacentHTML('beforeend', '<div class="msg bot" id="typing" aria-label="Sto calcolando"><span class="typing"><i></i><i></i><i></i></span></div>');
    const answer = await ask(q);
    history.push({ role: 'bot', answer });
    busy = false;
    paint();
    chat.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  el.querySelector('#composer').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = '';
    send(q);
  });
  paint();
}
