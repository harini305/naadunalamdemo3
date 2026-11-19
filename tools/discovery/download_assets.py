"""Download original Naadu Nalam assets (full-size originals only) and write the asset manifest.

Usage: python -I -X utf8 tools/discovery/download_assets.py <raw_dir> <assets_dir> <manifest_csv>
- Uses pages.json (from extract_content.py), the Store API product/category dumps and the media library dumps.
- Downloads each unique file once (skips files already on disk), throttled.
- Records every candidate, including deliberately skipped legacy/demo media, in the manifest.
"""
import csv, json, os, re, sys, time, urllib.request, urllib.error, collections

RAW, ASSETS, MANIFEST = sys.argv[1], sys.argv[2], sys.argv[3]
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36"
BASE = "https://naadunalam.fastfilings.in"

def load(name):
    return json.load(open(os.path.join(RAW, name), encoding="utf-8"))

def full(u):
    u = u.split("?")[0]
    return re.sub(r"-\d+x\d+(?=\.(webp|jpe?g|png|gif|svg)$)", "", u)

media = load("wp-media.json") + load("wp-media-p2.json") + load("wp-media-p3.json")
media_by_url = {m["source_url"]: m for m in media}
pages = load("pages.json")
products = load("wc-products-p1.json")
cats = load("wc-categories.json")
posts = load("wp-posts.json")

refs = collections.defaultdict(set)    # url -> set of "kind/slug" usages
folder = {}                            # url -> target folder

def add(url, usage, fold):
    if not url or url.startswith("data:"):
        return
    url = full(url)
    refs[url].add(usage)
    # strongest classification wins: logo > fonts > sellers > products > categories > blog > general
    order = ["logo", "fonts", "sellers", "products", "categories", "blog", "documents", "general"]
    if url not in folder or order.index(fold) < order.index(folder[url]):
        folder[url] = fold

for p in products:
    for im in p["images"]:
        add(im["src"], "product/" + p["slug"], "products")
for c in cats:
    if c.get("image"):
        add(c["image"]["src"], "category/" + c["slug"], "categories")
post_media_ids = {p["featured_media"]: p["slug"] for p in posts}
for m in media:
    if m["id"] in post_media_ids:
        add(m["source_url"], "post/" + post_media_ids[m["id"]], "blog")

for key, p in pages.items():
    kind = p["kind"]
    for im in p["images"]:
        if "/wp-content/uploads/" not in im:
            continue  # plugin placeholders (dokan default banner, loading gif) are not brand assets
        if "logo" in im:
            fold = "logo"
        elif kind == "post" or key in ("page/blog", "utility/blog__page__2", "page/research-articles")                 or kind in ("blog-category", "blog-tag"):
            fold = "blog"
        else:
            fold = "general"
        add(im, key, fold)

# Logo lives in the shared header/footer (stripped from pages.json), so add it explicitly
add(f"{BASE}/wp-content/uploads/2026/09/naadu-nalam-logo-header.svg", "site-wide header + footer logo", "logo")

# Self-hosted brand fonts (open-licence: Fraunces, Outfit, Noto Sans Tamil — SIL OFL)
for f in ["fraunces-latin.woff2", "fraunces-latin-ext.woff2", "outfit-latin.woff2", "outfit-latin-ext.woff2",
          "noto-sans-tamil.woff2", "nn-fonts.css"]:
    add(f"{BASE}/wp-content/uploads/nn-fonts/{f}", "site-wide @font-face", "fonts")

# Relevant media-library files that no public page currently shows
SELLER_IDS = {1004, 1005, 1006, 1013, 1014}
CURRENT_PRODUCT_IMG_IDS = {2329, 2325, 2304, 2303, 2301, 2300, 2299, 2298, 2292, 2290, 2285, 2282, 2210,
                           1147, 1135, 1133, 1132, 1121, 1105, 1095, 1419, 548, 545, 546, 564}
RECENT_IDS = {2499, 2500, 2501, 2466, 2467, 2468, 2469, 2470, 2471, 2472, 2473}
skipped = []
for m in media:
    u = m["source_url"]
    if u in refs:
        continue
    mid = m["id"]
    note = "media library (not shown on any public page)"
    if m["mime_type"] == "application/pdf":
        add(u, note + " — product information sheet", "documents")
    elif mid in SELLER_IDS:
        add(u, note + " — seller storefront image", "sellers")
    elif mid in CURRENT_PRODUCT_IMG_IDS:
        add(u, note + " — image named after a current product", "products")
    elif mid in RECENT_IDS:
        fold = "categories" if any(k in u for k in ["Kali-Kanji", "Karuppatti", "Nallennai", "Samai", "Parambariya", "personal-care"]) else "general"
        add(u, note + " — uploaded Nov 2026", fold)
    else:
        reason = "legacy/demo media: "
        if "nn-9" in u:
            reason += "delisted product (fresh produce/spices no longer in catalogue)"
        elif any(k in u for k in ["fresh-basket", "coastal-crafts", "spice-garden"]):
            reason += "demo seller that no longer exists"
        elif any(k in u.lower() for k in ["placeholder", "resturant", "testemonial", "article-img", "image-236"]):
            reason += "theme template placeholder"
        else:
            reason += "not linked to any current page or product"
        skipped.append((m, reason))

os.makedirs(ASSETS, exist_ok=True)
rows = []
for url in sorted(refs):
    fold = folder[url]
    fn = url.split("/")[-1]
    sub = url.split("/wp-content/uploads/")[-1]
    ym = re.match(r"(\d{4})/(\d{2})/", sub)
    local_name = (f"{ym.group(1)}-{ym.group(2)}__{fn}" if ym else fn)
    local = os.path.join(ASSETS, fold, local_name)
    os.makedirs(os.path.dirname(local), exist_ok=True)
    ok, note = True, ""
    # if an earlier run filed this asset under another folder, move it rather than re-download
    if not os.path.exists(local):
        for other in os.listdir(ASSETS):
            cand = os.path.join(ASSETS, other, local_name)
            if other != fold and os.path.exists(cand):
                os.replace(cand, local)
                break
    if not (os.path.exists(local) and os.path.getsize(local) > 0):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=90) as r:
                open(local, "wb").write(r.read())
            time.sleep(0.25)
        except urllib.error.HTTPError as e:
            ok, note = False, f"HTTP {e.code}"
        except Exception as e:
            ok, note = False, f"error: {e}"
    size = os.path.getsize(local) if os.path.exists(local) else 0
    m = media_by_url.get(url, {})
    md = m.get("media_details", {}) or {}
    ext = fn.rsplit(".", 1)[-1].lower()
    atype = {"svg": "logo (vector)", "woff2": "font", "css": "font stylesheet", "pdf": "document"}.get(ext, "image")
    rows.append({
        "original_filename": fn,
        "source_url": url,
        "local_file": os.path.relpath(local, os.path.dirname(ASSETS)).replace("\\", "/") if ok else "",
        "folder": fold,
        "asset_type": atype,
        "width": md.get("width", ""),
        "height": md.get("height", ""),
        "bytes": size if ok else "",
        "alt_text": m.get("alt_text", ""),
        "associated_with": "; ".join(sorted(refs[url]))[:900],
        "downloaded": "yes" if ok else "no",
        "download_note": note,
        "used_in_redesign": "",  # filled after the build by tools/discovery/mark_used_assets.py
    })
    print("OK " if ok else "FAIL", fold, fn, note)

for m, reason in skipped:
    md = m.get("media_details", {}) or {}
    rows.append({
        "original_filename": m["source_url"].split("/")[-1], "source_url": m["source_url"], "local_file": "",
        "folder": "", "asset_type": m["mime_type"], "width": md.get("width", ""), "height": md.get("height", ""),
        "bytes": "", "alt_text": m.get("alt_text", ""), "associated_with": "media library only",
        "downloaded": "no", "download_note": "skipped — " + reason, "used_in_redesign": "no",
    })

with open(MANIFEST, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)
print("manifest rows:", len(rows), "| downloaded:", sum(r["downloaded"] == "yes" for r in rows),
      "| failed:", sum(r["downloaded"] == "no" and not r["download_note"].startswith("skipped") for r in rows),
      "| skipped:", len(skipped))
