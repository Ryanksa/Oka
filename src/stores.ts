import {
  UserStore,
  WorkmapItemsStore,
  WorkmapPathsStore,
  AssistantStore,
  TakeABreakStore,
} from "./models/stores";
import { User } from "firebase/auth";
import { WorkmapItem, WorkmapPath } from "./models/workmap";
import { AssistantWithUrl } from "./models/assistant";
import { TakeABreak, BreakOption, HotSpringPalette } from "./models/takeABreak";

// User Store
const DEFAULT_USER: User | null = null;
const userStoreListeners = new Set<() => void>();

export const userStore: UserStore = {
  user: DEFAULT_USER,
  setUser: (user) => {
    userStore.user = user;
    userStoreListeners.forEach((listener) => listener());
  },
  subscribe: (notify: () => void) => {
    userStoreListeners.add(notify);
    return () => userStoreListeners.delete(notify);
  },
  getSnapshot: () => {
    return userStore.user;
  },
  getServerSnapshot: () => {
    return DEFAULT_USER;
  },
};

// Workmap Items Store
const DEFAULT_WORKMAP_ITEMS: WorkmapItem[] = [];
const workmapItemsStoreListeners = new Set<() => void>();

export const workmapItemsStore: WorkmapItemsStore = {
  items: DEFAULT_WORKMAP_ITEMS,
  setItems: (items) => {
    workmapItemsStore.items = items;
    workmapItemsStoreListeners.forEach((listener) => listener());
  },
  subscribe: (notify: () => void) => {
    workmapItemsStoreListeners.add(notify);
    return () => workmapItemsStoreListeners.delete(notify);
  },
  getSnapshot: () => {
    return workmapItemsStore.items;
  },
  getServerSnapshot: () => {
    return DEFAULT_WORKMAP_ITEMS;
  },
};

// Workmap Paths Store
const DEFAULT_WORKMAP_PATHS: WorkmapPath[] = [];
const workmapPathsStoreListeners = new Set<() => void>();

export const workmapPathsStore: WorkmapPathsStore = {
  paths: DEFAULT_WORKMAP_PATHS,
  setPaths: (paths) => {
    workmapPathsStore.paths = paths;
    workmapPathsStoreListeners.forEach((listener) => listener());
  },
  subscribe: (notify: () => void) => {
    workmapPathsStoreListeners.add(notify);
    return () => workmapPathsStoreListeners.delete(notify);
  },
  getSnapshot: () => {
    return workmapPathsStore.paths;
  },
  getServerSnapshot: () => {
    return DEFAULT_WORKMAP_PATHS;
  },
};

// Assistant Store
const assistantStoreListeners = new Set<() => void>();

export const DEFAULT_ASSISTANT: AssistantWithUrl = {
  name: "Assistant",
  voiceCommand: false,
  avatar: "",
  avatarUrl: "",
};

export const assistantStore: AssistantStore = {
  assistant: DEFAULT_ASSISTANT,
  setAssistant: (assistant) => {
    assistantStore.assistant = assistant;
    assistantStoreListeners.forEach((listener) => listener());
  },
  subscribe: (notify: () => void) => {
    assistantStoreListeners.add(notify);
    return () => assistantStoreListeners.delete(notify);
  },
  getSnapshot: () => {
    return assistantStore.assistant;
  },
  getServerSnapshot: () => {
    return DEFAULT_ASSISTANT;
  },
};

// TakeABreak Store
const takeABreakStoreListeners = new Set<() => void>();

export const DEFAULT_TAKEABREAK: TakeABreak = {
  breakOption: BreakOption.hotspring,
  hotSpringPalette: HotSpringPalette.warm,
  bulletingTopScore: 0,
};

export const takeABreakStore: TakeABreakStore = {
  takeABreak: DEFAULT_TAKEABREAK,
  setTakeABreak: (takeABreak) => {
    takeABreakStore.takeABreak = takeABreak;
    takeABreakStoreListeners.forEach((listener) => listener());
  },
  subscribe: (notify: () => void) => {
    takeABreakStoreListeners.add(notify);
    return () => takeABreakStoreListeners.delete(notify);
  },
  getSnapshot: () => {
    return takeABreakStore.takeABreak;
  },
  getServerSnapshot: () => {
    return DEFAULT_TAKEABREAK;
  },
};
