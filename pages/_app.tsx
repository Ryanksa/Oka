import "../styles/globals.css";
import type { AppProps } from "next/app";

import {
  UserContext,
  WorkmapContext,
  notifyUserContextListeners,
  notifyWorkampContextListeners,
} from "../contexts";
import {
  UserContextInterface,
  WorkmapContextInterface,
} from "../models/contexts";

import FirebaseHandler from "../components/FirebaseHandler";
import Sidebar from "../components/Sidebar";

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContext.Provider value={userContextValue}>
      <WorkmapContext.Provider value={workmapContextValue}>
        <FirebaseHandler />
        <Sidebar />
        <Component {...pageProps} />
      </WorkmapContext.Provider>
    </UserContext.Provider>
  );
}

export default MyApp;
