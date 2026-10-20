import { answerQuestion } from '../src/engine/answer.js';
import { zones, fines, defaultExitNote } from '../src/data/rules.js';

const FUELS = new Set(['benzina', 'diesel', 'gpl', 'metano', 'ibrido', 'elettrico']);
const MAX_QUESTION = 500;

export function sanitizeVehicle(v) {
  if (!v || typeof v !== 'object' || !FUELS.has(v.fuel)) return null;
  const euro = Number.isInteger(v.euro) && v.euro >= 0 && v.euro <= 6 ? v.euro : null;
  const euro6 = euro === 6 && (v.euro6 === 'abc' || v.euro6 === 'd') ? v.euro6 : null;
  return { fuel: v.fuel, euro, euro6 };
}

function parseBody(body) {
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch { return null; }
  }
  return body ?? null;
}

// Limite semplice per istanza (best effort su serverless): protegge il costo delle chiamate a Claude.
function makeLimiter({ max, windowMs }) {
  const hits = new Map();
  return (key, t) => {
    const list = (hits.get(key) ?? []).filter((x) => t - x < windowMs);
    list.push(t);
    hits.set(key, list);
    if (hits.size > 5000) hits.clear();
    return list.length <= max;
  };
}

export function createHandler({ now = () => new Date(), askClaude = null, rateLimit = { max: 30, windowMs: 60000 } } = {}) {
  const allow = makeLimiter(rateLimit);

  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Usa una richiesta POST.' });
    }
    const ip = String(req.headers?.['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'anon').split(',')[0].trim();
    if (!allow(ip, Date.now())) {
      return res.status(429).json({ error: 'Troppe domande in poco tempo. Riprova tra un minuto.' });
    }

    const body = parseBody(req.body);
    const question = typeof body?.question === 'string' ? body.question.trim() : '';
    if (!question) return res.status(400).json({ error: 'Manca la domanda.' });
    if (question.length > MAX_QUESTION) {
      return res.status(400).json({ error: `La domanda è troppo lunga (massimo ${MAX_QUESTION} caratteri).` });
    }

    const result = answerQuestion(question, now(), { zones, fines, defaultExitNote, vehicle: sanitizeVehicle(body.vehicle) });
    const payload = {
      verdict: result.verdict,
      zoneId: result.zoneId,
      zoneName: result.zoneName ?? null,
      text: result.text,
      detail: result.detail ?? result.text,
      ruleText: result.text,
      sources: result.sources,
      engine: 'regole',
    };

    if (askClaude && result.verdict !== 'chiarire') {
      try {
        const text = await askClaude(question, result);
        if (text && text.trim()) Object.assign(payload, { text: text.trim(), detail: text.trim(), engine: 'claude' });
      } catch {
        // Claude non disponibile: resta la risposta del motore, che è già completa.
      }
    }
    return res.status(200).json(payload);
  };
}
