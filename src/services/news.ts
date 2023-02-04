import useSWR from "swr";
import { env, Environments } from "../utils/environment";

// API from https://gnews.io
const apiUrl = "https://gnews.io";
const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export const getTopHeadlines = (country: string) => {
  return fetch(
    `${apiUrl}/api/v4/top-headlines?country=${country}&lang=en&token=${apiKey}`
  )
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("TopHeadlines API failed: " + response.status);
    })
    .catch((error) => {
      if (env === Environments.dev) console.error(error);
      return {};
    });
};

export const useTopHeadlines = (country: string) => {
  const { data, error } = useSWR(
    `${apiUrl}/api/v4/top-headlines?country=${country}&lang=en&token=${apiKey}`
  );
  return {
    news: data,
    isLoading: !error && !data,
    isError: error,
  };
};
