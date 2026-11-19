// QA: last section + footer must fill exactly one viewport on every page, at several desktop sizes.
// Also reports footer height, horizontal overflow and console errors.
// Usage: node qa-fit.mjs [path ...]
import { chromium } from 'playwright-core';

const BASE = process.env.BASE || 'http://localhost:3217';
const PATHS = process.argv.slice(2).length ? process.argv.slice(2) : [
  '/', '/shop', '/product-category/rice-grains', '/product/kalanamak-rice', '/product/organic-turmeric-powder',
  '/store-listing', '/store/thaayanbu', '/about-us', '/services', '/contact', '/blog', '/cold-pressed-vs-refined-oils',
  '/terms', '/shipping-policy', '/cart', '/checkout', '/wishlist', '/vendor-login', '/collaborators', '/this-does-not-exist',
];
const SIZES = (process.env.SIZES || '1920x1080,1536x864,1440x900,1366x768,1280x720,1024x768').split(',').map((s) => s.split('x').map(Number));

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const fails = [];
for (const [w, h] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
  page.on('console', (m) => { if (m.type() === 'error' && !/404|Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 120)); });
  for (const p of PATHS) {
    errs.length = 0;
    await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(600);
    const headerAtLoad = await page.evaluate(() => {
      const h = document.querySelector('.site-header');
      return !h.classList.contains('site-header--hidden') && h.getBoundingClientRect().bottom > 0;
    });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const main = document.querySelector('main');
      const secs = [...main.children].filter((e) => e.tagName === 'SECTION' || e.tagName === 'ARTICLE');
      const last = secs[secs.length - 1];
      const footer = document.querySelector('.site-footer');
      const lr = last.getBoundingClientRect();
      const fr = footer.getBoundingClientRect();
      return {
        lastH: Math.round(lr.height), footerH: Math.round(fr.height), vh: innerHeight,
        // short pages that do not scroll: header + section + footer must be exactly one screen
        scrollable: document.documentElement.scrollHeight > innerHeight + 1,
        diff: document.documentElement.scrollHeight > innerHeight + 1
          ? Math.round(lr.height + fr.height - innerHeight)
          : Math.round(document.querySelector('.site-header').getBoundingClientRect().height + lr.height + fr.height - innerHeight),
        lastTopOnScreen: Math.round(lr.top), // 0 = last section starts exactly at the viewport top
        hScroll: document.documentElement.scrollWidth - innerWidth,
        fit: last.classList.contains('fit-footer'),
      };
    });
    const ok = Math.abs(r.diff) <= 1 && r.hScroll <= 1 && !errs.length && headerAtLoad;
    if (!headerAtLoad) errs.push('HEADER HIDDEN ON LOAD');
    if (!ok) fails.push(`${w}x${h} ${p} ${JSON.stringify(r)} ${errs.join(' | ')}`);
    if (w === 1440) console.log(`${ok ? 'PASS' : 'FAIL'} ${p.padEnd(34)} last=${r.lastH} footer=${r.footerH} diff=${r.diff} hscroll=${r.hScroll}${errs.length ? ' ERR ' + errs[0] : ''}`);
  }
  await ctx.close();
}
console.log(fails.length ? `\n${fails.length} failures:\n` + fails.join('\n') : '\nALL PASS');
await browser.close();
