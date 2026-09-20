import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { BEAT, CROSS, DURATION, frames, HOLD } from './sets';

/* Each artefact is on screen for a beat and crosses into the next over
   the last CROSS frames of it. The one leaving drifts very slightly
   larger while the one arriving settles back to rest, so the two pass
   at different depths instead of dissolving flatly into each other.
   The scale is under three per cent: enough to feel, not enough to
   read as a zoom.

   Both sides also blur while they cross. Two dense screenshots held at
   half opacity against each other read as two pictures at once and go
   muddy; a few pixels of blur bridges them, so the eye takes it as one
   thing changing rather than two things overlapping. It resolves to
   nothing by the time either is at rest.

   The fourth crosses into the first, so the loop closes on itself and
   the last frame is the first. */
const REST = 1;
const LIFT = 1.028;
const BLUR = 8;

export const Frames: React.FC<{ stem: string; label: string }> = ({
  stem,
  label,
}) => {
  const frame = useCurrentFrame();
  const shots = frames(stem);

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff' }} aria-label={label}>
      {shots.map((src, i) => {
        /* Where this frame sits relative to this artefact's own beat,
           wrapped so the first can also be the one being crossed into
           at the very end. */
        let t = frame - i * BEAT;
        if (t < -CROSS) t += DURATION;

        const inAt = -CROSS;
        const outAt = HOLD;

        const opacity = interpolate(
          t,
          [inAt, 0, outAt, outAt + CROSS],
          [0, 1, 1, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.ease),
          },
        );
        if (opacity <= 0) return null;

        /* Arriving: LIFT down to REST. Leaving: REST up to LIFT. */
        const scale = interpolate(
          t,
          [inAt, 0, outAt, outAt + CROSS],
          [LIFT, REST, REST, LIFT],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const blur = interpolate(
          t,
          [inAt, 0, outAt, outAt + CROSS],
          [BLUR, 0, 0, BLUR],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        return (
          <AbsoluteFill
            key={src}
            style={{
              opacity,
              filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
            }}
          >
            <Img
              src={staticFile(src)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${scale})`,
              }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
