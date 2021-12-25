import axios from "axios";

// API from https://gnews.io
const apiUrl = "https://gnews.io";
const apiKey = process.env.NEWS_API_KEY;

export const getTopHeadlines = (country: string) => {
  return axios.get(
    `${apiUrl}/api/v4/top-headlines?country=${country}&lang=en&token=${apiKey}`
  );
};
