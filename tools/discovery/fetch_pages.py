"""Fetch rendered HTML for every discovered source URL (throttled, cached).

Usage: python -I -X utf8 tools/discovery/fetch_pages.py <raw_dir>
Reads the sitemaps already saved in <raw_dir> plus a few known utility routes,
saves HTML to <raw_dir>/html/<kind>/<slug>.html and writes fetch-log.csv.
Never submits forms, never logs in, never adds to cart.
"""
import csv, os, re, sys, time, urllib.request, urllib.error

RAW = sys.argv[1]
BASE = "https://naadunalam.fastfilings.in"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36"

def sitemap_urls(name):
    p = os.path.join(RAW, f"sm-{name}.xml")
    return re.findall(r"<loc>([^<]+)</loc>", open(p, encoding="utf-8").read())

targets = []
for name, kind in [("posts-page-1", "page"), ("posts-post-1", "post"), ("posts-product-1", "product"),
                   ("taxonomies-product_cat-1", "product-category"), ("taxonomies-category-1", "blog-category"),
                   ("taxonomies-post_tag-1", "blog-tag"), ("taxonomies-product_brand-1", "brand")]:
    for u in sitemap_urls(name):
        targets.append((kind, u))
# Routes not in the sitemap but linked from the theme / Dokan / WooCommerce
for u in ["/cart/", "/checkout/", "/my-account/", "/wishlist/", "/compare/", "/dashboard/", "/my-orders/",
          "/store/naadunalam/", "/store/thaayanbu/", "/store/superadmin/", "/shop/page/2/", "/blog/page/2/",
          "/this-page-does-not-exist-404-check/"]:
    targets.append(("utility", BASE + u))

def slug_for(url):
    path = url.replace(BASE, "").strip("/")
    return path.replace("/", "__") or "home"

os.makedirs(os.path.join(RAW, "html"), exist_ok=True)
log_rows = []
seen = set()
for kind, url in targets:
    if url in seen:
        continue
    seen.add(url)
    out_dir = os.path.join(RAW, "html", kind)
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, slug_for(url) + ".html")
    if os.path.exists(out) and os.path.getsize(out) > 0:
        log_rows.append([kind, url, "cached", os.path.getsize(out), out])
        continue
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    status, size = "", 0
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            body = r.read()
            status = r.status
            final = r.geturl()
    except urllib.error.HTTPError as e:
        body = e.read()
        status = e.code
        final = url
    except Exception as e:  # network error: record, do not retry in a loop
        log_rows.append([kind, url, f"error:{e}", 0, ""])
        print("ERR", url, e)
        continue
    open(out, "wb").write(body)
    size = len(body)
    log_rows.append([kind, url, status if final == url else f"{status} -> {final}", size, out])
    print(status, kind, url, size)
    time.sleep(0.35)

with open(os.path.join(RAW, "fetch-log.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["kind", "url", "status", "bytes", "local_file"])
    w.writerows(log_rows)
print("done", len(log_rows))
