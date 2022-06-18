import React, { FC } from "react";
import { SWRConfig } from "swr";
import {
  UserContext,
  WorkmapContext,
  AssistantContext,
  notifyUserContextListeners,
  notifyWorkampContextListeners,
  notifyAssistantContextListeners,
} from "../contexts";
import {
  UserContextInterface,
  WorkmapContextInterface,
  AssistantContextInterface,
} from "../models/contexts";

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
            {children}
          </AssistantContext.Provider>
        </WorkmapContext.Provider>
      </UserContext.Provider>
    </SWRConfig>
  );
};

export default OkaProvider;
