/* Geometry measured off the recording by tools/mint-board-reveal.py,
   in the coordinates of the exported board picture. */

export const FPS = 30;
export const DURATION = 210;       // 7 seconds
export const BOARD = { w: 1256, h: 1218 };

/* The prompt node's output port: every cable starts at its centre. */
export const SOURCE = { x: 446, y: 380 };

export type Placement = {
  key: string;
  /* The node's box in the board picture. */
  box: { x: number; y: number; w: number; h: number };
  /* Its input handle, where the connector lands. */
  handle: { x: number; y: number };
  /* How far the curve bows out of the straight line. A node almost
     level with the prompt needs more, or its connector reads as a
     ruled line rather than as a cable. */
  bow: number;
  /* Frame the connector starts drawing. The node lands as it arrives. */
  at: number;
};

export const PLACEMENTS: Placement[] = [
  { key: 'facebook',  box: { x: 537, y:   9, w: 333, h: 254 }, handle: { x: 544, y: 136 }, bow: 150, at: 10 },
  { key: 'instagram', box: { x: 901, y:  84, w: 333, h: 401 }, handle: { x: 908, y: 285 }, bow: 240, at: 40 },
  { key: 'linkedin',  box: { x: 496, y: 481, w: 341, h: 254 }, handle: { x: 503, y: 609 }, bow: 150, at: 70 },
  { key: 'story',     box: { x: 884, y: 534, w: 341, h: 640 }, handle: { x: 891, y: 855 }, bow: 240, at: 100 },
];

/* A node-editor cable: horizontal out of the source, horizontal into
   the target, which is what gives it the S bend. */
export const cable = (p: Placement) =>
  `M ${SOURCE.x} ${SOURCE.y} C ${SOURCE.x + p.bow} ${SOURCE.y}, ` +
  `${p.handle.x - p.bow} ${p.handle.y}, ${p.handle.x} ${p.handle.y}`;

export const MINT = 'rgb(54, 179, 140)';
