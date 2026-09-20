import { Composition } from 'remotion';
import { MintBoard } from './MintBoard/MintBoard';
import { BOARD, DURATION, FPS } from './MintBoard/board';
import { Email } from './Art/Email';
import { Photos } from './Art/Photos';
import { Portal } from './Art/Portal';
import { Website } from './Art/Website';
import {
  DURATION as A_DURATION,
  FPS as A_FPS,
  PIECES,
  SIZE as A_SIZE,
} from './Art/pieces';
import { Frames } from './Payoneer/Frames';
import {
  DURATION as P_DURATION,
  FPS as P_FPS,
  SETS,
  SIZE,
} from './Payoneer/sets';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MintBoard"
      component={MintBoard}
      durationInFrames={DURATION}
      fps={FPS}
      width={BOARD.w}
      height={BOARD.h}
    />
    {SETS.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={Frames}
        durationInFrames={P_DURATION}
        fps={P_FPS}
        width={SIZE.w}
        height={SIZE.h}
        defaultProps={{ stem: s.stem, label: s.label }}
      />
    ))}
    {PIECES.map((p) => (
      <Composition
        key={p.id}
        id={p.id}
        component={
          p.file === 'website'
            ? Website
            : p.file === 'email'
              ? Email
              : p.file === 'brand_portal'
                ? Portal
                : Photos
        }
        durationInFrames={A_DURATION}
        fps={A_FPS}
        width={A_SIZE.w}
        height={A_SIZE.h}
        defaultProps={{ file: p.file, label: p.label }}
      />
    ))}
  </>
);
