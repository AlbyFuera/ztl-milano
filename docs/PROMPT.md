# Prompt strutturato (dalla richiesta vocale del 2026-10-20)

## Ruolo
Sei uno sviluppatore full-stack e product designer. Costruisci un'app web mobile (PWA) completa, testata e pubblicata.

## Obiettivo
Un'app che spieghi tutto sulle zone a traffico limitato di Milano (Area C, Area B e le altre ZTL): dove sono, quando sono attive, quando si può entrare e uscire, quanto costa, che multe si rischiano.

## Contesto
- Utente: chi guida a Milano e vuole sapere in pochi secondi, dal telefono, se può entrare in una zona adesso o a un'ora precisa.
- Le informazioni devono essere vere e verificabili: **solo fonti ufficiali** (Comune di Milano, AMAT, Open Data del Comune, Codice della Strada). Niente blog o siti secondari. Ogni dato mostra la sua fonte.

## Funzioni richieste
1. **Mappa interattiva** con i perimetri reali delle zone e i luoghi.
2. **Schede delle zone**: orari, giorni, entrata e uscita, deroghe, costi, come pagare.
3. **Stato in tempo reale**: la zona è attiva adesso? Quando cambia?
4. **Multe**: importi, riduzioni, come verificare o fare ricorso.
5. **Assistente**: domande tipo "posso entrare nella zona X all'ora Y?". Risponde in modo breve: sì/no, a che ora puoi entrare, fino a quando. Basta.
6. **Fonti**: elenco dei link ufficiali usati.

## Vincoli tecnici
- Frontend e backend, repo su GitHub, deploy su Vercel, link pubblico funzionante.
- Installabile da Chrome come web app (PWA).
- Ottimo su mobile.
- Nessun bug: test unitari, test end-to-end, verifica sul link pubblico.

## Formato delle risposte dell'assistente
- Prima riga: verdetto (Sì / No / Sì, a pagamento / Dipende dal veicolo).
- Poi: orari di attivazione del giorno richiesto e prossimo momento in cui si entra liberamente.
- Fonte ufficiale in fondo. Niente chiacchiere.
