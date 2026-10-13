#!/usr/bin/env python3
"""Images and video for work/tradersmood.html, pulled from the TradersMood take-home repo.

Copies what the page shows, at the sizes the page uses, and nothing else.

    python3 tools/tradersmood-assets.py --src ~/The5ers
"""
import argparse, json, os, shutil, subprocess
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "images", "tradersmood")
MEDIA = os.path.join(ROOT, "assets", "media", "tradersmood")
MOODS = ["calm", "tense", "clear", "heavy"]
COL = {"calm": "#47B7F1", "tense": "#F0914A", "clear": "#F2C14E", "heavy": "#AE84F2"}


def save(im, rel, w, q=82):
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA") else "RGB")
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "WEBP", quality=q, method=6)
    return im.size


def pair(src, rel, w):
    """A 1x and a 2x export: rel-<w>.webp and rel-<2w>.webp."""
    im = Image.open(src)
    save(im, f"{rel}-{w}.webp", w)
    save(im, f"{rel}-{w * 2}.webp", w * 2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=os.path.expanduser("~/The5ers"))
    a = ap.parse_args()
    fig = os.path.join(a.src, "assets/covers/figma-v3")
    v3 = os.path.join(a.src, "site-v3/public")

    for m in MOODS:
        save(Image.open(os.path.join(fig, f"YouTube · {m}.png")), f"yt-{m}-720.webp", 720)
    save(Image.open(os.path.join(fig, "YouTube · calm.png")), "yt-calm-1440.webp", 1440)
    # Chapter 06 shows two posts, one quote card and one story; only those are exported.
    for kind, m, rel, w in [("Post", "calm", "post-calm", 360), ("Post", "tense", "post-tense", 360),
                            ("Quote card", "clear", "card-clear", 360), ("Story", "heavy", "story-heavy", 300)]:
        save(Image.open(os.path.join(fig, f"{kind} · {m}.png")), f"{rel}-{w}.webp", w)
    pair(os.path.join(v3, "img/fig2-yt-calm.webp"), "yt-brackets", 640)
    for n in ["test-before", "test-after"]:
        pair(os.path.join(v3, f"img/{n}.webp"), n, 720)
    pair(os.path.join(a.src, "assets/tradersmood/scenes/studio-set-neon.jpg"), "set", 720)

    # The four line shapes, drawn by the same maths as the covers (site-v3/line.js).
    js = ("const {moodLine}=require(process.argv[1]);"
          "console.log(JSON.stringify(Object.fromEntries(['calm','tense','clear','heavy']"
          ".map(m=>[m,moodLine(m,{base:150,k:.85,wk:1.4})]))))")
    paths = json.loads(subprocess.check_output(["node", "-e", js, os.path.join(a.src, "site-v3/line.js")]))
    for m, d in paths.items():
        with open(os.path.join(OUT, f"line-{m}.svg"), "w") as f:
            f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 300"><path d="{d}" fill="{COL[m]}"/></svg>\n')
    for name in ["tradersmood-logo-ink.svg", "tradersmood-logo-paper.svg"]:
        shutil.copy(os.path.join(a.src, "assets/logo", name), os.path.join(OUT, name))

    # Video: the Short (the hero) and the post being built layer by layer.
    os.makedirs(MEDIA, exist_ok=True)
    for n in ["short.mp4", "short-poster.webp", "anatomy.mp4", "anatomy-poster.webp"]:
        shutil.copy(os.path.join(v3, "media", n), os.path.join(MEDIA, n))

    # Home card (640x600 and 320x300) and the link-preview card (1200x630), from the clear YouTube cover.
    src = Image.open(os.path.join(fig, "YouTube · clear.png")).convert("RGB")
    W, H = src.size
    card = src.crop((W - round(H * 640 / 600), 0, W, H)).resize((640, 600), Image.LANCZOS)
    os.makedirs(os.path.join(ROOT, "images", "card"), exist_ok=True)
    card.save(os.path.join(ROOT, "images/card/tradersmood-640.webp"), "WEBP", quality=82, method=6)
    card.resize((320, 300), Image.LANCZOS).save(os.path.join(ROOT, "images/card/tradersmood-320.webp"), "WEBP", quality=82, method=6)
    for w in (800, 1600):  # the wide card on desktop, 16:9
        src.resize((w, round(H * w / W)), Image.LANCZOS).save(os.path.join(ROOT, f"images/card/tradersmood-wide-{w}.webp"), "WEBP", quality=82, method=6)
    og = src.resize((1200, round(H * 1200 / W)), Image.LANCZOS)
    og = og.crop((0, (og.height - 630) // 2, 1200, (og.height - 630) // 2 + 630))
    os.makedirs(os.path.join(ROOT, "images", "og"), exist_ok=True)
    og.save(os.path.join(ROOT, "images/og/tradersmood.jpg"), "JPEG", quality=86)
    print("tradersmood assets written to", os.path.relpath(OUT, ROOT), "and", os.path.relpath(MEDIA, ROOT))


if __name__ == "__main__":
    main()
