// Hero QA: one screen tall, no text over any face in the family photograph, buttons on one row.
import { chromium } from 'playwright-core';
const out = process.argv[2];
// face boxes in the source photo, as fractions of width / height
const FACES = [[0.01, 0.31, 0.15, 0.52], [0.17, 0.18, 0.29, 0.36], [0.40, 0.12, 0.54, 0.31], [0.53, 0.27, 0.63, 0.42],
  [0.73, 0.17, 0.86, 0.35], [0.31, 0.36, 0.44, 0.56], [0.63, 0.46, 0.75, 0.62], [0.88, 0.37, 1.0, 0.54]];
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
for (const [w, h] of [[1920, 1080], [1536, 864], [1440, 900], [1366, 768], [1280, 720], [1024, 768], [768, 1024], [390, 844], [360, 740]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: w < 600, hasTouch: w < 600 });
  await p.goto('http://localhost:3217/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  const r = await p.evaluate((FACES) => {
    const hero = document.querySelector('.hero3').getBoundingClientRect();
    const box = document.querySelector('.hero3__photo').getBoundingClientRect();
    const img = document.querySelector('.hero3__zoom img');
    // rendered image rect (object-fit: cover inside the box)
    const iw = img.naturalWidth, ih = img.naturalHeight, s = Math.max(box.width / iw, box.height / ih);
    const rw = iw * s, rh = ih * s;
    const pos = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    const ix = box.left + (box.width - rw) * pos[0], iy = box.top + (box.height - rh) * pos[1];
    const faces = FACES.map(([a, b2, c, d]) => ({ l: Math.max(ix + a * rw, box.left), t: Math.max(iy + b2 * rh, box.top), r: Math.min(ix + c * rw, box.right), b: Math.min(iy + d * rh, box.bottom) }))
      .filter((f) => f.r > f.l && f.b > f.t);
    const textEls = [...document.querySelectorAll('.hero3__h1 > span, .hero3__ta, .hero3__p, .hero3__ctas .btn, .hero3__feat li')].filter((e) => e.offsetParent);
    const hits = [];
    textEls.forEach((e) => {
      // use the actual text extent, not the block width
      const range = document.createRange(); range.selectNodeContents(e);
      [...range.getClientRects()].forEach((tr) => faces.forEach((f, i) => {
        if (tr.left < f.r && tr.right > f.l && tr.top < f.b && tr.bottom > f.t) hits.push(`${e.className || e.tagName}~face${i}`);
      }));
    });
    // every face corner must lie inside the active curved clip, and above the bottom wave
    const clipId = (getComputedStyle(document.querySelector('.hero3__photo')).clipPath.match(/#(\w+)/) || [])[1];
    const clipPathEl = clipId && document.querySelector(`#${clipId} path`);
    let clippedFaces = 0;
    if (clipPathEl) faces.forEach((f) => {
      const pts = [[f.l, f.t], [f.r, f.t], [f.l, f.b], [f.r, f.b]].map(([x, y]) => new DOMPoint((x - box.left) / box.width, (y - box.top) / box.height));
      if (pts.some((pt) => !clipPathEl.isPointInFill(pt))) clippedFaces++;
    });
    const wave = document.querySelector('.hero3__wave');
    const waveTop = wave && getComputedStyle(wave).display !== 'none' ? wave.getBoundingClientRect().top : Infinity;
    const facesUnderWave = faces.filter((f) => f.b > waveTop).length;
    const btns = [...document.querySelectorAll('.hero3__ctas .btn')].map((x) => Math.round(x.getBoundingClientRect().top));
    const facesCut = FACES.length - faces.length;
    const copy = document.querySelector('.hero3__copy').getBoundingClientRect();
    return { heroH: Math.round(hero.height), vh: innerHeight, facesVisible: faces.length, facesCut, clip: clipId, clippedFaces, facesUnderWave, textOverFace: [...new Set(hits)], btnRows: new Set(btns).size,
      copyTop: Math.round(copy.top), copyBottom: Math.round(copy.bottom), hscroll: document.documentElement.scrollWidth > innerWidth };
  }, FACES);
  console.log(`${w}x${h}`, JSON.stringify(r));
  await p.screenshot({ path: `${out}/hero-${w}x${h}.jpg`, type: 'jpeg', quality: 72 });
  await p.close();
}
await b.close();
