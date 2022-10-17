import { User } from "firebase/auth";
import { AssistantWithUrl } from "./assistant";
import { WorkmapItem, WorkmapPath } from "./workmap";
import { TakeABreak } from "./takeABreak";

export interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  subscribe: (notify: () => void) => () => void;
  getSnapshot: () => User | null;
  getServerSnapshot: () => User | null;
}

export interface WorkmapItemsStore {
  items: WorkmapItem[];
  setItems: (items: WorkmapItem[]) => void;
  subscribe: (notify: () => void) => () => void;
  getSnapshot: () => WorkmapItem[];
  getServerSnapshot: () => WorkmapItem[];
}

export interface WorkmapPathsStore {
  paths: WorkmapPath[];
  setPaths: (paths: WorkmapPath[]) => void;
  subscribe: (notify: () => void) => () => void;
  getSnapshot: () => WorkmapPath[];
  getServerSnapshot: () => WorkmapPath[];
}

export interface AssistantStore {
  assistant: AssistantWithUrl;
  setAssistant: (assistant: AssistantWithUrl) => void;
  subscribe: (notify: () => void) => () => void;
  getSnapshot: () => AssistantWithUrl;
  getServerSnapshot: () => AssistantWithUrl;
}

export interface TakeABreakStore {
  takeABreak: TakeABreak;
  setTakeABreak: (takeABreak: TakeABreak) => void;
  subscribe: (notify: () => void) => () => void;
  getSnapshot: () => TakeABreak;
  getServerSnapshot: () => TakeABreak;
}
