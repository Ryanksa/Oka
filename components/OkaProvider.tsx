import React, { FC } from "react";
import { SWRConfig } from "swr";
import {
  UserContext,
  WorkmapContext,
  AssistantContext,
  TakeABreakContext,
  notifyUserContextListeners,
  notifyWorkampContextListeners,
  notifyAssistantContextListeners,
  notifyTakeABreakContextListeners,
} from "../contexts";
import {
  UserContextInterface,
  WorkmapContextInterface,
  AssistantContextInterface,
  TakeABreakContextInterface,
} from "../models/contexts";
import { BreakOption, HotSpringPalette } from "../models/takeABreak";

const userContextValue: UserContextInterface = {
  user: null,
  setUser: (user) => {
    userContextValue.user = user;
    notifyUserContextListeners();
  },
};

const workmapContextValue: WorkmapContextInterface = {
  items: [],
  paths: [],
  setItems: (items) => {
    workmapContextValue.items = items;
    notifyWorkampContextListeners();
  },
  setPaths: (paths) => {
    workmapContextValue.paths = paths;
    notifyWorkampContextListeners();
  },
};

const assistantContextValue: AssistantContextInterface = {
  assistant: {
    name: "Assistant",
    voiceCommand: true,
    avatar: "",
    avatarUrl: "",
  },
  setAssistant: (assistant) => {
    assistantContextValue.assistant = assistant;
    notifyAssistantContextListeners();
  },
};

const takeABreakContextValue: TakeABreakContextInterface = {
  takeABreak: {
    breakOption: BreakOption.hotspring,
    hotSpringPalette: HotSpringPalette.warm,
    bulletingTopScore: 0,
  },
  setTakeABreak: (takeABreak) => {
    (takeABreakContextValue.takeABreak = takeABreak),
      notifyTakeABreakContextListeners();
  },
};

type Props = {
  children?: React.ReactNode;
};

const OkaProvider: FC<Props> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <UserContext.Provider value={userContextValue}>
        <WorkmapContext.Provider value={workmapContextValue}>
          <AssistantContext.Provider value={assistantContextValue}>
            <TakeABreakContext.Provider value={takeABreakContextValue}>
              {children}
            </TakeABreakContext.Provider>
          </AssistantContext.Provider>
        </WorkmapContext.Provider>
      </UserContext.Provider>
    </SWRConfig>
  );
};

export default OkaProvider;
