#!/usr/bin/env python3
"""Cut the Mint hero loop out of the screen recording.

The five seconds worth showing are the payoff: the Story node sits
empty, the generated placement lands in it, and the board is complete.
Everything before that is the board already finished, which says
nothing the screenshot did not.

A straight cut would snap from a finished ad back to an empty node
every five seconds. So the clip is taken half a second long and its
tail is crossfaded into its own head, which makes the first and last
frames the same picture and the loop invisible.

Usage:  python3 tools/mint-hero-loop.py [path-to-recording]
"""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "media")

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser(
    "~/Desktop/Screen Recording 2026-09-20 at 2.39.42.mov")

START, LOOP, LAP = 37.0, 5.0, 0.5   # seconds: in-point, loop length, crossfade
CROP = "1256:1218:24:102"           # w:h:x:y, trims the empty canvas margin
WIDTH, FPS = 1240, 30               # 2x the 620px the hero column allows

# Take LOOP + LAP seconds, then blend the last LAP into the first LAP, so
# the clip ends on the frame it began with.
CHAIN = (
    f"[0:v]crop={CROP},scale={WIDTH}:-2,fps={FPS},split=2[a][b];"
    f"[a]trim=start={LAP}:end={LOOP + LAP},setpts=PTS-STARTPTS[body];"
    f"[b]trim=start=0:end={LAP},setpts=PTS-STARTPTS[head];"
    f"[body][head]xfade=transition=fade:duration={LAP}:offset={LOOP - LAP}[v]"
)


def run(*args):
    subprocess.run(args, check=True)


def main():
    if not os.path.exists(SRC):
        raise SystemExit("recording not found: %s" % SRC)
    os.makedirs(OUT, exist_ok=True)
    base = ["ffmpeg", "-v", "error", "-y", "-ss", str(START), "-t",
            str(LOOP + LAP), "-i", SRC, "-filter_complex", CHAIN, "-map", "[v]", "-an"]

    # VP9 for everything that takes WebM. No alpha: the recording is an
    # opaque rectangle and its corners are rounded in CSS, which stays
    # sharp at any size and costs nothing to change.
    run(*base, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "34",
        "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
        os.path.join(OUT, "mint.webm"))

    # H.264 rather than the HEVC the other three use. They are HEVC
    # because they carry an alpha layer; this one does not, so the more
    # universally decodable codec is the better fallback.
    run(*base, "-c:v", "libx264", "-crf", "23", "-preset", "slow",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        os.path.join(OUT, "mint.mp4"))

    # This ffmpeg has no webp encoder, so the poster goes out as PNG and
    # cwebp does the conversion, same as every other image in the repo.
    tmp = os.path.join(OUT, "mint-poster.png")
    run("ffmpeg", "-v", "error", "-y", "-ss", str(START), "-i", SRC,
        "-vf", f"crop={CROP},scale={WIDTH}:-2", "-vframes", "1", tmp)
    run("cwebp", "-q", "80", "-quiet", tmp, "-o",
        os.path.join(OUT, "mint-poster.webp"))
    os.remove(tmp)

    for name in ("mint.webm", "mint.mp4", "mint-poster.webp"):
        p = os.path.join(OUT, name)
        print("%-20s %8d bytes" % (name, os.path.getsize(p)))


if __name__ == "__main__":
    main()
