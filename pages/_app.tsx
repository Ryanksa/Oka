import "../src/styles/globals.css";
import type { AppProps } from "next/app";
import { EmotionCache } from "@emotion/react";
import MuiTheme from "../src/components/MuiTheme";
import OkaProvider from "../src/components/OkaProvider";
import FirebaseHandler from "../src/components/FirebaseHandler";
import Sidebar from "../src/components/Sidebar";
import Assistant from "../src/components/Assistant";

interface MuiAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function App(props: MuiAppProps) {
  const { Component, pageProps, emotionCache } = props;
  return (
    <MuiTheme emotionCache={emotionCache}>
      <OkaProvider>
        <FirebaseHandler />
        <Sidebar />
        <Assistant />
        <Component {...pageProps} />
      </OkaProvider>
    </MuiTheme>
  );
}

export default App;
