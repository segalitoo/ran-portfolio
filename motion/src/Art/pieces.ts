/* Four pieces of supplied artwork, each 640x600 with alpha on its
   rounded corners and nothing else.

   Each one animates from the inside: a part of the picture moves,
   rather than the picture as a whole. Everything is driven off the
   frame's position in the loop, so five seconds closes exactly and
   there is no transition to hide. */

export const FPS = 30;
export const DURATION = 150;       // exactly 5s, and one full cycle
export const ART = { w: 640, h: 600 };
/* The motion is inside the artwork now rather than applied to it, so
   nothing moves past the edges and the frame is the artwork's own size,
   to the pixel. */
export const PAD = 0;
export const SIZE = { w: ART.w + PAD * 2, h: ART.h + PAD * 2 };

export type Piece = { id: string; file: string; label: string };

export const PIECES: Piece[] = [
  { id: 'ArtWebsite', file: 'website', label: 'The Payoneer website after the redesign' },
  { id: 'ArtEmail', file: 'email', label: 'An email built from the template system, beside the component panel that produced it' },
  { id: 'ArtPortal', file: 'brand_portal', label: 'The Payoneer brand portal' },
  { id: 'ArtPhotos', file: 'photoshot', label: 'Commissioned photography from the customer image library' },
];
