/* Renders the five Payoneer headers: a WebM for everything that takes
   one, an H.264 MP4 for Safari, and a poster on the first artefact at
   rest, which is the picture the static hero used to show. */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const SETS = [
  ['PayoneerWebsite', 'payoneer-website'],
  ['PayoneerEmail', 'payoneer-email'],
  ['PayoneerPortal', 'payoneer-portal'],
  ['PayoneerImages', 'payoneer-images'],
  ['PayoneerIcons', 'payoneer-icons'],
];

mkdirSync('out', { recursive: true });
const run = (args) =>
  execFileSync('npx', ['remotion', ...args, '--log=error'], { stdio: 'inherit' });

for (const [id, name] of SETS) {
  run(['render', id, `out/${name}.webm`, '--codec=vp9', '--crf=30']);
  run(['render', id, `out/${name}.mp4`, '--codec=h264', '--crf=26']);
  run(['still', id, `out/${name}-poster.png`, '--frame=0']);
  console.log(`done ${name}`);
}
