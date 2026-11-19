import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const msgs = [];
page.on('console', (m) => { if (m.type() === 'error') msgs.push(m.text()); });
await page.goto('http://localhost:3217' + (process.argv[2] || '/'), { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
for (const m of msgs) { const i = m.indexOf('+'); console.log(m.slice(0, 300)); console.log('...DIFF...'); console.log(m.split('\n').filter((l) => /^\s*[+-]/.test(l)).slice(0, 20).join('\n')); }
await browser.close();
