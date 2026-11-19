"""Extract structured, verbatim content from the saved source HTML.

Usage: python -I -X utf8 tools/discovery/extract_content.py <raw_dir>
Writes <raw_dir>/text/<kind>/<slug>.md  (reading-order dump of main content)
and    <raw_dir>/pages.json             (title, meta, headings, links, images per page)
and    <raw_dir>/chrome.md              (shared header + footer content, once)
"""
import json, os, re, sys
from bs4 import BeautifulSoup, NavigableString, Tag

RAW = sys.argv[1]
BASE = "https://naadunalam.fastfilings.in"
HTML_DIR = os.path.join(RAW, "html")
TEXT_DIR = os.path.join(RAW, "text")

BLOCK_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote", "figcaption", "button", "label",
              "td", "th", "summary", "dt", "dd"}
SKIP_TAGS = {"script", "style", "noscript", "template", "svg", "iframe", "select", "option"}


def clean(s):
    return re.sub(r"\s+", " ", s or "").strip()


def walk(node, out):
    """Emit reading-order lines: headings, paragraphs, links/buttons, images."""
    for child in node.children:
        if isinstance(child, NavigableString):
            continue
        if not isinstance(child, Tag):
            continue
        name = child.name
        if name in SKIP_TAGS:
            continue
        cls = " ".join(child.get("class", []))
        if name == "img":
            src = child.get("data-src") or child.get("data-lazy-src") or child.get("src") or ""
            if src and not src.startswith("data:"):
                out.append(("img", src, clean(child.get("alt", ""))))
            continue
        if name in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            t = clean(child.get_text(" "))
            if t:
                out.append((name, t))
            # still capture images/links inside headings
            for a in child.find_all("a"):
                out.append(("link", clean(a.get_text(" ")), a.get("href", "")))
            continue
        if name == "a" and (("button" in cls) or ("btn" in cls) or child.find_parent(class_=re.compile("elementor-button"))):
            out.append(("button", clean(child.get_text(" ")), child.get("href", "")))
            for im in child.find_all("img"):
                out.append(("img", im.get("data-src") or im.get("src", ""), clean(im.get("alt", ""))))
            continue
        if name in {"p", "li", "blockquote", "figcaption", "td", "th", "dt", "dd", "label", "summary"}:
            t = clean(child.get_text(" "))
            if t:
                out.append((name, t))
            for a in child.find_all("a"):
                href = a.get("href", "")
                if href:
                    out.append(("link", clean(a.get_text(" ")), href))
            for im in child.find_all("img"):
                out.append(("img", im.get("data-src") or im.get("src", ""), clean(im.get("alt", ""))))
            continue
        if name == "button" or name == "input" and child.get("type") in ("submit", "button"):
            t = clean(child.get_text(" ") or child.get("value", "") or child.get("aria-label", ""))
            if t:
                out.append(("button", t, ""))
            continue
        if name in {"input", "textarea"}:
            out.append(("field", child.get("type", name), clean(child.get("placeholder", "") or child.get("name", ""))))
            continue
        if name == "form":
            out.append(("form", child.get("action", ""), " ".join(child.get("class", []))))
        if name == "a":
            href = child.get("href", "")
            t = clean(child.get_text(" "))
            imgs = child.find_all("img")
            if t or imgs:
                out.append(("link", t, href))
            for im in imgs:
                out.append(("img", im.get("data-src") or im.get("src", ""), clean(im.get("alt", ""))))
            if t and not child.find(BLOCK_TAGS):
                continue
        # leaf divs/spans with direct text (Elementor heading/text widgets, prices)
        direct = clean("".join(c for c in child.children if isinstance(c, NavigableString)))
        if direct and name in {"div", "span", "strong", "em", "bdi", "small", "del", "ins"} and len(direct) > 1:
            out.append(("text", direct))
        # background images declared inline
        style = child.get("style", "")
        m = re.search(r"background-image:\s*url\(['\"]?([^'\")]+)", style)
        if m:
            out.append(("bgimg", m.group(1), cls[:60]))
        walk(child, out)


def to_md(lines):
    md = []
    for item in lines:
        k = item[0]
        if k in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            md.append("#" * int(k[1]) + " " + item[1])
        elif k == "img":
            md.append(f"![{item[2]}]({item[1]})")
        elif k == "bgimg":
            md.append(f"[background-image: {item[1]}] ({item[2]})")
        elif k == "link":
            md.append(f"- link: [{item[1]}]({item[2]})")
        elif k == "button":
            md.append(f"- BUTTON: [{item[1]}]({item[2]})")
        elif k == "field":
            md.append(f"- field: {item[1]} / {item[2]}")
        elif k == "form":
            md.append(f"- FORM action={item[1]} class={item[2]}")
        elif k == "li":
            md.append("* " + item[1])
        else:
            md.append(item[1])
    # collapse consecutive duplicates (Elementor often repeats nested text)
    dedup = []
    for l in md:
        if not dedup or dedup[-1] != l:
            dedup.append(l)
    return "\n".join(dedup)


pages = {}
chrome_written = False
for kind in sorted(os.listdir(HTML_DIR)):
    for fn in sorted(os.listdir(os.path.join(HTML_DIR, kind))):
        path = os.path.join(HTML_DIR, kind, fn)
        html = open(path, encoding="utf-8", errors="replace").read()
        soup = BeautifulSoup(html, "lxml")
        title = clean(soup.title.get_text()) if soup.title else ""
        desc = soup.find("meta", attrs={"name": "description"})
        canon = soup.find("link", rel="canonical")
        body = soup.body
        if body is None:
            continue
        header = body.find(class_=re.compile(r"elementor-location-header")) or body.find("header")
        footer = body.find(class_=re.compile(r"elementor-location-footer")) or body.find("footer")
        if not chrome_written and header is not None and footer is not None:
            hl, fl = [], []
            walk(header, hl)
            walk(footer, fl)
            open(os.path.join(RAW, "chrome.md"), "w", encoding="utf-8").write(
                f"# Shared header (from {kind}/{fn})\n\n" + to_md(hl) + "\n\n# Shared footer\n\n" + to_md(fl) + "\n")
            chrome_written = True
        for t in (header, footer):
            if t is not None:
                t.extract()
        # drop off-canvas carts / popups / modals that repeat on every page
        for t in body.find_all(class_=re.compile(r"(elementor-location-popup|xoo-|mini-cart|offcanvas|nn-drawer|wcboost|woosq|woosw|woosc|cookie)")):
            t.extract()
        lines = []
        walk(body, lines)
        slug = fn[:-5]
        url = (canon.get("href") if canon else "") or ""
        os.makedirs(os.path.join(TEXT_DIR, kind), exist_ok=True)
        md = to_md(lines)
        open(os.path.join(TEXT_DIR, kind, slug + ".md"), "w", encoding="utf-8").write(
            f"<!-- source: {kind}/{fn} | title: {title} | canonical: {url} -->\n\n{md}\n")
        pages[f"{kind}/{slug}"] = {
            "kind": kind, "slug": slug, "title": title, "canonical": url,
            "meta_description": desc.get("content", "") if desc else "",
            "headings": [l[1] for l in lines if l[0] in {"h1", "h2", "h3"}],
            "images": sorted({l[1] for l in lines if l[0] in {"img", "bgimg"}}),
            "links": sorted({l[2] for l in lines if l[0] in {"link", "button"} and l[2]}),
            "buttons": [[l[1], l[2]] for l in lines if l[0] == "button"],
            "forms": [l[1] for l in lines if l[0] == "form"],
            "text_chars": len(md),
        }

json.dump(pages, open(os.path.join(RAW, "pages.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("pages extracted:", len(pages))
