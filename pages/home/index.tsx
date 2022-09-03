import React from "react";
import styles from "../../src/styles/Home.module.scss";
import OkaHead from "../../src/components/OkaHead";
import TopNews from "../../src/components/TopNews";
import Weather from "../../src/components/Weather";
import Upcoming from "../../src/components/Upcoming";
import {
  useIpInfo,
  DEFAULT_LOCATION,
  DEFAULT_COUNTRY,
} from "../../src/utils/ip-service";
import { useTopHeadlines } from "../../src/utils/news-service";
import { useWeatherOneCall } from "../../src/utils/weather-service";
import { News } from "../../src/models/news";
import {
  Location,
  CurrentWeather,
  HourlyWeather,
  DailyWeather,
} from "../../src/models/weather";

const Home = () => {
  let location: Location | null = null;
  let newsList: News[] = [];
  let current: CurrentWeather | null = null;
  let hourly: HourlyWeather[] = [];
  let daily: DailyWeather[] = [];

  const { ipInfo, isLoading, isError } = useIpInfo();
  let loc = DEFAULT_LOCATION;
  let country = DEFAULT_COUNTRY;
  if (!isLoading && !isError) {
    location = {
      city: ipInfo.city,
      region: ipInfo.region,
      country: ipInfo.country,
    };
    loc = ipInfo.loc.split(",");
    country = ipInfo.country;
  }

  const topHeadlines = useTopHeadlines(country);
  if (!topHeadlines.isLoading && !topHeadlines.isError) {
    const news = topHeadlines.news;
    if (news.articles) {
      for (let i = 0; i < news.articles.length; i++) {
        const article = news.articles[i];
        newsList.push({
          title: article.title,
          description: article.description,
          articleUrl: article.url.startsWith("https") ? article.url : "#",
          imageUrl: article.image.startsWith("https") ? article.image : "#",
        });
      }
    }
  }

  const weatherOneCall = useWeatherOneCall(loc[0], loc[1]);
  if (!weatherOneCall.isLoading && !weatherOneCall.isError) {
    const weather = weatherOneCall.weather;
    if (weather.current && weather.hourly && weather.daily) {
      const offset = weather.timezone_offset;

      // data for current weather
      const curr = weather.current;
      const iconCode = curr.weather[0].icon;
      const iconUrl = "https://openweathermap.org/img/wn/";
      let weatherClass;
      if (iconCode.startsWith("01")) {
        weatherClass = "weatherClearBg";
      } else if (iconCode.match("(02|03|04).*")) {
        weatherClass = "weatherCloudBg";
      } else if (iconCode.match("(09|10|11).*")) {
        weatherClass = "weatherRainBg";
      } else if (iconCode.startsWith("13")) {
        weatherClass = "weatherSnowBg";
      } else {
        weatherClass = "weatherMistBg";
      }
      current = {
        temperature: Math.round(curr.temp),
        feelsLike: Math.round(curr.feels_like),
        weather: curr.weather[0].main,
        icon: iconUrl + iconCode + "@2x.png",
        code: iconCode,
        class: weatherClass,
      };

      // data for hourly weather
      for (let i = 0; i < 5; i++) {
        const nextHour = weather.hourly[i];
        const nextIconCode = nextHour.weather[0].icon;
        const time = new Date(1970, 0, 1);
        time.setSeconds(nextHour.dt + offset);
        hourly.push({
          time: time.getTime(),
          temp: Math.round(nextHour.temp),
          icon: iconUrl + nextIconCode + ".png",
        });
      }

      // data for daily weather
      for (let j = 0; j < 5; j++) {
        const nextDay = weather.daily[j];
        const nextIconCode = nextDay.weather[0].icon;
        const time = new Date(1970, 0, 1);
        time.setSeconds(nextDay.dt + offset);
        daily.push({
          time: time.getTime(),
          minTemp: Math.round(nextDay.temp.min),
          maxTemp: Math.round(nextDay.temp.max),
          icon: iconUrl + nextIconCode + ".png",
        });
      }
    }
  }

  return (
    <>
      <OkaHead title="Home" />
      <div className={styles.homeContainer}>
        <div className={styles.newsWeatherContainer}>
          {newsList.length > 0 && <TopNews newsList={newsList} />}
          {location && current && (
            <Weather
              location={location}
              current={current}
              hourly={hourly}
              daily={daily}
            />
          )}
          <Upcoming />
        </div>
      </div>
    </>
  );
};

export default Home;
