import { chromium } from 'playwright-core';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const run = async (w, h) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 600, hasTouch: w < 600 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  // empty state first
  await p.goto('http://localhost:3217/wishlist', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/wl-empty-${w}.jpg`, type: 'jpeg', quality: 72 });
  // save a starter from the empty state, then seed four more
  await p.click('.wl-pick .wish-btn');
  await p.evaluate(() => localStorage.setItem('nn-wishlist-v1', JSON.stringify(['black-kavuni-rice', 'organic-turmeric-powder', 'tulsi-infused-honey', 'kambu', 'cold-pressed-sesame-oil'])));
  await p.goto('http://localhost:3217/wishlist', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const before = await p.evaluate(() => ({ rows: document.querySelectorAll('.wl-row').length, groups: [...document.querySelectorAll('.wl-group__head h2')].map((h) => h.textContent), total: document.querySelectorAll('.wl__stats dd')[1]?.textContent, badge: document.querySelector('.hdr__wish .count')?.textContent }));
  // change turmeric pack to 250 g, then add all
  await p.selectOption('select[aria-label="Pack for Turmeric Powder"]', { label: '250 g' });
  const totalAfterPack = await p.evaluate(() => document.querySelectorAll('.wl__stats dd')[1]?.textContent);
  await p.click('text=Add all to basket');
  await p.waitForTimeout(400);
  const basket = await p.textContent('.cart-pill__count');
  await p.screenshot({ path: `${out}/wl-full-${w}.jpg`, type: 'jpeg', quality: 72, fullPage: true });
  console.log(w + 'x' + h, JSON.stringify({ ...before, totalAfterPack, basketAfterAddAll: basket, errs }));
  await ctx.close();
};
await run(1440, 900);
await run(390, 844);
await b.close();
