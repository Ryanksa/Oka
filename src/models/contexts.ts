import { User } from "firebase/auth";
import { AssistantWithUrl } from "./assistant";
import { WorkmapItem, WorkmapPath } from "./workmap";
import { TakeABreak } from "./takeABreak";

export interface UserContextInterface {
  user: User | null;
  setUser: (user: User | null) => void;
}

export interface WorkmapContextInterface {
  items: WorkmapItem[];
  paths: WorkmapPath[];
  setItems: (items: WorkmapItem[]) => void;
  setPaths: (paths: WorkmapPath[]) => void;
}

export interface AssistantContextInterface {
  assistant: AssistantWithUrl;
  setAssistant: (assistant: AssistantWithUrl) => void;
}

export interface TakeABreakContextInterface {
  takeABreak: TakeABreak;
  setTakeABreak: (takeABreak: TakeABreak) => void;
}
