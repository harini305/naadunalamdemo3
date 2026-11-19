// Read-only behaviour checks on the SOURCE site + homepage recapture with the promo popup dismissed.
// Usage: node source-interactions.mjs <outDir>
// Never submits forms, never logs in, never adds to cart.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.argv[2];
const BASE = 'https://naadunalam.fastfilings.in';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = {};

async function closePopup(page) {
  const info = await page.evaluate(() => {
    const modal = document.querySelector('.elementor-popup-modal, .dialog-widget');
    return { popupPresent: !!modal, popupVisible: !!modal && getComputedStyle(modal).display !== 'none' };
  });
  for (const sel of ['.dialog-close-button', '.elementor-popup-modal .dialog-close-button']) {
    const el = await page.$(sel);
    if (el && (await el.isVisible())) { await el.click().catch(() => {}); break; }
  }
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(600);
  return info;
}

for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(2500);
  const popup = await closePopup(page);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += h / 2) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(150); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, `home-no-popup-${w}.jpg`), fullPage: true, type: 'jpeg', quality: 60 });
  results[`home_${w}`] = { ...popup, docHeight: await page.evaluate(() => document.documentElement.scrollHeight) };

  if (w === 390) {
    // Mobile menu
    const toggle = await page.$('.elementor-menu-toggle:visible, .nn-burger:visible, [aria-label*="menu" i]:visible');
    if (toggle) {
      await toggle.click().catch(() => {});
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT, `mobile-menu-open-390.jpg`), type: 'jpeg', quality: 60 });
      results.mobileMenu = { toggleFound: true, linksVisible: await page.evaluate(() =>
        Array.from(document.querySelectorAll('a')).filter((a) => a.offsetParent && a.getBoundingClientRect().top < innerHeight && /Shop|About|Contact/.test(a.textContent)).length) };
    } else results.mobileMenu = { toggleFound: false };
  }
  await ctx.close();
}

// Desktop: live product search (type only, no submit)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/shop/', { waitUntil: 'networkidle', timeout: 90000 });
  await closePopup(page);
  const input = await page.$('input[type="search"]:visible');
  if (input) {
    await input.type('samba', { delay: 60 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(OUT, 'search-typed-samba-1440.jpg'), type: 'jpeg', quality: 60 });
    results.search = await page.evaluate(() => ({
      suggestionBoxes: Array.from(document.querySelectorAll('[class*="search"] li, [class*="suggest"] a, [class*="autocomplete"] li'))
        .filter((e) => e.offsetParent).length,
    }));
  } else results.search = { inputFound: false };

  // Quick view on a product card (read-only modal)
  const qv = await page.$('a:has-text("Quick View")');
  if (qv) {
    await qv.hover().catch(() => {});
    await qv.click({ force: true }).catch(() => {});
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(OUT, 'quick-view-1440.jpg'), type: 'jpeg', quality: 60 });
    results.quickView = await page.evaluate(() => ({
      modalVisible: !!Array.from(document.querySelectorAll('[class*="quick"], [class*="modal"], .mfp-wrap')).find((e) => e.offsetParent && e.getBoundingClientRect().height > 200),
    }));
  } else results.quickView = { linkFound: false };

  // Shop filters / sort controls present?
  results.shopControls = await page.evaluate(() => ({
    orderby: !!document.querySelector('select.orderby'),
    orderbyOptions: Array.from(document.querySelectorAll('select.orderby option')).map((o) => o.textContent.trim()),
    pagination: Array.from(document.querySelectorAll('.page-numbers a, .woocommerce-pagination a')).map((a) => a.textContent.trim()),
    resultCount: document.querySelector('.woocommerce-result-count')?.textContent.trim() || '',
    productCardsOnPage: document.querySelectorAll('li.product, .rtsb-product, .product-item').length,
  }));

  // Variation selection: price change (no add to cart)
  await page.goto(BASE + '/product/organic-turmeric-powder/', { waitUntil: 'networkidle', timeout: 90000 });
  await closePopup(page);
  const sel = await page.$('select#pack, select[name="attribute_pa_pack"]');
  if (sel) {
    await sel.selectOption({ index: 2 }).catch(() => {});
    await page.waitForTimeout(1200);
    results.variation = await page.evaluate(() => ({
      shownVariationPrice: document.querySelector('.woocommerce-variation-price')?.textContent.trim() || '',
      addToCartEnabled: !document.querySelector('.single_add_to_cart_button')?.classList.contains('disabled'),
    }));
    // quantity control (+) — client-side only
    const plus = await page.$('.quantity .plus, button.plus, .rtsb-quantity-plus');
    const qty = await page.$('input.qty');
    if (plus && qty) { await plus.click().catch(() => {}); results.quantityPlus = await qty.inputValue(); }
    else results.quantityPlus = qty ? 'number input only (no +/- buttons found)' : 'no quantity input found';
  } else results.variation = { selectFound: false };
  await ctx.close();
}

fs.writeFileSync(path.join(OUT, 'interactions.json'), JSON.stringify(results, null, 1));
console.log(JSON.stringify(results, null, 1));
await browser.close();
