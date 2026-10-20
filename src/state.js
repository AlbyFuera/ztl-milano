// Stato condiviso tra le sezioni. Tutto resta sul dispositivo (localStorage):
// il veicolo viene inviato solo insieme a una domanda all'assistente.
const KEYS = { vehicle: 'ztl-milano:veicolo', places: 'ztl-milano:posti' };
const listeners = new Set();

function read(key, check) {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? 'null');
    return check(v) ? v : null;
  } catch {
    return null;
  }
}
function write(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // archiviazione non disponibile (navigazione privata): vale solo per questa sessione
  }
}

const state = {
  vehicle: read(KEYS.vehicle, (v) => v && typeof v.fuel === 'string'),
  places: read(KEYS.places, Array.isArray) ?? [],
  when: null, // null = adesso; altrimenti un istante (Date) scelto dall'utente
};

const emit = () => listeners.forEach((fn) => fn(state));
export const onChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

export const getVehicle = () => state.vehicle;
export function setVehicle(v) { state.vehicle = v; write(KEYS.vehicle, v); emit(); }
export const onVehicleChange = onChange;

export const getWhen = () => state.when;
export const resolveWhen = () => state.when ?? new Date();
export function setWhen(d) { state.when = d; emit(); }

export const getPlaces = () => state.places;
export function addPlace(p) {
  state.places = [...state.places.filter((x) => x.label !== p.label), p].slice(-12);
  write(KEYS.places, state.places);
  emit();
}
export function removePlace(label) {
  state.places = state.places.filter((x) => x.label !== label);
  write(KEYS.places, state.places);
  emit();
}
