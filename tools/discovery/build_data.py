"""Build the structured local data source + inventories from the captured source data.

Usage: python -I -X utf8 tools/discovery/build_data.py <project_root>
Inputs : docs/source-discovery/raw/*.json, docs/source-discovery/asset-manifest.csv, original-assets/
Outputs: data/products.json, data/categories.json, data/sellers.json, data/posts.json
         docs/source-discovery/product-inventory.csv, category-inventory.csv, seller-inventory.csv
         public/images/catalog/*.webp (optimised copies; originals untouched)
Nothing is invented: every field comes from the Store API / WP REST API / Dokan API dumps.
"""
import csv, html, json, os, re, sys
from PIL import Image

ROOT = sys.argv[1]
RAW = os.path.join(ROOT, "docs", "source-discovery", "raw")
DOCS = os.path.join(ROOT, "docs", "source-discovery")
DATA = os.path.join(ROOT, "data")
PUB = os.path.join(ROOT, "public", "images", "catalog")
os.makedirs(DATA, exist_ok=True)
os.makedirs(PUB, exist_ok=True)

def load(n):
    return json.load(open(os.path.join(RAW, n), encoding="utf-8"))

TA = r"[஀-௿]"

def split_name(full):
    full = html.unescape(full).strip()
    m = re.match(r"^(.*?)\s*\(([^()]*" + TA + r"[^()]*)\)\s*$", full)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return full, ""

def strip_tags(h):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", h or ""))).strip()

def clean_html(h):
    """Keep simple semantic tags only (p, h3, h4, ul, ol, li, strong, em, br)."""
    h = h or ""
    h = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", h, flags=re.S)
    h = re.sub(r"<(?!/?(p|h3|h4|ul|ol|li|strong|em|br)\b)[^>]+>", "", h)
    h = re.sub(r"<(p|h3|h4|ul|ol|li|strong|em)\s+[^>]*>", r"<\1>", h)
    return re.sub(r"\n\s*\n", "\n", h).strip()

# ---------- asset manifest: source URL -> local original file
manifest = {}
with open(os.path.join(DOCS, "asset-manifest.csv"), encoding="utf-8") as f:
    for r in csv.DictReader(f):
        if r["downloaded"] == "yes":
            manifest[r["source_url"]] = os.path.join(ROOT, r["local_file"])

def full_url(u):
    return re.sub(r"-\d+x\d+(?=\.(webp|jpe?g|png)$)", "", u.split("?")[0])

made = {}
def optimise(src_url, max_px=1400):
    """Return public path of an optimised WebP for a source image URL (or None)."""
    u = full_url(src_url)
    if u in made:
        return made[u]
    local = manifest.get(u)
    if not local or not os.path.exists(local):
        made[u] = None
        return None
    base = re.sub(r"[^a-zA-Z0-9]+", "-", os.path.splitext(os.path.basename(local))[0]).strip("-").lower()
    out = os.path.join(PUB, base + ".webp")
    if not os.path.exists(out):
        im = Image.open(local)
        im = im.convert("RGBA") if im.mode in ("P", "LA", "RGBA") else im.convert("RGB")
        im.thumbnail((max_px, max_px), Image.LANCZOS)
        im.save(out, "WEBP", quality=82, method=6)
    w, h = Image.open(out).size
    made[u] = {"src": "/images/catalog/" + base + ".webp", "w": w, "h": h, "original": u}
    return made[u]

# ---------- sellers + product->seller map
stores = [s for s in load("dokan-stores.json") if s["store_name"]]
seller_of = {}
seller_slug = {}
for s in stores:
    slug = s["shop_url"].rstrip("/").split("/")[-1]
    seller_slug[s["id"]] = slug
    for p in load(f"dokan-store-{s['id']}-products.json"):
        seller_of[p["id"]] = slug

# ---------- categories
cats_raw = load("wc-categories.json")
categories = []
for c in cats_raw:
    en, ta = split_name(c["name"])
    img = optimise(c["image"]["src"]) if c.get("image") else None
    categories.append({
        "id": c["id"], "slug": c["slug"], "name": html.unescape(c["name"]), "nameEn": en, "nameTa": ta,
        "description": strip_tags(c.get("description", "")), "count": c["count"],
        "image": img, "imageAlt": (c.get("image") or {}).get("alt", ""),
        "sourceUrl": c["permalink"],
    })

# ---------- products
UPLOADS = "https://naadunalam.fastfilings.in/wp-content/uploads/"
MATCHED_PHOTOS = {
    "kichadi-samba-rice": "2026/08/Kichili-Samba-Arisi.webp",
    "panangkarkandu": "2026/08/Panangkarkandu.webp",
    "black-kavuni-rice": "2026/09/Karuppu-Kavuni-Rice.webp",
    "karunguruvai-rice": "2026/09/Karunguruvai-Rice-2.webp",
    "kaatuyanam-rice": "2026/09/Kattu-Yanam-Rice.webp",
    "kullakar-rice": "2026/09/Kuzhakkan-Kullakar-Rice.webp",
    "poongar-rice": "2026/09/Poongar-Arisi.webp",
    "thooyamalli-rice": "2026/09/Thooyamallirice.webp",
    "kalanamak-rice": "2026/09/Kalanamak-Rice.webp",
    "ratha-sali-rice": "2026/09/Ratha-Sali-Rice.webp",
    "karuppu-kavuni-aval": "2026/09/Karuppu-Kavuni-Aval.webp",
    "mappillai-samba-aval": "2026/09/Mappillai-Samba-Aval.webp",
    "ratha-sali-aval": "2026/09/Ratha-Sali-Aval.jpg",
    "thuya-malli-aval": "2026/09/thuyamalliaval.jpeg",
    "palm-jaggery-karupatti": "2026/08/Karuppatti.webp",  # the site's own category photo, alt "Karuppatti — traditional palm jaggery"
}
prods_raw = load("wc-products-p1.json")
products = []
for p in prods_raw:
    en, ta = split_name(p["name"])
    pr = p["prices"]
    div = 10 ** pr["currency_minor_unit"]
    pack_attr = next((a for a in p["attributes"] if a["name"].lower() == "pack"), None)
    packs = [t["name"] for t in pack_attr["terms"]] if pack_attr else []
    variations = []
    for v in p["variations"]:
        vf = os.path.join(RAW, f"wc-variation-{v['id']}.json")
        if os.path.exists(vf):
            vd = json.load(open(vf, encoding="utf-8"))
            variations.append({
                "id": vd["id"], "pack": vd["variation"].split(":", 1)[-1].strip(),
                "price": int(vd["prices"]["price"]) / div, "regularPrice": int(vd["prices"]["regular_price"]) / div,
                "stock": vd["stock_availability"]["text"],
            })
    images = []
    for im in p["images"]:
        o = optimise(im["src"])
        if o:
            is_label = "-pdf" in o["original"].lower()   # printed pack label artwork, e.g. "Karuppatti-pdf.jpg"
            images.append({**o, "alt": im.get("alt") or en, "kind": "label" if is_label else "photo"})
    # Products whose live listing shows only the printed pack label: add the owner's own photograph whose
    # media-library filename names the same product (documented in issues-and-decisions.md for confirmation).
    if p["slug"] in MATCHED_PHOTOS and all(i["kind"] == "label" for i in images):
        o = optimise(UPLOADS + MATCHED_PHOTOS[p["slug"]])
        if o:
            images.append({**o, "alt": en, "kind": "photo-matched"})
    # Presentation order only: food photograph first, pack label second (both kept, nothing removed)
    images.sort(key=lambda i: i["kind"] == "label")
    products.append({
        "id": p["id"], "slug": p["slug"], "sku": p["sku"], "type": p["type"],
        "name": html.unescape(p["name"]), "nameEn": en, "nameTa": ta,
        "price": int(pr["price"]) / div, "regularPrice": int(pr["regular_price"]) / div,
        "salePrice": int(pr["sale_price"]) / div, "onSale": p["on_sale"],
        "priceRange": ({"min": int(pr["price_range"]["min_amount"]) / div, "max": int(pr["price_range"]["max_amount"]) / div}
                       if pr.get("price_range") else None),
        "packs": packs, "variations": variations,
        "shortDescription": strip_tags(p["short_description"]),
        "descriptionHtml": clean_html(p["description"]),
        "categories": [c["slug"] for c in p["categories"]],
        "seller": seller_of.get(p["id"], ""),
        "images": images,
        "weight": p.get("formatted_weight", ""), "dimensions": p.get("formatted_dimensions", ""),
        "stock": p["stock_availability"]["text"], "inStock": p["is_in_stock"],
        "maxQty": p["add_to_cart"]["maximum"],
        "reviewCount": p["review_count"],
        "sourceUrl": p["permalink"],
    })
products.sort(key=lambda x: x["id"])

sellers = []
for s in stores:
    slug = seller_slug[s["id"]]
    sellers.append({
        "id": s["id"], "slug": slug, "name": s["store_name"],
        "productCount": sum(1 for p in products if p["seller"] == slug),
        "categories": sorted({c for p in products if p["seller"] == slug for c in p["categories"]}),
        "storePhone": s.get("phone", ""), "registered": s["registered"][:10],
        "sourceUrl": s["shop_url"],
    })

# ---------- posts
posts_raw = load("wp-posts.json")
cat_names = {c["id"]: html.unescape(c["name"]) for c in load("wp-categories.json")}
tag_names = {t["id"]: html.unescape(t["name"]) for t in load("wp-tags.json")}
media = load("wp-media.json") + load("wp-media-p2.json") + load("wp-media-p3.json")
media_by_id = {m["id"]: m for m in media}
pages = load("pages.json")
# Blog archive pages show each post's card image directly above its title link
archive_img = {}
for md in ["page/blog.md", "utility/blog__page__2.md"]:
    fp = os.path.join(RAW, "text", md)
    if not os.path.exists(fp):
        continue
    last = None
    for line in open(fp, encoding="utf-8"):
        m = re.match(r"!\[(.*?)\]\((https?://[^)]+/uploads/[^)]+)\)", line.strip())
        if m:
            last = (m.group(2), m.group(1))
            continue
        m = re.match(r"- link: \[[^\]]+\]\(https://naadunalam\.fastfilings\.in/([a-z0-9-]+)/\)", line.strip())
        if m and last and m.group(1) not in archive_img:
            archive_img[m.group(1)] = last
            last = None

posts = []
for p in posts_raw:
    fm = media_by_id.get(p["featured_media"])
    img = None
    if fm:
        img = optimise(fm["source_url"], 1600)
        alt = fm.get("alt_text", "")
    elif p["slug"] in archive_img:
        img = optimise(archive_img[p["slug"]][0], 1600)
        alt = archive_img[p["slug"]][1]
    else:
        # fall back to the first image the rendered post page shows
        pg = pages.get("post/" + p["slug"], {})
        first = next((i for i in pg.get("images", []) if "/uploads/" in i), None)
        img = optimise(first, 1600) if first else None
        alt = ""
    posts.append({
        "id": p["id"], "slug": p["slug"], "date": p["date"][:10],
        "title": html.unescape(strip_tags(p["title"]["rendered"])),
        "excerpt": strip_tags(p["excerpt"]["rendered"]).replace(" [&hellip;]", "").replace(" […]", ""),
        "contentHtml": clean_html(p["content"]["rendered"]),
        "categories": [cat_names.get(c, "") for c in p["categories"]],
        "tags": [tag_names.get(t, "") for t in p["tags"]],
        "image": img, "imageAlt": alt, "sourceUrl": p["link"],
    })
posts.sort(key=lambda x: x["date"], reverse=True)

# Lightweight catalogue for client components (cart, search, wishlist) — no long descriptions
catalog_lite = [{
    "id": p["id"], "slug": p["slug"], "nameEn": p["nameEn"], "nameTa": p["nameTa"], "price": p["price"],
    "priceRange": p["priceRange"], "packs": p["packs"],
    "variations": [{"id": v["id"], "pack": v["pack"], "price": v["price"]} for v in p["variations"]],
    "categories": p["categories"], "seller": p["seller"],
    "image": p["images"][0]["src"] if p["images"] else None, "maxQty": p["maxQty"], "inStock": p["inStock"],
} for p in products]

for name, obj in [("products", products), ("categories", categories), ("sellers", sellers), ("posts", posts),
                  ("catalog-lite", catalog_lite)]:
    json.dump(obj, open(os.path.join(DATA, name + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ---------- inventories (CSV, UTF-8 with BOM so Excel shows Tamil correctly)
def write_csv(path, rows):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)

cat_name = {c["slug"]: c["name"] for c in categories}
write_csv(os.path.join(DOCS, "product-inventory.csv"), [{
    "id": p["id"], "slug": p["slug"], "sku": p["sku"], "name_en": p["nameEn"], "name_ta": p["nameTa"],
    "type": p["type"],
    "price_inr": p["price"] if not p["priceRange"] else f"{p['priceRange']['min']}–{p['priceRange']['max']}",
    "regular_price_inr": p["regularPrice"], "on_sale": p["onSale"],
    "pack": " / ".join(p["packs"]),
    "variations": "; ".join(f"{v['pack']}: ₹{v['price']:g}" for v in p["variations"]),
    "category": "; ".join(cat_name.get(c, c) for c in p["categories"]),
    "seller": p["seller"], "stock_text": p["stock"], "weight": p["weight"], "dimensions": p["dimensions"],
    "image_count": len(p["images"]),
    "image_files": " | ".join(i["original"].split("/uploads/")[-1] for i in p["images"]),
    "short_description_en": p["shortDescription"],
    "description_ta_present": "yes" if re.search(TA, p["descriptionHtml"]) else "no",
    "reviews": p["reviewCount"], "product_url": p["sourceUrl"],
} for p in products])

write_csv(os.path.join(DOCS, "category-inventory.csv"), [{
    "id": c["id"], "slug": c["slug"], "name_en": c["nameEn"], "name_ta": c["nameTa"],
    "description": c["description"], "product_count_api": c["count"],
    "product_count_verified": sum(1 for p in products if c["slug"] in p["categories"]),
    "image": (c["image"] or {}).get("original", "").split("/uploads/")[-1], "category_url": c["sourceUrl"],
} for c in categories])

write_csv(os.path.join(DOCS, "seller-inventory.csv"), [{
    "store_id": s["id"], "slug": s["slug"], "store_name": s["name"], "product_count": s["productCount"],
    "categories": "; ".join(cat_name.get(c, c) for c in s["categories"]),
    "store_phone_listed": s["storePhone"], "registered": s["registered"],
    "banner": "Dokan default banner (no custom banner set)", "store_url": s["sourceUrl"],
} for s in sellers])

print("products", len(products), "| categories", len(categories), "| sellers", len(sellers), "| posts", len(posts))
print("optimised images", sum(1 for v in made.values() if v), "| missing", [k for k, v in made.items() if not v])
print("no-tamil names:", [p["slug"] for p in products if not p["nameTa"]])
print("category count mismatch:", [(c["slug"], c["count"], sum(1 for p in products if c["slug"] in p["categories"])) for c in categories
                                    if c["count"] != sum(1 for p in products if c["slug"] in p["categories"])])
