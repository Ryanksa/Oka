import React, { FC } from "react";
import styles from "../../styles/Home.module.scss";
import TopNews from "../../components/TopNews";
import Weather from "../../components/Weather";
import Upcoming from "../../components/Upcoming";
import { getIpInfo } from "../../utils/ip-service";
import { getTopHeadlines } from "../../utils/news-service";
import { getWeatherOneCall } from "../../utils/weather-service";
import { News } from "../../models/news";
import {
  Location,
  CurrentWeather,
  HourlyWeather,
  DailyWeather,
} from "../../models/weather";
import { GetServerSideProps } from "next";

const Home: FC<{
  newsList: News[];
  location: Location;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}> = ({ newsList, location, current, hourly, daily }) => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.newsWeatherContainer}>
        <TopNews newsList={newsList} />
        <Weather
          location={location}
          current={current}
          hourly={hourly}
          daily={daily}
        />
        <Upcoming />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  let res = await getIpInfo();

  const loc = res.data.loc.split(",");
  const location: Location = {
    city: res.data.city,
    region: res.data.region,
    country: res.data.country,
  };

  res = await getTopHeadlines(res.data.country);

  const newsList: News[] = [];
  let article;
  for (let i = 0; i < res.data.articles.length; i++) {
    article = res.data.articles[i];
    newsList.push({
      title: article.title,
      description: article.description,
      articleUrl: article.url.startsWith("https") ? article.url : "#",
      imageUrl: article.image.startsWith("https") ? article.image : "#",
    });
  }

  res = await getWeatherOneCall(loc[0], loc[1]);

  const offset = res.data.timezone_offset;

  // data for current weather
  const curr = res.data.current;
  const iconCode = curr.weather[0].icon;

  const iconUrl = "https://openweathermap.org/img/wn/";

  // data for hourly weather
  const hourly: HourlyWeather[] = [];
  for (let i = 0; i < 5; i++) {
    const nextHour = res.data.hourly[i];
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
  const daily: DailyWeather[] = [];
  for (let j = 0; j < 5; j++) {
    const nextDay = res.data.daily[j];
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

  return { props: { newsList, location, current, hourly, daily } };
};

export default Home;
