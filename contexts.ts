import React from "react";
import {
  UserContextInterface,
  WorkmapContextInterface,
  AssistantContextInterface,
} from "./models/contexts";

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

export const AssistantContext = React.createContext<AssistantContextInterface>({
  name: "",
  voiceCommand: true,
  avatar: "",
  avatarUrl: "",
  setName: (name) => {},
  setVoiceCommand: (on) => {},
  setAvatar: (avatar) => {},
  setAvatarUrl: (url) => {},
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
