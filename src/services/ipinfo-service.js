import axios from 'axios';

// API from https://ipinfo.io
const apiUrl = "https://ipinfo.io";
const apiToken = process.env.REACT_APP_IPINFO_TOKEN;

export const getIpInfo = () => {
    return axios.get(`${apiUrl}?token=${apiToken}`);
}