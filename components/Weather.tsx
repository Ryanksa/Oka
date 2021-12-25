import React, { FC } from "react";
import styles from "../styles/Weather.module.scss";
import {
  Location,
  CurrentWeather,
  HourlyWeather,
  DailyWeather,
} from "../models/weather";
import { formatHour } from "../utils/date-helper";

const weekday = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

const Weather: FC<{
  location: Location;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}> = ({ location, current, hourly, daily }) => {
  return (
    <div>
      <div className={styles.weatherHeader}>
        <h2>Weather</h2>
        {location.city && location.region && (
          <span>
            {location.city}, {location.region}
          </span>
        )}
      </div>
      <div className={styles.weatherContainer}>
        <div
          className={`${styles.currentWeatherContainer} ${
            styles.weatherShiftingBg
          } ${styles[current.class]}`}
        >
          <div className={styles.currentWeatherIcon}>
            <img src={current.icon} alt="" />
            <span>{current.weather}</span>
          </div>
          <h4>Temperature</h4>
          <p className={styles.temperature}>{current.temperature}°C</p>
          <h4>Feels Like</h4>
          <p className={styles.temperature}>{current.feelsLike}°C</p>
        </div>

        <div className={styles.hourlyWeatherContainer}>
          <div className={styles.hourlyHeader}>
            <div className={styles.hourlyHeaderText}>Hourly</div>
          </div>
          <div
            className={`${styles.hourlyDailyWeather} ${
              styles.weatherShiftingBg
            } ${styles[current.class]}`}
          >
            {hourly.map((weather) => (
              <div key={weather.time} className={styles.weatherRow}>
                <span>{formatHour(new Date(weather.time).getHours())}</span>
                <img src={weather.icon} alt="" />
                <span className={styles.temperature}>{weather.temp}°C</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.dailyWeatherContainer}>
          <div className={styles.dailyHeader}>
            <div className={styles.dailyHeaderText}>Daily</div>
          </div>
          <div
            className={`${styles.hourlyDailyWeather} ${
              styles.weatherShiftingBg
            } ${styles[current.class]}`}
          >
            {daily.map((weather) => (
              <div key={weather.time} className={styles.weatherRow}>
                <span>{weekday[new Date(weather.time).getDay()]}</span>
                <img src={weather.icon} alt="" />
                <span className={styles.temperature}>
                  {weather.minTemp + " ~ " + weather.maxTemp + "°C"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
