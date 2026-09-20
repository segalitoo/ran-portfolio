import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { ART, DURATION } from './pieces';

/* Four switches in the component panel, measured off the artwork: each
   is a 25 by 12 pill at x 115, on a flat #2C2C2C ground, blue #008FF0
   with a white knob to the right.
 
   They are covered over in the panel's own colour and redrawn, which
   is cheap here because the ground behind them is a single flat value,
   so nothing has to be reconstructed.
 
   Each one turns off and back on in turn, as though the panel were
   being configured. All four are on at frame 0 and on again by the end
   of the cycle, so the loop closes on its own state. */
const PANEL = '#2C2C2C';
const ON = '#008FF0';
const OFF = '#55585C';

const PILL = { x: 115, w: 25, h: 12, r: 6 };
const ROWS = [270, 293, 316, 448];

/* Off at these frames, on again 40 later: a stagger, not a chorus. */
const OFF_AT = [14, 30, 46, 62];
const BACK = 42;

const Toggle: React.FC<{ y: number; offAt: number }> = ({ y, offAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* 1 while on, 0 while off, springing between the two so the knob
     carries a little weight rather than snapping. */
  const down = spring({ frame: frame - offAt, fps, durationInFrames: 12,
    config: { damping: 18, mass: 0.5 } });
  const up = spring({ frame: frame - (offAt + BACK), fps, durationInFrames: 12,
    config: { damping: 18, mass: 0.5 } });
  const on = 1 - down + up;

  const knob = PILL.h - 2;
  const travel = PILL.w - knob - 2;
  const left = PILL.x + 1 + travel * on;
  const track = on > 0.5 ? ON : OFF;
  const mix = interpolate(on, [0.3, 0.7], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* the original switch, painted out in the panel's own colour */}
      <div style={{
        position: 'absolute', left: PILL.x - 2, top: y - 2,
        width: PILL.w + 4, height: PILL.h + 4, background: PANEL,
      }} />
      <div style={{
        position: 'absolute', left: PILL.x, top: y,
        width: PILL.w, height: PILL.h, borderRadius: PILL.r,
        background: OFF,
      }} />
      <div style={{
        position: 'absolute', left: PILL.x, top: y,
        width: PILL.w, height: PILL.h, borderRadius: PILL.r,
        background: ON, opacity: mix,
      }} />
      <div style={{
        position: 'absolute', left, top: y + 1,
        width: knob, height: knob, borderRadius: knob / 2,
        background: '#FFFFFF',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.45)',
      }} />
    </>
  );
};

export const Email: React.FC = () => (
  <AbsoluteFill>
    <Img
      src={staticFile('payoneer-art/email.png')}
      style={{ width: ART.w, height: ART.h }}
    />
    {ROWS.map((y, i) => (
      <Toggle key={y} y={y} offAt={OFF_AT[i]} />
    ))}
  </AbsoluteFill>
);
