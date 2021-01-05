import axios from 'axios';

// API from https://openweathermap.org
const apiUrl = "https://api.openweathermap.org";
const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

export const getWeatherOneCall = (lat, lon) => {
    return axios.get(`${apiUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=${apiKey}`);
}