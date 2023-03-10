export type Store<T> = {
  value: T;
  listeners: Set<() => void>;
  setValue: (value: T) => void;
  subscribe: (notify: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
};
