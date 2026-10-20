// Genera le icone PNG della PWA da SVG (uso: node scripts/icons.mjs)
import { chromium } from '@playwright/test';
const icon = (size, pad) => {
  const r = (size / 2) * pad;
  const sw = r * 0.27;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#1F4E9C"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${r - sw / 2}" fill="#fff" stroke="#C8102E" stroke-width="${sw}"/>
  <text x="${size / 2}" y="${size / 2 + r * 0.2}" text-anchor="middle" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="${r * 0.58}" fill="#1C232B">ZTL</text></svg>`;
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
