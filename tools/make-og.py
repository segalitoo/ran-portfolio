#!/usr/bin/env python3
"""Build 1200x630 JPEG link-preview cards from the optimised exports.

LinkedIn and X do not reliably render WebP og:image, and this portfolio is
circulated as a bare link, so the card is a functional requirement rather
than polish. Cover-crops to the canonical ratio instead of squashing.
"""
import os, sys
from PIL import Image

TW, TH = 1200, 630

def build(src, out):
    im = Image.open(src).convert("RGB")
    sw, sh = im.size
    scale = max(TW / sw, TH / sh)
    im = im.resize((round(sw * scale), round(sh * scale)), Image.LANCZOS)
    left, top = (im.width - TW) // 2, (im.height - TH) // 2
    im.crop((left, top, left + TW, top + TH)).save(out, "JPEG", quality=86, optimize=True)
    print("  %s  %d KB" % (out, os.path.getsize(out) // 1024))

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("usage: make-og.py <source-image> <out.jpg>")
    build(sys.argv[1], sys.argv[2])
