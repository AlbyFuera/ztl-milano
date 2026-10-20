// Genera le icone PNG della PWA da SVG (uso: node scripts/icons.mjs)
import { chromium } from '@playwright/test';
const icon = (size, pad) => {
  const r = (size / 2) * pad;
  const sw = r * 0.26;
  const c = size / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#5b3df5"/>
  <g transform="rotate(-10 ${c} ${c})">
    <circle cx="${c + r * 0.07}" cy="${c + r * 0.07}" r="${r}" fill="#17131f"/>
    <circle cx="${c}" cy="${c}" r="${r - sw / 2}" fill="#fff" stroke="#ff4d6a" stroke-width="${sw}"/>
    <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#17131f" stroke-width="${r * 0.06}"/>
    <text x="${c}" y="${c + r * 0.2}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${r * 0.52}" fill="#17131f">ZTL</text>
  </g></svg>`;
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
