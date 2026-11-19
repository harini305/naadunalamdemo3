import { chromium } from 'playwright-core';
const [out, sel, ...fracs] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3217/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
for (const f of fracs) {
  // place the element's top at f * viewport height
  await page.evaluate(([s, ff]) => { const el = document.querySelector(s); const y = el.getBoundingClientRect().top + scrollY - innerHeight * ff; window.scrollTo(0, y); }, [sel, Number(f)]);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}-${f}.jpg`, type: 'jpeg', quality: 60 });
}
await browser.close();
