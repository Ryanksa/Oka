import useSWR from "swr";

// API from https://ipinfo.io
const apiUrl = "https://ipinfo.io";
const apiToken = process.env.NEXT_PUBLIC_IPINFO_TOKEN;

export const DEFAULT_LOCATION = ["38.68", "-101.07"];
export const DEFAULT_COUNTRY = "US";

export const getIpInfo = () => {
  return fetch(`${apiUrl}?token=${apiToken}`).then((response) =>
    response.json()
  );
};

export const useIpInfo = () => {
  const { data, error } = useSWR(`${apiUrl}?token=${apiToken}`);
  return {
    ipInfo: data,
    isLoading: !error && !data,
    isError: error,
  };
};
