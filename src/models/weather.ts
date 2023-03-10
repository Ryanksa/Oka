export type Location = {
  city: string;
  region: string;
  country: string;
};

export type CurrentWeather = {
  temperature: number;
  feelsLike: number;
  weather: string;
  icon: string;
  code: string;
  class: string;
};

export type HourlyWeather = {
  time: number;
  temp: number;
  icon: string;
};

export type DailyWeather = {
  time: number;
  minTemp: number;
  maxTemp: number;
  icon: string;
};
