/* The MP4s came out half again the size of the WebMs, which is the
   whole cost for Safari. Re-encoding only those at a higher CRF. */
import { execFileSync } from 'node:child_process';
const SETS = [
  ['PayoneerWebsite', 'payoneer-website'],
  ['PayoneerEmail', 'payoneer-email'],
  ['PayoneerPortal', 'payoneer-portal'],
  ['PayoneerImages', 'payoneer-images'],
  ['PayoneerIcons', 'payoneer-icons'],
];
for (const [id, name] of SETS) {
  execFileSync('npx', ['remotion', 'render', id, `out/${name}.mp4`,
    '--codec=h264', '--crf=26', '--log=error'], { stdio: 'inherit' });
  console.log(`done ${name}`);
}
