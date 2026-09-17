# Image re-export spec

Every current export is **2120x1120 (1.893:1)**, 36 of them. That single ratio is
the reason all nine projects felt like the same project. Varying the *layout*
alone cannot fix it, because there is only one shape to lay out.

`design-c.html` already has the frames built. Each media entry names its own
layout, so a re-export only needs its layout tag changed in the `media` array.

## The five frames

| Layout | Renders at | Best source | Use for |
|--------|-----------|-------------|---------|
| `bleed` | Edge to edge | 2560x1080 or wider | One opening shot per project. |
| `wide` | 1560px cap | 2120x1120 (what you have) | The default. |
| `inset` | 1180px cap | 1600x900 | Detail crops, single-panel UI. |
| `pair` | Two at ~740px | 1480x1000 each | Genuine before/after only. |
| `portrait` | Up to 420px each | 900x1600 | Phone and menu bar shots at real proportions. |

## Minimum widths

The review's rule was no image below 60% of its native width. Against a 2120
export that means 1272px on screen, which only `bleed` and `wide` clear. So:

- `inset` and `pair` need **smaller, purpose-made exports**, not downscaled
  versions of the 2120 files. Export them at the size in the table.
- Do not re-export everything at 4K. An oversized file in a small frame is the
  same waste, just in the other direction.

## What each project actually needs

**Naymo** is the weakest set right now: all four are landing-page marketing
shots, not the product running. The recording covers the hero. For stills,
what would help is the voice overlay mid-listen, and the options page as an
`inset` crop rather than a full-page screenshot.

**Zoom for Kids** wants `portrait`. It runs on a laptop, but the control panel
itself is a tall strip, and cropping to it at 900x1600 shows the button scale
in a way the wide shot flattens.

**Shhh** is a menu bar app. The whole interface is a pill maybe 200px wide.
A 2120px-wide screenshot of it is 90% desktop wallpaper. Crop tight, use
`inset`, and it will read for the first time.

**Mint** benefits from `pair`: the prompt beside the generated set, so the
before and after sit next to each other instead of 800px apart.

**Payoneer work** is fine as is. Those are web pages, and wide is the honest
frame for them.

## Naming

Keep the existing convention, `<project>_<n>.png`, and add new ones with the
next number. Nothing in the page hardcodes a count.
