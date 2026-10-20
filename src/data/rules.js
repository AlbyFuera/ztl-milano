// FILE GENERATO da scripts/build_data.py: non modificarlo a mano.
// Fonti: Comune di Milano, portali Area B/Area C, Open Data Comune di Milano, Normattiva.
export const provisional = false;
export const updated = "20 ottobre 2026";
export const defaultExitNote = "I varchi elettronici controllano le targhe dei veicoli che entrano nella zona.";
export const zones = [
  {
    "id": "area-c",
    "name": "Area C",
    "short": "C",
    "type": "congestion",
    "featured": true,
    "verified": true,
    "aliases": [
      "area c",
      "areac",
      "zona c",
      "cerchia dei bastioni",
      "bastioni",
      "centro storico",
      "ztl centro"
    ],
    "schedule": [
      {
        "days": [
          1,
          2,
          3,
          4,
          5
        ],
        "from": "07:30",
        "to": "19:30"
      }
    ],
    "holidaysOff": true,
    "summary": "Il centro di Milano dentro la Cerchia dei Bastioni. Nei giorni feriali si entra pagando un ticket giornaliero; alcuni veicoli non possono entrare.",
    "scheduleNotes": [
      "Attiva tutto l'anno, anche ad agosto, dal lunedì al venerdì; non attiva sabato, domenica e festivi.",
      "Veicoli per trasporto merci: vietati dalle 8:00 alle 10:00 senza deroga."
    ],
    "cost": "7,50 € al giorno. Residenti: 50 ingressi gratis all'anno, poi 3 €. Veicoli di servizio e auto parcheggiate in autorimesse convenzionate: 4,50 €.",
    "paymentShort": "Devi attivare il ticket da 7,50 € entro le 24:00 del giorno dopo (online, app, parcometri, tabaccherie, Telepass).",
    "payment": "Attiva il ticket da 7,50 € entro le 24:00 del giorno dopo l'ingresso: online su areac.atm-mi.it, parcometri, tabaccherie e punti SISAL, bancomat Intesa Sanpaolo, Telepass, UnipolMove, PayPal o al telefono 02 4868 4001. Se ti dimentichi: ticket da 22,50 € entro 7 giorni, solo da MyAreaC.",
    "exitNote": "Le telecamere leggono solo le targhe in entrata: all'uscita non paghi nulla. Se il tuo veicolo è vietato, però, non può nemmeno circolare dentro l'area.",
    "gates": "43 varchi con telecamera (6 riservati ai mezzi pubblici, 1 ai soli autorizzati).",
    "freeFor": [
      "elettrico"
    ],
    "freeNote": "Entrano gratis i veicoli elettrici, le auto ibride con CO2 fino a 100 g/km, le moto non vietate e chi ha il contrassegno disabili (con targa registrata).",
    "fuelNotes": {
      "ibrido": "Se la tua auto ibrida emette fino a 100 g/km di CO2 (voce V.7 del libretto) entri gratis."
    },
    "permitNotes": {
      "residente": {
        "verdict": "pagamento",
        "text": "Da residente in Area C hai 50 ingressi gratis all'anno (con registrazione), poi paghi 3 € invece di 7,50 €."
      },
      "cude": {
        "verdict": "dipende",
        "text": "Con il contrassegno disabili (CUDE), il titolare a bordo e la targa registrata entri senza pagare."
      }
    },
    "uncertainFuels": [
      "gpl",
      "metano"
    ],
    "vehicleBans": [
      {
        "fuel": [
          "benzina"
        ],
        "maxEuro": 2,
        "since": null,
        "label": "Benzina Euro 0, 1 e 2"
      },
      {
        "fuel": [
          "diesel"
        ],
        "maxEuro": 5,
        "since": null,
        "label": "Diesel da Euro 0 a Euro 5, con o senza filtro"
      },
      {
        "fuel": [
          "benzina"
        ],
        "maxEuro": 3,
        "since": "2024-10-01",
        "label": "Benzina Euro 3"
      },
      {
        "fuel": [
          "benzina"
        ],
        "maxEuro": 4,
        "since": "2027-10-01",
        "label": "Benzina Euro 4"
      },
      {
        "fuel": [
          "diesel"
        ],
        "euro6": "abc",
        "since": "2028-10-01",
        "label": "Diesel Euro 6 A, B e C"
      },
      {
        "fuel": [
          "diesel"
        ],
        "euro6": "d",
        "since": "2029-10-01",
        "label": "Diesel Euro 6 D-TEMP e D"
      },
      {
        "fuel": [
          "benzina"
        ],
        "maxEuro": 5,
        "since": "2030-10-01",
        "label": "Benzina Euro 5"
      }
    ],
    "exceptions": [
      "Ingresso gratuito: veicoli elettrici; auto ibride con CO2 fino a 100 g/km; moto e ciclomotori non vietati.",
      "Contrassegno disabili (CUDE) con titolare a bordo e targa registrata: esenzioni e deroghe.",
      "Veicoli storici con almeno 40 anni e certificato di rilevanza storica: derogati dal divieto e dal pagamento.",
      "Taxi e NCC fino a 9 posti: esenti.",
      "Deroghe per motivi di salute, operatori sociali e sanitari, farmaci urgenti."
    ],
    "notes": [
      "Vietati i veicoli lunghi più di 7,5 metri (deroga su richiesta).",
      "I residenti hanno un calendario dei divieti diverso, con scadenze più lunghe: controlla la pagina del Comune.",
      "Divieti per le moto rinviati al 1° ottobre 2027 (Ordinanza 373/2026)."
    ],
    "geo": "/geo/area-c.geojson",
    "sources": [
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/argomenti/mobilita/area-c"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/argomenti/mobilita/area-c-calendario-dei-divieti"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/servizi/mobilita/area-c-acquista-il-ticket"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/servizi/mobilita/area-c-attiva-il-ticket"
      },
      {
        "title": "Comune di Milano (PDF)",
        "url": "https://www.comune.milano.it/documents/20118/35188/Area+C+nuove+tariffe+dal+2023+Area+C.pdf/5ee21a73-7301-60c7-d2fe-5e2f77e8a158?version=1.0&t=1746021538283&download=true"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/servizi/mobilita/area-c-agevolazioni-per-residenti-ed-equiparati"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/servizi/mobilita/area-c-agevolazioni-per-imprese-con-veicoli-di-servizio"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/servizi/mobilita/area-c-deroga-per-trasporto-merci-8-00-10-00"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/servizi/mobilita/area-c-deroghe-per-veicoli-superiori-a-7-5-metri"
      },
      {
        "title": "Portale Area C",
        "url": "https://areac.atm-mi.it/Areac/IWeb/FAQ2.aspx"
      },
      {
        "title": "Portale Area C",
        "url": "https://areac.atm-mi.it/Areac/IWeb/English.aspx"
      },
      {
        "title": "Comune di Milano (PDF)",
        "url": "https://www.comune.milano.it/documents/d/guest/ordinanza-n-373-del-17022026-pdf?download=true"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "gatesGeo": "/geo/varchi-area-c.geojson"
  },
  {
    "id": "area-b",
    "name": "Area B",
    "short": "B",
    "type": "lez",
    "featured": true,
    "verified": true,
    "aliases": [
      "area b",
      "areab",
      "zona b",
      "milano",
      "tutta milano"
    ],
    "schedule": [
      {
        "days": [
          1,
          2,
          3,
          4,
          5
        ],
        "from": "07:30",
        "to": "19:30"
      }
    ],
    "holidaysOff": true,
    "summary": "La zona a basse emissioni che copre quasi tutta Milano. È gratis: nei giorni feriali vieta l'ingresso ai veicoli più inquinanti.",
    "scheduleNotes": [
      "Dal lunedì al venerdì, festivi esclusi.",
      "Con un veicolo vietato puoi entrare prima delle 7:30, ma dalle 7:30 alle 19:30 non puoi circolare né dentro né verso l'uscita.",
      "Veicoli con merci pericolose: vietati 24 ore su 24, tutti i giorni."
    ],
    "cost": "Gratis per i veicoli ammessi.",
    "exitNote": "Le telecamere leggono le targhe in entrata, ma un veicolo vietato non può circolare all'interno né verso l'esterno dalle 7:30 alle 19:30.",
    "gates": "186 varchi d'accesso.",
    "uncertainFuels": [
      "gpl",
      "metano"
    ],
    "permitNotes": {
      "cude": {
        "verdict": "dipende",
        "text": "Con il contrassegno disabili rilasciato dal Comune di Milano e il titolare a bordo entri anche con un veicolo vietato; se è rilasciato da un altro Comune serve la registrazione."
      }
    },
    "vehicleBans": [
      {
        "fuel": [
          "benzina"
        ],
        "maxEuro": 2,
        "since": null,
        "label": "Benzina Euro 0, 1 e 2"
      },
      {
        "fuel": [
          "diesel"
        ],
        "maxEuro": 5,
        "since": null,
        "label": "Diesel da Euro 0 a Euro 5"
      },
      {
        "fuel": [
          "benzina"
        ],
        "maxEuro": 3,
        "since": "2025-10-01",
        "label": "Benzina Euro 3"
      },
      {
        "fuel": [
          "benzina"
        ],
        "maxEuro": 4,
        "since": "2028-10-01",
        "label": "Benzina Euro 4"
      },
      {
        "fuel": [
          "diesel"
        ],
        "euro6": "abc",
        "since": "2028-10-01",
        "label": "Diesel Euro 6 A, B e C"
      },
      {
        "fuel": [
          "diesel"
        ],
        "euro6": "d",
        "since": "2030-10-01",
        "label": "Diesel Euro 6 D-TEMP e D"
      }
    ],
    "exceptions": [
      "Auto ibride ed elettriche entrano sempre.",
      "Primo anno di divieto: 50 giornate di accesso in deroga, senza registrazione.",
      "Dal secondo anno (regole dal 1° ottobre 2026): 5 giornate all'anno automatiche per ogni veicolo, più 20 per residenti e imprese di Milano con targa registrata.",
      "Move-In (Regione Lombardia): in alternativa alle deroghe, un tetto di chilometri all'anno monitorato da una scatola a bordo.",
      "Diesel Euro 5 con abbonamento ai parcheggi di interscambio Lampugnano, Forlanini o Rogoredo: deroga.",
      "Veicoli storici con almeno 40 anni e certificato: derogati; tra 20 e 40 anni: 25 giornate all'anno.",
      "Contrassegno disabili del Comune di Milano con titolare a bordo: ingresso senza registrazione."
    ],
    "notes": [
      "Il 1° ottobre 2026 non è scattato nessun nuovo divieto: sono cambiate le giornate di deroga.",
      "Vietati i veicoli e complessi più lunghi di 12 metri (non vale per il trasporto persone).",
      "La classe Euro è sul libretto alla voce V.9.",
      "Puoi vedere online le foto delle infrazioni di Area B fino a 180 giorni."
    ],
    "geo": "/geo/area-b.geojson",
    "sources": [
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/argomenti/mobilita/area-b"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/argomenti/mobilita/area-b-calendario-dei-divieti"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/servizi/mobilita/area-b-richiesta-deroghe-e-permessi"
      },
      {
        "title": "Portale Area B",
        "url": "https://areab.atm.it/it-IT/Web/FAQ"
      },
      {
        "title": "Comune di Milano (PDF)",
        "url": "https://www.comune.milano.it/documents/20118/808719/Area+B_volantino+25_5.pdf/aa35b5f0-e692-32b5-e3e7-265bf758e61b?version=1.2&t=1790773122597&download=true"
      },
      {
        "title": "Comune di Milano (PDF)",
        "url": "https://www.comune.milano.it/documents/d/guest/prot__28-09-2026_0543731_i-file-primario-ordinanza_area_b_ffo__dgc_1182_del_17-09-2026_signed_signed_timbrato?download=true"
      },
      {
        "title": "Comune di Milano (PDF)",
        "url": "https://www.comune.milano.it/documents/d/guest/ordinanza-n-373-del-17022026-pdf?download=true"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "gatesGeo": "/geo/varchi-area-b.geojson"
  },
  {
    "id": "ztl-quadrilatero",
    "name": "ZTL Quadrilatero della Moda",
    "short": "QM",
    "type": "ztl",
    "featured": true,
    "verified": true,
    "aliases": [
      "quadrilatero",
      "quadrilatero della moda",
      "montenapoleone",
      "via montenapoleone",
      "via della spiga",
      "spiga",
      "via sant andrea",
      "via borgospesso",
      "via gesu",
      "corso matteotti",
      "corso monforte",
      "corso venezia",
      "largo mattioli",
      "piazza belgioioso",
      "piazza della scala",
      "piazza meda",
      "piazza san babila",
      "sito dei bagatti valsecchi",
      "via agnello",
      "via bagutta",
      "via bigli",
      "via borgospesso",
      "via case rotte",
      "via catena",
      "via degli omenoni",
      "via della spiga",
      "via gesu",
      "via hoepli",
      "via monte napoleone",
      "via morone",
      "via rossari",
      "via san paolo",
      "via san pietro all'orto",
      "via sant'andrea",
      "via santo spirito",
      "via verri"
    ],
    "alwaysActive": true,
    "schedule": [],
    "summary": "Le vie della moda tra Montenapoleone, Spiga, Sant'Andrea e Manzoni. Vietati accesso, attraversamento e sosta 24 ore su 24, salvo autorizzati.",
    "whoCanEnter": "residenti e dimoranti con pass, accompagnatori (un veicolo al giorno), chi ha box o posto auto, contrassegno disabili, artigiani, clienti di hotel e autorimesse, taxi e NCC autorizzati, targhe speciali. Bici e monopattini sempre. Moto e ciclomotori ammessi fino all'11 maggio 2028.",
    "scheduleNotes": [
      "Merci (veicoli N): carico e scarico dalle 9:00 alle 11:00 e dalle 20:00 alle 01:00, tutti i giorni.",
      "Multe attive dal 15 settembre 2025."
    ],
    "exitNote": "Le telecamere controllano gli accessi e le uscite principali.",
    "exceptions": [
      "Senza registrazione: targhe speciali (CD, CC, CRI, Forze Armate, Polizia, VVF, Protezione Civile ecc.) H24.",
      "Motocicli, ciclomotori e tre ruote simmetriche (esclusi tricicli con carrozzeria e non basculanti): ammessi H24 fino all'11 maggio 2028; divieto rinviato al 12 maggio 2028.",
      "Bici e monopattini sempre ammessi.",
      "Veicoli categoria N (merci): carico/scarico 9:00-11:00 e 20:00-01:00 tutti i giorni; isotermici anche 16:00-18:00; prodotti freschi/lievitati, lattiero-caseari ed edilizia (ATECO F 41-43) anche 4:30-7:30.",
      "Con registrazione targa: residenti e dimoranti (pass sosta 'Ambito 1-1A' + pass transito), accompagnatori (1 veicolo/giorno), box/posti auto, CUDE disabili, artigiani, hotel e autorimesse (targa comunicata da struttura/autorimessa), taxi e NCC fino a 9 posti gia autorizzati corsie/ZTL, altre categorie.",
      "Il permesso di sosta libera per auto elettriche/ibride NON consente l'accesso."
    ],
    "notes": [
      "Il perimetro non è ancora negli Open Data del Comune: sulla mappa non compare. Trovi la mappa ufficiale nelle fonti."
    ],
    "geo": null,
    "sources": [
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/servizi/mobilita/ztl-quadrilatero-della-moda"
      },
      {
        "title": "Comune di Milano (PDF)",
        "url": "https://www.comune.milano.it/documents/20118/499192/FAQ+ZTL+QUADRILATERO+DELLA+MODA_agg.24092026.pdf/1e9a0052-2f42-2e38-2c16-4a6c43590a72?version=1.1&t=1790261304542&download=true"
      },
      {
        "title": "Comune di Milano (PDF)",
        "url": "https://www.comune.milano.it/documents/20118/499192/Varchi.pdf/9bd8515b-8332-18ae-30eb-de7e5169f285?t=1757684070255"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/argomenti/mobilita"
      }
    ],
    "checkedOn": "20 ottobre 2026"
  },
  {
    "id": "ztl-isola",
    "name": "ZTL Isola",
    "short": "ISO",
    "type": "ztl",
    "featured": true,
    "verified": true,
    "aliases": [
      "isola",
      "quartiere isola",
      "ztl isola",
      "piazzale segrino",
      "via borsieri",
      "piazza minniti",
      "piazza fidia",
      "piazzale archinto",
      "piazzale segrino",
      "piazza minniti",
      "piazza santa maria alla fontana",
      "piazza spotorno",
      "via alserio",
      "via angelo della pergola",
      "via arese",
      "via ugo bassi",
      "via boltraffio",
      "via borsieri",
      "via carmagnola",
      "via civerchio",
      "via cola montano",
      "via cusio",
      "via de castillia",
      "via garigliano",
      "via jacopo dal verme",
      "via lario",
      "via lepontina",
      "via pastrengo",
      "via pepe",
      "via perasto",
      "via pollaiuolo",
      "via porro lambertenghi",
      "via rigola",
      "via rosellini",
      "via medardo rosso",
      "via sassetti",
      "via sebenico",
      "via spalato",
      "via strabone",
      "via thaon di revel",
      "via toce",
      "via trau",
      "via volturno"
    ],
    "schedule": [
      {
        "days": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ],
        "from": "19:30",
        "to": "06:00"
      }
    ],
    "summary": "Il quartiere Isola. Tutte le sere dalle 19:30 alle 6:00 entrano solo i veicoli autorizzati.",
    "whoCanEnter": "senza registrazione bici, monopattini, moto e ciclomotori, targhe speciali; con registrazione residenti e dimoranti con pass, accompagnatori, chi ha box o posto auto, contrassegno disabili, clienti di hotel e autorimesse, medici, artigiani, taxi e NCC fino a 9 posti.",
    "scheduleNotes": [
      "In vigore dal 20 aprile 2026, multe dal 7 settembre 2026.",
      "Dentro la ZTL ci sono aree pedonali sempre chiuse: via Borsieri (tra Porro Lambertenghi e piazzale Segrino), via Pepe (tra Borsieri e Carmagnola), via Toce, piazza Minniti."
    ],
    "exceptions": [
      "Senza registrazione: bici e monopattini; motocicli, ciclomotori e tre ruote simmetriche (esclusi tricicli con carrozzeria, non basculanti e quadricicli); targhe speciali; isotermici per prodotti lattiero-caseari diretti a esercizi nella ZTL.",
      "Con registrazione: residenti/dimoranti (pass sosta Ambito 9 o 10 + pass ZTL Isola), accompagnatori (targa ospite giornaliera; registrazione annuale per residenti >= 75 anni), box/posti auto, CUDE, clienti hotel e autorimesse, medici, artigiani, turnisti, operatori locali, GDO, quotidiani, sharing, taxi/NCC fino a 9 posti, altri."
    ],
    "notes": [
      "Permessi: Fascicolo del Cittadino (SPID o CIE), sezione Mobilità, oppure Polizia Locale Zona 9, via Passerini 5.",
      "Il perimetro non è ancora negli Open Data del Comune: sulla mappa non compare. Trovi la mappa ufficiale nelle fonti."
    ],
    "geo": null,
    "sources": [
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/servizi/mobilita/ztl-isola"
      },
      {
        "title": "Comune di Milano (PDF)",
        "url": "https://www.comune.milano.it/documents/20118/6463764/Ordinanza+istituzione+ZTL+Isola.pdf/db358458-ca55-8f3d-ef90-249c42b2014e?version=1.0&t=1776172729446&download=true"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/documents/20118/6463764/Mappa+ZTL+Isola.jpg/86e7e495-176c-3244-81de-1d0a870fda2e?t=1775833421281"
      }
    ],
    "checkedOn": "20 ottobre 2026"
  },
  {
    "id": "ztl-navigli-notturna",
    "name": "ZTL Navigli notturna",
    "short": "NAV",
    "type": "ztl",
    "featured": true,
    "verified": false,
    "aliases": [
      "navigli",
      "navigli notturna",
      "ztl navigli",
      "via borsi",
      "via argelati",
      "via fusetti",
      "via magolfa",
      "via paoli",
      "via pichi",
      "via gola"
    ],
    "schedule": [
      {
        "days": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ],
        "from": "20:00",
        "to": "07:00"
      }
    ],
    "summary": "Le vie della movida intorno ai Navigli (Borsi, Argelati, Fusetti, Magolfa, Paoli, Pichi, Gola). Tutte le sere dalle 20:00 alle 7:00 entrano solo gli autorizzati.",
    "whoCanEnter": "bici, taxi, NCC fino a nove posti, carico e scarico 5:00-7:30 15:00-17:30, residenti, domiciliati, autorizzati, possessori di box o posto auto",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 648/2015."
    ],
    "geo": "/geo/ztl-navigli-notturna.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026"
  },
  {
    "id": "ztl-navigli-fumagalli",
    "name": "ZTL Navigli (via Fumagalli)",
    "short": "FUM",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "via fumagalli",
      "fumagalli"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: ZTL Navigli (via Fumagalli).",
    "whoCanEnter": "bici, residenti e domiciliati, possessori di box o posto auto, taxi e NCC fino a nove posti, residenti in ripa di porta ticinese tra via paoli e il ponte di via valenzs",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 648/2015."
    ],
    "geo": "/geo/ztl-navigli-fumagalli.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "alwaysActive": true
  },
  {
    "id": "ztl-arco-della-pace",
    "name": "ZTL Arco della Pace",
    "short": "ARC",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "arco della pace",
      "piazza sempione",
      "sempione"
    ],
    "schedule": [
      {
        "days": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ],
        "from": "22:00",
        "to": "06:00"
      }
    ],
    "summary": "La zona intorno all'Arco della Pace. Ogni notte dalle 22:00 alle 6:00 entrano solo gli autorizzati.",
    "whoCanEnter": "residenti e domiciliati, autorizzati, possessori di box o posto auto, veicoli adibiti al pronto soccorso, mezzi di emergenza, mezzi di polizia, taxi, NCC, bici",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 64502/2010 (zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-arco-della-pace.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026"
  },
  {
    "id": "ztl-monte-ceneri",
    "name": "ZTL Cavalcavia Monte Ceneri",
    "short": "MC",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "monte ceneri",
      "cavalcavia monte ceneri"
    ],
    "schedule": [
      {
        "days": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ],
        "from": "22:00",
        "to": "06:00"
      }
    ],
    "summary": "Zona a traffico limitato: ZTL Cavalcavia Monte Ceneri.",
    "whoCanEnter": "veicoli adibiti al pronto soccorso, veicoli di pubblica utilità, autovetture e autocarri di massa complessiva a pieno carico inferiore a t.3, 5",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 52317/2002 (zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-monte-ceneri.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026"
  },
  {
    "id": "ztl-ascanio-sforza",
    "name": "ZTL Ascanio Sforza",
    "short": "AS",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "ascanio sforza",
      "via ascanio sforza",
      "via conchetta",
      "scoglio di quarto"
    ],
    "schedule": [
      {
        "days": [
          1,
          2,
          3,
          4
        ],
        "from": "19:00",
        "to": "06:00"
      },
      {
        "days": [
          5
        ],
        "from": "19:00",
        "to": "24:00"
      },
      {
        "days": [
          6,
          7
        ],
        "from": "00:00",
        "to": "24:00"
      },
      {
        "days": [
          1
        ],
        "from": "00:00",
        "to": "06:00"
      }
    ],
    "summary": "Zona a traffico limitato: Via Ascanio Sforza da via Scoglio di Quarto a via Conchetta, via Scoglio di Quarto, via Bettinelli, via Lagrange, via Pavia (tratto di circa 20 m. da via A. Sforza).",
    "whoCanEnter": "residenti e domiciliati, bici, veicoli con contrassegno di parcheggio per disabili, mezzi di soccorso, emergenza e polizia, veicoli per supporto a manifestazioni, eventi e servizi essenziali, pulizia e manutenzione strade, taxi ed assimilati",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 1619/2021 (DISCIPLINA VIABILISTICA DELLA ZONA A TRAFFICO LIMITATO (ZTL))."
    ],
    "geo": "/geo/ztl-ascanio-sforza.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026"
  },
  {
    "id": "ztl-garibaldi",
    "name": "ZTL Garibaldi",
    "short": "GAR",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "garibaldi",
      "corso garibaldi",
      "largo la foppa",
      "via anfiteatro",
      "via san simpliciano"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: Corso Garibaldi_via Anfiteatro_via Tessa_via San Simpliciano; C.so Garibaldi da Via Marsala a L.go La Foppa, L.go La Foppa civici n. 2, 4 e 5.",
    "whoCanEnter": null,
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Chi può entrare, per tratto: Residenti, bici, motocicli, taxi, carico scarico merci lun-sab 8:00 - 11:00, altri autorizzati | Residenti, bici, motocicli, taxi, carico scarico merci lun-sab 8:00 - 11:00, veicoli a tre ruote simmetriche (cat. L5 Ae) con esclusione dei tricicli con carrozzeria e quelli non basculanti",
      "Ordinanza: 54515/2004,1109/2016 (zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-garibaldi.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-corso-como",
    "name": "ZTL Corso Como",
    "short": "CC",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "corso como"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: ZTL Corso Como.",
    "whoCanEnter": "residenti, bici, carico scarico merci civica amministrazione",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 53660/2003 (zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-corso-como.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-ticinese",
    "name": "ZTL Ticinese",
    "short": "TIC",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "ticinese",
      "via vetere",
      "via scaldasole",
      "molino delle armi"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: Da via Molino delle Armi a piazza XXIV Maggio, via Vetere, via Scaldasole.",
    "whoCanEnter": "transito: autoveicoli muniti di contrassegno, cicli e moto, taxi, veicoli da noleggio con conducente, pubblica utilità, altri autorizzati; transito e sosta: residenti, trasporto merci (06.00-08.00 e 10.00-12.00 feriali)",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 97/2017,52000/2002 (zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-ticinese.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-guastalla",
    "name": "ZTL Via della Guastalla",
    "short": "GUA",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "guastalla",
      "via della guastalla"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: Da via Andreani a via San Barnaba.",
    "whoCanEnter": "bici, altri veicoli autorizzati",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 56593/2005 (zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-guastalla.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-san-prospero",
    "name": "ZTL San Prospero",
    "short": "SP",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "san prospero",
      "via san prospero"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: Via San Prospero da via Broletto a via Meravigli.",
    "whoCanEnter": "taxi, cicli, moto, autorizzati",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 51401/2002 (zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-san-prospero.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-unione",
    "name": "ZTL Via dell'Unione",
    "short": "UNI",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "via dell unione"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: Da via FALCONE a via TORINO.",
    "whoCanEnter": "taxi, cicli-moto, carico scarico merci (lun-sab dalle 10:00 alle 14:00 e dalle 19:00 alle 7.30)",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 51405/2002 (zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-unione.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-san-dalmazio",
    "name": "ZTL San Dalmazio, Paolo Ferrari, Filodrammatici",
    "short": "SD",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "san dalmazio",
      "paolo ferrari",
      "filodrammatici"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: Tutta via San Dalmazio, tutta piazza Paolo Ferrari, via Filodrammatici da piazza Paolo Ferrari a piazza della Scala.",
    "whoCanEnter": "solo transito: taxi, veicoli di pubblica utilità, veicoli autorizzati. Transito e sosta: trasporto merci, dalle 10 alle 14 dei giorni feriali, trasporto valori dalle 8 alle 18 dei giorni feriali",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 61945/2008 (zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-san-dalmazio.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-sant-agostino",
    "name": "ZTL Sant'Agostino - Cesare da Sesto",
    "short": "SA",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "sant agostino",
      "piazza sant agostino",
      "cesare da sesto"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: Piazza Sant'Agostino (lato che incrocia via Cesare da Sesto) tra viale Papiniano e via Olona - Via Cesare da Sesto tra via Ausonio e piazza Sant'Agostino.",
    "whoCanEnter": "transito e sosta : residenti e domiciliati, carico-scarico merci dalle 8:00-11:00 e 16:00-18:00, operatori del mercato, mezzi di soccorso, emergenza, polizia, manutenzione strade. Transito: possessori di box o posto auto, veicoli diretti al parcheggio",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 973/2020; 138/2022 (Delimitazione di Zona a Traffico Limitato (ZTL) in  piazza S. Agostino e nel tratto di via Cesare da Sesto compreso tra piazza S. Agostino e via Ausonio)."
    ],
    "geo": "/geo/ztl-sant-agostino.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-governo-provvisorio",
    "name": "ZTL Piazzale Governo Provvisorio",
    "short": "GP",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "governo provvisorio"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: Da via Russo a via Vida.",
    "whoCanEnter": "veicoli diretti alle proprietà private, bici",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 49284/2001 (zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-governo-provvisorio.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-betulle",
    "name": "ZTL Via delle Betulle",
    "short": "BET",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "via delle betulle",
      "betulle"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: Tutta escluse le diramazioni verso via degli Ulivi e via degli Ippocastani.",
    "whoCanEnter": "veicoli diretti alle proprietà private, veicoli degli operatori del mercato, bici",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 69791/2013 (istituzione zona a traffico limitato)."
    ],
    "geo": "/geo/ztl-betulle.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-barsanti-autari",
    "name": "ZTL Barsanti-Autari",
    "short": "BA",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "barsanti",
      "autari"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: ZTL Barsanti-Autari.",
    "whoCanEnter": "residenti e domiciliati, mezzi di soccorsi e assistenza, artigiani e manutentori, disabili, taxi",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 459/2022 (DISCIPLINA VIABILISTICA DELLA ZONA A TRAFFICO LIMITATO (ZTL))."
    ],
    "geo": "/geo/ztl-barsanti-autari.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-san-luigi",
    "name": "ZTL San Luigi, Scrivia, Don Bosco",
    "short": "SL",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "san luigi",
      "scrivia",
      "don bosco"
    ],
    "schedule": [],
    "summary": "Zona a traffico limitato: ZTL San Luigi, Scrivia, Don Bosco.",
    "whoCanEnter": "transito e sosta : residenti e domiciliati, carico e carico merci (dalle ore 5:00 alle ore 23:00), taxi, altri autorizzati. Solo transito:possessori di box non residenti o domiciliati, ospiti delle struutre ricettive che utilizzano i box",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 697/2021 (DISCIPLINA VIABILISTICA DELLA ZONA A TRAFFICO LIMITATO (ZTL) IN PIAZZA SAN LUIGI, VIA SCRIVIA E VIA DON BOSCO)."
    ],
    "geo": "/geo/ztl-san-luigi.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ztl-san-siro-eventi",
    "name": "ZTL San Siro Eventi",
    "short": "SS",
    "type": "ztl",
    "featured": false,
    "verified": false,
    "aliases": [
      "san siro",
      "stadio",
      "san siro eventi"
    ],
    "schedule": [],
    "summary": "La zona intorno allo stadio di San Siro, attiva durante gli eventi.",
    "whoCanEnter": "bus, taxi, disabili, veicoli diretti all'interno delle proprietà private, bici, moto, veicoli diretti ai parcheggi a pagamento",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 670/2017 (misure viabilistiche nelle località adiacenti lo stadio Meazza in occasione di eventi, spettacoli e manifestazioni sportive)."
    ],
    "geo": "/geo/ztl-san-siro-eventi.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "scheduleUnknown": true
  },
  {
    "id": "ap-brera",
    "name": "Area pedonale Brera",
    "short": "BRE",
    "type": "pedonale",
    "featured": true,
    "verified": false,
    "aliases": [
      "brera",
      "via brera",
      "via fiori oscuri",
      "quartiere brera",
      "ztl brera"
    ],
    "schedule": [],
    "summary": "Le vie pedonali di Brera (via Brera, via Fiori Oscuri e dintorni). Chiusa alle auto, salvo deroghe.",
    "whoCanEnter": null,
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Chi può entrare, per tratto: Bici | Carico e scarico merci (dalle 9:00 alle 12:00 e dalle 16:00 alle 17:00), bici, taxi, residenti, veicoli espressamente autorizzati | Carico e scarico merci (lun-sab dalle 10:00 alle 14:00), veicoli diretti alle proprietà private, bici, altri autorizzati | Veicoli diretti alle proprietà private, bici",
      "Ordinanza: 42499/1996 (Istituzione area pedonale urbana), 48281/2000 (Istituzione area pedonale urbana), 66108/2011,66282/2011, 66207/2011 (Istituzione area pedonale urbana)."
    ],
    "geo": "/geo/ap-brera.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "alwaysActive": true
  },
  {
    "id": "ap-sarpi",
    "name": "Area pedonale Paolo Sarpi",
    "short": "SAR",
    "type": "pedonale",
    "featured": true,
    "verified": false,
    "aliases": [
      "sarpi",
      "paolo sarpi",
      "via paolo sarpi",
      "via sarpi",
      "chinatown",
      "china town",
      "ztl sarpi"
    ],
    "schedule": [],
    "summary": "Via Paolo Sarpi, la Chinatown di Milano, e le vie vicine. Chiusa alle auto, salvo deroghe.",
    "whoCanEnter": null,
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Chi può entrare, per tratto: Carico e scarico merci (dalle 9:00 alle 12:00 e dalle 16:00 alle 17:00 con uscita esclusivamente in via Lomazzo), bici, taxi, residenti e domiciliati, possessori di box o posto auto | Carico e scarico merci (dalle 9:00 alle 12:00 e dalle 16:00 alle 17:00), bici, taxi, residenti e domiciliati, possessori di box o posto auto",
      "Ordinanza: 65941/2011,71009/2014."
    ],
    "geo": "/geo/ap-sarpi.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "alwaysActive": true
  },
  {
    "id": "ap-navigli",
    "name": "Aree pedonali Navigli",
    "short": "NP",
    "type": "pedonale",
    "featured": false,
    "verified": false,
    "aliases": [
      "alzaia",
      "alzaia naviglio grande",
      "alzaia naviglio pavese",
      "naviglio grande",
      "naviglio pavese",
      "ripa di porta ticinese",
      "ripa ticinese"
    ],
    "schedule": [],
    "summary": "Le alzaie del Naviglio Grande e del Naviglio Pavese e la Ripa di Porta Ticinese. Chiuse alle auto, salvo deroghe.",
    "whoCanEnter": null,
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Chi può entrare, per tratto: Carico e scarico merci (dalle 5:00 alle 7:30 e dalle 15:00 alle 17:30), bici, residenti e domiciliati | Carico e scarico merci (feriali dalle 5:00 alle 8:00 e dalle 14:00 alle 16:00), bici, taxi, residenti e domiciliati, possessori di box | Carico e scarico merci (feriali dalle 5:00 alle 8:00 e dalle 15:00 alle 16:00), bici, residenti e domiciliati, taxi e assimilati, possessori di box | Mezzi di emergenza, invalidi, bici, veicoli a emissione zero assimilabili ai bici, veicoli diretti alle proprietà private (per 160 m da via Don Rodrigo) | Residenti e domiciliati, possessori di box o posto auto, taxi, invalidi, bici",
      "Ordinanza: 649/2015, 1070/2015 (delimitazione di area pedonale in base ai disposti della deliberazione numero 1173/2015), 67820/2012,1070/2015 (delimitazione area pedonale), 791/2022, 959/2022 (Disciplina viabilistica dell'Area Pedonale in Alzaia Naviglio Pavese)."
    ],
    "geo": "/geo/ap-navigli.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "alwaysActive": true
  },
  {
    "id": "ap-duomo",
    "name": "Aree pedonali Duomo e centro",
    "short": "DUO",
    "type": "pedonale",
    "featured": false,
    "verified": false,
    "aliases": [
      "duomo",
      "piazza duomo",
      "piazza del duomo",
      "mercanti",
      "via mercanti",
      "cordusio",
      "piazza cordusio",
      "via dante",
      "piazza della scala",
      "scala",
      "corso vittorio emanuele",
      "vittorio emanuele",
      "via marconi"
    ],
    "schedule": [],
    "summary": "Piazza del Duomo, via Mercanti e Cordusio, via Dante, piazza della Scala, corso Vittorio Emanuele. Chiuse alle auto, salvo deroghe.",
    "whoCanEnter": null,
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Chi può entrare, per tratto: Bici | Bici, carico e scarico merci, veicoli diretti alle proprietà private | Carico e scarico merci (dalle 2:00 alle 7:30) da via agnello a via San Paolo, bici | Carico e scarico merci (dalle 7:00 alle 10:00), bici",
      "Ordinanza: 35309/1990 (Istituzione area pedonale urbana), 41939/1995 (Istituzione area pedonale urbana), 41965/1996 (Istituzione area pedonale urbana), 42111/1996 (Istituzione area pedonale urbana), 42429/1996 (Istituzione area pedonale urbana), 65416/2010 (Istituzione area pedonale urbana)."
    ],
    "geo": "/geo/ap-duomo.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "alwaysActive": true
  },
  {
    "id": "ap-ticinese",
    "name": "Aree pedonali Ticinese",
    "short": "XXIV",
    "type": "pedonale",
    "featured": false,
    "verified": false,
    "aliases": [
      "colonne di san lorenzo",
      "san lorenzo",
      "piazza xxiv maggio",
      "xxiv maggio",
      "darsena"
    ],
    "schedule": [],
    "summary": "Le Colonne di San Lorenzo e piazza XXIV Maggio. Chiuse alle auto, salvo deroghe.",
    "whoCanEnter": "veicoli diretti alle proprietà private, veicoli connessi alle funzioni religiose, bici",
    "scheduleNotes": [
      "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
    ],
    "notes": [
      "Ordinanza: 149/2018 (istituzione percorso pedonale e ciclabile), 48169/2000 (Istituzione area pedonale urbana)."
    ],
    "geo": "/geo/ap-ticinese.geojson",
    "sources": [
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
      },
      {
        "title": "Open Data Comune di Milano",
        "url": "https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson"
      }
    ],
    "checkedOn": "20 ottobre 2026",
    "alwaysActive": true
  }
];
export const fines = {
  "ztl": {
    "min": 83,
    "max": 332,
    "reducedPct": 30,
    "reducedDays": 5,
    "payDays": 60,
    "prefettoDays": 60,
    "giudiceDays": 30,
    "summary": "Entrare in una ZTL, in un'area pedonale o in una corsia riservata senza permesso costa da 83 a 332 euro (art. 7, comma 14, del Codice della Strada). Non toglie punti dalla patente.",
    "sources": [
      {
        "title": "Normattiva",
        "url": "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1992-04-30;285~art7"
      },
      {
        "title": "Normattiva",
        "url": "https://www.normattiva.it/atto/caricaArticolo?art.versione=6&art.idGruppo=12&art.flagTipoArticolo=0&art.codiceRedazionale=092G0306&art.idArticolo=202&art.idSottoArticolo=1&art.idSottoArticolo1=10&art.dataPubblicazioneGazzetta=1992-05-18&art.progressivo=0"
      },
      {
        "title": "Comune di Milano",
        "url": "https://www.comune.milano.it/servizi/polizia-locale-e-sicurezza/pagamento-di-un-verbale-d-infrazione-al-codice-della-strada"
      }
    ]
  },
  "sections": [],
  "summary": "Entrare in una ZTL, in un'area pedonale o in una corsia riservata senza permesso costa da 83 a 332 euro (art. 7, comma 14, del Codice della Strada). Non toglie punti dalla patente. Se paghi entro 5 giorni dalla notifica hai lo sconto del 30% (58,10 euro).",
  "sources": [
    {
      "title": "Normattiva",
      "url": "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:1992-04-30;285~art7"
    },
    {
      "title": "Normattiva",
      "url": "https://www.normattiva.it/atto/caricaArticolo?art.versione=6&art.idGruppo=12&art.flagTipoArticolo=0&art.codiceRedazionale=092G0306&art.idArticolo=202&art.idSottoArticolo=1&art.idSottoArticolo1=10&art.dataPubblicazioneGazzetta=1992-05-18&art.progressivo=0"
    },
    {
      "title": "Comune di Milano",
      "url": "https://www.comune.milano.it/servizi/polizia-locale-e-sicurezza/pagamento-di-un-verbale-d-infrazione-al-codice-della-strada"
    }
  ]
};
export const vehicleNotes = [
  {
    "text": "La classe Euro è sul libretto di circolazione, alla voce V.9. Per i diesel Euro 6 conta anche la lettera (A, B, C oppure D-TEMP, D).",
    "sources": [
      "https://www.comune.milano.it/argomenti/mobilita/area-b"
    ]
  },
  {
    "text": "Per le auto a GPL o metano le regole dipendono dal motore di base: controlla il calendario dei divieti del Comune per il tuo caso.",
    "sources": [
      "https://www.comune.milano.it/argomenti/mobilita/area-b-calendario-dei-divieti"
    ]
  },
  {
    "text": "Moto, furgoni, camion e bus hanno calendari diversi da quelli delle auto: questa app considera le auto per il trasporto persone.",
    "sources": [
      "https://www.comune.milano.it/argomenti/mobilita/area-c-calendario-dei-divieti",
      "https://www.comune.milano.it/argomenti/mobilita/area-b-calendario-dei-divieti"
    ]
  }
];
export const sources = [
  {
    "title": "Comune di Milano - Area C",
    "url": "https://www.comune.milano.it/argomenti/mobilita/area-c"
  },
  {
    "title": "Area C - Calendario dei divieti",
    "url": "https://www.comune.milano.it/argomenti/mobilita/area-c-calendario-dei-divieti"
  },
  {
    "title": "Area C - Acquista il ticket",
    "url": "https://www.comune.milano.it/servizi/mobilita/area-c-acquista-il-ticket"
  },
  {
    "title": "Area C - Attiva il ticket",
    "url": "https://www.comune.milano.it/servizi/mobilita/area-c-attiva-il-ticket"
  },
  {
    "title": "Area C - Costo dei ticket dal 30 ottobre 2023 (PDF)",
    "url": "https://www.comune.milano.it/documents/20118/35188/Area+C+nuove+tariffe+dal+2023+Area+C.pdf/5ee21a73-7301-60c7-d2fe-5e2f77e8a158?version=1.0&t=1746021538283&download=true"
  },
  {
    "title": "Area C - Agevolazioni residenti",
    "url": "https://www.comune.milano.it/servizi/mobilita/area-c-agevolazioni-per-residenti-ed-equiparati"
  },
  {
    "title": "Area C - Agevolazioni imprese (veicoli di servizio)",
    "url": "https://www.comune.milano.it/servizi/mobilita/area-c-agevolazioni-per-imprese-con-veicoli-di-servizio"
  },
  {
    "title": "Area C - Deroga trasporto merci 8-10",
    "url": "https://www.comune.milano.it/servizi/mobilita/area-c-deroga-per-trasporto-merci-8-00-10-00"
  },
  {
    "title": "Area C - Deroghe veicoli oltre 7,5 m",
    "url": "https://www.comune.milano.it/servizi/mobilita/area-c-deroghe-per-veicoli-superiori-a-7-5-metri"
  },
  {
    "title": "Portale Area C (ATM per il Comune) - FAQ",
    "url": "https://areac.atm-mi.it/Areac/IWeb/FAQ2.aspx"
  },
  {
    "title": "Portale Area C - Regole, agevolazioni, esenzioni",
    "url": "https://areac.atm-mi.it/Areac/IWeb/FAQ.aspx"
  },
  {
    "title": "Portale Area C - Information (EN)",
    "url": "https://areac.atm-mi.it/Areac/IWeb/English.aspx"
  },
  {
    "title": "Portale Area C - FAQ (EN)",
    "url": "https://areac.atm-mi.it/Areac/IWeb/FAQ_en.aspx"
  },
  {
    "title": "Ordinanza n. 373 del 17/02/2026 (rinvio divieti moto)",
    "url": "https://www.comune.milano.it/documents/d/guest/ordinanza-n-373-del-17022026-pdf?download=true"
  },
  {
    "title": "Comune di Milano - Area B",
    "url": "https://www.comune.milano.it/argomenti/mobilita/area-b"
  },
  {
    "title": "Area B - Calendario dei divieti",
    "url": "https://www.comune.milano.it/argomenti/mobilita/area-b-calendario-dei-divieti"
  },
  {
    "title": "Area B - Richiesta deroghe e permessi",
    "url": "https://www.comune.milano.it/servizi/mobilita/area-b-richiesta-deroghe-e-permessi"
  },
  {
    "title": "Portale Area B (ATM per il Comune) - FAQ",
    "url": "https://areab.atm.it/it-IT/Web/FAQ"
  },
  {
    "title": "Area B - volantino informativo (PDF)",
    "url": "https://www.comune.milano.it/documents/20118/808719/Area+B_volantino+25_5.pdf/aa35b5f0-e692-32b5-e3e7-265bf758e61b?version=1.2&t=1790773122597&download=true"
  },
  {
    "title": "Ordinanza n. 2338 del 28/09/2026 (Area B, angolo cieco mezzi istituzionali)",
    "url": "https://www.comune.milano.it/documents/d/guest/prot__28-09-2026_0543731_i-file-primario-ordinanza_area_b_ffo__dgc_1182_del_17-09-2026_signed_signed_timbrato?download=true"
  },
  {
    "title": "Pass disabili per Area B, Area C, ZTL",
    "url": "https://www.comune.milano.it/servizi/mobilita/ingressi-in-area-b-e-area-c-corsie-riservate-ztl-per-titolari-di-contrassegno-disabili"
  },
  {
    "title": "ZTL Quadrilatero della Moda",
    "url": "https://www.comune.milano.it/servizi/mobilita/ztl-quadrilatero-della-moda"
  },
  {
    "title": "FAQ ZTL Quadrilatero della Moda (agg. 24/09/2026, PDF)",
    "url": "https://www.comune.milano.it/documents/20118/499192/FAQ+ZTL+QUADRILATERO+DELLA+MODA_agg.24092026.pdf/1e9a0052-2f42-2e38-2c16-4a6c43590a72?version=1.1&t=1790261304542&download=true"
  },
  {
    "title": "Mappa varchi ZTL Quadrilatero (PDF)",
    "url": "https://www.comune.milano.it/documents/20118/499192/Varchi.pdf/9bd8515b-8332-18ae-30eb-de7e5169f285?t=1757684070255"
  },
  {
    "title": "ZTL Isola",
    "url": "https://www.comune.milano.it/servizi/mobilita/ztl-isola"
  },
  {
    "title": "Ordinanza istituzione ZTL Isola (PDF)",
    "url": "https://www.comune.milano.it/documents/20118/6463764/Ordinanza+istituzione+ZTL+Isola.pdf/db358458-ca55-8f3d-ef90-249c42b2014e?version=1.0&t=1776172729446&download=true"
  },
  {
    "title": "Mobilita - Comune di Milano",
    "url": "https://www.comune.milano.it/argomenti/mobilita"
  },
  {
    "title": "Pagamento di un verbale CdS",
    "url": "https://www.comune.milano.it/servizi/polizia-locale-e-sicurezza/pagamento-di-un-verbale-d-infrazione-al-codice-della-strada"
  },
  {
    "title": "Pagamento multe tramite Fascicolo del Cittadino",
    "url": "https://www.comune.milano.it/servizi/polizia-locale-e-sicurezza/pagamento-multe-tramite-fascicolo-del-cittadino"
  },
  {
    "title": "Ricorso contro verbali CdS",
    "url": "https://www.comune.milano.it/servizi/polizia-locale-e-sicurezza/ricorso-contro-verbali-per-infrazioni-del-codice-della-strada"
  },
  {
    "title": "Multe: foto delle infrazioni",
    "url": "https://www.comune.milano.it/servizi/polizia-locale-e-sicurezza/multe-foto-delle-infrazioni"
  },
  {
    "title": "Normattiva - CdS art. 7 (testo vigente dal 25-4-2026)",
    "url": "https://www.normattiva.it/atto/caricaArticolo?art.versione=31&art.idGruppo=1&art.flagTipoArticolo=0&art.codiceRedazionale=092G0306&art.idArticolo=7&art.idSottoArticolo=1&art.idSottoArticolo1=10&art.dataPubblicazioneGazzetta=1992-05-18&art.progressivo=0"
  },
  {
    "title": "Normattiva - CdS art. 202",
    "url": "https://www.normattiva.it/atto/caricaArticolo?art.versione=6&art.idGruppo=12&art.flagTipoArticolo=0&art.codiceRedazionale=092G0306&art.idArticolo=202&art.idSottoArticolo=1&art.idSottoArticolo1=10&art.dataPubblicazioneGazzetta=1992-05-18&art.progressivo=0"
  },
  {
    "title": "Open Data ds51 Aree pedonali e ZTL",
    "url": "https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl"
  },
  {
    "title": "Open Data ds82 Varchi Area C",
    "url": "https://dati.comune.milano.it/dataset/ds82_infogeo_varchi_elettronici_localizzazione_"
  },
  {
    "title": "Open Data ds959 Varchi Area B",
    "url": "https://dati.comune.milano.it/dataset/ds959-varchi-areab"
  }
];
