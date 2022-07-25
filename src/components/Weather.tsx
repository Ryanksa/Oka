import React, { FC, Fragment } from "react";
import styles from "../styles/Weather.module.scss";
import {
  Location,
  CurrentWeather,
  HourlyWeather,
  DailyWeather,
} from "../models/weather";
import { formatHour } from "../utils/date-helper";
import Image from "next/image";

const weekday = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

type Props = {
  location: Location;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
};

const Weather: FC<Props> = ({ location, current, hourly, daily }) => {
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
            <Image src={current.icon} alt="" width={80} height={80} />
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
            className={`${styles.hourlyDailyWeather} ${styles.hourly} ${
              styles.weatherShiftingBg
            } ${styles[current.class]}`}
          >
            {hourly.map((weather, idx) => (
              <Fragment key={idx}>
                <span>{formatHour(new Date(weather.time).getHours())}</span>
                <Image src={weather.icon} alt="" width={50} height={50} />
                <span className={styles.temperature}>{weather.temp}°C</span>
              </Fragment>
            ))}
          </div>
        </div>

        <div className={styles.dailyWeatherContainer}>
          <div className={styles.dailyHeader}>
            <div className={styles.dailyHeaderText}>Daily</div>
          </div>
          <div
            className={`${styles.hourlyDailyWeather} ${styles.daily} ${
              styles.weatherShiftingBg
            } ${styles[current.class]}`}
          >
            {daily.map((weather, idx) => (
              <Fragment key={idx}>
                <span>{weekday[new Date(weather.time).getDay()]}</span>
                <Image src={weather.icon} alt="" width={50} height={50} />
                <span
                  className={styles.temperature}
                >{`${weather.maxTemp}°`}</span>
                <span>{`${weather.minTemp}°`}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
