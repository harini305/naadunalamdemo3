// Screenshot the SOURCE site at 1440 / 768 / 390 and record read-only behaviour observations.
// Usage: node source-shots.mjs <outDir>
// Read-only: never submits forms, never logs in, never adds to cart.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.argv[2];
const BASE = 'https://naadunalam.fastfilings.in';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PAGES = [
  ['home', '/'], ['shop', '/shop/'], ['category-rice', '/product-category/rice-grains/'],
  ['product-turmeric', '/product/organic-turmeric-powder/'], ['product-ponni', '/product/ponni-arisi/'],
  ['about', '/about-us/'], ['how-ordering-works', '/services/'], ['reviews', '/testimonials/'],
  ['contact', '/contact/'], ['blog', '/blog/'], ['post-oils', '/cold-pressed-vs-refined-oils/'],
  ['store-thaayanbu', '/store/thaayanbu/'], ['store-listing', '/store-listing/'], ['vendor-login', '/vendor-login/'],
  ['collaborators', '/collaborators/'], ['events', '/events/'], ['cart', '/cart/'], ['my-account', '/my-account/'],
  ['shipping-policy', '/shipping-policy/'],
];
const WIDTHS = [[1440, 900], [768, 1024], [390, 844]];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const obs = [];
for (const [w, h] of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1,
    isMobile: w < 500, hasTouch: w < 500 });
  const page = await ctx.newPage();
  for (const [name, p] of PAGES) {
    const file = path.join(OUT, `${name}-${w}.jpg`);
    try {
      await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 90000 });
      await page.waitForTimeout(1200);
      // nudge lazy images: scroll through the page then back up
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += h) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      const m = await page.evaluate(() => ({
        docH: document.documentElement.scrollHeight,
        hScroll: document.documentElement.scrollWidth > window.innerWidth + 1,
        scrollW: document.documentElement.scrollWidth,
        title: document.title,
        burgerVisible: !!Array.from(document.querySelectorAll('.elementor-menu-toggle, .menu-toggle, [aria-label*="Menu" i]'))
          .find((el) => el.offsetParent !== null),
        headerH: (document.querySelector('.elementor-location-header') || document.querySelector('header'))?.getBoundingClientRect().height || 0,
        stickyHeader: getComputedStyle(document.querySelector('.elementor-location-header > *') || document.body).position,
        imgs: document.images.length,
        brokenImgs: Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0 && !i.src.startsWith('data:')).map((i) => i.src).slice(0, 8),
        fontsLoaded: Array.from(document.fonts).filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '') + ' ' + f.weight).slice(0, 20),
      }));
      await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 62 });
      obs.push({ page: name, url: BASE + p, width: w, ...m, screenshot: path.basename(file) });
      console.log('ok', w, name, m.docH, m.hScroll ? 'H-SCROLL' : '');
    } catch (e) {
      obs.push({ page: name, url: BASE + p, width: w, error: String(e).slice(0, 200) });
      console.log('ERR', w, name, String(e).slice(0, 120));
    }
  }
  await ctx.close();
}
fs.writeFileSync(path.join(OUT, 'observations.json'), JSON.stringify(obs, null, 1));
await browser.close();
