/* Four transparent 5s loops.
 
   WebM carries alpha natively through VP9. Safari does not read that,
   and Remotion cannot emit an alpha MP4 directly, so the fallback goes
   out as ProRes 4444 and ffmpeg re-encodes it to HEVC with an alpha
   layer, which is how the three older clips in assets/media were made.
   The ProRes is a scratch file and is deleted after.
 
   The poster keeps its alpha too, so nothing shows a white box before
   the video starts.

   Rendered at 2x. The hero column is 620 CSS px, which is 1240 device
   px on a retina screen, and the source artwork is only 640px wide, so
   something has to be upscaled either way. Doing it at render time
   beats leaving it to the browser: the parts drawn rather than
   photographed, the arc's gradient and the toggle and swatch
   rectangles, come out genuinely sharp at that size instead of being
   resampled twice. The artwork behind them is still capped by its
   source and no render setting changes that. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, statSync } from 'node:fs';

const PIECES = [
  ['ArtWebsite', 'art-website'],
  ['ArtEmail', 'art-email'],
  ['ArtPortal', 'art-portal'],
  ['ArtPhotos', 'art-photos'],
];

mkdirSync('out', { recursive: true });
const remotion = (a) => execFileSync('npx', ['remotion', ...a, '--log=error'], { stdio: 'inherit' });
const ff = (a) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...a], { stdio: 'inherit' });
const kb = (f) => Math.round(statSync(f).size / 1024);

for (const [id, name] of PIECES) {
  remotion(['render', id, `out/${name}.webm`, '--codec=vp9', '--scale=2',
    '--pixel-format=yuva420p', '--image-format=png', '--crf=32']);

  remotion(['render', id, `out/${name}.mov`, '--codec=prores', '--scale=2',
    '--prores-profile=4444', '--pixel-format=yuva444p10le', '--image-format=png']);
  ff(['-i', `out/${name}.mov`, '-c:v', 'hevc_videotoolbox',
    '-alpha_quality', '0.9', '-pix_fmt', 'bgra', '-tag:v', 'hvc1',
    '-allow_sw', '1', '-q:v', '55', `out/${name}.mp4`]);
  rmSync(`out/${name}.mov`);

  remotion(['still', id, `out/${name}-poster.png`, '--frame=0', '--scale=2', '--image-format=png']);
  execFileSync('cwebp', ['-q', '86', '-alpha_q', '100', '-quiet',
    `out/${name}-poster.png`, '-o', `out/${name}-poster.webp`]);
  rmSync(`out/${name}-poster.png`);

  console.log(`done ${name}  webm ${kb(`out/${name}.webm`)}KB  mp4 ${kb(`out/${name}.mp4`)}KB  poster ${kb(`out/${name}-poster.webp`)}KB`);
}
