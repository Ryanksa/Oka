export type KeyFunction = (keyDown: boolean) => void;

export interface Directions {
  ArrowUp: KeyFunction;
  ArrowDown: KeyFunction;
  ArrowLeft: KeyFunction;
  ArrowRight: KeyFunction;
}

export interface Bullet {
  top: number;
  left: number;
  topVelocity: number;
  leftVelocity: number;
}

export interface Buff {
  top: number;
  left: number;
  type: number;
}
