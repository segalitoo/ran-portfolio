#!/usr/bin/env python3
"""Bring every ?v= cache stamp in every page back in line with its file.

The page generator hashes the assets for the nine pages it owns. The six
hand-kept pages under work/ reference the same shared stylesheets and
nothing was updating them, so any edit to a shared file left those pages
pointing at a stamp that no longer matched. The browser then served them
the old copy from cache while the generated pages got the new one.

Run this after touching anything in assets/ or brand-system/.
"""
import glob, hashlib, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["index.html"] + sorted(glob.glob(os.path.join(ROOT, "work", "*.html")))
REF = re.compile(r'((?:\.\./)?(?:assets|brand-system)/[A-Za-z0-9_.-]+\.(?:css|js))(\?v=[0-9a-f]+)?')

def sha(path):
    with open(path, "rb") as f:
        return hashlib.sha1(f.read()).hexdigest()[:8]

changed = 0
for page in PAGES:
    path = page if os.path.isabs(page) else os.path.join(ROOT, page)
    src = open(path).read()

    def fix(m):
        rel = m.group(1).replace("../", "")
        target = os.path.join(ROOT, rel)
        if not os.path.exists(target):
            print("  missing asset, left alone: %s (in %s)" % (rel, os.path.relpath(path, ROOT)))
            return m.group(0)
        return "%s?v=%s" % (m.group(1), sha(target))

    out = REF.sub(fix, src)
    if out != src:
        open(path, "w").write(out)
        changed += 1
        print("  restamped %s" % os.path.relpath(path, ROOT))

print("%d page(s) restamped" % changed)
