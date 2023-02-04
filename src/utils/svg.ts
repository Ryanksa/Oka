import { getRandomArbitrary } from "./general";

const DISPLACEMENT_CONSTANT = 0.5;

export type Point = {
  x: number;
  y: number;
};

export const midpointDisplace = (
  start: Point,
  end: Point,
  depth: number
): Point[] => {
  const mid = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };
  const dRange = DISPLACEMENT_CONSTANT + depth;
  mid.y += getRandomArbitrary(-dRange, dRange);
  if (depth <= 0) return [mid];
  return [
    start,
    ...midpointDisplace(start, mid, depth - 1),
    mid,
    ...midpointDisplace(mid, end, depth - 1),
    end,
  ];
};
