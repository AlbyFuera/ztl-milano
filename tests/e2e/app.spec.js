import { test, expect } from '@playwright/test';

const REMOTE = Boolean(process.env.BASE_URL);
const DUOMO = { latitude: 45.4641, longitude: 9.1919 };

test.beforeEach(async ({ page }) => {
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|tiles|cartocdn/.test(m.text())) page.errors.push(m.text()); });
});
test.afterEach(async ({ page }) => {
  expect(page.errors, 'errori in console').toEqual([]);
});

test('home: stato live di tutte le zone', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Posso entrare?' })).toBeVisible();
  await expect(page.locator('.status-card .verdict-word')).toBeVisible();
  const rows = page.locator('.zone-list .zone-row');
  expect(await rows.count()).toBeGreaterThanOrEqual(4);
  expect(await page.locator('details.group').count()).toBe(2);
  await expect(page.locator('.zone-list')).toContainText('Area C');
  await expect(page.locator('.zone-list')).toContainText('Area B');
});

test('tab bar: ogni sezione si apre e si evidenzia', async ({ page }) => {
  await page.goto('/');
  const tabs = [
    ['Mappa', '#/mappa'],
    ['Chiedi', '#/chiedi'],
    ['Veicolo', '#/veicolo'],
    ['Multe', '#/multe'],
    ['Adesso', '#/adesso'],
  ];
  for (const [label, hash] of tabs) {
    await page.locator('.tabbar').getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${hash.replace('/', '\\/')}$`));
    await expect(page.locator('.tabbar').getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
  }
});

test('scheda zona: Area C con orari e fonti ufficiali', async ({ page }) => {
  await page.goto('/#/adesso');
  await page.locator('.zone-row', { hasText: 'Area C' }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Area C' })).toBeVisible();
  await expect(page.getByText('Quando è attiva')).toBeVisible();
  const links = page.locator('.sources a');
  expect(await links.count()).toBeGreaterThan(0);
  for (const href of await links.evaluateAll((as) => as.map((a) => a.href))) {
    expect(href).toMatch(/comune\.milano\.it|amat-mi\.it|normattiva\.it|gazzettaufficiale\.it/);
  }
});

test('zona inesistente mostra un messaggio utile', async ({ page }) => {
  await page.goto('/#/zona/non-esiste');
  await expect(page.getByRole('heading', { name: 'Zona non trovata' })).toBeVisible();
});

test('assistente: domenica a mezzogiorno Area C non è attiva', async ({ page }) => {
  await page.goto('/#/chiedi');
  await page.getByLabel('La tua domanda').fill('posso entrare in area c domenica alle 12?');
  await page.getByRole('button', { name: 'Chiedi', exact: true }).click();
  const bot = page.locator('.msg.bot').last();
  await expect(bot.locator('.verdict')).toHaveText('Sì');
  await expect(bot).toContainText('domenica');
  await expect(bot.locator('.sources a').first()).toBeVisible();
});

test('assistente: i suggerimenti funzionano e una zona sconosciuta chiede chiarimento', async ({ page }) => {
  await page.goto('/#/chiedi');
  await page.locator('.suggest button').first().click();
  await expect(page.locator('.msg.bot .verdict').first()).not.toBeEmpty();
  await page.getByLabel('La tua domanda').fill('posso entrare in zona pippo?');
  await page.getByLabel('La tua domanda').press('Enter');
  await expect(page.locator('.msg.bot').last().locator('.verdict')).toHaveText('Mi serve un dettaglio');
});

test('mappa: disegna le zone e lo slider cambia orario', async ({ page }) => {
  await page.goto('/#/mappa');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('path.leaflet-interactive').first()).toBeVisible({ timeout: 15000 });
  expect(await page.locator('path.leaflet-interactive').count()).toBeGreaterThanOrEqual(3);
  const label = page.locator('#when-label');
  // domenica: Area C spenta
  const sunday = page.locator('[data-day]').filter({ hasText: /^Domenica$/ });
  if (await sunday.count()) await sunday.click();
  await page.locator('#time-range').fill('720');
  await expect(label).toContainText('12:00');
  await expect(page.locator('#active-count')).toContainText('zone attive');
});

test('mappa: tocco su una zona apre la scheda', async ({ page }) => {
  await page.goto('/#/mappa');
  await expect(page.locator('path.leaflet-interactive').first()).toBeVisible({ timeout: 15000 });
  const box = await page.locator('#map').boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2 - 60);
  await expect(page.locator('#sheet.open h2')).toBeVisible();
  await page.locator('.sheet-close').click();
  await expect(page.locator('#sheet')).not.toHaveClass(/open/);
});

test('veicolo: diesel Euro 3 salvato resta dopo il ricaricamento', async ({ page }) => {
  await page.goto('/#/veicolo');
  await page.locator('.seg label', { hasText: 'Diesel' }).click();
  await page.getByLabel(/Classe Euro/).selectOption('3');
  await page.getByRole('button', { name: 'Salva veicolo' }).click();
  await expect(page.getByText('Veicolo salvato')).toBeVisible();
  await expect(page.locator('.zone-row', { hasText: 'Area B' })).toContainText('Non puoi entrare');
  await page.reload();
  await expect(page.getByLabel(/Classe Euro/)).toHaveValue('3');
  await page.getByRole('button', { name: 'Cancella' }).click();
  await expect(page.getByRole('button', { name: 'Cancella' })).toHaveCount(0);
});

test('multe: importi e scadenze dalla data di notifica', async ({ page }) => {
  await page.goto('/#/multe');
  await expect(page.locator('.amount').first()).toContainText('€');
  await page.getByLabel(/Data in cui l'hai ricevuto/).fill('2026-10-01');
  await page.getByLabel(/Data in cui l'hai ricevuto/).dispatchEvent('change');
  await expect(page.locator('.timeline li').first()).toContainText('6 ottobre 2026');
});

test('posizione: al Duomo sei dentro Area C', async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation(DUOMO);
  await page.goto('/#/adesso');
  await page.getByRole('button', { name: 'Dove sono?' }).click();
  await expect(page.locator('#loc-note')).toContainText('Area C', { timeout: 15000 });
  await expect(page.locator('#loc-note')).toContainText('Area B');
});

test('PWA: manifest valido, icone raggiungibili, service worker attivo', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  const manifest = await (await request.get(href)).json();
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.map((i) => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']));
  for (const icon of manifest.icons) expect((await request.get(icon.src)).status()).toBe(200);
  const sw = await page.evaluate(async () => (await navigator.serviceWorker.ready).active?.state);
  expect(sw).toBe('activated');
});

test('offline: dopo la prima visita l\'app e l\'assistente funzionano senza rete', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); // la pagina ora è controllata dal service worker
  await page.waitForLoadState('networkidle');
  await context.setOffline(true);
  await page.goto('/#/chiedi');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Chiedi' })).toBeVisible();
  await page.getByLabel('La tua domanda').fill('area c domenica alle 12');
  await page.getByLabel('La tua domanda').press('Enter');
  await expect(page.locator('.msg.bot .verdict').last()).toHaveText('Sì');
  await expect(page.locator('.msg.bot .by').last()).toContainText('senza connessione');
  await context.setOffline(false);
  page.errors = page.errors.filter((e) => !/Failed to load resource|ERR_INTERNET_DISCONNECTED|net::/.test(e));
});

test('API: risponde col verdetto calcolato @api', async ({ request }) => {
  test.skip(!REMOTE, 'solo sul sito pubblicato');
  const r = await request.post('/api/ask', { data: { question: 'posso entrare in area c domenica alle 12?' } });
  expect(r.status()).toBe(200);
  const body = await r.json();
  expect(body.verdict).toBe('si');
  expect(body.zoneId).toBe('area-c');
  const bad = await request.post('/api/ask', { data: {} });
  expect(bad.status()).toBe(400);
});

test('layout: nessuno scroll orizzontale su schermi piccoli @layout', async ({ page }) => {
  for (const hash of ['#/adesso', '#/chiedi', '#/veicolo', '#/multe', '#/fonti', '#/zona/area-c']) {
    await page.goto(`/${hash}`);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, hash).toBeLessThanOrEqual(0);
  }
});

test('verdetto a frase: scegliere "Domani alle 8" ricalcola la card', async ({ page }) => {
  await page.goto('/#/adesso');
  await page.getByRole('button', { name: /Cambia quando/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Domani alle 8' }).click();
  await expect(page.getByRole('button', { name: /Cambia quando/ })).toContainText('08:00');
  const word = await page.locator('.verdict-word').textContent();
  expect(['Puoi entrare', 'Puoi entrare pagando']).toContain(word.trim());
  await page.getByRole('button', { name: /Cambia quando/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Adesso' }).click();
  await expect(page.getByRole('button', { name: /Cambia quando/ })).toContainText('adesso');
});

test('mappa: cerco una via, vedo il verdetto e la salvo nei miei posti', async ({ page }) => {
  await page.route('https://nominatim.openstreetmap.org/**', (route) =>
    route.fulfill({ json: [{ lat: '45.4641', lon: '9.1919', name: 'Piazza del Duomo', display_name: 'Piazza del Duomo, Municipio 1, Milano, Lombardia' }] }),
  );
  await page.goto('/#/mappa?cerca=1');
  await page.getByLabel('Cerca una via o un posto a Milano').fill('piazza duomo');
  await page.locator('#map-results button').first().click();
  await expect(page.locator('#sheet.open h2')).toHaveText('Piazza del Duomo');
  await expect(page.locator('#sheet .verdict-list')).toContainText('Area C');
  await page.getByRole('button', { name: 'Salva nei miei posti' }).click();
  await page.goto('/#/adesso');
  await expect(page.locator('.zone-row', { hasText: 'Piazza del Duomo' })).toBeVisible();
});

test('veicolo: nome e permesso compaiono nella frase della home', async ({ page }) => {
  await page.goto('/#/veicolo');
  await page.getByLabel(/Come la chiami/).fill('Golf');
  await page.locator('.seg label', { hasText: 'Benzina' }).click();
  await page.getByLabel(/Classe Euro/).selectOption('6');
  await page.locator('.seg label', { hasText: 'Contrassegno disabili' }).click();
  await page.getByRole('button', { name: 'Salva veicolo' }).click();
  await page.goto('/#/adesso');
  await expect(page.getByRole('link', { name: /Cambia veicolo/ })).toContainText('Golf');
});
