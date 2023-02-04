import { ReactNode } from "react";
import { SWRConfig } from "swr";

type Props = {
  children?: ReactNode;
};

const OkaProvider = ({ children }: Props) => {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default OkaProvider;
