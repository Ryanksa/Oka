import { User } from "firebase/auth";
import { AssistantWithUrl } from "./assistant";
import { WorkmapItem, WorkmapPath } from "./workmap";
import { TakeABreak } from "./takeABreak";

export interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export interface WorkmapStore {
  items: WorkmapItem[];
  paths: WorkmapPath[];
  setItems: (items: WorkmapItem[]) => void;
  setPaths: (paths: WorkmapPath[]) => void;
}

export interface AssistantStore {
  assistant: AssistantWithUrl;
  setAssistant: (assistant: AssistantWithUrl) => void;
}

export interface TakeABreakStore {
  takeABreak: TakeABreak;
  setTakeABreak: (takeABreak: TakeABreak) => void;
}
