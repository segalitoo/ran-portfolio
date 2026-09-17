#!/usr/bin/env python3
"""Write WebP variants of images/*.png into images/opt/.

Originals are never touched. Every landing page reads the WebP; the PNGs stay
as the masters and as the lightbox source. Reruns skip anything already newer
than its input, so this is cheap to call again.
"""
import os
import sys
from PIL import Image

SRC = "images"
DST = os.path.join(SRC, "opt")
WIDTHS = (1440, 720)
QUALITY = 82


def variants(stem):
    return [(w, os.path.join(DST, f"{stem}-{w}.webp")) for w in WIDTHS]


def main():
    os.makedirs(DST, exist_ok=True)
    before = after = 0
    made = skipped = 0
    for name in sorted(os.listdir(SRC)):
        if not name.lower().endswith(".png"):
            continue
        src = os.path.join(SRC, name)
        stem = os.path.splitext(name)[0]
        before += os.path.getsize(src)
        im = None
        for width, out in variants(stem):
            if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
                after += os.path.getsize(out)
                skipped += 1
                continue
            if im is None:
                im = Image.open(src).convert("RGB")
            h = round(im.height * width / im.width)
            im.resize((width, h), Image.LANCZOS).save(
                out, "WEBP", quality=QUALITY, method=6
            )
            after += os.path.getsize(out)
            made += 1
    mb = 1024 * 1024
    print(f"wrote {made}, skipped {skipped}")
    print(f"png masters {before / mb:.1f} MB  ->  webp variants {after / mb:.1f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
