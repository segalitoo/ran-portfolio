#!/usr/bin/env python3
"""Reset the four misspelt lines in the Shhh hero artwork.

The export had "Metting notes", "finaize budeget", a list item numbered
"2" with no full stop and a third with no number at all. They are in the
hero of a project page on a design portfolio, which is the worst place
to leave them.

The notes panel is flat #EFEFEF behind the text, so the affected lines
can be painted out and set again rather than the whole picture redrawn.
The face is Inter, which is what the artwork was set in: an untouched
line re-set at 12px lands within two pixels of the original's width and
the letterforms sit on top of each other. The site loads Inter anyway,
so the fonts here are the same family, vendored because this has to run
without a network.

    python3 tools/shhh-fix-typos.py

Reads images/shhh_inner_raw.png, the export as it arrived, and writes
images/shhh_inner.png. Run tools/shhh-wave-cutout.py afterwards to
rebuild the WebP the page actually loads.
"""
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "images", "shhh_inner_raw.png")
OUT = os.path.join(ROOT, "images", "shhh_inner.png")
FONTS = os.path.join(ROOT, "tools", "fonts")

INK = (30, 30, 30)
PANEL = (239, 239, 239)
LEFT = 25                 # the text column in the notes panel
CLEAR = (20, 292)         # x range to wipe: flat panel all the way across

# Baselines are 20px apart down the body, measured off the export by
# re-setting an untouched line and matching where its ink starts.
LINES = [
    dict(text="Meeting notes: Q2 planning",            size=16, weight="SemiBold", baseline=141, up=16, down=6),
    dict(text="Review Q2 targets and finalize budget.", size=12, weight="Regular",  baseline=164, up=13, down=5),
    dict(text="2. Approve two new eng roles.",          size=12, weight="Regular",  baseline=244, up=13, down=5),
    dict(text="3. Align roadmap with feedback.",        size=12, weight="Regular",  baseline=264, up=13, down=5),
]


def main():
    if not os.path.exists(RAW):
        raise SystemExit("missing %s" % os.path.relpath(RAW, ROOT))
    im = Image.open(RAW).convert("RGBA")
    d = ImageDraw.Draw(im)

    for line in LINES:
        path = os.path.join(FONTS, "Inter-%s.woff" % line["weight"])
        font = ImageFont.truetype(path, line["size"])
        top = line["baseline"] - line["up"]
        bottom = line["baseline"] + line["down"]
        d.rectangle([CLEAR[0], top, CLEAR[1], bottom], fill=PANEL + (255,))
        d.text((LEFT, line["baseline"]), line["text"], font=font,
               fill=INK + (255,), anchor="ls")
        print("set %r" % line["text"])

    im.save(OUT)
    print("\nwrote %s" % os.path.relpath(OUT, ROOT))


if __name__ == "__main__":
    main()
