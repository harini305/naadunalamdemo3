// Screenshot the LOCAL rebuild for visual QA.
// Usage: node shots.mjs <outDir> <width>x<height> <path> [path...]   (full-page JPEGs; phone widths emulate mobile)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [OUT, size, ...paths] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const BASE = process.env.BASE || 'http://localhost:3217';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 600, hasTouch: w < 600, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));
for (const p of paths) {
  await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(900);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += Math.round(h * 0.6)) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(140); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2400);
  const name = (p === '/' ? 'home' : p.replace(/^\//, '').replace(/[/?=&]+/g, '_')) + `-${w}x${h}.jpg`;
  await page.screenshot({ path: path.join(OUT, name), fullPage: true, type: 'jpeg', quality: 70 });
  const hs = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log('shot', name, 'docH', H, hs > 1 ? `H-SCROLL ${hs}px` : '');
}
if (errors.length) console.log('CONSOLE ERRORS:\n' + [...new Set(errors)].join('\n'));
await browser.close();
