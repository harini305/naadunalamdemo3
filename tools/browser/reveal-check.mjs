// Verify late-mounted [data-reveal] content becomes visible (wishlist suggestions, shop after filter reset).
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3217/wishlist', { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.setItem('nn-wishlist-v1', JSON.stringify(['black-kavuni-rice', 'organic-turmeric-powder', 'tulsi-infused-honey'])));
await p.goto('http://localhost:3217/wishlist', { waitUntil: 'networkidle' });
await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await p.waitForTimeout(1800);
const wl = await p.evaluate(() => [...document.querySelectorAll('.wl__more .product-card')].map((c) => getComputedStyle(c).opacity));
// shop: filter to Honey (1 product) then back to all, scroll down, check cards are visible
await p.goto('http://localhost:3217/shop', { waitUntil: 'networkidle' });
await p.click('.mk__cat:has-text("Honey")');
await p.waitForTimeout(400);
await p.click('.mk__cat:has-text("All products")');
await p.waitForTimeout(400);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 700) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(160); }
await p.waitForTimeout(1500);
const shop = await p.evaluate(() => { const cs = [...document.querySelectorAll('.product-grid--shop .product-card')]; return { cards: cs.length, hidden: cs.filter((c) => getComputedStyle(c).opacity === '0').length }; });
console.log(JSON.stringify({ wishlistSuggestionOpacity: wl, shopAfterFilterReset: shop }));
await b.close();
