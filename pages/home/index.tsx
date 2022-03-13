import React, { useState, useEffect } from "react";
import styles from "../../styles/Home.module.scss";
import TopNews from "../../components/TopNews";
import Weather from "../../components/Weather";
import Upcoming from "../../components/Upcoming";
import {
  useIpInfo,
  DEFAULT_LOCATION,
  DEFAULT_COUNTRY,
} from "../../utils/ip-service";
import { useTopHeadlines } from "../../utils/news-service";
import { useWeatherOneCall } from "../../utils/weather-service";
import { News } from "../../models/news";
import {
  Location,
  CurrentWeather,
  HourlyWeather,
  DailyWeather,
} from "../../models/weather";

const Home = () => {
  const [location, setLocation] = useState<Location>();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [current, setCurrent] = useState<CurrentWeather>();
  const [hourly, setHourly] = useState<HourlyWeather[]>([]);
  const [daily, setDaily] = useState<DailyWeather[]>([]);

  const { ipInfo, isLoading, isError } = useIpInfo();
  let loc = DEFAULT_LOCATION;
  let country = DEFAULT_COUNTRY;
  if (!isLoading && !isError) {
    loc = ipInfo.loc.split(",");
    country = ipInfo.country;
  }
  const topHeadlines = useTopHeadlines(country);
  const weatherOneCall = useWeatherOneCall(loc[0], loc[1]);

  useEffect(() => {
    if (!isLoading && !isError) {
      const location: Location = {
        city: ipInfo.city,
        region: ipInfo.region,
        country: ipInfo.country,
      };
      setLocation(location);
    }

    if (!topHeadlines.isLoading && !topHeadlines.isError) {
      const news = topHeadlines.news;
      const newsList: News[] = [];
      let article;
      for (let i = 0; i < news.articles.length; i++) {
        article = news.articles[i];
        newsList.push({
          title: article.title,
          description: article.description,
          articleUrl: article.url.startsWith("https") ? article.url : "#",
          imageUrl: article.image.startsWith("https") ? article.image : "#",
        });
      }
      setNewsList(newsList);
    }

    if (!weatherOneCall.isLoading && !weatherOneCall.isError) {
      const weather = weatherOneCall.weather;
      const offset = weather.timezone_offset;

      // data for current weather
      const curr = weather.current;
      const iconCode = curr.weather[0].icon;

      const iconUrl = "https://openweathermap.org/img/wn/";

      // data for hourly weather
      const hourly: HourlyWeather[] = [];
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
      setHourly(hourly);

      // data for daily weather
      const daily: DailyWeather[] = [];
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
      setDaily(daily);

      // decide which background image to display
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
      const current: CurrentWeather = {
        temperature: Math.round(curr.temp),
        feelsLike: Math.round(curr.feels_like),
        weather: curr.weather[0].main,
        icon: iconUrl + iconCode + "@2x.png",
        code: iconCode,
        class: weatherClass,
      };
      setCurrent(current);
    }
  }, [ipInfo, isLoading, isError, topHeadlines, weatherOneCall]);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.newsWeatherContainer}>
        <TopNews newsList={newsList} />
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
  );
};

export default Home;
