import { User } from "firebase/auth";
import { WorkmapItem, WorkmapPath } from "./models/workmap";
import { AssistantWithUrl } from "./models/assistant";
import { TakeABreak, BreakOption, HotSpringPalette } from "./models/takeABreak";
import { signal } from "@preact/signals-react";

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

export default {
  user: signal<User | null>(DEFAULT_USER),
  workmapItems: signal<WorkmapItem[]>(DEFAULT_WORKMAP_ITEMS),
  workmapPaths: signal<WorkmapPath[]>(DEFAULT_WORKMAP_PATHS),
  assistant: signal<AssistantWithUrl>(DEFAULT_ASSISTANT),
  takeABreak: signal<TakeABreak>(DEFAULT_TAKEABREAK),
};
