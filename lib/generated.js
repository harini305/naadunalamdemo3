// Generated-image slots. The homepage is designed around original generated photography
// (see docs/image-generation/). Image generation was not available while this build was made, so each
// slot is resolved at build time: if the file exists in public/images/generated/, it is used; otherwise
// the section renders its designed interim composition. Nothing is substituted silently.
import fs from 'node:fs';
import path from 'node:path';

export const GENERATED = {
  heroDesktop: 'hero-seven-generations-desktop.webp',
  heroMobile: 'hero-seven-generations-mobile.webp',
  earth: 'panchabhootham-earth-nilam.webp',
  water: 'panchabhootham-water-neer.webp',
  fire: 'panchabhootham-fire-neruppu.webp',
  air: 'panchabhootham-air-kaatru.webp',
  space: 'panchabhootham-space-aagaayam.webp',
  thaayanbu: 'thaayanbu-naadu-nalam-hearth.webp',
};

export function generatedImage(key) {
  const file = GENERATED[key];
  if (!file) return null;
  const abs = path.join(process.cwd(), 'public', 'images', 'generated', file);
  return fs.existsSync(abs) ? `/images/generated/${file}` : null;
}
