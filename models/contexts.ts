import { User } from "firebase/auth";
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
  name: string;
  voiceCommand: boolean;
  avatar: string;
  avatarUrl: string;
  setName: (name: string) => void;
  setVoiceCommand: (on: boolean) => void;
  setAvatar: (avatar: string) => void;
  setAvatarUrl: (url: string) => void;
}
