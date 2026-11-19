// Functional QA: basket flow + internal link crawl (no external requests are made).
import { chromium } from 'playwright-core';
const BASE = 'http://localhost:3217';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const out = {};

// 1) simple product → add 2
await page.goto(BASE + '/product/kalanamak-rice', { waitUntil: 'networkidle' });
await page.click('button[aria-label="Increase quantity"]');
await page.click('.pd-add');
await page.waitForTimeout(400);
out.badgeAfterSimple = await page.textContent('.cart-pill');
out.toast = await page.textContent('.toast');
// 2) variable product → choose 250 g
await page.goto(BASE + '/product/organic-turmeric-powder', { waitUntil: 'networkidle' });
const before = await page.textContent('.pd2-price');
await page.click('.pd2-packs button:nth-child(2)');
const after = await page.textContent('.pd2-price');
out.variationPrice = { before, after };
await page.click('.pd-add');
await page.waitForTimeout(300);
// 3) card add on shop + search filter
await page.goto(BASE + '/shop', { waitUntil: 'networkidle' });
await page.fill('.mk__search input', 'கவுனி');
await page.waitForTimeout(300);
out.tamilSearchCount = await page.textContent('.mk__count');
await page.fill('.mk__search input', '');
await page.selectOption('.mk__sort select', 'price-asc');
out.cheapestFirst = await page.textContent('.product-grid .product-card__name');
// 4) cart totals
await page.goto(BASE + '/cart', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
out.cartLines = await page.$$eval('.cart-line', (els) => els.map((e) => e.querySelector('.cart-line__name strong').textContent + ' = ' + e.querySelector('.cart-line__total').textContent));
out.summary = await page.$$eval('.summary dl div', (els) => els.map((e) => e.textContent.replace(/\s+/g, ' ')));
// 5) remove + persistence across reload
await page.reload({ waitUntil: 'networkidle' });
out.linesAfterReload = await page.$$eval('.cart-line', (els) => els.length);
// 6) checkout renders form (do not submit — it would open a mail client)
await page.goto(BASE + '/checkout', { waitUntil: 'networkidle' });
out.checkoutFields = await page.$$eval('.checkout input, .checkout textarea', (els) => els.length);
out.checkoutButton = await page.textContent('.checkout button[type="submit"]');
// 7) wishlist
await page.goto(BASE + '/product/poongar-rice', { waitUntil: 'networkidle' });
await page.click('.pd-wish');
await page.goto(BASE + '/wishlist', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
out.wishlist = await page.$$eval('.wl-row__name strong', (els) => els.map((e) => e.textContent));
// 8) contact topic preselect
await page.goto(BASE + '/contact?topic=thai-pongal-combo', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
out.contactTopic = await page.$eval('#c-topic', (s) => s.value);
console.log(JSON.stringify(out, null, 1));

// Internal link crawl: every href found on every reachable page (BFS), check status
const seen = new Set(['/']);
const queue = ['/'];
const bad = [];
const external = new Set();
while (queue.length) {
  const p = queue.shift();
  const res = await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
  if (!res || res.status() >= 400) { bad.push(`${p} -> ${res && res.status()}`); continue; }
  const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  for (const h of hrefs) {
    if (/^(mailto:|tel:)/.test(h)) continue;
    if (/^https?:/.test(h)) { external.add(h); continue; }
    const path = h.split('#')[0].split('?')[0] || '/';
    if (!seen.has(path)) { seen.add(path); queue.push(path); }
  }
}
console.log(`crawled ${seen.size} internal paths | broken: ${bad.length ? bad.join(', ') : 'none'} | external links: ${external.size ? [...external].join(', ') : 'none'}`);
await browser.close();
