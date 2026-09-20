import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { ART, DURATION } from './pieces';

/* The four colour blocks in the portal's swatch grid, measured off the
   artwork: each is a solid rectangle of one value, 98% or more of its
   own box, so covering and redrawing one is exact rather than
   approximate.
 
   The palette rotates through them, a quarter turn at a time. Four
   steps returns every block to the colour it started on, which is what
   closes the loop: frame 0 and the end of the cycle are the same
   picture. A brand portal cycling its own palette is the thing the
   page is about. */
const BLOCKS = [
  { x: 521, y: 131, w: 43, h: 34 },
  { x: 570, y: 130, w: 39, h: 35 },
  { x: 521, y: 170, w: 43, h: 46 },
  { x: 569, y: 170, w: 40, h: 46 },
];

/* In the order the blocks are read, so a step moves each colour to its
   neighbour rather than jumping across the grid. */
const PALETTE = ['#00257F', '#A27BFF', '#FFC6F7', '#0036FF'];
const ORDER = [0, 1, 3, 2];

const STEPS = PALETTE.length;
const PER = DURATION / STEPS;
const FADE = 14;

export const Portal: React.FC = () => {
  const frame = useCurrentFrame();

  const step = Math.floor(frame / PER);
  const into = frame - step * PER;
  /* Held for most of the step, then crossfaded into the next. */
  const mix = interpolate(into, [PER - FADE, PER], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  return (
    <AbsoluteFill>
      <Img
        src={staticFile('payoneer-art/brand_portal.png')}
        style={{ width: ART.w, height: ART.h }}
      />
      {BLOCKS.map((b, i) => {
        const seat = ORDER.indexOf(i);
        const now = PALETTE[(seat + step) % STEPS];
        const next = PALETTE[(seat + step + 1) % STEPS];
        return (
          <div key={i} style={{ position: 'absolute', left: b.x, top: b.y }}>
            <div style={{
              position: 'absolute', width: b.w, height: b.h,
              borderRadius: 4, background: now,
            }} />
            <div style={{
              position: 'absolute', width: b.w, height: b.h,
              borderRadius: 4, background: next, opacity: mix,
            }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
