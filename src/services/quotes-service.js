import axios from 'axios';

// API from https://github.com/lukePeavey/quotable
const apiUrl = "https://api.quotable.io";

export const getRandomQuote = () => {
    return axios.get(`${apiUrl}/random`);
}