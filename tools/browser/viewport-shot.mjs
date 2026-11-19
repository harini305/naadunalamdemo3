import { chromium } from 'playwright-core';
const [out, ...paths] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const p of paths) {
  const [path, where] = p.split('@');
  await page.goto('http://localhost:3217' + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  if (where === 'bottom') { await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); }
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${out}/vp-${path.replace(/\W+/g, '_')}-${where || 'top'}.jpg`, type: 'jpeg', quality: 62 });
}
await browser.close();
