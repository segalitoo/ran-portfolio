#!/usr/bin/env python3
"""Build the four TradersMood card images from one Figma export.

The cover is re-exported from Figma whenever the design changes, so this
keeps the derivation in one place instead of being re-derived by hand.

  python3 tools/tradersmood-cards.py <export.png>

Wide variants are the whole 16:9 cover. The 640 and 320 are cropped tight
on the guest, matching how the card was framed originally. The crop centre
is MEASURED, not fixed: the portrait moved from 0.689 to 0.745 of the width
between two exports, and a hardcoded centre would have sliced his face off.
"""
import subprocess, sys, os
import numpy as np
from PIL import Image

OUT = "images/card"
SIZES = [(1600, 900, "wide-1600"), (800, 450, "wide-800"), (640, 600, "640"), (320, 300, "320")]


def portrait_centre(im):
    """Horizontal centre of the guest, as a fraction of width.

    He is the one large near-neutral bright mass. The headline is bright
    too, so only the right half is considered, and only the upper band
    where the head sits rather than the full figure.
    """
    a = np.asarray(im, dtype=int)
    h, w, _ = a.shape
    neutral = (np.abs(a[..., 0] - a[..., 1]) < 22) & (np.abs(a[..., 1] - a[..., 2]) < 22)
    mask = neutral & (a.mean(axis=2) > 95)
    band = mask[int(h * 0.12):int(h * 0.55), w // 2:].sum(axis=0)
    peak = int(np.argmax(np.convolve(band, np.ones(120) / 120, mode="same")))
    return (w // 2 + peak) / w


def main(src_path):
    src = Image.open(src_path).convert("RGB")
    W, H = src.size
    cx_frac = portrait_centre(src)
    print("  source %dx%d, portrait centre at %.3f of width" % (W, H, cx_frac))

    for w, h, name in SIZES:
        if w / h > 1.5:                       # the wide pair is the whole cover
            img = src.resize((w, h), Image.LANCZOS)
        else:
            cw = int(H * (w / h))
            x0 = max(0, min(W - cw, int(W * cx_frac) - cw // 2))
            img = src.crop((x0, 0, x0 + cw, H)).resize((w, h), Image.LANCZOS)
        png = "/tmp/tm-%s.png" % name
        img.save(png)
        out = os.path.join(OUT, "tradersmood-%s.webp" % name)
        subprocess.run(["cwebp", "-q", "84", "-quiet", png, "-o", out], check=True)
        os.remove(png)
        print("  %-42s %dx%d  %d KB" % (out, w, h, os.path.getsize(out) // 1024))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: tradersmood-cards.py <export.png>")
    main(sys.argv[1])
