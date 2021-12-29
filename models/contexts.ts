import { User } from "firebase/auth";
import { AssistantWithUrl } from "./assistant";
import { WorkmapItem, WorkmapPath } from "./workmap";

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
