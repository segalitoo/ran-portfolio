#!/usr/bin/env python3
"""Images and loops for work/ad-studio.html, pulled from the art-direction repo.

The campaigns live in the video-ad-art-direction repo under local/ (kept out of
its public git, because they are real brands). This copies what the page shows,
at the sizes the page uses, and nothing else.

    python3 tools/ad-studio-assets.py --src ~/Video-ad-art-direction- --shots /path/to/board-shots

--shots holds the board screenshots and the rejected-clip strips made during
the run (board_head.png, board_set.png, b06_drift.jpg, b062.jpg).
"""
import argparse, glob, os, subprocess
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "images", "ad-studio")
MEDIA = os.path.join(ROOT, "assets", "media", "ad-studio")


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


def collage(paths, cols, tile_w, gap, bg=(0, 0, 0, 0)):
    ims = [Image.open(p).convert("RGB") for p in paths]
    tiles = [im.resize((tile_w, round(im.height * tile_w / im.width)), Image.LANCZOS) for im in ims]
    rows = [tiles[i:i + cols] for i in range(0, len(tiles), cols)]
    H = sum(max(t.height for t in r) for r in rows) + gap * (len(rows) - 1)
    W = cols * tile_w + gap * (cols - 1)
    c = Image.new("RGBA", (W, H), bg)
    y = 0
    for r in rows:
        for i, t in enumerate(r):
            c.paste(t, (i * (tile_w + gap), y))
        y += max(t.height for t in r) + gap
    return c


def video(src, name, w=540):
    os.makedirs(MEDIA, exist_ok=True)
    out = os.path.join(MEDIA, f"{name}.mp4")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-vf", f"scale={w}:-2", "-c:v", "libx264",
                    "-crf", "27", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out],
                   check=True)
    frame = os.path.join(MEDIA, f"{name}-poster.png")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", "2", "-i", src, "-frames:v", "1", frame], check=True)
    save(Image.open(frame), f"loops/{name}-poster-{w}.webp", w)
    os.remove(frame)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True, help="the video-ad-art-direction repo")
    ap.add_argument("--shots", required=True)
    a = ap.parse_args()
    by = os.path.join(a.src, "local/projects/byoma-barrier-test-set")
    ly = os.path.join(a.src, "local/projects/lucy-and-yak-awareness-statics")
    out = lambda k, s: glob.glob(os.path.join(by, "formats/out", f"{k}_*_{s}.jpg"))[0]
    v1 = lambda k, s: glob.glob(os.path.join(by, "v1", f"{k}_*_{s}.jpg"))[0]

    # Hero: four feed ads from the two brands, 2 x 2
    hero = collage([out("B06", "1080x1350"), os.path.join(ly, "exports/LucyYak_spec_ad1_feed_1080x1350.jpg"),
                    out("B03", "1080x1350"), out("B05", "1080x1350")], 2, 520, 16)
    save(hero, "hero-1056.webp", 1056)
    save(hero, "hero-528.webp", 528)

    # The set: ten feed ads, plus the three sizes of one
    for k in [f"B{i:02d}" for i in range(1, 11)]:
        pair(out(k, "1080x1350"), f"set/{k.lower()}", 360)
    sizes = collage([out("B07", "1080x1350"), out("B07", "1080x1080"), out("B07", "1080x1920")], 3, 600, 24)
    # same height, not same width: rebuild at a common height
    ims = [Image.open(out("B07", s)).convert("RGB") for s in ("1080x1350", "1080x1080", "1080x1920")]
    h = 900
    ims = [im.resize((round(im.width * h / im.height), h), Image.LANCZOS) for im in ims]
    c = Image.new("RGB", (sum(i.width for i in ims) + 2 * 28, h), (255, 255, 255))
    x = 0
    for im in ims:
        c.paste(im, (x, 0))
        x += im.width + 28
    save(c, "set/sizes-b07-720.webp", 720)
    save(c, "set/sizes-b07-1440.webp", 1440)

    # Before and after: the set sent back (v1) and the set approved (v2)
    for k, s, w in (("B03", "1080x1080", 360), ("B06", "1080x1350", 360), ("B09", "1080x1920", 300)):
        pair(v1(k, s), f"fix/{k.lower()}-{s}-v1", w)
        pair(out(k, s), f"fix/{k.lower()}-{s}-v2", w)

    # The look: eight first drafts that drew fake text, and the frame that was fixed
    maya = sorted(glob.glob(os.path.join(by, "keyframes/r1/maya-0*.png")))
    strip = collage(maya, 8, 300, 10, (255, 255, 255, 255))
    save(strip, "look/maya-drafts-1440.webp", 1440)
    save(strip, "look/maya-drafts-720.webp", 720)
    pair(os.path.join(by, "keyframes/r1/maya-04.png"), "look/maya-04", 360)
    pair(os.path.join(by, "keyframes/r2/maya-edit.png"), "look/maya-edit", 360)
    pair(os.path.join(by, "keyframes/r2/trio-a.png"), "look/trio-a", 360)

    # The board: a stage as a page, with the gate controls
    head = Image.open(os.path.join(a.shots, "board_head.png")).convert("RGB")
    body = Image.open(os.path.join(a.shots, "board_set.png")).convert("RGB")
    board = Image.new("RGB", (head.width, head.height + 24 + body.height), (240, 240, 238))
    board.paste(head, (0, 0))
    board.paste(body, (0, head.height + 24))
    save(board, "board-1440.webp", 1440)
    save(board, "board-720.webp", 720)

    # Rejected clips, frame strips
    for f, rel in (("b06_drift.jpg", "loops/b06-wan-1"), ("b062.jpg", "loops/b06-wan-2")):
        im = Image.open(os.path.join(a.shots, f))
        save(im, f"{rel}-{im.width}.webp", im.width)

    # Lucy & Yak: the four exports
    for f in sorted(glob.glob(os.path.join(ly, "exports/*.jpg"))):
        name = os.path.basename(f).replace("LucyYak_spec_", "").replace(".jpg", "").replace("_", "-")
        pair(f, f"ly/{name}", 300 if "story" in name else 360)

    # Loops
    video(os.path.join(by, "loops/B06_kling_loop_9x16.mp4"), "b06-kling")
    video(os.path.join(by, "loops/B05_loop_9x16.mp4"), "b05-wan")
    video(os.path.join(ly, "loops/ad2_story_1080x1920_kling_loop.mp4"), "ly-ad2-kling")

    # Card (640 x 600) and link preview (1200 x 630): a neutral ground, so the yellow ads keep their edge
    from PIL import ImageFilter
    GROUND = (236, 234, 228)

    def lay(canvas, paths, tw, gap, lift):
        x0 = (canvas.width - len(paths) * tw - (len(paths) - 1) * gap) // 2
        for i, p in enumerate(paths):
            t = Image.open(p).convert("RGB")
            t = t.resize((tw, round(t.height * tw / t.width)), Image.LANCZOS)
            x, y = x0 + i * (tw + gap), (canvas.height - t.height) // 2 + (-lift if i % 2 else lift)
            sh = Image.new("L", canvas.size, 0)
            ImageDraw.Draw(sh).rectangle([x, y + 18, x + tw, y + t.height + 18], fill=70)
            sh = sh.filter(ImageFilter.GaussianBlur(22))
            canvas.paste(Image.new("RGB", canvas.size, (40, 36, 30)), (0, 0), sh)
            canvas.paste(t, (x, y))
        return canvas

    card = lay(Image.new("RGB", (1280, 1200), GROUND),
               [out("B06", "1080x1350"), out("B03", "1080x1350"), out("B05", "1080x1350")], 392, 30, 44)
    save(card, "../card/ad-studio-640.webp", 640)
    save(card, "../card/ad-studio-320.webp", 320)
    # The wide home card: three Stories frames side by side fill a 16:9 frame
    wide = Image.new("RGB", (1600, 900), GROUND)
    stories = [out("B06", "1080x1920"), os.path.join(ly, "exports/LucyYak_spec_ad2_story_1080x1920.jpg"), out("B05", "1080x1920")]
    th = 820
    tw = round(th * 1080 / 1920)
    x0 = (1600 - 3 * tw - 2 * 36) // 2
    for i, p in enumerate(stories):
        t = Image.open(p).convert("RGB").resize((tw, th), Image.LANCZOS)
        wide.paste(t, (x0 + i * (tw + 36), 40))
    save(wide, "../card/ad-studio-wide-800.webp", 800)
    save(wide, "../card/ad-studio-wide-1600.webp", 1600)
    og = lay(Image.new("RGB", (1200, 630), GROUND),
             [out("B06", "1080x1350"), os.path.join(ly, "exports/LucyYak_spec_ad1_feed_1080x1350.jpg"),
              out("B03", "1080x1350"), out("B05", "1080x1350")], 248, 24, 22)
    os.makedirs(os.path.join(ROOT, "images", "og"), exist_ok=True)
    og.save(os.path.join(ROOT, "images", "og", "ad-studio.jpg"), "JPEG", quality=86)
    print("done")


if __name__ == "__main__":
    main()
