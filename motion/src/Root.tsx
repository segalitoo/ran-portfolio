import { Composition } from 'remotion';
import { MintBoard } from './MintBoard/MintBoard';
import { BOARD, DURATION, FPS } from './MintBoard/board';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MintBoard"
    component={MintBoard}
    durationInFrames={DURATION}
    fps={FPS}
    width={BOARD.w}
    height={BOARD.h}
  />
);
