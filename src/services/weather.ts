import useSWR from "swr";
import { env, Environments } from "../utils/environment";

// API from https://openweathermap.org
const apiUrl = "https://api.openweathermap.org";
const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export const getWeatherOneCall = (lat: string, lon: string) => {
  return fetch(
    `${apiUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=${apiKey}`
  )
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("WeatherOneCall API failed: " + response.status);
    })
    .catch((error) => {
      if (env === Environments.dev) console.error(error);
      return {};
    });
};

export const useWeatherOneCall = (lat: string, lon: string) => {
  const { data, error } = useSWR(
    `${apiUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=${apiKey}`
  );
  return {
    weather: data,
    isLoading: !error && !data,
    isError: error,
  };
};
