import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

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

import FirebaseHandler from "../components/FirebaseHandler";
import Sidebar from "../components/Sidebar";
import Assistant from "../components/Assistant";

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
  name: "Assistant",
  voiceCommand: true,
  avatar: "",
  avatarUrl: "",
  setName: (name) => {
    assistantContextValue.name = name;
    notifyAssistantContextListeners();
  },
  setVoiceCommand: (on) => {
    assistantContextValue.voiceCommand = on;
    notifyAssistantContextListeners();
  },
  setAvatar: (avatar) => {
    assistantContextValue.avatar = avatar;
    notifyAssistantContextListeners();
  },
  setAvatarUrl: (url) => {
    assistantContextValue.avatarUrl = url;
    notifyAssistantContextListeners();
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Oka</title>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      </Head>

      <UserContext.Provider value={userContextValue}>
        <WorkmapContext.Provider value={workmapContextValue}>
          <AssistantContext.Provider value={assistantContextValue}>
            <FirebaseHandler />
            <Sidebar />
            <Assistant />
            <Component {...pageProps} />
          </AssistantContext.Provider>
        </WorkmapContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
