import useSWR from "swr";
import { env, Environments } from "./environment";

// API from https://ipinfo.io
const apiUrl = "https://ipinfo.io";
const apiToken = process.env.NEXT_PUBLIC_IPINFO_TOKEN;

export const DEFAULT_LOCATION = ["38.68", "-101.07"];
export const DEFAULT_COUNTRY = "US";

export const getIpInfo = () => {
  return fetch(`${apiUrl}?token=${apiToken}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("IPInfo API failed: " + response.status);
    })
    .catch((error) => {
      if (env === Environments.dev) console.error(error);
      return {};
    });
};

export const useIpInfo = () => {
  const { data, error } = useSWR(`${apiUrl}?token=${apiToken}`);
  return {
    ipInfo: data,
    isLoading: !error && !data,
    isError: error,
  };
};
