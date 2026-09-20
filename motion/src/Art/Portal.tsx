import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { ART, DURATION } from './pieces';

/* Two things happen on this one, in different halves of the picture so
   they do not compete: the swatch grid cycles its palette top right,
   and bottom left a pointer arrives and presses the Brand Guidelines
   button. A brand portal cycling its own palette while someone opens
   the guidelines is the thing the page is about. */

/* ── The swatches ──────────────────────────────────────────
   Measured off the artwork: each is a solid rectangle of one value,
   98% or more of its own box, so covering and redrawing one is exact
   rather than approximate. Four steps returns every block to the
   colour it started on, which is what closes that half of the loop.

   Only the four colour blocks move. The charcoal and white beside them
   are the brand's monochrome core and stay put. */
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

/* ── The button ────────────────────────────────────────────
   Traced off the artwork: a 156x40 pill at (51, 464), radius 20, drawn
   in a 1px #929292 stroke. Every pixel within 6px of it is pure white,
   which is what makes the next part safe.

   The button is not redrawn. It is covered in the panel's own white
   and then painted back as a clipped copy of the artwork itself, so
   pressing it scales the real label and the real stroke rather than a
   reconstruction of them. Nothing here is a guess about the typeface. */
const BTN = { x: 51, y: 464, w: 156, h: 40 };
const TIP = { x: BTN.x + 84, y: BTN.y + 26 };   /* Where the arrow lands: below
   the label's baseline rather than through the middle of it, so the
   word stays readable and the arrow's body overhangs the pill the way
   a real pointer resting on a wide button does. */
const FROM = { x: 690, y: 556 };                // off the right edge

const IN = [6, 44];        // pointer travels in
const HOVER_ON = 41;
const PRESS = 54;          // button goes down
const RELEASE = 60;
const HOVER_OFF = 92;
const OUT = [92, 130];     // pointer leaves

const ez = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const Portal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const art = staticFile('payoneer-art/brand_portal.png');

  const step = Math.floor(frame / PER);
  const into = frame - step * PER;
  const mix = interpolate(into, [PER - FADE, PER], [0, 1], {
    ...ez,
    easing: Easing.inOut(Easing.ease),
  });

  /* Movement across the screen, so ease-in-out both ways: it leans into
     the travel and settles rather than arriving at full speed. */
  const travel = (a: number, b: number) =>
    interpolate(frame, [a, b], [0, 1], { ...ez, easing: Easing.inOut(Easing.ease) });
  const arrive = travel(IN[0], IN[1]);
  const leave = travel(OUT[0], OUT[1]);
  const at = arrive - leave;                    // 0 off-screen, 1 on the button
  const px = FROM.x + (TIP.x - FROM.x) * at;
  const py = FROM.y + (TIP.y - FROM.y) * at;

  /* Entering and leaving a state, so ease-out: the change is visible
     immediately, which is the half the eye is watching. */
  const hover =
    interpolate(frame, [HOVER_ON, HOVER_ON + 5], [0, 1], { ...ez, easing: Easing.out(Easing.ease) }) -
    interpolate(frame, [HOVER_OFF, HOVER_OFF + 5], [0, 1], { ...ez, easing: Easing.out(Easing.ease) });

  /* Down fast and flat, back up on a spring: a press is deliberate, the
     release is the interface answering. Symmetric timing here reads
     mechanical. */
  const down = interpolate(frame, [PRESS, PRESS + 4], [0, 1], { ...ez, easing: Easing.out(Easing.ease) });
  const up = spring({ frame: frame - RELEASE, fps, config: { damping: 13, mass: 0.5, stiffness: 190 } });
  const held = Math.max(0, down - up);
  const scale = 1 - 0.03 * held;

  /* The ripple starts at the contact point rather than from nothing,
     because that is where a click physically happens. */
  const ring = interpolate(frame, [PRESS, PRESS + 20], [0, 1], { ...ez, easing: Easing.out(Easing.ease) });
  const ringOn = frame >= PRESS && frame <= PRESS + 20;

  return (
    <AbsoluteFill>
      <Img src={art} style={{ width: ART.w, height: ART.h }} />

      {BLOCKS.map((b, i) => {
        const seat = ORDER.indexOf(i);
        const now = PALETTE[(seat + step) % STEPS];
        const next = PALETTE[(seat + step + 1) % STEPS];
        return (
          <div key={i} style={{ position: 'absolute', left: b.x, top: b.y }}>
            <div style={{ position: 'absolute', width: b.w, height: b.h, borderRadius: 4, background: now }} />
            <div style={{ position: 'absolute', width: b.w, height: b.h, borderRadius: 4, background: next, opacity: mix }} />
          </div>
        );
      })}

      {/* The panel's own white, over the original button. */}
      <div style={{
        position: 'absolute', left: BTN.x - 3, top: BTN.y - 3,
        width: BTN.w + 6, height: BTN.h + 6, background: '#FFFFFF',
      }} />

      {/* The click ring, under the button so it reads as coming from it. */}
      {ringOn && (
        <div style={{
          position: 'absolute',
          left: TIP.x - 8 - ring * 46, top: TIP.y - 8 - ring * 46,
          width: 16 + ring * 92, height: 16 + ring * 92,
          borderRadius: '50%', border: '2px solid #1A1A1A',
          opacity: 0.22 * (1 - ring),
        }} />
      )}

      {/* The button itself, cut from the artwork and free to move. */}
      <div style={{
        position: 'absolute', left: BTN.x, top: BTN.y,
        width: BTN.w, height: BTN.h,
        borderRadius: BTN.h / 2, overflow: 'hidden',
        transform: `scale(${scale})`, transformOrigin: 'center',
      }}>
        <Img src={art} style={{
          position: 'absolute', left: -BTN.x, top: -BTN.y,
          width: ART.w, height: ART.h,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: '#1A1A1A', opacity: hover * 0.07 }} />
      </div>

      {/* The pointer. Tip at the origin of its own box, so the point
          lands where it is placed rather than the box's corner. */}
      <div style={{
        position: 'absolute', left: px, top: py,
        transform: `scale(${1 - 0.12 * held})`, transformOrigin: '2px 2px',
      }}>
        <svg width={16} height={25} viewBox="0 0 13 20" style={{ display: 'block', overflow: 'visible' }}>
          <path
            d="M0.6 0.6 L0.6 16.1 L4.5 12.5 L7.1 18.4 L9.6 17.3 L7.1 11.6 L12.0 11.4 Z"
            fill="#1A1A1A" stroke="#FFFFFF" strokeWidth={1.3} strokeLinejoin="round"
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
