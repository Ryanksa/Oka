import "../src/styles/globals.css";
import type { AppProps } from "next/app";
import OkaProvider from "../src/components/OkaProvider";
import FirebaseHandler from "../src/components/FirebaseHandler";
import Sidebar from "../src/components/Sidebar";
import Assistant from "../src/components/Assistant";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  return (
    <OkaProvider>
      <FirebaseHandler />
      <Sidebar />
      <Assistant />
      <Component {...pageProps} />
    </OkaProvider>
  );
};

export default App;
