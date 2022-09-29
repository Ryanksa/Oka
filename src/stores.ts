import {
  UserStore,
  WorkmapStore,
  AssistantStore,
  TakeABreakStore,
} from "./models/stores";
import { BreakOption, HotSpringPalette } from "./models/takeABreak";

// User Store
let userStoreListeners: (() => void)[] = [];

export const addUserStoreListener = (callback: () => void) => {
  userStoreListeners.push(callback);
};

export const removeUserStoreListener = (callback: () => void) => {
  userStoreListeners = userStoreListeners.filter(
    (listener) => listener !== callback
  );
};

export const notifyUserStoreListeners = () => {
  userStoreListeners.forEach((listener) => listener());
};

export const userStore: UserStore = {
  user: null,
  setUser: (user) => {
    userStore.user = user;
    notifyUserStoreListeners();
  },
};

// Workmap Store
let workmapStoreListeners: (() => void)[] = [];

export const addWorkmapStoreListener = (callback: () => void) => {
  workmapStoreListeners.push(callback);
};

export const removeWorkmapStoreListener = (callback: () => void) => {
  workmapStoreListeners = workmapStoreListeners.filter(
    (listener) => listener !== callback
  );
};

export const notifyWorkampStoreListeners = () => {
  workmapStoreListeners.forEach((listener) => listener());
};

export const workmapStore: WorkmapStore = {
  items: [],
  paths: [],
  setItems: (items) => {
    workmapStore.items = items;
    notifyWorkampStoreListeners();
  },
  setPaths: (paths) => {
    workmapStore.paths = paths;
    notifyWorkampStoreListeners();
  },
};

// Assistant Store
let assistantStoreListeners: (() => void)[] = [];

export const addAssistantStoreListener = (callback: () => void) => {
  assistantStoreListeners.push(callback);
};

export const removeAssistantStoreListener = (callback: () => void) => {
  assistantStoreListeners = assistantStoreListeners.filter(
    (listener) => listener !== callback
  );
};

export const notifyAssistantStoreListeners = () => {
  assistantStoreListeners.forEach((listener) => listener());
};

export const assistantStore: AssistantStore = {
  assistant: {
    name: "Assistant",
    voiceCommand: false,
    avatar: "",
    avatarUrl: "",
  },
  setAssistant: (assistant) => {
    assistantStore.assistant = assistant;
    notifyAssistantStoreListeners();
  },
};

// TakeABreak Store
let takeABreakStoreListeners: (() => void)[] = [];

export const addTakeABreakStoreListener = (callback: () => void) => {
  takeABreakStoreListeners.push(callback);
};

export const removeTakeABreakStoreListener = (callback: () => void) => {
  takeABreakStoreListeners = takeABreakStoreListeners.filter(
    (listener) => listener !== callback
  );
};

export const notifyTakeABreakStoreListeners = () => {
  takeABreakStoreListeners.forEach((listener) => listener());
};

export const takeABreakStore: TakeABreakStore = {
  takeABreak: {
    breakOption: BreakOption.hotspring,
    hotSpringPalette: HotSpringPalette.warm,
    bulletingTopScore: 0,
  },
  setTakeABreak: (takeABreak) => {
    takeABreakStore.takeABreak = takeABreak;
    notifyTakeABreakStoreListeners();
  },
};
