import "../styles/globals.css";
import type { AppProps } from "next/app";

import OkaHead from "../components/OkaHead";
import OkaProvider from "../components/OkaProvider";
import FirebaseHandler from "../components/FirebaseHandler";
import Sidebar from "../components/Sidebar";
import Assistant from "../components/Assistant";

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
