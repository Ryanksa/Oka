export interface Location {
  city: string;
  region: string;
  country: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  weather: string;
  icon: string;
  code: string;
  class: string;
}

export interface HourlyWeather {
  time: number;
  temp: number;
  icon: string;
}

export interface DailyWeather {
  time: number;
  minTemp: number;
  maxTemp: number;
  icon: string;
}
