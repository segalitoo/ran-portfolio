/* The five Payoneer projects are all the same argument: a system, so
   that other people can ship without a designer in the loop. The
   motion says it the only way a header can, by keeping the frame and
   changing what is in it. One system, four things that came out of it.
   The hero used to show one. */

export const FPS = 24;
export const HOLD = 38;            // 1.6s on each artefact, long enough to read
export const CROSS = 13;           // 0.55s to pass from one to the next
export const BEAT = HOLD + CROSS;
/* The hero column is 552 CSS px, so 1104 device pixels on a retina
   screen. Rendering the 1440-wide sources at 1120 covers that with a
   little to spare and takes roughly 40% of the pixels out of every
   frame, which is most of the file size. */
export const SIZE = { w: 1120, h: 592 };

export type Set = { id: string; stem: string; label: string };

export const SETS: Set[] = [
  {
    id: 'PayoneerWebsite',
    stem: 'website',
    label: 'The Payoneer site: marketing pages, a market variant, mobile, and the brand system behind them',
  },
  {
    id: 'PayoneerEmail',
    stem: 'email_template',
    label: 'The email system: a built template, assembled campaigns, and the approved components underneath',
  },
  {
    id: 'PayoneerPortal',
    stem: 'brand_portal',
    label: 'The brand portal: guidance pages, the icon library, the image library, and the template collections',
  },
  {
    id: 'PayoneerImages',
    stem: 'photoshoot',
    label: 'The image library: commissioned photography, the casting notes behind it, and the shoots themselves',
  },
  {
    id: 'PayoneerIcons',
    stem: 'icon_packages',
    label: 'The icon system: the drawn sets, the named library, the sheets, and the four tiers side by side',
  },
];

export const frames = (stem: string) =>
  [1, 2, 3, 4].map((n) => `payoneer/${stem}_${n}.webp`);

export const DURATION = BEAT * 4;
