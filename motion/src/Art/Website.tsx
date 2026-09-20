import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { ART, DURATION } from './pieces';

/* The arc is a real circle in the artwork: fitted to its own pixels at
   centre (320, -5), radius 252, a 32px stroke running from due east
   round to due west.
 
   It is not redrawn. A conic gradient sits on top of it, centred on
   that same point and masked to the arc's own shape, in the hue blend
   mode: the arc keeps its shading, its soft ends and its anti-aliasing,
   and only the colour travels. Rotating the gradient sends the colour
   round the curve, which reads as the ring turning.
 
   The mask is built from how coloured each pixel is, so the white
   avatar chips sitting on the arc fall out of it automatically and keep
   their own colour while the ring moves under them.
 
   The stops are the arc's own palette, sampled off the artwork every
   15 degrees, then mirrored so the wheel closes on itself. */
const CENTRE = { x: 319.6, y: -4.9 };

const RAMP = [
  '#18A2C7', '#0996EA', '#2689E5', '#4D7BE2', '#6F6FDA', '#9965D6',
  '#C05AD1', '#D253B7', '#DB5495', '#E45075', '#EB4F54', '#E65548',
];

const wheel = () => {
  const full = [...RAMP, ...[...RAMP].reverse()];
  return full
    .map((c, i) => `${c} ${((i / full.length) * 360).toFixed(1)}deg`)
    .join(', ');
};

export const Website: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = (frame / DURATION) * 360;

  return (
    <AbsoluteFill>
      <Img
        src={staticFile('payoneer-art/website.png')}
        style={{ width: ART.w, height: ART.h }}
      />
      <AbsoluteFill
        style={{
          mixBlendMode: 'hue',
          maskImage: `url(${staticFile('payoneer-art/website-arc-mask.png')})`,
          maskSize: `${ART.w}px ${ART.h}px`,
          maskRepeat: 'no-repeat',
          WebkitMaskImage: `url(${staticFile('payoneer-art/website-arc-mask.png')})`,
          WebkitMaskSize: `${ART.w}px ${ART.h}px`,
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `conic-gradient(from ${spin.toFixed(2)}deg at ${CENTRE.x}px ${CENTRE.y}px, ${wheel()})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
