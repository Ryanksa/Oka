import React, { FC } from "react";
import { SWRConfig } from "swr";
import SnackbarProvider from "react-simple-snackbar";

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
      <SnackbarProvider>
        <>{children}</>
      </SnackbarProvider>
    </SWRConfig>
  );
};

export default OkaProvider;
