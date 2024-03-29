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
  ref: HTMLElement | null;
};

export type Buff = {
  top: number;
  left: number;
  type: number;
  ref: HTMLElement | null;
};
