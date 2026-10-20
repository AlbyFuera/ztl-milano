// Festività nazionali italiane + Sant'Ambrogio (patrono di Milano, 7 dicembre).
const FIXED = {
  '1-1': 'Capodanno',
  '1-6': 'Epifania',
  '4-25': 'Festa della Liberazione',
  '5-1': 'Festa del Lavoro',
  '6-2': 'Festa della Repubblica',
  '8-15': 'Ferragosto',
  '11-1': 'Ognissanti',
  '12-7': "Sant'Ambrogio",
  '12-8': 'Immacolata Concezione',
  '12-25': 'Natale',
  '12-26': 'Santo Stefano',
};

// Algoritmo di Meeus/Jones/Butcher (calendario gregoriano).
export function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

export function italianHoliday(year, month, day) {
  const fixed = FIXED[`${month}-${day}`];
  if (fixed) return fixed;
  const e = easterSunday(year);
  const easter = Date.UTC(year, e.month - 1, e.day);
  const diff = Math.round((Date.UTC(year, month - 1, day) - easter) / 86400000);
  if (diff === 0) return 'Pasqua';
  if (diff === 1) return "Lunedì dell'Angelo";
  return null;
}
