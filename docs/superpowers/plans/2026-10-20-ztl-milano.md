# ZTL Milano — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (native) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PWA mobile installabile che mostra Area C, Area B e tutte le ZTL di Milano su mappa, con orari, stato "adesso", multe, fonti ufficiali e un assistente che risponde a "posso entrare in zona X all'ora Y?".

**Architecture:** Un unico motore di regole puro in `src/engine/` (nessuna dipendenza da DOM) usato sia dal frontend (funziona offline) sia dalla funzione Vercel `api/ask.js`. I dati vengono solo da fonti ufficiali (Comune di Milano, AMAT, Open Data) e stanno in `src/data/rules.js`, ogni voce con il suo `sources`. La risposta "posso entrare?" è sempre calcolata dal motore (deterministica); Claude, se c'è `ANTHROPIC_API_KEY`, la riformula soltanto e non può cambiare i fatti.

**Tech Stack:** Vite 5 (vanilla JS ES modules), Leaflet 1.9.4 + tile OpenStreetMap, vite-plugin-pwa (manifest + service worker), Vitest 2 (unit), Playwright 1.48 (e2e su viewport mobile), Vercel (static + Node serverless function), @anthropic-ai/sdk (opzionale, server-side).

**Spec:** richiesta vocale di Alberto del 2026-10-20 (questa conversazione), riscritta in `docs/PROMPT.md`.

## Global Constraints

- Fonti: solo comune.milano.it, amat-mi.it, dati.comune.milano.it, normattiva/gazzettaufficiale. Ogni fatto mostrato ha un link alla fonte.
- Fuso orario: tutti i calcoli in `Europe/Rome`, a prescindere dal fuso del dispositivo o del server (Vercel gira in UTC).
- Giorni: 1 = lunedì … 7 = domenica.
- Lingua dell'interfaccia: italiano, frasi semplici, sentence case.
- Mobile first: funziona a 360px di larghezza, target touch ≥ 44px, installabile da Chrome (manifest + SW + icone 192/512 + maskable).
- Nessuna chiave nel client. `ANTHROPIC_API_KEY` solo come variabile d'ambiente Vercel; senza chiave l'app funziona al 100% col motore locale.
- Disclaimer sempre visibile nell'assistente: informazione indicativa, fa fede il Comune di Milano.

## Review Focus

1. Orari a cavallo dei limiti (19:30 esatte, 7:29, mezzanotte) → stato giusto e "prossimo cambio" giusto. Test in `status.test.js`.
2. Festivi (Natale, Pasqua/Pasquetta mobile, 7 dicembre Sant'Ambrogio) e weekend → zone a orario feriale risultano libere. Test in `holidays.test.js`.
3. Server in UTC vs utente in Italia, inclusi i giorni di cambio ora legale (ultima domenica di ottobre/marzo). Test in `time.test.js`.
4. Domande scritte male o senza zona/ora ("posso entrare a brera stasera?", "area c domani alle 8", "sarpi"), o con zona sconosciuta → risposta utile o richiesta di chiarimento, mai crash. Test in `parse.test.js`.
5. Rete assente / GeoJSON non caricato / API in errore → la mappa mostra un messaggio e l'assistente ricade sul motore locale. Test e2e `offline.spec.js`.

---

### Task 1: Tempo e festivi (`src/engine/time.js`, `src/engine/holidays.js`)

**Interfaces — Produces:**
- `romeParts(date: Date) -> { year, month, day, weekday(1-7), hour, minute, minutesOfDay }`
- `romeDate(year, month, day, hour, minute) -> Date` (istante UTC corrispondente all'ora di Roma)
- `isItalianHoliday(year, month, day) -> string|null` (nome del festivo, include 7/12 Sant'Ambrogio)
- `easterSunday(year) -> {month, day}`

- [ ] Test: `romeParts(new Date('2026-10-20T05:30:00Z')).hour === 7`; `romeParts(new Date('2026-07-01T17:30:00Z')).minutesOfDay === 19*60+30`; dopo il cambio ora 2026-10-25 `romeParts(new Date('2026-10-26T06:30:00Z')).hour === 7`.
- [ ] Test: `easterSunday(2026)` = 5 aprile; `isItalianHoliday(2026,4,6)` = 'Lunedì dell\'Angelo'; `isItalianHoliday(2026,12,7)` = 'Sant\'Ambrogio'; `isItalianHoliday(2026,10,20)` = null.
- [ ] Implementazione con `Intl.DateTimeFormat('it-IT',{timeZone:'Europe/Rome'}).formatToParts`; Pasqua con l'algoritmo di Meeus.
- [ ] `npx vitest run` → PASS. Commit.

### Task 2: Stato zona (`src/engine/status.js`)

**Interfaces — Consumes:** Task 1. **Produces:**
- `isActiveAt(zone, date) -> boolean`
- `zoneStatus(zone, date) -> { active: boolean, reason: string, nextChange: Date|null, todayWindows: [{from,to}] }`
- `nextFreeWindow(zone, date) -> { from: Date, to: Date|null }`

Le regole di `zone.schedule` sono `{days:[1..7], from:'HH:MM', to:'HH:MM'}`, `zone.alwaysActive` per le zone 24/7, `zone.holidaysOff: true` se il festivo spegne la zona, `zone.periodsOff` per periodi (es. agosto) se la fonte li riporta.

- [ ] Test con zona fittizia lun-ven 7:30-19:30: martedì 7:29 → non attiva, `nextChange` = 7:30 stesso giorno; 7:30 → attiva; 19:30 → non attiva; venerdì 20:00 → `nextChange` = lunedì 7:30; 25/12 ore 10 → non attiva con `reason` che nomina Natale.
- [ ] Test zona 24/7: sempre attiva, `nextChange` null.
- [ ] Implementazione: scansione a passi di giorno fino a 14 giorni avanti per trovare il prossimo cambio.
- [ ] PASS. Commit.

### Task 3: Domande in linguaggio naturale (`src/engine/parse.js`, `src/engine/answer.js`)

**Interfaces — Produces:**
- `parseQuestion(text: string, now: Date, zones) -> { zoneId|null, when: Date, whenExplicit: boolean, intent: 'enter'|'hours'|'fine'|'unknown' }`
- `answerQuestion(text: string, now: Date, ctx:{zones, vehicle?}) -> { ok: boolean, zoneId, verdict: 'si'|'no'|'pagamento'|'dipende'|'chiarire', text: string, facts: object, sources: string[] }`

Riconosce: nomi e alias delle zone (in `rules.js`, campo `aliases`), "adesso/ora", "oggi/domani/dopodomani/stasera(20:00)/stamattina(9:00)", giorni della settimana (prossimo), "alle 18", "18:30", "18.30", "ore 9", date "25/12".

- [ ] Test: "posso entrare in area c alle 18?" (now mar 10:00) → zone 'area-c', ora 18:00 oggi, verdict 'pagamento'; "e a brera alle 21 di sabato?" → 'brera', sabato 21:00; "sarpi" → intent 'hours'; "posso entrare in zona pippo?" → verdict 'chiarire'; stringa vuota → 'chiarire'.
- [ ] Il testo della risposta dice sempre: se puoi entrare a quell'ora, da che ora a che ora è attiva, quando puoi entrare liberamente la prossima volta, e la fonte.
- [ ] PASS. Commit.

### Task 4: Dati ufficiali (`src/data/rules.js`, `public/geo/*.geojson`)

- [ ] Trasformare `research/rules.json` nel formato delle zone di Task 2 (+ `aliases`, `color`, `summary`, `howToPay`, `exceptions`, `sources`).
- [ ] Scaricare i GeoJSON ufficiali dall'Open Data, semplificarli se > 1 MB, salvarli in `public/geo/`.
- [ ] Test `data.test.js`: ogni zona ha `id`, `name`, `sources` non vuoto e tutti gli URL sono su domini ufficiali; ogni orario è `HH:MM` valido.
- [ ] Commit.

### Task 5: API (`api/ask.js`)

**Consumes:** `answerQuestion`. **Produces:** `POST /api/ask {question, vehicle?} -> {verdict, text, zoneId, sources, engine:'regole'|'claude'}`.
- [ ] Senza chiave: risponde col motore. Con chiave: chiama Claude (prompt di sistema strutturato in `api/prompt.js`) passando il risultato del motore come fatti immutabili; se Claude fallisce o va in timeout (8 s) → risposta del motore.
- [ ] Validazione: domanda mancante o > 500 caratteri → 400 con messaggio. Metodo ≠ POST → 405.
- [ ] Test `api.test.js` con req/res finti. Commit.

### Task 6: Frontend PWA (`index.html`, `src/main.js`, `src/views/*.js`, `src/styles.css`, `vite.config.js`)

- [ ] Tab bar: Mappa · Zone · Chiedi · Multe · Fonti. Hash routing (`#/mappa` …).
- [ ] Mappa: Leaflet, poligoni colorati per zona, tap → foglio dal basso con disco-stato e orari; pulsante "dove sono" (geolocalizzazione, opzionale, nessun dato inviato).
- [ ] Zone: elenco con stato live (aggiornato ogni 30 s), dettaglio zona.
- [ ] Chiedi: chat; prima prova `/api/ask`, se fallisce usa il motore locale; suggerimenti rapidi.
- [ ] Multe e Fonti: contenuti da `rules.js`.
- [ ] Manifest, icone, service worker (precache app shell + GeoJSON; tile OSM in cache runtime limitata).
- [ ] Commit.

### Task 7: Test e2e, revisione, deploy

- [ ] Playwright su viewport Pixel 7: navigazione tab, mappa con poligoni, domanda all'assistente, installabilità (manifest valido, SW registrato), modalità offline.
- [ ] Revisione multi-agente (bug, accessibilità/mobile, correttezza dei dati vs fonti) e correzione.
- [ ] Repo GitHub `AlbyFuera/ztl-milano`, deploy Vercel produzione, test e2e ripetuti sull'URL pubblico.

## Aggiornamento UX (richiesta di Alberto, 2026-10-20)

Ogni sezione risponde a un bisogno diverso (jobs-to-be-done):

| Bisogno | Sezione (tab) | Funzione distintiva |
|---|---|---|
| "Posso entrare adesso?" | Adesso (home) | Stato live di tutte le zone + countdown; geolocalizzazione: in che zona sei / quale è vicina |
| "Domani alle 8 devo andare in centro" | Mappa | Perimetri ufficiali + slider del tempo (giorno/ora) che accende/spegne le zone |
| Domanda precisa | Chiedi | Assistente: verdetto + orari + prossimo cambio + fonte |
| "La mia auto può entrare?" | Veicolo | Profilo veicolo salvato sul dispositivo; esito per zona oggi e divieti futuri con data |
| "Mi è arrivata una multa" | Multe | Calcolatore: importo ridotto/ordinario, scadenze di pagamento e ricorso dalla data di notifica |

Scheda zona `#/zona/:id`: orari, come pagare, deroghe, uscita, fonti. Fonti raggiungibili dall'header.
Il profilo veicolo è usato anche da Adesso, Mappa e Chiedi (una sola fonte di verità in `src/state.js`).
