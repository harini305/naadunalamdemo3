"""Convert the extracted legal pages (verbatim text) into JSON blocks for the frontend.

Usage: python -I -X utf8 tools/discovery/build_legal.py <project_root>
Output: data/legal.json  {slug: {title, intro:[...], updated, sections:[{id, heading, blocks:[{type,text|items}]}]}}
Drops only navigation artefacts (the "On this page" table of contents, raw link lines, the trailing
contact card — the new template renders the same contact details from data/site.js).
"""
import json, os, re, sys

ROOT = sys.argv[1]
TEXT = os.path.join(ROOT, "docs", "source-discovery", "raw", "text", "page")
SLUGS = ["shipping-policy", "refund-policy", "terms", "privacy-policy"]
STOP = re.compile(r"^## (Questions about|Need to report|Questions about a delivery)")

def slugify(s):
    s = re.sub(r"^\d+\.\s*", "", s)
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

out = {}
for slug in SLUGS:
    lines = open(os.path.join(TEXT, slug + ".md"), encoding="utf-8").read().splitlines()
    title, updated, intro, sections = "", "", [], []
    in_toc = False
    cur = None
    for raw in lines:
        l = raw.strip()
        if not l or l.startswith("<!--") or l.startswith("- link:") or l.startswith("- BUTTON:") or l == "NAADU NALAM":
            continue
        if l in ("Item", "0.00"):
            break
        if STOP.match(l):
            break
        if l.startswith("# "):
            title = l[2:].strip()
            continue
        if l.startswith("Last updated"):
            updated = l.split(":", 1)[-1].strip()
            continue
        if l == "On this page":
            in_toc = True
            continue
        if l.startswith("## "):
            in_toc = False
            heading = l[3:].strip()
            cur = {"id": slugify(heading), "heading": re.sub(r"^\d+\.\s*", "", heading), "blocks": []}
            sections.append(cur)
            continue
        if in_toc:
            continue
        target = cur["blocks"] if cur else intro
        if l.startswith("* "):
            item = l[2:].strip()
            if target and target[-1]["type"] == "ul":
                target[-1]["items"].append(item)
            else:
                target.append({"type": "ul", "items": [item]})
        else:
            # Tidy spaces the extractor left before punctuation (e.g. "business days (Monday–Saturday) .")
            text = re.sub(r"\s+([.,;:])", r"\1", l)
            target.append({"type": "p", "text": text})
    out[slug] = {"slug": slug, "title": title, "updated": updated, "intro": intro, "sections": sections}
    print(slug, "|", title, "|", updated, "|", len(sections), "sections")

json.dump(out, open(os.path.join(ROOT, "data", "legal.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
