// Genera le icone PNG della PWA da SVG (uso: node scripts/icons.mjs)
import { chromium } from '@playwright/test';
const icon = (size, pad) => {
  const r = (size / 2) * pad;
  const sw = r * 0.2;
  const c = size / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ececf0"/></linearGradient></defs>
  <rect width="${size}" height="${size}" fill="url(#g)"/>
  <circle cx="${c}" cy="${c + r * 0.04}" r="${r}" fill="rgba(0,0,0,0.08)"/>
  <circle cx="${c}" cy="${c}" r="${r - sw / 2}" fill="#fff" stroke="#ff453a" stroke-width="${sw}"/>
  <text x="${c}" y="${c + r * 0.17}" text-anchor="middle" font-family="-apple-system, Helvetica, Arial, sans-serif" font-weight="700" font-size="${r * 0.46}" fill="#1d1d1f" letter-spacing="-1">ZTL</text></svg>`;
};
const out = [
  ['public/icons/icon-192.png', 192, 0.84],
  ['public/icons/icon-512.png', 512, 0.84],
  ['public/icons/icon-maskable-512.png', 512, 0.66],
  ['public/icons/apple-touch-icon.png', 180, 0.8],
];
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [file, size, pad] of out) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0">${icon(size, pad)}</body></html>`);
  await page.screenshot({ path: file, omitBackground: false });
}
await browser.close();
console.log('icone generate');
