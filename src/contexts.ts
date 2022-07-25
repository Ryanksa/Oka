import React from "react";
import {
  UserContextInterface,
  WorkmapContextInterface,
  AssistantContextInterface,
  TakeABreakContextInterface,
} from "./models/contexts";
import { BreakOption, HotSpringPalette } from "./models/takeABreak";

// User Context
export const UserContext = React.createContext<UserContextInterface>({
  user: null,
  setUser: (user) => {},
});

let userContextListeners: (() => void)[] = [];

export const addUserContextListener = (callback: () => void) => {
  userContextListeners.push(callback);
};

export const removeUserContextListener = (callback: () => void) => {
  userContextListeners = userContextListeners.filter(
    (listener) => listener !== callback
  );
};

export const notifyUserContextListeners = () => {
  userContextListeners.forEach((listener) => listener());
};

// Workmap Context
export const WorkmapContext = React.createContext<WorkmapContextInterface>({
  items: [],
  paths: [],
  setItems: (items) => {},
  setPaths: (paths) => {},
});

let workmapContextListeners: (() => void)[] = [];

export const addWorkmapContextListener = (callback: () => void) => {
  workmapContextListeners.push(callback);
};

export const removeWorkmapContextListener = (callback: () => void) => {
  workmapContextListeners = workmapContextListeners.filter(
    (listener) => listener !== callback
  );
};

export const notifyWorkampContextListeners = () => {
  workmapContextListeners.forEach((listener) => listener());
};

// Assistant Context
export const AssistantContext = React.createContext<AssistantContextInterface>({
  assistant: {
    name: "",
    voiceCommand: true,
    avatar: "",
    avatarUrl: "",
  },
  setAssistant: (assistant) => {},
});

let assistantContextListeners: (() => void)[] = [];

export const addAssistantContextListener = (callback: () => void) => {
  assistantContextListeners.push(callback);
};

export const removeAssistantContextListener = (callback: () => void) => {
  assistantContextListeners = assistantContextListeners.filter(
    (listener) => listener !== callback
  );
};

export const notifyAssistantContextListeners = () => {
  assistantContextListeners.forEach((listener) => listener());
};

// TakeABreak Context
export const TakeABreakContext =
  React.createContext<TakeABreakContextInterface>({
    takeABreak: {
      breakOption: BreakOption.hotspring,
      hotSpringPalette: HotSpringPalette.warm,
      bulletingTopScore: 0,
    },
    setTakeABreak: (takeABreak) => {},
  });

let takeABreakContextListeners: (() => void)[] = [];

export const addTakeABreakContextListener = (callback: () => void) => {
  takeABreakContextListeners.push(callback);
};

export const removeTakeABreakContextListener = (callback: () => void) => {
  takeABreakContextListeners = takeABreakContextListeners.filter(
    (listener) => listener !== callback
  );
};

export const notifyTakeABreakContextListeners = () => {
  takeABreakContextListeners.forEach((listener) => listener());
};
