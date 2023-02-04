import Store from "./models/stores";
import { User } from "firebase/auth";
import { WorkmapItem, WorkmapPath } from "./models/workmap";
import { AssistantWithUrl } from "./models/assistant";
import { TakeABreak, BreakOption, HotSpringPalette } from "./models/takeABreak";

export const DEFAULT_USER: User | null = null;
export const DEFAULT_WORKMAP_ITEMS: WorkmapItem[] = [];
export const DEFAULT_WORKMAP_PATHS: WorkmapPath[] = [];
export const DEFAULT_ASSISTANT: AssistantWithUrl = {
  name: "Assistant",
  voiceCommand: false,
  avatar: "",
  avatarUrl: "",
};
export const DEFAULT_TAKEABREAK: TakeABreak = {
  breakOption: BreakOption.hotspring,
  hotSpringPalette: HotSpringPalette.warm,
  bulletingTopScore: 0,
};

// User Store
export const userStore: Store<User | null> = {
  value: DEFAULT_USER,
  listeners: new Set(),
  setValue: (user) => {
    userStore.value = user;
    userStore.listeners.forEach((listener) => listener());
  },
  subscribe: (notify: () => void) => {
    userStore.listeners.add(notify);
    return () => userStore.listeners.delete(notify);
  },
  getSnapshot: () => {
    return userStore.value;
  },
  getServerSnapshot: () => {
    return DEFAULT_USER;
  },
};

// Workmap Items Store
export const workmapItemsStore: Store<WorkmapItem[]> = {
  value: DEFAULT_WORKMAP_ITEMS,
  listeners: new Set(),
  setValue: (items) => {
    workmapItemsStore.value = items;
    workmapItemsStore.listeners.forEach((listener) => listener());
  },
  subscribe: (notify: () => void) => {
    workmapItemsStore.listeners.add(notify);
    return () => workmapItemsStore.listeners.delete(notify);
  },
  getSnapshot: () => {
    return workmapItemsStore.value;
  },
  getServerSnapshot: () => {
    return DEFAULT_WORKMAP_ITEMS;
  },
};

// Workmap Paths Store
export const workmapPathsStore: Store<WorkmapPath[]> = {
  value: DEFAULT_WORKMAP_PATHS,
  listeners: new Set(),
  setValue: (paths) => {
    workmapPathsStore.value = paths;
    workmapPathsStore.listeners.forEach((listener) => listener());
  },
  subscribe: (notify: () => void) => {
    workmapPathsStore.listeners.add(notify);
    return () => workmapPathsStore.listeners.delete(notify);
  },
  getSnapshot: () => {
    return workmapPathsStore.value;
  },
  getServerSnapshot: () => {
    return DEFAULT_WORKMAP_PATHS;
  },
};

// Assistant Store
export const assistantStore: Store<AssistantWithUrl> = {
  value: DEFAULT_ASSISTANT,
  listeners: new Set(),
  setValue: (assistant) => {
    assistantStore.value = assistant;
    assistantStore.listeners.forEach((listener) => listener());
  },
  subscribe: (notify: () => void) => {
    assistantStore.listeners.add(notify);
    return () => assistantStore.listeners.delete(notify);
  },
  getSnapshot: () => {
    return assistantStore.value;
  },
  getServerSnapshot: () => {
    return DEFAULT_ASSISTANT;
  },
};

// TakeABreak Store
export const takeABreakStore: Store<TakeABreak> = {
  value: DEFAULT_TAKEABREAK,
  listeners: new Set(),
  setValue: (takeABreak) => {
    takeABreakStore.value = takeABreak;
    takeABreakStore.listeners.forEach((listener) => listener());
  },
  subscribe: (notify: () => void) => {
    takeABreakStore.listeners.add(notify);
    return () => takeABreakStore.listeners.delete(notify);
  },
  getSnapshot: () => {
    return takeABreakStore.value;
  },
  getServerSnapshot: () => {
    return DEFAULT_TAKEABREAK;
  },
};
