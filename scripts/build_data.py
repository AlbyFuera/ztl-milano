#!/usr/bin/env python3
"""Costruisce src/data/rules.js e public/geo/*.geojson dai dati ufficiali raccolti in research/.

Uso: python3 -I scripts/build_data.py
Input:  research/rules.json (ricerca sulle fonti ufficiali), research/verified.json (verifica avversariale, opzionale),
        research/raw/*.geojson (Open Data Comune di Milano).
Ogni testo mostrato all'utente riporta le fonti da cui viene.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = lambda *p: os.path.join(ROOT, *p)

research = json.load(open(R('research', 'rules.json')))
verified = json.load(open(R('research', 'verified.json'))) if os.path.exists(R('research', 'verified.json')) else {}
Z = {z['id']: z for z in research['zones']}
geo = json.load(open(R('research', 'raw', 'disciplina_aree.geojson')))
BY_AMAT = {f['properties']['id_amat']: f for f in geo['features']}

OPEN_DATA_PAGE = 'https://dati.comune.milano.it/dataset/ds51_trafficotrasporti_aree_pedonali_ztl'
OPEN_DATA_NOTE = "Orari e deroghe dagli Open Data del Comune (aggiornati al 2 maggio 2023): controlla il cartello all'ingresso."
CHECKED = '20 ottobre 2026'


def src(url, title=None):
    if title:
        return {'title': title, 'url': url}
    host = re.sub(r'^https?://(www\.)?', '', url).split('/')[0]
    t = {
        'comune.milano.it': 'Comune di Milano',
        'areac.atm-mi.it': 'Portale Area C',
        'areab.atm.it': 'Portale Area B',
        'dati.comune.milano.it': 'Open Data Comune di Milano',
        'normattiva.it': 'Normattiva',
    }.get(host, host)
    if url.lower().endswith('.pdf') or 'download=true' in url or '.pdf' in url.lower():
        t += ' (PDF)'
    return {'title': t, 'url': url}


def srcs(urls):
    seen, out = set(), []
    for u in urls:
        if u and u not in seen:
            seen.add(u)
            out.append(src(u))
    return out


def clean(t):
    t = re.sub(r'\s+', ' ', (t or '')).strip(' ,;')
    t = re.sub(r'\bc/s\b', 'carico e scarico', t)
    t = re.sub(r'\bvelocipedi\b', 'bici', t)
    t = re.sub(r'\bncc\b', 'NCC', t, flags=re.I)
    t = re.sub(r',(?=\S)', ', ', t)
    t = re.sub(r'\s+,', ',', t)
    t = t.replace("proprieta'", 'proprietà').replace("utilita'", 'utilità').replace('mercii', 'merci').replace('invaliidi', 'invalidi')
    return t[:1].upper() + t[1:] if t else t


def write_geo(zone_id, amats):
    feats = []
    for a in amats:
        f = BY_AMAT.get(a)
        if f:
            feats.append({'type': 'Feature', 'properties': {'id_amat': a, 'nome': f['properties'].get('nome')}, 'geometry': f['geometry']})
    if not feats:
        return None
    os.makedirs(R('public', 'geo'), exist_ok=True)
    with open(R('public', 'geo', f'{zone_id}.geojson'), 'w') as fh:
        json.dump({'type': 'FeatureCollection', 'features': feats}, fh, separators=(',', ':'))
    return f'/geo/{zone_id}.geojson'


def amat(zid):
    return (Z[zid].get('opendata_ref') or {}).get('id_amat')


def streets_aliases(streets):
    out = []
    for s in streets or []:
        s = re.sub(r'\(.*?\)', '', s).strip().lower()
        if s:
            out.append(s)
    return out


zones = []

# ---------------------------------------------------------------- Area C
c = Z['area-c']
zones.append({
    'id': 'area-c', 'name': 'Area C', 'short': 'C', 'type': 'congestion', 'featured': True, 'verified': True,
    'aliases': ['area c', 'areac', 'zona c', 'cerchia dei bastioni', 'bastioni', 'centro storico', 'ztl centro'],
    'schedule': [{'days': [1, 2, 3, 4, 5], 'from': '07:30', 'to': '19:30'}], 'holidaysOff': True,
    'summary': 'Il centro di Milano dentro la Cerchia dei Bastioni. Nei giorni feriali si entra pagando un ticket giornaliero; alcuni veicoli non possono entrare.',
    'scheduleNotes': [
        'Attiva tutto l\'anno, anche ad agosto, dal lunedì al venerdì; non attiva sabato, domenica e festivi.',
        'Veicoli per trasporto merci: vietati dalle 8:00 alle 10:00 senza deroga.',
    ],
    'cost': '7,50 € al giorno. Residenti: 50 ingressi gratis all\'anno, poi 3 €. Veicoli di servizio e auto parcheggiate in autorimesse convenzionate: 4,50 €.',
    'paymentShort': 'Devi attivare il ticket da 7,50 € entro le 24:00 del giorno dopo (online, app, parcometri, tabaccherie, Telepass).',
    'payment': 'Attiva il ticket da 7,50 € entro le 24:00 del giorno dopo l\'ingresso: online su areac.atm-mi.it, parcometri, tabaccherie e punti SISAL, bancomat Intesa Sanpaolo, Telepass, UnipolMove, PayPal o al telefono 02 4868 4001. Se ti dimentichi: ticket da 22,50 € entro 7 giorni, solo da MyAreaC.',
    'exitNote': 'Le telecamere leggono solo le targhe in entrata: all\'uscita non paghi nulla. Se il tuo veicolo è vietato, però, non può nemmeno circolare dentro l\'area.',
    'gates': '43 varchi con telecamera (6 riservati ai mezzi pubblici, 1 ai soli autorizzati).',
    'freeFor': ['elettrico'],
    'freeNote': 'Entrano gratis i veicoli elettrici, le auto ibride con CO2 fino a 100 g/km, le moto non vietate e chi ha il contrassegno disabili (con targa registrata).',
    'fuelNotes': {'ibrido': 'Se la tua auto ibrida emette fino a 100 g/km di CO2 (voce V.7 del libretto) entri gratis.'},
    'permitNotes': {
        'residente': {'verdict': 'pagamento', 'text': 'Da residente in Area C hai 50 ingressi gratis all\'anno (con registrazione), poi paghi 3 € invece di 7,50 €.'},
        'cude': {'verdict': 'dipende', 'text': 'Con il contrassegno disabili (CUDE), il titolare a bordo e la targa registrata entri senza pagare.'},
    },
    'uncertainFuels': ['gpl', 'metano'],
    'vehicleBans': [
        {'fuel': ['benzina'], 'maxEuro': 2, 'since': None, 'label': 'Benzina Euro 0, 1 e 2'},
        {'fuel': ['diesel'], 'maxEuro': 5, 'since': None, 'label': 'Diesel da Euro 0 a Euro 5, con o senza filtro'},
        {'fuel': ['benzina'], 'maxEuro': 3, 'since': '2024-10-01', 'label': 'Benzina Euro 3'},
        {'fuel': ['benzina'], 'maxEuro': 4, 'since': '2027-10-01', 'label': 'Benzina Euro 4'},
        {'fuel': ['diesel'], 'euro6': 'abc', 'since': '2028-10-01', 'label': 'Diesel Euro 6 A, B e C'},
        {'fuel': ['diesel'], 'euro6': 'd', 'since': '2029-10-01', 'label': 'Diesel Euro 6 D-TEMP e D'},
        {'fuel': ['benzina'], 'maxEuro': 5, 'since': '2030-10-01', 'label': 'Benzina Euro 5'},
    ],
    'exceptions': [
        'Ingresso gratuito: veicoli elettrici; auto ibride con CO2 fino a 100 g/km; moto e ciclomotori non vietati.',
        'Contrassegno disabili (CUDE) con titolare a bordo e targa registrata: esenzioni e deroghe.',
        'Veicoli storici con almeno 40 anni e certificato di rilevanza storica: derogati dal divieto e dal pagamento.',
        'Taxi e NCC fino a 9 posti: esenti.',
        'Deroghe per motivi di salute, operatori sociali e sanitari, farmaci urgenti.',
    ],
    'notes': [
        'Vietati i veicoli lunghi più di 7,5 metri (deroga su richiesta).',
        'I residenti hanno un calendario dei divieti diverso, con scadenze più lunghe: controlla la pagina del Comune.',
        'Divieti per le moto rinviati al 1° ottobre 2027 (Ordinanza 373/2026).',
    ],
    'geo': write_geo('area-c', [276]),
    'sources': srcs(c['sources']),
    'checkedOn': CHECKED,
})

# ---------------------------------------------------------------- Area B
b = Z['area-b']
zones.append({
    'id': 'area-b', 'name': 'Area B', 'short': 'B', 'type': 'lez', 'featured': True, 'verified': True,
    'aliases': ['area b', 'areab', 'zona b', 'milano', 'tutta milano'],
    'schedule': [{'days': [1, 2, 3, 4, 5], 'from': '07:30', 'to': '19:30'}], 'holidaysOff': True,
    'summary': 'La zona a basse emissioni che copre quasi tutta Milano. È gratis: nei giorni feriali vieta l\'ingresso ai veicoli più inquinanti.',
    'scheduleNotes': [
        'Dal lunedì al venerdì, festivi esclusi.',
        'Con un veicolo vietato puoi entrare prima delle 7:30, ma dalle 7:30 alle 19:30 non puoi circolare né dentro né verso l\'uscita.',
        'Veicoli con merci pericolose: vietati 24 ore su 24, tutti i giorni.',
    ],
    'cost': 'Gratis per i veicoli ammessi.',
    'exitNote': 'Le telecamere leggono le targhe in entrata, ma un veicolo vietato non può circolare all\'interno né verso l\'esterno dalle 7:30 alle 19:30.',
    'gates': '186 varchi d\'accesso.',
    'uncertainFuels': ['gpl', 'metano'],
    'permitNotes': {
        'cude': {'verdict': 'dipende', 'text': 'Con il contrassegno disabili rilasciato dal Comune di Milano e il titolare a bordo entri anche con un veicolo vietato; se è rilasciato da un altro Comune serve la registrazione.'},
    },
    'vehicleBans': [
        {'fuel': ['benzina'], 'maxEuro': 2, 'since': None, 'label': 'Benzina Euro 0, 1 e 2'},
        {'fuel': ['diesel'], 'maxEuro': 5, 'since': None, 'label': 'Diesel da Euro 0 a Euro 5'},
        {'fuel': ['benzina'], 'maxEuro': 3, 'since': '2025-10-01', 'label': 'Benzina Euro 3'},
        {'fuel': ['benzina'], 'maxEuro': 4, 'since': '2028-10-01', 'label': 'Benzina Euro 4'},
        {'fuel': ['diesel'], 'euro6': 'abc', 'since': '2028-10-01', 'label': 'Diesel Euro 6 A, B e C'},
        {'fuel': ['diesel'], 'euro6': 'd', 'since': '2030-10-01', 'label': 'Diesel Euro 6 D-TEMP e D'},
    ],
    'exceptions': [
        'Auto ibride ed elettriche entrano sempre.',
        'Primo anno di divieto: 50 giornate di accesso in deroga, senza registrazione.',
        'Dal secondo anno (regole dal 1° ottobre 2026): 5 giornate all\'anno automatiche per ogni veicolo, più 20 per residenti e imprese di Milano con targa registrata.',
        'Move-In (Regione Lombardia): in alternativa alle deroghe, un tetto di chilometri all\'anno monitorato da una scatola a bordo.',
        'Diesel Euro 5 con abbonamento ai parcheggi di interscambio Lampugnano, Forlanini o Rogoredo: deroga.',
        'Veicoli storici con almeno 40 anni e certificato: derogati; tra 20 e 40 anni: 25 giornate all\'anno.',
        'Contrassegno disabili del Comune di Milano con titolare a bordo: ingresso senza registrazione.',
    ],
    'notes': [
        'Il 1° ottobre 2026 non è scattato nessun nuovo divieto: sono cambiate le giornate di deroga.',
        'Vietati i veicoli e complessi più lunghi di 12 metri (non vale per il trasporto persone).',
        'La classe Euro è sul libretto alla voce V.9.',
        'Puoi vedere online le foto delle infrazioni di Area B fino a 180 giorni.',
    ],
    'geo': write_geo('area-b', [277]),
    'sources': srcs(b['sources']),
    'checkedOn': CHECKED,
})

# ---------------------------------------------------------------- ZTL nuove (pagine ufficiali)
q = Z['ztl-quadrilatero-della-moda']
zones.append({
    'id': 'ztl-quadrilatero', 'name': 'ZTL Quadrilatero della Moda', 'short': 'QM', 'type': 'ztl', 'featured': True, 'verified': True,
    'aliases': ['quadrilatero', 'quadrilatero della moda', 'montenapoleone', 'via montenapoleone', 'via della spiga', 'spiga', 'via sant andrea', 'via borgospesso', 'via gesu'] + streets_aliases(q.get('streets')),
    'alwaysActive': True, 'schedule': [],
    'summary': 'Le vie della moda tra Montenapoleone, Spiga, Sant\'Andrea e Manzoni. Vietati accesso, attraversamento e sosta 24 ore su 24, salvo autorizzati.',
    'whoCanEnter': 'residenti e dimoranti con pass, accompagnatori (un veicolo al giorno), chi ha box o posto auto, contrassegno disabili, artigiani, clienti di hotel e autorimesse, taxi e NCC autorizzati, targhe speciali. Bici e monopattini sempre. Moto e ciclomotori ammessi fino all\'11 maggio 2028.',
    'scheduleNotes': ['Merci (veicoli N): carico e scarico dalle 9:00 alle 11:00 e dalle 20:00 alle 01:00, tutti i giorni.', 'Multe attive dal 15 settembre 2025.'],
    'exitNote': 'Le telecamere controllano gli accessi e le uscite principali.',
    'exceptions': [clean(e['text']) for e in q.get('exceptions', [])][:6],
    'notes': ['Il perimetro non è ancora negli Open Data del Comune: sulla mappa non compare. Trovi la mappa ufficiale nelle fonti.'],
    'geo': None,
    'sources': srcs(q['sources']),
    'checkedOn': CHECKED,
})

i = Z['ztl-isola']
zones.append({
    'id': 'ztl-isola', 'name': 'ZTL Isola', 'short': 'ISO', 'type': 'ztl', 'featured': True, 'verified': True,
    'aliases': ['isola', 'quartiere isola', 'ztl isola', 'piazzale segrino', 'via borsieri', 'piazza minniti'] + streets_aliases(i.get('streets')),
    'schedule': [{'days': [1, 2, 3, 4, 5, 6, 7], 'from': '19:30', 'to': '06:00'}],
    'summary': 'Il quartiere Isola. Tutte le sere dalle 19:30 alle 6:00 entrano solo i veicoli autorizzati.',
    'whoCanEnter': 'senza registrazione bici, monopattini, moto e ciclomotori, targhe speciali; con registrazione residenti e dimoranti con pass, accompagnatori, chi ha box o posto auto, contrassegno disabili, clienti di hotel e autorimesse, medici, artigiani, taxi e NCC fino a 9 posti.',
    'scheduleNotes': ['In vigore dal 20 aprile 2026, multe dal 7 settembre 2026.', 'Dentro la ZTL ci sono aree pedonali sempre chiuse: via Borsieri (tra Porro Lambertenghi e piazzale Segrino), via Pepe (tra Borsieri e Carmagnola), via Toce, piazza Minniti.'],
    'exceptions': [clean(e['text']) for e in i.get('exceptions', [])],
    'notes': ['Permessi: Fascicolo del Cittadino (SPID o CIE), sezione Mobilità, oppure Polizia Locale Zona 9, via Passerini 5.', 'Il perimetro non è ancora negli Open Data del Comune: sulla mappa non compare. Trovi la mappa ufficiale nelle fonti.'],
    'geo': None,
    'sources': srcs(i['sources']),
    'checkedOn': CHECKED,
})

# ---------------------------------------------------------------- ZTL e aree pedonali dagli Open Data
def from_opendata(new_id, name, ztype, members, aliases, short, featured=False, summary=None):
    recs = [Z[m] for m in members]
    sched = recs[0]['schedule']
    unknown = not sched
    always = bool(sched) and all(r['from'] == '00:00' and r['to'] == '24:00' for r in sched)
    access = [clean(r.get('access')) for r in recs if r.get('access')]
    tratti = [clean(r.get('tratto')) for r in recs if r.get('tratto') and r.get('tratto').lower() not in ('tutta', 'tutto')]
    ord_ = sorted({r.get('ordinanza') for r in recs if r.get('ordinanza')})
    z = {
        'id': new_id, 'name': name, 'short': short, 'type': ztype, 'featured': featured, 'verified': False,
        'aliases': aliases,
        'schedule': [] if (unknown or always) else [{'days': s['days'], 'from': s['from'], 'to': s['to']} for s in sched],
        'summary': summary or (f"{'Area pedonale' if ztype == 'pedonale' else 'Zona a traffico limitato'}: " + ('; '.join(tratti) if tratti else name) + '.'),
        'whoCanEnter': (access[0][:1].lower() + access[0][1:]) if len(set(access)) == 1 and access else None,
        'scheduleNotes': [OPEN_DATA_NOTE],
        'notes': ([f'Chi può entrare, per tratto: ' + ' | '.join(sorted(set(access)))] if len(set(access)) > 1 else []) + ([f'Ordinanza: {", ".join(ord_)}.'] if ord_ else []),
        'geo': write_geo(new_id, [amat(m) for m in members if amat(m)]),
        'sources': srcs([OPEN_DATA_PAGE] + [u for r in recs for u in r.get('sources', [])]),
        'checkedOn': CHECKED,
    }
    if unknown:
        z['scheduleUnknown'] = True
    if always:
        z['alwaysActive'] = True
    return z


OD = [
    ('ztl-navigli-notturna', 'ZTL Navigli notturna', 'ztl', ['ztl-navigli-notturna-via-borsi', 'ztl-navigli-notturna-argelati-fusetti-magolfa', 'ztl-navigli-notturna-paoli', 'ztl-navigli-notturna-pichi-gola'],
     ['navigli', 'navigli notturna', 'ztl navigli', 'via borsi', 'via argelati', 'via fusetti', 'via magolfa', 'via paoli', 'via pichi', 'via gola'], 'NAV', True,
     'Le vie della movida intorno ai Navigli (Borsi, Argelati, Fusetti, Magolfa, Paoli, Pichi, Gola). Tutte le sere dalle 20:00 alle 7:00 entrano solo gli autorizzati.'),
    ('ztl-navigli-fumagalli', 'ZTL Navigli (via Fumagalli)', 'ztl', ['ztl-navigli-fumagalli'], ['via fumagalli', 'fumagalli'], 'FUM', False, None),
    ('ztl-arco-della-pace', 'ZTL Arco della Pace', 'ztl', ['ztl-arco-della-pace'], ['arco della pace', 'piazza sempione', 'sempione'], 'ARC', False,
     'La zona intorno all\'Arco della Pace. Ogni notte dalle 22:00 alle 6:00 entrano solo gli autorizzati.'),
    ('ztl-monte-ceneri', 'ZTL Cavalcavia Monte Ceneri', 'ztl', ['ztl-cavalcavia-monte-ceneri'], ['monte ceneri', 'cavalcavia monte ceneri'], 'MC', False, None),
    ('ztl-ascanio-sforza', 'ZTL Ascanio Sforza', 'ztl', ['ztl-ascanio-sforza'], ['ascanio sforza', 'via ascanio sforza', 'via conchetta', 'scoglio di quarto'], 'AS', False, None),
    ('ztl-garibaldi', 'ZTL Garibaldi', 'ztl', ['ztl-garibaldi-sottoambito-1', 'ztl-garibaldi-sottoambito-2'], ['garibaldi', 'corso garibaldi', 'largo la foppa', 'via anfiteatro', 'via san simpliciano'], 'GAR', False, None),
    ('ztl-corso-como', 'ZTL Corso Como', 'ztl', ['ztl-corso-como'], ['corso como'], 'CC', False, None),
    ('ztl-ticinese', 'ZTL Ticinese', 'ztl', ['ztl-ticinese'], ['ticinese', 'via vetere', 'via scaldasole', 'molino delle armi'], 'TIC', False, None),
    ('ztl-guastalla', 'ZTL Via della Guastalla', 'ztl', ['ztl-via-della-guastalla'], ['guastalla', 'via della guastalla'], 'GUA', False, None),
    ('ztl-san-prospero', 'ZTL San Prospero', 'ztl', ['ztl-san-prospero'], ['san prospero', 'via san prospero'], 'SP', False, None),
    ('ztl-unione', "ZTL Via dell'Unione", 'ztl', ['ztl-via-dell-unione'], ['via dell unione'], 'UNI', False, None),
    ('ztl-san-dalmazio', 'ZTL San Dalmazio, Paolo Ferrari, Filodrammatici', 'ztl', ['ztl-san-dalmazio-paolo-ferrari-filodrammatici'], ['san dalmazio', 'paolo ferrari', 'filodrammatici'], 'SD', False, None),
    ('ztl-sant-agostino', "ZTL Sant'Agostino - Cesare da Sesto", 'ztl', ['ztl-sant-agostino-cesare-da-sesto'], ['sant agostino', 'piazza sant agostino', 'cesare da sesto'], 'SA', False, None),
    ('ztl-governo-provvisorio', 'ZTL Piazzale Governo Provvisorio', 'ztl', ['ztl-piazzale-governo-provvisorio'], ['governo provvisorio'], 'GP', False, None),
    ('ztl-betulle', 'ZTL Via delle Betulle', 'ztl', ['ztl-via-delle-betulle'], ['via delle betulle', 'betulle'], 'BET', False, None),
    ('ztl-barsanti-autari', 'ZTL Barsanti-Autari', 'ztl', ['ztl-barsanti-autari'], ['barsanti', 'autari'], 'BA', False, None),
    ('ztl-san-luigi', 'ZTL San Luigi, Scrivia, Don Bosco', 'ztl', ['ztl-san-luigi-scrivia-don-bosco'], ['san luigi', 'scrivia', 'don bosco'], 'SL', False, None),
    ('ztl-san-siro-eventi', 'ZTL San Siro Eventi', 'ztl', ['ztl-san-siro-eventi'], ['san siro', 'stadio', 'san siro eventi'], 'SS', False,
     'La zona intorno allo stadio di San Siro, attiva durante gli eventi.'),
    ('ap-brera', 'Area pedonale Brera', 'pedonale', ['ap-area-brera-area-pedonale-a', 'ap-area-brera-area-pedonale-b', 'ap-area-brera-area-pedonale-c', 'ap-area-brera-area-pedonale-d'],
     ['brera', 'via brera', 'via fiori oscuri', 'quartiere brera', 'ztl brera'], 'BRE', True, 'Le vie pedonali di Brera (via Brera, via Fiori Oscuri e dintorni). Chiusa alle auto, salvo deroghe.'),
    ('ap-sarpi', 'Area pedonale Paolo Sarpi', 'pedonale', ['ap-sarpi-sottoambito-a', 'ap-sarpi-sottoambito-b', 'ap-sarpi-sottoambito-c'],
     ['sarpi', 'paolo sarpi', 'via paolo sarpi', 'via sarpi', 'chinatown', 'china town', 'ztl sarpi'], 'SAR', True, 'Via Paolo Sarpi, la Chinatown di Milano, e le vie vicine. Chiusa alle auto, salvo deroghe.'),
    ('ap-navigli', 'Aree pedonali Navigli', 'pedonale', ['ap-navigli-ambito-a-alzaia-naviglio-grande', 'ap-navigli-ambito-b-ripa-di-porta-ticinese', 'ap-navigli-ambito-c-alzaia-naviglio-pavese', 'ap-alzaia-naviglio-pavese', 'ap-ripa-di-porta-ticinese-tra-via-paoli-e-via-valenza-e-controviale-sud'],
     ['alzaia', 'alzaia naviglio grande', 'alzaia naviglio pavese', 'naviglio grande', 'naviglio pavese', 'ripa di porta ticinese', 'ripa ticinese'], 'NP', False,
     'Le alzaie del Naviglio Grande e del Naviglio Pavese e la Ripa di Porta Ticinese. Chiuse alle auto, salvo deroghe.'),
    ('ap-duomo', 'Aree pedonali Duomo e centro', 'pedonale', ['ap-piazza-del-duomo', 'ap-area-duomo-sottoambito-marconi', 'ap-mercanti-cordusio', 'ap-area-scala-san-fedele-sottoambito-piazza-della-scala', 'ap-dante', 'ap-corso-vittorio-emanuele-ii'],
     ['duomo', 'piazza duomo', 'piazza del duomo', 'mercanti', 'via mercanti', 'cordusio', 'piazza cordusio', 'via dante', 'piazza della scala', 'scala', 'corso vittorio emanuele', 'vittorio emanuele', 'via marconi'], 'DUO', False,
     'Piazza del Duomo, via Mercanti e Cordusio, via Dante, piazza della Scala, corso Vittorio Emanuele. Chiuse alle auto, salvo deroghe.'),
    ('ap-ticinese', 'Aree pedonali Ticinese', 'pedonale', ['ap-corso-di-porta-ticinese-colonne-di-san-lorenzo', 'ap-piazza-xxiv-maggio'],
     ['colonne di san lorenzo', 'san lorenzo', 'piazza xxiv maggio', 'xxiv maggio', 'darsena'], 'XXIV', False,
     'Le Colonne di San Lorenzo e piazza XXIV Maggio. Chiuse alle auto, salvo deroghe.'),
]
for args in OD:
    zones.append(from_opendata(*args))

# ---------------------------------------------------------------- varchi
for name, fn in [('varchi-area-c', 'ingressi_areac_varchi.geojson'), ('varchi-area-b', 'areab_varchi.geojson')]:
    d = json.load(open(R('research', 'raw', fn)))
    with open(R('public', 'geo', f'{name}.geojson'), 'w') as fh:
        json.dump(d, fh, separators=(',', ':'))
zones[0]['gatesGeo'] = '/geo/varchi-area-c.geojson'
zones[1]['gatesGeo'] = '/geo/varchi-area-b.geojson'

# ---------------------------------------------------------------- multe
F = research['fines']
fines = {
    'ztl': {
        'min': F['ztl_access']['min_eur'], 'max': F['ztl_access']['max_eur'],
        'reducedPct': 30, 'reducedDays': 5, 'payDays': 60, 'prefettoDays': 60, 'giudiceDays': 30,
        'summary': 'Entrare in una ZTL, in un\'area pedonale o in una corsia riservata senza permesso costa da 83 a 332 euro (art. 7, comma 14, del Codice della Strada). Non toglie punti dalla patente.',
        'sources': srcs([F['ztl_access']['source_urn'], F['reduced_payment']['sources'][0], F['reduced_payment']['sources'][1]]),
    },
    'sections': [],
}
fines['summary'] = fines['ztl']['summary'] + ' Se paghi entro 5 giorni dalla notifica hai lo sconto del 30% (58,10 euro).'
fines['sources'] = fines['ztl']['sources']

# ---------------------------------------------------------------- override dalla verifica avversariale
for v in verified.get('overrides', []):
    for z in zones:
        if z['id'] == v['id']:
            z.update(v['fields'])
if verified.get('fines'):
    fines['ztl'].update(verified['fines'].get('ztl', {}))
    fines['sections'] = verified['fines'].get('sections', fines['sections'])

vehicle_notes = [
    {'text': 'La classe Euro è sul libretto di circolazione, alla voce V.9. Per i diesel Euro 6 conta anche la lettera (A, B, C oppure D-TEMP, D).', 'sources': [b['sources'][0]]},
    {'text': 'Per le auto a GPL o metano le regole dipendono dal motore di base: controlla il calendario dei divieti del Comune per il tuo caso.', 'sources': ['https://www.comune.milano.it/argomenti/mobilita/area-b-calendario-dei-divieti']},
    {'text': 'Moto, furgoni, camion e bus hanno calendari diversi da quelli delle auto: questa app considera le auto per il trasporto persone.', 'sources': ['https://www.comune.milano.it/argomenti/mobilita/area-c-calendario-dei-divieti', 'https://www.comune.milano.it/argomenti/mobilita/area-b-calendario-dei-divieti']},
]

all_sources = []
seen = set()
for s in research['sources']:
    if s['url'] not in seen:
        seen.add(s['url'])
        all_sources.append({'title': s['title'], 'url': s['url'], **({'note': s['note']} if s.get('note') else {})})

out = {
    'provisional': False,
    'updated': CHECKED,
    'defaultExitNote': 'I varchi elettronici controllano le targhe dei veicoli che entrano nella zona.',
    'zones': zones,
    'fines': fines,
    'vehicleNotes': vehicle_notes,
    'sources': all_sources,
}
js = ['// FILE GENERATO da scripts/build_data.py: non modificarlo a mano.',
      '// Fonti: Comune di Milano, portali Area B/Area C, Open Data Comune di Milano, Normattiva.']
for k, v in out.items():
    name = {'defaultExitNote': 'defaultExitNote', 'vehicleNotes': 'vehicleNotes'}.get(k, k)
    js.append(f'export const {name} = {json.dumps(v, ensure_ascii=False, indent=2)};')
with open(R('src', 'data', 'rules.js'), 'w') as fh:
    fh.write('\n'.join(js) + '\n')
print(f'zone: {len(zones)}, con geo: {sum(1 for z in zones if z.get("geo"))}, fonti: {len(all_sources)}')
