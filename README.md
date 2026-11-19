# Naadu Nalam — நாடு நலம்

A rebuild of https://naadunalam.fastfilings.in/ as a premium Tamil heritage marketplace, built around **ஏழு தலைமுறை — பரம்பரை** (seven generations), Iyarkai Panchabhootham and the Thaayanbu + Naadu Nalam story.

## Run

```bash
npm install
npm run dev        # http://localhost:3217
npm run build      # static build of 124 routes
```

## Where things are

| Path | What |
|---|---|
| `app/` | Routes (Next.js App Router, JavaScript) |
| `components/`, `components/home/` | UI. GSAP + ScrollTrigger via `@gsap/react` |
| `styles/`, `app/globals.css` | Design tokens and styles |
| `data/` | Catalogue extracted from the source: 82 products, 12 categories, 2 sellers, 8 posts, 4 policies |
| `lib/site.js` | Business details, the seven-generation terms, values and the Pongal combo |
| `public/images/` | Optimised WebP images (`catalog/` originals, `client/` client-supplied, `site/`, `brand/`) |
| `docs/source-discovery/` | Audit, inventories, asset manifest, brand reference, issues and owner questions, implementation plan |
| `docs/image-generation/prompts.md` | Image status and generation prompts |
| `original-assets/` | Untouched originals from the source site and the client (gitignored, kept on disk) |
| `tools/discovery/` | Crawl, extract, download and data-build scripts (Python) |
| `tools/browser/` | Screenshot and QA scripts (Playwright with the system Chrome) |

Frontend only: the basket and wishlist are stored on the device; checkout and forms compose an email to hello@naadunalam.in.
