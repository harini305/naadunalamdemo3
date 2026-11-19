"""Fill the used_in_redesign column of the asset manifest by tracing what the built site references.

Usage: python -I -X utf8 tools/discovery/mark_used_assets.py <project_root>
"""
import csv, glob, json, os, re, sys

ROOT = sys.argv[1]
MAN = os.path.join(ROOT, "docs", "source-discovery", "asset-manifest.csv")

# originals referenced through the data layer (products, categories, posts)
used = {}
for name in ["products", "categories", "posts"]:
    data = json.load(open(os.path.join(ROOT, "data", name + ".json"), encoding="utf-8"))
    for item in data:
        imgs = item.get("images") or ([item["image"]] if item.get("image") else [])
        for im in imgs:
            if im and im.get("original"):
                used[im["original"]] = f"yes — {name} ({im['src']})"

# originals copied into public/images/site and brand (see build log in implementation-plan.md)
code = "\n".join(open(f, encoding="utf-8").read() for f in glob.glob(os.path.join(ROOT, "app", "**", "*.js"), recursive=True)
                 + glob.glob(os.path.join(ROOT, "components", "**", "*.js"), recursive=True))
SITE = {
    "2026/07/sona-masoori-rice-fix.jpg": "/images/site/paddy-in-hand.webp",
    "2026/11/naadu-nalam-store-banner.webp": "/images/site/produce-before-paddy.webp",
    "2026/11/nn-hero-cutout-clean.webp": "/images/site/farmer-basket.webp",
    "2026/09/naadu-nalam-logo-header.svg": "/images/brand/naadu-nalam-emblem.webp",
}
for orig, pub in SITE.items():
    if pub in code:
        used["https://naadunalam.fastfilings.in/wp-content/uploads/" + orig] = f"yes — {pub}"

rows = list(csv.DictReader(open(MAN, encoding="utf-8")))
for r in rows:
    if r["source_url"] in used:
        r["used_in_redesign"] = used[r["source_url"]]
    elif r["downloaded"] == "yes":
        if r["asset_type"] in ("font", "font stylesheet"):
            r["used_in_redesign"] = "no — replaced by self-hosted Noto Serif Tamil + Catamaran (see brand-reference.md)"
        elif r["asset_type"] == "document":
            r["used_in_redesign"] = "no — product information sheet kept for reference"
        elif "thai-pongal" in r["source_url"] or "deepavali" in r["source_url"]:
            r["used_in_redesign"] = "no (image) — Pongal combo content transcribed into the home page; flyer image itself not shown (contains bank/payment details)"
        else:
            r["used_in_redesign"] = "no — preserved original"
    elif not r["used_in_redesign"]:
        r["used_in_redesign"] = "no"

client = {
    "original_filename": "Tamil Family and Five Elements.png", "source_url": "client-supplied (shared in project chat, 19 Nov 2026)",
    "local_file": "original-assets/client-supplied/tamil-family-and-five-elements.png", "folder": "client-supplied",
    "asset_type": "image (composite: 2 family photographs + 5 element cards)", "width": "1536", "height": "1024", "bytes": "",
    "alt_text": "", "associated_with": "home hero, about, contact, closing bands, Panchabhootham cards",
    "downloaded": "yes", "download_note": "cropped into public/images/client/*.webp",
    "used_in_redesign": "yes — /images/client/family-courtyard.webp, family-paddy-fields.webp, element-*.webp",
}
rows = [r for r in rows if r["folder"] != "client-supplied"] + [client]
p = os.path.join(ROOT, "original-assets", "client-supplied", "tamil-family-and-five-elements.png")
if os.path.exists(p):
    client["bytes"] = str(os.path.getsize(p))
with open(MAN, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)
print("rows", len(rows), "| used", sum(r["used_in_redesign"].startswith("yes") for r in rows))
