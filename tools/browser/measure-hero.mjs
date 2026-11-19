import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
for (const [w, h] of [[1920,1080],[1440,900],[1366,768],[1280,720],[1024,768],[768,1024],[390,844],[360,740]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w < 600 });
  await page.goto('http://localhost:3217/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  const r = await page.evaluate(() => {
    const lh = (el) => { const cs = getComputedStyle(el); return parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2; };
    const lines = (el) => Math.round(el.getBoundingClientRect().height / lh(el));
    const en = [...document.querySelectorAll('.hero__en > span')].map(lines);
    const ta = lines(document.querySelector('.hero__ta'));
    const hero = document.querySelector('.hero').getBoundingClientRect();
    const btns = [...document.querySelectorAll('.hero__ctas .btn')].map((b) => Math.round(b.getBoundingClientRect().top));
    const copy = document.querySelector('.hero__copy').getBoundingClientRect();
    const arch = document.querySelector('.hero__arch').getBoundingClientRect();
    return { fs: getComputedStyle(document.querySelector('.hero__copy h1')).fontSize, enLines: en, taLines: ta, heroH: Math.round(hero.height), vh: innerHeight,
      copyTop: Math.round(copy.top), copyBottom: Math.round(copy.bottom), archTop: Math.round(arch.top), archBottom: Math.round(arch.bottom), archW: Math.round(arch.width), btnRows: new Set(btns).size, hscroll: document.documentElement.scrollWidth > innerWidth };
  });
  console.log(w + 'x' + h, JSON.stringify(r));
  await page.close();
}
await browser.close();
