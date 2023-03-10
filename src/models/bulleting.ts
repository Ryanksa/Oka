export type KeyFunction = (keyDown: boolean) => void;

export type Directions = {
  ArrowUp: KeyFunction;
  ArrowDown: KeyFunction;
  ArrowLeft: KeyFunction;
  ArrowRight: KeyFunction;
};

export type Bullet = {
  top: number;
  left: number;
  topVelocity: number;
  leftVelocity: number;
};

export type Buff = {
  top: number;
  left: number;
  type: number;
};
