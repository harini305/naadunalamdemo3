"""Generate docs/source-discovery/page-inventory.md from the crawl (pages.json) + hand-written annotations.

Usage: python -I -X utf8 tools/discovery/build_page_inventory.py <project_root>
"""
import json, os, sys

ROOT = sys.argv[1]
RAW = os.path.join(ROOT, "docs", "source-discovery", "raw")
pages = json.load(open(os.path.join(RAW, "pages.json"), encoding="utf-8"))
BASE = "https://naadunalam.fastfilings.in"

# key -> (purpose, content to preserve, problems, decision → new route)
A = {
 "page/home": ("Marketplace landing page.", "Hero copy ('Naturally Grown Food, Straight From Local Sellers'), category list, 'Many Sellers. One Basket.' copy, 'Built Around Trust, Not Volume' points, Thai Pongal combo popup (2 flyers + TST Deepavali flyer).",
   "Promo popup covers the page on load; 'Whole Spices… Eighteen varieties… Starting at ₹40' links to an empty category; '100% Natural · Locally Sourced · Chemical Free' unverifiable claims; social links are '#'.", "Rebuilt from scratch → `/` (seven-generation concept)."),
 "page/shop": ("Product listing (12 per page, 7 pages).", "All 82 products (captured via Store API).", "Pagination only, no category sidebar on page 1 view.", "→ `/shop` (client-side filter, search, sort; all 82 on one page)."),
 "page/about-us": ("Brand story.", "All headings and paragraphs, Tamil tagline 'நம்ம மண்ணின் சுவை. நம்ம மக்களின் நலம்.', values Nambikkai/Nalam/Marabu, product philosophy lists.", "None beyond generic stock-like imagery.", "→ `/about-us` (Our Story), copy verbatim."),
 "page/services": ("'How Ordering Works' — services, steps, values.", "Steps Explore/Choose/Order/Receive, delivery ₹50, COD, service blurbs.", "'Always free from chemicals and pesticides' is an unverifiable claim.", "→ `/services`, claim line omitted (see issues)."),
 "page/testimonials": ("Customer Reviews page — states no reviews published yet + review policy.", "Review policy (4 rules), 'We would rather show you nothing…'.", "No reviews exist; page is mostly filler.", "Merged into `/about-us#reviews`; `/testimonials` redirects."),
 "page/contact": ("Contact details + Contact Form 7 form.", "Address, phone, email, Telegram, hours, consent text.", "Map section says 'Our location' but shows no map; Telegram link leaves the site.", "→ `/contact` (pinned details + email-composing form)."),
 "page/blog": ("Blog archive page 1 (6 posts) with sidebar.", "Post titles, dates, excerpts, images.", "Author shown as 'Superadmin'; pagination link '/blog/2/'.", "→ `/blog` (all 8 posts on one page)."),
 "page/privacy-policy": ("Privacy policy (11 sections, updated 25/08/2026).", "Full text.", "—", "→ `/privacy-policy`, verbatim from extraction."),
 "page/refund-policy": ("Return & Refund policy (8 sections).", "Full text.", "—", "→ `/refund-policy`, verbatim."),
 "page/shipping-policy": ("Shipping policy (6 sections).", "Full text incl. delivery windows and ₹50 fee.", "Mentions fruits/vegetables/frozen items that are not in the current catalogue.", "→ `/shipping-policy`, verbatim."),
 "page/terms": ("Terms of Service (16 sections).", "Full text.", "—", "→ `/terms`, verbatim."),
 "page/store-listing": ("Dokan store directory (2 stores).", "Store names, links.", "Stores use Dokan default banner + 'mystery person' avatar; Naadu Nalam store phone '8123456456' looks like a placeholder.", "→ `/store-listing` (seller panels with real product photos)."),
 "page/vendor-login": ("Vendor sign-in + Dokan vendor registration.", "'Sell on Naadu Nalam' copy and 3 bullets.", "Requires a WordPress backend; cannot work in a frontend-only rebuild.", "→ `/vendor-login` as 'Sell on Naadu Nalam' with an email-composing application form."),
 "page/collaborators": ("Collaborators hub — placeholder ('coming soon').", "Intro, 'How collaboration works here' points.", "No real collaborator details yet.", "Merged into `/collaborators` (Community)."),
 "page/collaborators__tst-music-dance-academy": ("Collaborator placeholder.", "Name only.", "'Details coming soon'.", "Listed on `/collaborators`; URL redirects there."),
 "page/collaborators__tst-event-mgt": ("Collaborator placeholder with a Deepavali Fund flyer.", "Name; flyer image.", "Flyer advertises a 52-week instalment scheme (financial product) — not promoted in the rebuild.", "Listed on `/collaborators`; URL redirects there."),
 "page/collaborators__ignite-our-tharas-kids-kondaatam": ("Collaborator placeholder.", "Name only.", "'Details coming soon'.", "Listed on `/collaborators`; URL redirects there."),
 "page/collaborators__queen-bees-math-tutoring": ("Collaborator placeholder.", "Name only.", "'Details coming soon'.", "Listed on `/collaborators`; URL redirects there."),
 "page/collaborators__bharathanaatiyam": ("Collaborator placeholder.", "Name only.", "'Details coming soon'.", "Listed on `/collaborators`; URL redirects there."),
 "page/events": ("Events placeholder — nothing scheduled.", "Three planned event kinds.", "Placeholder only.", "Merged into `/collaborators#events`."),
 "page/calendar": ("12-month calendar placeholder with season labels.", "Month → season mapping (Pongal season, cool season, summer, SW/NE monsoon).", "No entries.", "Merged into `/collaborators#calendar` (season strip)."),
 "page/research-articles": ("Research placeholder + 3 blog teasers.", "Intro and invitation to researchers.", "No research published.", "Merged into `/collaborators#research`."),
 "page/newsletter": ("Empty page (title only).", "—", "No content.", "Redirect → `/contact`."),
 "page/angietesting": ("Empty test page left published.", "—", "Should be unpublished on the source.", "Redirect → `/`."),
 "utility/cart": ("WooCommerce cart (empty state verified).", "'Good food, brighter days!', COD note.", "—", "→ `/cart` (client-side basket)."),
 "utility/checkout": ("Checkout — redirects to cart when empty.", "—", "Could not be inspected with items (no add-to-cart performed by design).", "→ `/checkout` (email-composed COD order, no payment)."),
 "utility/my-account": ("Login + registration (customer/vendor).", "—", "Backend-only.", "Redirect → `/cart`."),
 "utility/my-orders": ("Redirects to my-account.", "—", "Backend-only.", "Redirect → `/cart`."),
 "utility/dashboard": ("Dokan dashboard → vendor login page.", "—", "Backend-only.", "Redirect → `/vendor-login`."),
 "utility/wishlist": ("Wishlist page (empty for a new visitor).", "—", "—", "→ `/wishlist` (saved on device)."),
 "utility/compare": ("Empty compare page.", "—", "No content.", "Redirect → `/shop`."),
 "utility/store__naadunalam": ("Dokan storefront — 54 products.", "Store name, products.", "Default Dokan banner/avatar.", "→ `/store/naadunalam`."),
 "utility/store__thaayanbu": ("Dokan storefront — 28 products.", "Store name, products.", "Default Dokan banner/avatar; contact first/last name is a person's name (not shown).", "→ `/store/thaayanbu`."),
 "utility/store__superadmin": ("404 — admin store has no storefront.", "—", "—", "Not rebuilt."),
 "utility/shop__page__2": ("Shop pagination page 2.", "—", "—", "Redirect `/shop/page/*` → `/shop`."),
 "utility/blog__page__2": ("Blog pagination page 2 (2 posts).", "—", "—", "Redirect → `/blog`."),
 "utility/this-page-does-not-exist-404-check": ("Theme 404 page.", "—", "—", "Custom 404 built."),
}

lines = ["# Page inventory", "",
         "Every URL discovered on the source (sitemaps + navigation + Dokan/WooCommerce utility routes), what it contains, and what happened to it in the rebuild.",
         "Facts (title, headings, images, links, forms) come from the crawl in `raw/pages.json`; verbatim reading-order text for each page is in `raw/text/<kind>/<slug>.md`.",
         "All pages returned HTTP 200 unless noted. Nothing was submitted, no login was attempted and nothing was added to a cart.", "",
         "## Summary", "",
         "| Group | Count | Rebuild |", "|---|---|---|",
         "| Content pages (sitemap) | 24 | 13 rebuilt as pages, 10 merged/redirected, 1 test page dropped |",
         "| Blog posts | 8 | All kept at their original root URLs |",
         "| Products | 82 | All kept at `/product/<slug>` |",
         "| Product categories | 12 (+1 empty 'spices' category) | All 12 kept at `/product-category/<slug>`; empty 'spices' redirects to Masala & Powders |",
         "| Blog categories / tags / brand | 4 / 8 / 1 | Redirect to `/blog` or `/shop` |",
         "| Seller storefronts | 2 (+ empty superadmin) | `/store/naadunalam`, `/store/thaayanbu` |",
         "| Utility routes (cart, checkout, account, wishlist, compare, dashboard) | 7 | cart, checkout, wishlist rebuilt client-side; account routes redirect |", "",
         "## Page records", ""]
order = sorted(pages.items(), key=lambda kv: (["page", "utility", "post"].index(kv[1]["kind"]) if kv[1]["kind"] in ("page", "utility", "post") else 9, kv[0]))
for key, p in order:
    if p["kind"] not in ("page", "utility", "post"):
        continue
    slug = p["slug"].replace("__", "/")
    url = BASE + "/" + ("" if slug == "home" else slug + "/")
    purpose, keep, problems, decision = A.get(key, ("Blog post." if p["kind"] == "post" else "—",
                                                     "Title, date, excerpt, body text, featured image." if p["kind"] == "post" else "—",
                                                     "Body mentions produce that is not in the current catalogue (e.g. vegetables, fruit, whole spices)." if p["kind"] == "post" and any(s in key for s in ["vegetables", "spices", "fruit", "many-sellers"]) else "—",
                                                     f"Kept at `/{p['slug']}` (same URL)." if p["kind"] == "post" else "—"))
    imgs = [i.split("/uploads/")[-1] for i in p["images"] if "/uploads/" in i][:6]
    links = [l.replace(BASE, "") for l in p["links"] if l.startswith(BASE) or l.startswith("/")][:10]
    lines += [f"### {p['title'] or slug}", "",
              f"- **URL:** {url}",
              f"- **Purpose:** {purpose}",
              f"- **Main headings:** {'; '.join(h for h in p['headings'][:8]) or '—'}",
              f"- **Important images:** {', '.join(imgs) or '—'}",
              f"- **Important internal links:** {', '.join(links) or '—'}",
              f"- **Functional elements:** {', '.join(sorted(set(p['forms']))) or 'none'}; {len(p['buttons'])} buttons",
              f"- **Content to preserve:** {keep}",
              f"- **Problems / missing information:** {problems}",
              f"- **Rebuild decision:** {decision}", ""]

lines += ["## Product, category and store templates", "",
          "- **Product pages (82):** `/product/<slug>/` — category link, gallery (1–2 images), English + Tamil name, price, pack, SKU, short description (English), description tab (Tamil, with சிறப்பம்சங்கள் and பயன்படுத்தும் முறை), shipping tab, additional information (weight, dimensions, pack), reviews (none), vendor info, more products. One variable product (Turmeric Powder: 100 g ₹40 / 250 g ₹70). Full field-level data: `product-inventory.csv`.",
          "- **Category pages (12):** `/product-category/<slug>/` — WooCommerce archive with result count and sorting. Data: `category-inventory.csv`.",
          "- **Storefronts (2):** `/store/<slug>/` — Dokan store header (default banner/avatar), product grid. Data: `seller-inventory.csv`.",
          "- **Blog taxonomy archives:** `/category/<slug>/` (Sourcing & Sellers, Kitchen Notes, Wellness, Seasonal Picks) and `/tag/<slug>/` (8 tags) — plain archives, redirected to `/blog`.",
          "- **Brand archive:** `/brand/naadu-nalam/` — every product carries the 'Naadu Nalam' brand term; redirected to `/shop`.", ""]
open(os.path.join(ROOT, "docs", "source-discovery", "page-inventory.md"), "w", encoding="utf-8").write("\n".join(lines))
print("written", len(lines), "lines")
