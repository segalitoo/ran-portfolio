import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BOARD, cable, DURATION, MINT, PLACEMENTS, Placement } from './board';

/* How long a cable takes to draw, and how long after it arrives the
   placement takes to settle. Entering elements get a spring, which
   carries its own velocity and needs no easing curve on top. */
const DRAW = 14;
const GLOW = 26;

/* Everything fades back to the empty board at the end, so the last
   frame is the first frame and the loop has no seam. */
const RESET_AT = DURATION - 15;

const useReset = () => {
  const frame = useCurrentFrame();
  return interpolate(frame, [RESET_AT, DURATION - 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

const Cable: React.FC<{ p: Placement }> = ({ p }) => {
  const frame = useCurrentFrame();
  const reset = useReset();
  /* A dashed stroke as long as the path itself, offset out of sight and
     then pulled back in: the cable draws from the prompt outwards. */
  const drawn = interpolate(frame, [p.at, p.at + DRAW], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <path
      d={cable(p)}
      fill="none"
      stroke={MINT}
      strokeWidth={2.2}
      strokeLinecap="round"
      opacity={0.5 * reset}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - drawn}
    />
  );
};

const Node: React.FC<{ p: Placement }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reset = useReset();

  /* The node lands as its cable arrives. A spring rather than a curve,
     because an element arriving should carry a little momentum, and
     from 0.94 rather than from nothing: things do not appear out of
     no size at all. */
  const land = spring({
    frame: frame - (p.at + DRAW),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 120 },
    durationInFrames: 22,
  });
  const scale = interpolate(land, [0, 1], [0.94, 1]);
  const opacity = interpolate(land, [0, 0.55], [0, 1], {
    extrapolateRight: 'clamp',
  }) * reset;

  /* The ring blooms with the node and decays on its own, so only one
     placement is ever glowing. */
  const glow =
    interpolate(frame, [p.at + DRAW - 2, p.at + DRAW + 5], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) *
    interpolate(frame, [p.at + DRAW + 8, p.at + DRAW + GLOW], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return (
    <div
      style={{
        position: 'absolute',
        left: p.box.x,
        top: p.box.y,
        width: p.box.w,
        height: p.box.h,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -3,
          borderRadius: 14,
          opacity: glow,
          boxShadow: `0 0 0 2px ${MINT}, 0 0 26px 6px rgba(54, 179, 140, 0.5)`,
        }}
      />
      <Img
        src={staticFile(`p-${p.key}.png`)}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
};

export const MintBoard: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#1a1a1c' }}>
    <Img
      src={staticFile('base.png')}
      style={{ width: BOARD.w, height: BOARD.h, display: 'block' }}
    />
    <AbsoluteFill>
      <svg width={BOARD.w} height={BOARD.h} style={{ position: 'absolute' }}>
        {PLACEMENTS.map((p) => (
          <Cable key={p.key} p={p} />
        ))}
      </svg>
      {PLACEMENTS.map((p) => (
        <Node key={p.key} p={p} />
      ))}
    </AbsoluteFill>
  </AbsoluteFill>
);
