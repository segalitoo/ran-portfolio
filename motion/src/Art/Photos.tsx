import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { ART, DURATION } from './pieces';

/* The other three animate a specific part of the artwork. This one
   cannot: it is a collage of photographs with dark edges, and the gaps
   between the frames are the same value as the shadows inside them, so
   there is no tile grid to take apart. Anything that claimed to move
   one photograph would be moving a guess.
 
   So it gets light instead. A soft band travels across the collage at
   an angle, the way a light source would if you tilted the thing in
   your hands.

   It is a repeating gradient moved by exactly one period over the
   cycle, which closes the loop arithmetically rather than by a fade.
   What has to equal one period is the travel measured along the
   gradient's own axis, not along x: moving the band 900px sideways
   when the gradient runs at 115 degrees advances its phase by 949px,
   which lands 5 per cent past the start and shows as a jump. So the
   step is divided by the projection of the travel direction onto that
   axis.
 
   Masked to the artwork's own alpha so it stops at the rounded
   corners, and in soft-light at low strength so it lifts the
   photographs rather than washing them out. */
const PERIOD = 900;        // how far apart the bands are, in px
const STRENGTH = 0.5;
const ANGLE = 115;         // gradient direction, CSS convention
const DRIFT = 0.35;        // vertical travel per unit of horizontal

/* How far the band's phase advances per pixel of horizontal travel.
   A CSS gradient at angle t runs along (sin t, -cos t) in screen
   coordinates, so this is the dot product of the travel direction with
   that axis. */
const rad = (ANGLE * Math.PI) / 180;
const ADVANCE = Math.sin(rad) + DRIFT * -Math.cos(rad);
const TRAVEL = PERIOD / ADVANCE;

export const Photos: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame / DURATION) * TRAVEL;
  const art = staticFile('payoneer-art/photoshot.png');

  return (
    <AbsoluteFill>
      <Img src={art} style={{ width: ART.w, height: ART.h }} />
      <AbsoluteFill
        style={{
          mixBlendMode: 'soft-light',
          opacity: STRENGTH,
          maskImage: `url(${art})`,
          maskSize: `${ART.w}px ${ART.h}px`,
          maskRepeat: 'no-repeat',
          WebkitMaskImage: `url(${art})`,
          WebkitMaskSize: `${ART.w}px ${ART.h}px`,
          WebkitMaskRepeat: 'no-repeat',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -PERIOD,
            top: -PERIOD,
            width: ART.w + PERIOD * 2,
            height: ART.h + PERIOD * 2,
            transform: `translate(${shift}px, ${shift * DRIFT}px)`,
            background: `repeating-linear-gradient(${ANGLE}deg,
              rgba(255,255,255,0) 0px,
              rgba(255,255,255,0.55) ${PERIOD * 0.18}px,
              rgba(255,255,255,0) ${PERIOD * 0.42}px,
              rgba(255,255,255,0) ${PERIOD}px)`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
