// Zone di prova: stessa forma di src/data/rules.js, valori volutamente semplici.
export const zones = [
  {
    id: 'area-c', name: 'Area C', type: 'congestion',
    aliases: ['area c', 'areac', 'cerchia dei bastioni'],
    schedule: [{ days: [1, 2, 3, 4, 5], from: '07:30', to: '19:30' }],
    holidaysOff: true,
    exitNote: "L'uscita è sempre libera.",
    sources: ['https://www.comune.milano.it/aree-tematiche/mobilita/area-c'],
  },
  {
    id: 'area-b', name: 'Area B', type: 'lez',
    aliases: ['area b', 'areab'],
    schedule: [{ days: [1, 2, 3, 4, 5], from: '07:30', to: '19:30' }],
    holidaysOff: true,
    vehicleBans: [{ fuel: ['diesel'], maxEuro: 5, since: '2025-10-01', label: 'Diesel fino a Euro 5' }],
    sources: ['https://www.comune.milano.it/aree-tematiche/mobilita/area-b'],
  },
  {
    id: 'brera', name: 'ZTL Brera', type: 'ztl',
    aliases: ['brera', 'ztl brera'],
    schedule: [{ days: [1, 2, 3, 4, 5, 6, 7], from: '20:00', to: '02:00' }],
    sources: ['https://www.comune.milano.it/ztl-brera'],
  },
  {
    id: 'sarpi', name: 'ZTL Paolo Sarpi', type: 'ztl',
    aliases: ['sarpi', 'paolo sarpi', 'chinatown'],
    alwaysActive: true,
    sources: ['https://www.comune.milano.it/ztl-sarpi'],
  },
];

export const fines = {
  summary: 'Da 83 a 332 euro (art. 7 del Codice della Strada), ridotta del 30% se paghi entro 5 giorni.',
  sources: ['https://www.normattiva.it/'],
};
