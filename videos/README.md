# Recordings

`design-c.html` has a video slot at the top of each of the four tool projects.
Until an mp4 lands here, the slot shows the poster still and removes its
"Recording" badge, so the page is never broken by a missing file.

Drop these in, named exactly:

| File         | Tool           | What to capture |
|--------------|----------------|-----------------|
| `naymo.mp4`  | Voice tab switching | Hotkey, speak a partial tab name, tab switches. Then save a tab by voice and reopen it after closing. |
| `zoom.mp4`   | Zoom for Kids  | The panel inside a real Zoom call. Hit a reaction, raise a hand, mute. Switch a theme. |
| `mint.mp4`   | Mint           | Brand kit in, format picked, prompt typed, the set coming back. Then one remix. |
| `shhh.mp4`   | Shhh           | Menu bar pill, talk, words appearing live in another app. Switch to Hebrew mid-flow. |

## Encoding

The slot autoplays muted on loop, so treat these as silent demos.

- 15 to 25 seconds. Loop-friendly: end near where you started.
- H.264 mp4, 1920 wide, 30fps, no audio track.
- Keep each under about 5MB. GitHub Pages serves these on every page load.
- Record at 2x then downscale, so the text stays crisp.

```bash
ffmpeg -i raw.mov -vf "scale=1920:-2,fps=30" -c:v libx264 -crf 24 -preset slow -an -movflags +faststart naymo.mp4
```

The poster still stays as the fallback, so a slow connection or a failed load
still shows something real.
