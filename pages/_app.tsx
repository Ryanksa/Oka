import "../src/styles/globals.css";
import type { AppProps } from "next/app";

import OkaHead from "../src/components/OkaHead";
import OkaProvider from "../src/components/OkaProvider";
import FirebaseHandler from "../src/components/FirebaseHandler";
import Sidebar from "../src/components/Sidebar";
import Assistant from "../src/components/Assistant";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <OkaHead />
      <OkaProvider>
        <FirebaseHandler />
        <Sidebar />
        <Assistant />
        <Component {...pageProps} />
      </OkaProvider>
    </>
  );
}

export default App;
