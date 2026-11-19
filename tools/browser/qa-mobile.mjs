// Mobile QA: horizontal overflow + console errors on every page type at phone/tablet widths.
import { chromium } from 'playwright-core';
const BASE = 'http://localhost:3217';
const PATHS = ['/', '/shop', '/product-category/aval-flakes', '/product/organic-turmeric-powder', '/store-listing', '/store/naadunalam', '/about-us', '/services', '/contact', '/blog', '/choosing-your-honey', '/privacy-policy', '/cart', '/checkout', '/wishlist', '/vendor-login', '/collaborators', '/nope'];
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
let bad = 0;
for (const [w, h] of [[390, 844], [360, 740], [768, 1024]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 600, hasTouch: w < 600 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 140)));
  page.on('console', (m) => { if (m.type() === 'error' && !/404|Failed to load/.test(m.text())) errs.push(m.text().slice(0, 140)); });
  for (const p of PATHS) {
    errs.length = 0;
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const over = document.documentElement.scrollWidth - innerWidth;
      const wide = over > 1 ? [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed').slice(0, 3).map((e) => e.className || e.tagName) : [];
      const tiny = [...document.querySelectorAll('main p, main li, main a, main span, main small')].filter((e) => e.offsetParent && e.childElementCount === 0 && e.textContent.trim().length > 2 && parseFloat(getComputedStyle(e).fontSize) < 12.5).length;
      return { over, wide, tiny, h: document.documentElement.scrollHeight };
    });
    const ok = r.over <= 1 && !errs.length;
    if (!ok) bad++;
    if (!ok || r.tiny) console.log(`${ok ? 'ok  ' : 'FAIL'} ${w}x${h} ${p} over=${r.over} ${r.wide.join(',')} tinyText=${r.tiny} ${errs.join(' | ')}`);
  }
  await ctx.close();
}
console.log(bad ? `${bad} problems` : 'MOBILE ALL PASS (no horizontal overflow, no console errors)');
await browser.close();
