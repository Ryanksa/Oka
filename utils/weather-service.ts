import useSWR from "swr";

// API from https://openweathermap.org
const apiUrl = "https://api.openweathermap.org";
const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export const getWeatherOneCall = (lat: string, lon: string) => {
  return fetch(
    `${apiUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=${apiKey}`
  ).then((response) => response.json());
};

export const useWeatherOneCall = (lat: string, lon: string) => {
  const { data, error } = useSWR(
    `${apiUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,alerts&appid=${apiKey}`
  );
  return {
    weather: data,
    isLoading: !error && !data,
    isError: error,
  };
};
