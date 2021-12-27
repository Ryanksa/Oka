import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

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
          <FirebaseHandler />
          <Sidebar />
          <Component {...pageProps} />
        </WorkmapContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
