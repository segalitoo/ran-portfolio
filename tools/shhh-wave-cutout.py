#!/usr/bin/env python3
"""Paint the wave bars out of the Shhh hero artwork and write the WebP.

The hero on work/shhh-g.html is the drawing as exported, except its nine
wave bars, which are elements on top so they can animate. That means the
bars have to be removed from the picture underneath, or they would sit
frozen behind the live ones.

The area is inside the pill, above the caption and clear of the pill's
rounded edges, and the pill ground is a flat #0C1020, so painting the
box solid is enough. Re-run this after any new export of the artwork:

    python3 tools/shhh-wave-cutout.py

If the artwork's geometry ever changes, the bar positions in the .wv
rules in assets/inner-g.css are percentages measured off this same
file and have to be re-measured with it.
"""
import os
import subprocess
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "images", "shhh_inner.png")
PNG = os.path.join(ROOT, "images", "shhh_inner_base.png")
WEBP = os.path.join(ROOT, "images", "opt", "shhh_inner_base.webp")

PILL = (12, 16, 32, 255)
BOX = (138, 12, 247, 58)  # left, top, right, bottom, in the 384x394 export


def main():
    im = Image.open(SRC).convert("RGBA")
    px = im.load()
    for y in range(BOX[1], BOX[3]):
        for x in range(BOX[0], BOX[2]):
            px[x, y] = PILL
    im.save(PNG)

    left = sum(1 for y in range(0, 94) for x in range(75, 309)
               if px[x, y][3] > 120 and px[x, y][0] > 110
               and px[x, y][0] - px[x, y][1] > 45)
    if left:
        raise SystemExit("%d red pixels still inside the pill: the box misses "
                         "part of the wave" % left)

    # Lossless, because flat UI with small text comes out both smaller
    # and sharper this way than it does lossy.
    subprocess.run(["cwebp", "-lossless", "-alpha_q", "100", "-quiet",
                    PNG, "-o", WEBP], check=True)
    print("wrote %s (%d bytes)" % (os.path.relpath(WEBP, ROOT),
                                   os.path.getsize(WEBP)))


if __name__ == "__main__":
    main()
