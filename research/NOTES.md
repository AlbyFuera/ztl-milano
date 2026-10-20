# ZTL Milano: research notes (2026-10-20)

Sources: comune.milano.it, the official Area B/C portals run by ATM for the Comune (areac.atm-mi.it, areab.atm.it), dati.comune.milano.it, normattiva.it. Every fact in `rules.json` has a `source` URL. Anything I could not confirm is marked `unverified: true`.

Access note: comune.milano.it returns 403 to curl/WebFetch. I read it through a real browser, and its PDFs with pdf.js inside the page.

## Area C (Cerchia dei Bastioni)
- **When:** Mon-Fri 7:30-19:30, holidays excluded, all year (including August).
- **Gates:** 43 varchi: 6 for public transport only, 1 for permit holders only.
- **Prices (since 30/10/2023):**
  - €7.50 ordinary.
  - Residents: 50 free entries a year (since 1/1/2024), then €3.00 each.
  - €4.50 for service vehicles and for cars parked in partner garages.
  - €22.50 late ticket, paid within 7 days via MyAreaC.
- **Payment:**
  - The ticket must be activated by 24:00 of the day after entry. Garage tickets must be activated the same day.
  - Channels: online, Intesa ATMs, parcometri, SISAL/PUNTOLIS/LIS, Telepass (Italian plates only), UnipolMove, PayPal, old RID, phone 02 4868 4001.
  - No SMS channel is listed.
- **On exit:** cameras read only entries, so nothing is charged on exit.
- **Free entry:**
  - Electric vehicles.
  - Hybrid cars with CO2 ≤100 g/km.
  - Motorcycles and mopeds that are not banned.
  - CUDE disability pass holders.
  - Historic vehicles over 40 years old.
  - Hybrids in categories M2/M3/N have paid since 1/10/2023.
- **Bans:**
  - Vehicles longer than **7.5 m**. The 12 m limit applies to Area B.
  - Goods vehicles 8:00-10:00, unless they have a deroga.
  - The environmental calendar, which runs to 2030.
- **Changes in 2026:** DGC 140/2026 and Ord. 373/2026 moved the motorcycle bans (2-stroke Euro 2-3, diesel Euro 2-3, 4-stroke Euro 0-2) to **1/10/2027**.

## Area B (LEZ)
- **When:** Mon-Fri 7:30-19:30, holidays excluded. Dangerous goods are banned around the clock, 7 days a week.
- **Gates:** 186 varchi. No fee is charged.
- **Bans on cars:**
  - Already banned: petrol Euro 0-2, all diesel Euro 0-5.
  - Petrol Euro 3 since 1/10/2025.
  - Petrol Euro 4 and diesel Euro 6 A-B-C from 1/10/2028.
  - Diesel Euro 6 D-TEMP/D from 1/10/2030.
- **No new ban on 1/10/2026.** What changed that day is the deroghe scheme:
  - In the first year of a ban, every vehicle gets 50 days.
  - From the second year, every vehicle gets 5 days automatically.
  - Residents and firms with a site in Milan get 20 extra days, counted per tax code, not per plate. They must register and switch on "rilevazione automatica".
- **Other bans:**
  - Goods vehicles longer than 12 m.
  - Trucks and buses without blind-spot systems: N3/M3 since 2023, N2/M2 since 2024. Police and fire vehicles are exempt until 1/10/2027 (Ord. 2338/2026).
- **Free entry:** hybrid and electric vehicles. MoVe-In works as a km-based alternative.

## Other ZTLs
- **New ZTLs, verified on Comune pages:**
  - **Quadrilatero della Moda:** active 24/7 since 12/05/2025, fines since 15/09/2025. Motorcycles are allowed until 11/05/2028. Goods loading 9-11 and 20-01.
  - **Isola:** active 19:30-6:00 every day since 20/04/2026, fines since 07/09/2026. It also contains 24/7 pedestrian areas (Borsieri, Pepe, Toce, Minniti).
- **Older ZTLs and pedestrian areas (Brera, Sarpi, Mercanti-Cordusio, Duomo, Navigli, Guastalla, Garibaldi, Corso Como, Ticinese, Ascanio Sforza…):** taken from Open Data ds51, whose data dates to 2023-05-02. Each is marked `unverified_current`.
- **Not found** as a ZTL: Città Studi.
- **No text list of gate names** for these ZTLs; there are only map images.

## Fines (CdS)
- **Entering a ZTL or pedestrian area:** art. 7 c.14, **€83-€332**, text in force from 25/4/2026.
  - With the art. 202 reduction (30% off within 5 days) that is €58.10. Within 60 days it is €83, plus notification costs.
- **Area B and banned-vehicle cases:** these could fall under c.13-bis instead (€168-678, licence suspension if repeated). Which one the Comune applies is **unverified**.
- **Points:** no points are deducted for ZTL entry. This is inferred: the Fascicolo prepayment service covers ZTL/Area B/Area C fines and excludes fines that cost points.
- **How notices arrive:** by registered mail via Sailpost. If you register your plate in the Fascicolo del Cittadino, you can pay within 5 days of the alert and avoid notification costs.
- **Appeals:** to the Prefetto within 60 days, or the Giudice di Pace within 30.
- **Tolerance:** no grace period appears in official sources.

## Datasets (CC-BY, all tested with HTTP 200)
| What | GeoJSON URL | Size | Data date |
|---|---|---|---|
| Polygons: AP, ZTL, AREA_C, AREA_B, DT, DA (217 features) | https://dati.comune.milano.it/dataset/d7d9179a-8228-427f-9c86-1e30154be4fe/resource/d788b26b-31b4-4e57-992d-276a1280c8c2/download/disciplina_aree.geojson | 819 KB | 2023-05-02, **missing Quadrilatero and Isola** |
| Area C gates, 42 points | https://dati.comune.milano.it/dataset/4cad1605-8225-4ecd-9b82-868b3af453e5/resource/fa8fcc31-1722-4a50-a0ae-ce7b9c0d0361/download/ingressi_areac_varchi.geojson | 7 KB | 2026-10-14 |
| Area B gates, 188 points with status | https://dati.comune.milano.it/dataset/cebfe28e-a50e-4b81-9d14-7b0d37170f0d/resource/c3439df3-673d-45e7-b151-c6d8d70ba0e4/download/areab_varchi.geojson | 48 KB | 2023-11-07 |

All three are CRS84 (lon/lat) and served as `application/geo+json`. SHP and CSV versions are listed in `rules.json`.

**Gaps:**
- No geometry exists yet for the Quadrilatero and Isola ZTLs; they would have to be drawn from the official map and street list.
- No gate points exist for the smaller ZTLs.
- The Comune's ArcGIS geoportal was unreachable, so it is untested as a data source.
