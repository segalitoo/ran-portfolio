#!/usr/bin/env python3
"""Lift the Mint hero's layers out of the recording, for motion/.

The recording only ever shows a single placement being generated, so a
sequence of all four appearing cannot be cut from it. This takes one
frame of the finished board apart instead: a base of bare canvas and
the prompt node, and one opaque crop per placement. motion/ animates
them, drawing a cable to each placement and landing it as the cable
arrives.

Two things are cleaned off the frame on the way. Two of the four
placements were selected when it was taken, so they carry the app's
green ring; it is neutralised rather than filled over, or it smears
along the panel edge. And the connector curves come off entirely,
since Remotion draws its own, which are crisper and can be animated.

Usage:  python3 tools/mint-board-reveal.py [path-to-recording]
"""
import os
import subprocess
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser(
    "~/Desktop/Screen Recording 2026-09-20 at 2.39.42.mov")
FRAME = 44.0                       # the board complete, nothing selected mid-change
CROP = (24, 102, 1280, 1320)       # left, top, right, bottom in the 1374x1372 capture
GRID = 36
RING = 26                          # how far in from a node box edge the ring reaches
HALO = 13                          # and how far out its halo spills                          # the canvas dot grid repeats every 36px
PHASE = (3, 0)                     # x, y of a grid line in capture coordinates

# Each placement's panel, header and chip row included, in capture
# coordinates. Padded out far enough that a cover hides the whole node
# and a little of the connector that feeds it.
SOURCE = (470, 482)                # the prompt node's output port, centre of its ring
TARGETS = {                        # and each placement's input handle
    "facebook":  (568, 238),
    "instagram": (932, 387),
    "linkedin":  (527, 711),
    "story":     (915, 957),
}

PROMPT_EDGE = 500                  # capture x: the prompt node is the only thing left of this

NODES = {
    "facebook":  (561, 111, 894, 365),
    "instagram": (925, 186, 1258, 587),
    "linkedin":  (520, 583, 861, 837),
    "story":     (908, 636, 1249, 1276),
}


def prompt_mask(cap):
    """Where the prompt node is, shadow included.

    A rectangle was not good enough. Too tight and the node's left
    border survived into the empty canvas as a stray line; too loose
    and it swallowed the first stretch of every cable, which then also
    survived. This takes whatever is actually drawn on the left third
    of the board, as one connected shape, and grows it enough to carry
    its own shadow.
    """
    import numpy as np
    from scipy import ndimage

    a = np.asarray(cap).astype(int)
    lift = np.abs(a - grid_like(cap)).sum(axis=2)
    left = lift > 14
    left[:, PROMPT_EDGE:] = False
    lab, n = ndimage.label(ndimage.binary_closing(left, np.ones((15, 15))))
    if not n:
        return left
    biggest = 1 + int(np.argmax(ndimage.sum(left, lab, range(1, n + 1))))
    mask = ndimage.binary_dilation(lab == biggest, np.ones((37, 37)))
    # The dilation that carries the panel's shadow also reaches past the
    # output port and catches the first few pixels of every cable, which
    # then survive as stubs on an otherwise empty canvas. Cutting just
    # outside the port keeps the panel and the port itself, and loses
    # the stubs, which is where the cables start and Remotion's job
    # begins.
    mask[:, SOURCE[0] + 11:] = False
    return mask


def unring(cap):
    import numpy as np
    from scipy import ndimage

    a = np.asarray(cap).astype(int)
    # The ring's core is strongly green, but the halo around it fades
    # to a few points above neutral. The canvas grid and the node
    # greys are all neutral, so inside the edge band even a faint
    # green cast can only be the ring.
    green = (a[:, :, 1] - a[:, :, 0] > 6) & (a[:, :, 1] > 30)
    band = np.zeros(green.shape, bool)
    for x0, y0, x1, y1 in NODES.values():
        band[y0:y1, x0:x1] = True
        band[y0 + RING:y1 - RING, x0 + RING:x1 - RING] = False
    mask = ndimage.binary_dilation(green & band, np.ones((3, 3)))
    out = a.copy()
    # Pull the green back down to the red channel rather than filling
    # from the nearest kept pixel. Filling smeared the ring's own dark
    # green inwards and left a stain along the panel edge; taking the
    # tint out leaves the border itself, which is the neutral grey it
    # was before the node was selected.
    if mask.any():
        r = out[:, :, 0]
        out[:, :, 1] = np.where(mask, np.minimum(out[:, :, 1], r + 3), out[:, :, 1])
        out[:, :, 2] = np.where(mask, np.minimum(out[:, :, 2], r + 3), out[:, :, 2])
    # Everything else with a green cast on bare canvas is either the
    # connector curves or what is left of a halo, and none of it should
    # be on screen before the first placement lands. It all comes off
    # the board and goes onto its own layer, which fades in with the
    # first reveal.
    canvas = grid_like(cap)

    # The halo spills past the node box too, and out there it cannot be
    # told from a connector by colour: both top out at the same few
    # points of green. So the strip just outside each box is replaced
    # with canvas outright rather than masked. It is kept narrow, since
    # every pixel of it is also a pixel off the end of the connector
    # that feeds the node.
    for x0, y0, x1, y1 in NODES.values():
        strip = np.zeros(green.shape, bool)
        strip[max(y0 - HALO, 0):y1 + HALO, max(x0 - HALO, 0):x1 + HALO] = True
        strip[y0:y1, x0:x1] = False
        out[strip] = canvas[strip]

    loose = (a[:, :, 1] - a[:, :, 0] > 3) & (a[:, :, 1] > 28)
    # Grown by the halo strip, or the ring glow around the two selected
    # placements is lifted onto the wires layer and simply comes back
    # the moment that layer fades in.
    for x0, y0, x1, y1 in NODES.values():
        loose[max(y0 - HALO, 0):y1 + HALO, max(x0 - HALO, 0):x1 + HALO] = False
    loose[prompt_mask(cap)] = False
    loose = ndimage.binary_dilation(loose, np.ones((3, 3)))
    out[loose] = canvas[loose]

    # The same pixels, kept as a transparent layer. Alpha is how far
    # each one stood off the canvas, so the curves keep their soft
    # edges instead of coming back as a hard stencil.
    lift = np.abs(a - canvas).sum(axis=2)
    alpha = np.clip(lift * 4, 0, 255) * loose
    wires = np.dstack([a, alpha]).astype("uint8")

    print("ring pixels repainted: %d, wires lifted: %d" % (mask.sum(), loose.sum()))
    return Image.fromarray(out.astype("uint8")), Image.fromarray(wires)


def empty_canvas(board, canvas_board, keep):
    """The board with nothing on it but the canvas and the prompt node.

    Replacing only the node boxes left their drop shadows behind, plus
    the odd stray line, as faint ghosts on what is supposed to be an
    empty canvas. So this goes the other way round: start from bare
    grid, and bring back only the prompt node.

    The prompt node is carried over by how far each pixel stands off
    the grid rather than by a rectangle, so its shadow fades out the
    way it was drawn instead of ending on a hard edge.
    """
    import numpy as np

    b = np.asarray(board).astype(int)
    g = np.asarray(canvas_board).astype(int)
    lift = np.abs(b - g).sum(axis=2)

    alpha = (np.clip(lift * 6, 0, 255) * keep)[:, :, None] / 255.0

    out = g * (1 - alpha) + b * alpha
    return Image.fromarray(out.round().astype("uint8"))


def grid_like(cap):
    """The bare canvas, tiled across the whole frame at the real phase."""
    import numpy as np
    gx = PHASE[0] + GRID * ((100 - PHASE[0]) // GRID)
    gy = PHASE[1] + GRID * ((900 - PHASE[1]) // GRID)
    cell = np.asarray(cap.crop((gx, gy, gx + GRID, gy + GRID))).astype(int)
    W, H = cap.size
    ys = (np.arange(H) - PHASE[1]) % GRID
    xs = (np.arange(W) - PHASE[0]) % GRID
    return cell[ys][:, xs]


def main():
    if not os.path.exists(SRC):
        raise SystemExit("recording not found: %s" % SRC)
    full = os.path.join(ROOT, "motion", "public", "_frame.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(FRAME), "-i", SRC,
                    "-vframes", "1", full], check=True)
    cap = Image.open(full).convert("RGB")
    os.remove(full)

    # Two of the four placements are selected in this frame, so they
    # carry the app's own green ring. Left in, they would glow all the
    # time while the other two glowed only on their turn, and the ring
    # would peek out from behind its cover. It is painted out along the
    # edge band of each node box, near enough to the border to catch the
    # ring and far enough from the middle to leave the Remix button and
    # the rest of the node alone. Each removed pixel takes the value of
    # the closest kept one, so canvas fills with canvas and border with
    # border.
    keep_prompt = prompt_mask(cap)
    cap, _wires = unring(cap)

    board = cap.crop(CROP)

    # Bare canvas the size of the board, cropped the same way, so every
    # patch taken out of it is already in board coordinates. Generating
    # a patch in capture coordinates and then placing it by board
    # coordinates shifts it by the crop offset, which is 24 across and
    # 30 down: not enough to read as a shift, but enough to leave a
    # visible rectangle where two grids meet out of phase.
    canvas_board = Image.fromarray(
        grid_like(cap)[CROP[1]:CROP[3], CROP[0]:CROP[2]].astype("uint8"))

    motion = os.path.join(ROOT, "motion", "public")
    os.makedirs(motion, exist_ok=True)
    if True:
        for name, (x0, y0, x1, y1) in NODES.items():
            cx, cy = x0 - CROP[0], y0 - CROP[1]
            board.crop((cx, cy, cx + (x1 - x0), cy + (y1 - y0))).save(
                os.path.join(motion, "p-%s.png" % name))
        base = empty_canvas(board, canvas_board,
                            keep_prompt[CROP[1]:CROP[3], CROP[0]:CROP[2]])
        base.save(os.path.join(motion, "base.png"))
        print("\nmotion/public: base.png + %d placements, %dx%d"
              % (len(NODES), *board.size))
        print("handles (board coordinates): source %s" % (tuple(
            c - o for c, o in zip(SOURCE, CROP[:2])),))
        for name, t in TARGETS.items():
            print("   %-10s %s" % (name, tuple(c - o for c, o in zip(t, CROP[:2]))))


if __name__ == "__main__":
    main()
