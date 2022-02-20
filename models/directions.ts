export type KeyFunction = (keyDown: boolean) => void;

export interface Directions {
  ArrowUp: KeyFunction;
  ArrowDown: KeyFunction;
  ArrowLeft: KeyFunction;
  ArrowRight: KeyFunction;
}
