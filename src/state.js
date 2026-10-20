// Stato condiviso: il profilo veicolo resta sul dispositivo (localStorage), mai inviato altrove
// se non insieme a una domanda all'assistente.
const KEY = 'ztl-milano:veicolo';
const listeners = new Set();

function read() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return v && typeof v.fuel === 'string' ? v : null;
  } catch {
    return null;
  }
}

let vehicle = read();

export const getVehicle = () => vehicle;

export function setVehicle(v) {
  vehicle = v;
  try {
    if (v) localStorage.setItem(KEY, JSON.stringify(v));
    else localStorage.removeItem(KEY);
  } catch {
    // archiviazione non disponibile (navigazione privata): il profilo vale solo per questa sessione
  }
  listeners.forEach((fn) => fn(v));
}

export function onVehicleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
