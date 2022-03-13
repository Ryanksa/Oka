import useSWR from "swr";

// API from https://gnews.io
const apiUrl = "https://gnews.io";
const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export const getTopHeadlines = (country: string) => {
  return fetch(
    `${apiUrl}/api/v4/top-headlines?country=${country}&lang=en&token=${apiKey}`
  ).then((response) => response.json());
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
