import axios from 'axios';

// API from https://gnews.io
const apiUrl = "https://gnews.io";
const apiKey = process.env.REACT_APP_NEWS_API_KEY;

export const getTopHeadlines = (country) => {
    return axios.get(`${apiUrl}/api/v4/top-headlines?country=${country}&lang=en&token=${apiKey}`);
}