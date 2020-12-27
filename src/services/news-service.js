import axios from 'axios';

// API from https://newsapi.org
const apiUrl = "https://newsapi.org";
const apiKey = process.env.REACT_APP_NEWS_API_KEY;

export const getTopHeadlines = (country) => {
    return axios.get(`${apiUrl}/v2/top-headlines?country=${country}&apiKey=${apiKey}`);
}