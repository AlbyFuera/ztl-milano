import { defineConfig, devices } from '@playwright/test';

// In locale prova la build di produzione (vite preview, senza /api → assistente in modalità locale).
// Con BASE_URL=https://… prova il sito pubblicato, API comprese.
const BASE_URL = process.env.BASE_URL;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  retries: BASE_URL ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL ?? 'http://localhost:4173',
    ...devices['Pixel 7'],
    locale: 'it-IT',
    timezoneId: 'Europe/Rome',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'small-phone', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 640 } }, grep: /@layout/ },
  ],
  webServer: BASE_URL
    ? undefined
    : { command: 'npm run build && npm run preview', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 120000 },
});
