import React, { FC } from "react";
import { SWRConfig } from "swr";

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
      {children}
    </SWRConfig>
  );
};

export default OkaProvider;
