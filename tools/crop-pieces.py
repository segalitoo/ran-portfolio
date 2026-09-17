#!/usr/bin/env python3
"""Cut portrait, square and detail pieces out of the landscape exports.

ASSET-SPEC.md records the problem this solves: every screenshot in images/
is 1.893:1, and one shape is the reason every project reads the same. The
collage on a project page needs pieces of different proportions, so rather
than wait for new exports these are cut from the real ones. Nothing is
upscaled: a 3:4 piece out of a 2120px wide export is still 840px across,
which is well over twice its largest display size.

Originals are never touched. Reruns skip anything newer than its input.
"""
import os
import sys
from PIL import Image, ImageChops

SRC = "images"
DST = os.path.join(SRC, "opt")
QUALITY = 82

# name -> (aspect, horizontal anchor 0..1, zoom as a fraction of source height)
# These exports are already compositions: panels of real UI floating on a
# flat grey. A crop that keeps the grey is a collage of collages, which
# reads as mud. Every window here is tight enough to land inside the
# panels, and the four anchors pull from different parts of the frame so
# one project yields pieces that are not all the same screen.
SHAPES = {
    "wide": (16 / 10, 0.18, 0.60),
    "tall": (3 / 4, 0.64, 0.82),
    "sq": (1 / 1, 0.42, 0.72),
    "detail": (4 / 3, 0.30, 0.44),
}


def trim(im, tol=14):
    """Cut the uniform backdrop off a mockup.

    Most of these exports are a device or a browser frame sitting on a flat
    grey. On a white page that grey reads as a heavy shadow behind every
    piece and the whole collage goes muddy. Trimming leaves the artefact
    itself, which is what the composition is made of. Only fires when the
    border really is uniform and the result is still most of the frame, so
    a full bleed screenshot is left alone.
    """
    w, h = im.size
    px = im.load()
    corners = [px[1, 1], px[w - 2, 1], px[1, h - 2], px[w - 2, h - 2]]
    if max(max(abs(c[i] - corners[0][i]) for i in range(3)) for c in corners) > tol:
        return im
    bg = Image.new("RGB", im.size, corners[0])
    diff = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > tol else 0)
    box = diff.getbbox()
    if not box:
        return im
    if (box[2] - box[0]) < w * 0.25 or (box[3] - box[1]) < h * 0.25:
        return im
    return im.crop(box)


def crop(im, aspect, anchor, zoom=1.0):
    h = int(im.height * zoom)
    w = int(h * aspect)
    if w > im.width:
        w = im.width
        h = int(w / aspect)
    x = int((im.width - w) * anchor)
    y = int((im.height - h) / 2)
    return im.crop((x, y, x + w, y + h))


def main():
    os.makedirs(DST, exist_ok=True)
    stems = sys.argv[1:]
    made = skipped = 0
    for name in sorted(os.listdir(SRC)):
        if not name.lower().endswith(".png"):
            continue
        stem = os.path.splitext(name)[0]
        if stems and not any(stem.startswith(s) for s in stems):
            continue
        src = os.path.join(SRC, name)
        im = None
        for shape, (aspect, anchor, zoom) in SHAPES.items():
            out = os.path.join(DST, "%s-%s.webp" % (stem, shape))
            if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
                skipped += 1
                continue
            if im is None:
                im = trim(Image.open(src).convert("RGB"))
            piece = crop(im, aspect, anchor, zoom)
            # cap the long edge so a piece never ships more pixels than it shows
            if max(piece.size) > 1100:
                s = 1100 / max(piece.size)
                piece = piece.resize(
                    (round(piece.width * s), round(piece.height * s)), Image.LANCZOS
                )
            piece.save(out, "WEBP", quality=QUALITY, method=6)
            made += 1
    print("wrote %d, skipped %d" % (made, skipped))
    return 0


if __name__ == "__main__":
    sys.exit(main())
