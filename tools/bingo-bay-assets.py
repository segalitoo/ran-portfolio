#!/usr/bin/env python3
"""Bring the Bingo Bay material into the portfolio as WebP.

The sources live in the take-home folder next door and are never
touched. Everything the two Bingo Bay pages show is written from them
here, so a rerun after a source changes is the whole update.

Two things are deliberately left behind. The submission's *_v2 cast
cutouts carry name labels painted in the hiring studio's brand style,
so the cast is cut from the clean Bria removals instead. And the
reference screens of a competitor's live game stay where they are:
this page has no reason to show somebody else's product.

Reruns skip anything already newer than its input.

Usage:  python3 tools/bingo-bay-assets.py <path-to-take-home-folder>
        (or set BINGO_BAY_SRC). The folder holds characters/ and
        submission/assets/ exactly as the take-home left them.
"""
import os
import shutil
import sys
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("BINGO_BAY_SRC", "")
if not SRC or not os.path.isdir(SRC):
    sys.exit("Pass the take-home folder as the first argument, or set BINGO_BAY_SRC.")
GEN = os.path.join(SRC, "characters")
SEL = os.path.join(GEN, "selected")
CUT = os.path.join(SEL, "removed_bg")
SUB = os.path.join(SRC, "submission", "assets")

DST = os.path.join(ROOT, "images", "bingo-bay")
CARD = os.path.join(ROOT, "images", "card")
MEDIA = os.path.join(ROOT, "assets", "media")
QUALITY = 82

# Finished pieces: (source, output stem, widths)
PIECES = [
    (os.path.join(SUB, "app_store.jpeg"), "keyart", (1440, 720)),
    (os.path.join(SEL, "UI_1.jpeg"), "lobby", (1440, 720)),
    (os.path.join(SEL, "UI_2.jpeg"), "progression", (1440, 720)),
    (os.path.join(SEL, "scene_02.jpeg"), "plate", (1376, 720)),
    (os.path.join(SEL, "mango_09.jpeg"), "mango-2d", (720,)),
    (os.path.join(SUB, "mango_repose.png"), "mango-repose", (720,)),
    (os.path.join(SUB, "mango_mesh.png"), "mango-mesh", (720,)),
]

# The cast, trimmed to the figure so every cutout sits on the same baseline
CAST = [
    ("crab_02-bria-nobg.png", "coral"),
    ("turtle_04-bria-nobg.png", "shelly"),
    ("starfish_12-bria-nobg_edited.png", "twinkle"),
    ("dolphin_07-bria-nobg_edited.png", "splash"),
    ("mango_09-bria-nobg_edited_2.png", "mango"),
]

FAMILIES = [("crab", 8), ("turtle", 8), ("starfish", 12), ("dolphin", 8), ("mango", 9), ("scene", 10)]


def fresh(src, out):
    # An empty file is an interrupted write, never a finished one. Skipping
    # it on the grounds that it is newer than its source is how a 0-byte
    # twinkle-720.webp once shipped as a broken image on every 2x screen.
    return (os.path.exists(out) and os.path.getsize(out) > 0
            and os.path.getmtime(out) >= os.path.getmtime(src))


def save(im, out):
    im.save(out, "WEBP", quality=QUALITY, method=6)


def fit(im, w):
    if im.width <= w:
        return im.copy()
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)


def main():
    for d in (DST, os.path.join(DST, "cast"), os.path.join(DST, "sheet"), CARD, MEDIA):
        os.makedirs(d, exist_ok=True)
    made = 0

    for src, stem, widths in PIECES:
        for w in widths:
            out = os.path.join(DST, f"{stem}-{w}.webp")
            if fresh(src, out):
                continue
            im = Image.open(src)
            im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
            save(fit(im, w), out)
            made += 1

    for name, stem in CAST:
        src = os.path.join(CUT, name)
        for h in (720, 360):
            out = os.path.join(DST, "cast", f"{stem}-{h}.webp")
            if fresh(src, out):
                continue
            im = Image.open(src).convert("RGBA")
            im = im.crop(im.getbbox())
            im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
            save(im, out)
            made += 1

    # The event logo for the page hero, trimmed to the artwork so the page
    # positions the drawing and not a square of empty alpha around it
    src = os.path.join(SEL, "BINGO_BAY_logo_summer_nobg.png")
    for w in (1040, 520):
        out = os.path.join(DST, f"logo-{w}.webp")
        if fresh(src, out):
            continue
        im = Image.open(src).convert("RGBA")
        im = im.crop(im.getbbox())
        save(fit(im, w), out)
        made += 1

    # Contact sheet: a small frame for the grid, a large one for the viewer
    for prefix, count in FAMILIES:
        for i in range(1, count + 1):
            src = os.path.join(GEN, f"{prefix}_{i:02d}.jpeg")
            for w, tag in ((360, "s"), (1200, "l")):
                out = os.path.join(DST, "sheet", f"{prefix}_{i:02d}-{tag}.webp")
                if fresh(src, out):
                    continue
                save(fit(Image.open(src).convert("RGB"), w), out)
                made += 1

    # Homepage card: the event logo on the event's own cream-to-sand
    # ground, at the 16:15 every card in the row shares
    src = os.path.join(SEL, "BINGO_BAY_logo_summer_nobg.png")
    if not all(fresh(src, os.path.join(CARD, f"bingo-bay-sq-{w}.webp")) for w in (1280, 640, 320)):
        W, H = 1280, 1200
        c1, c2 = (0xFF, 0xF4, 0xE2), (0xF3, 0xD9, 0xA4)
        card = Image.new("RGBA", (W, H))
        for y in range(H):
            t = y / (H - 1)
            card.paste(tuple(round(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)) + (255,), (0, y, W, y + 1))
        logo = Image.open(src).convert("RGBA")
        logo = logo.crop(logo.getbbox())
        lw = 860
        logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
        x, y = (W - lw) // 2, (H - logo.height) // 2
        shadow = Image.new("RGBA", logo.size, (58, 42, 92, 0))
        shadow.putalpha(logo.split()[-1].point(lambda v: int(v * 0.22)))
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        layer.paste(shadow, (x, y + 26), shadow)
        card.alpha_composite(layer.filter(ImageFilter.GaussianBlur(30)))
        card.alpha_composite(logo, (x, y))
        card = card.convert("RGB")
        for w in (1280, 640, 320):
            save(card.resize((w, round(w * H / W)), Image.LANCZOS), os.path.join(CARD, f"bingo-bay-sq-{w}.webp"))
            made += 1

    src = os.path.join(SUB, "event_loop.mp3")
    out = os.path.join(MEDIA, "bingo-bay-loop.mp3")
    if not fresh(src, out):
        shutil.copy2(src, out)
        made += 1

    print(f"{made} written")


if __name__ == "__main__":
    sys.exit(main())
