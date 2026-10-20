# ZTL Milano

Web app (PWA) per sapere **se puoi entrare** in Area C, Area B e nelle ZTL di Milano: adesso o a un'ora scelta, con il tuo veicolo.

- **Adesso**: verdetto personale a frase ("Puoi entrare · adesso · con la tua auto"), conto alla rovescia, posizione GPS, i miei posti.
- **Mappa**: perimetri ufficiali colorati per il tuo veicolo, slider del tempo, ricerca indirizzi, varchi.
- **Chiedi**: assistente che risponde a "posso entrare in X alle Y?" (motore di regole deterministico; Claude opzionale per riformulare).
- **Veicolo**: alimentazione, classe Euro (con sottoclassi Euro 6), permessi; divieti in arrivo.
- **Multe**: importi e scadenze dalla data di notifica.

## Dati
Solo fonti ufficiali: Comune di Milano, portali Area B/Area C, Open Data Comune di Milano, Normattiva.
I dati si rigenerano con `python3 -I scripts/build_data.py` (input in `research/`).

## Sviluppo
```bash
npm install
npm run dev        # sviluppo
npm test           # test unitari (Vitest)
npm run test:e2e   # test end-to-end (Playwright, telefono emulato)
```
Variabile opzionale su Vercel: `ANTHROPIC_API_KEY` (senza, l'assistente usa solo il motore di regole).

App non ufficiale, a scopo informativo: fa fede la segnaletica e il sito del Comune di Milano.
