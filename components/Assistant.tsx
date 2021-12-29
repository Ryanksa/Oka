import React, { useContext, useState, useEffect } from "react";
import styles from "../styles/Assistant.module.scss";

import {
  AssistantContext,
  addAssistantContextListener,
  removeAssistantContextListener,
} from "../contexts";
import { AssistantWithUrl } from "../models/assistant";
import defaultAssistant from "../assets/default-assistant.svg";

import * as SpeechRecognizer from "../utils/speech-recognizer";
import { getIpInfo } from "../utils/ip-service";
import { getTopHeadlines } from "../utils/news-service";
import { getWeatherOneCall } from "../utils/weather-service";
import { News } from "../models/news";
import { CurrentWeather } from "../models/weather";

import Image from "next/image";

const Assistant = () => {
  const assistantContext = useContext(AssistantContext);
  const [assistant, setAssistant] = useState<AssistantWithUrl>({
    name: assistantContext.name,
    voiceCommand: assistantContext.voiceCommand,
    avatar: assistantContext.avatar,
    avatarUrl: assistantContext.avatarUrl,
  });
  const [message, setMessage] = useState<string | JSX.Element>("");

  useEffect(() => {
    const callback = () => {
      setAssistant({
        name: assistantContext.name,
        voiceCommand: assistantContext.voiceCommand,
        avatar: assistantContext.avatar,
        avatarUrl: assistantContext.avatarUrl,
      });
      onVoiceCommandToggle();
    };
    addAssistantContextListener(callback);
    return () => removeAssistantContextListener(callback);
  }, []);

  const onVoiceCommandToggle = () => {
    if (assistantContext.voiceCommand) {
      SpeechRecognizer.addCommand({
        prompt: "google *",
        callback: (query: string) => {
          showMessage(`Googling "${query}"`, 5000);
          window.open("https://www.google.com/search?q=" + query);
        },
      });

      SpeechRecognizer.addCommand({
        prompt: "what's on the news",
        callback: () => {
          getIpInfo()
            .then((res) => {
              return getTopHeadlines(res.data.country);
            })
            .then((res) => {
              if (res.data.articles.length > 0) {
                const i = Math.floor(Math.random() * res.data.articles.length);
                const article = res.data.articles[i];
                showMessage(
                  newsMessage({
                    title: article.title,
                    description: article.description,
                    articleUrl: article.url.startsWith("https")
                      ? article.url
                      : "#",
                    imageUrl: article.image.startsWith("https")
                      ? article.image
                      : "#",
                  }),
                  20000
                );
              }
            });
        },
      });

      SpeechRecognizer.addCommand({
        prompt: "how's the weather",
        callback: () => {
          getIpInfo()
            .then((res) => {
              const loc = res.data.loc.split(",");
              return getWeatherOneCall(loc[0], loc[1]);
            })
            .then((res) => {
              const curr = res.data.current;
              const iconCode = curr.weather[0].icon;
              const iconUrl = "https://openweathermap.org/img/wn/";
              const current: CurrentWeather = {
                temperature: Math.round(curr.temp),
                feelsLike: Math.round(curr.feels_like),
                weather: curr.weather[0].main,
                icon: iconUrl + iconCode + "@2x.png",
                code: iconCode,
                class: "", // class isnt needed here
              };
              showMessage(weatherMessage(current), 10000);
            });
        },
      });

      SpeechRecognizer.startRecognizer();
      return () => SpeechRecognizer.stopRecognizer();
    } else {
      SpeechRecognizer.stopRecognizer();
    }
  };

  const showMessage = (msg: string | JSX.Element, timeout: number) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, timeout);
  };

  const newsMessage = (news: News) => {
    let msgs = [
      "This might interest you. Take a look.",
      "Here's one I found. Check out the Home tab for more.",
      "I saw this one in the headlines. What do you think?",
      "Have a look at this one, isn't it interesting?",
      "How about this piece? I was quite intrigued by it.",
    ];
    const msgIdx = Math.floor(Math.random() * 5);

    return (
      <div className={styles.newsMessage}>
        <div>{msgs[msgIdx]}</div>
        <div className={styles.newsContainer}>
          <div className={styles.newsImgContainer}>
            <img src={news.imageUrl} alt="" className={styles.newsImg} />
          </div>
          <a href={news.articleUrl} className={styles.newsTitle}>
            {news.title}
          </a>
          <div className={styles.newsDescription}>
            {news.description ? news.description : ""}
          </div>
        </div>
      </div>
    );
  };

  const weatherMessage = (currentWeather: CurrentWeather) => {
    let msg = "Here's the latest weather forecast in your area: ";
    if (currentWeather.feelsLike > 30) {
      msg = "It's quite hot today.";
    } else if (currentWeather.feelsLike > 15) {
      msg = "The weather's really nice! Would you like to head out for a walk?";
    } else if (currentWeather.feelsLike >= 0) {
      msg =
        "It's a bit chilly. Make sure to wear an extra layer if you're heading out.";
    } else if (currentWeather.feelsLike < 0) {
      msg = "It's cold outside. Would be nice to stay inside and stay cozy.";
    }

    return (
      <div className={styles.weatherMessage}>
        <div>{msg}</div>
        <div className={styles.display}>
          <div className={styles.icon}>
            <img src={currentWeather.icon} alt="" />
            <span>{currentWeather.weather}</span>
          </div>
          <div className={styles.temperature}>
            <div>Temperature</div>
            {currentWeather.temperature}°C
          </div>
          <div className={styles.feelsLike}>
            <div>Feels Like</div>
            {currentWeather.feelsLike}°C
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${styles.wrapper} ${
        message === "" ? styles.hide : styles.show
      }`}
    >
      {message !== "" && (
        <div className={styles.assistantTextBox}>{message}</div>
      )}
      <div className={styles.assistantContainer}>
        <Image
          src={
            assistant.avatarUrl !== "" ? assistant.avatarUrl : defaultAssistant
          }
          alt=""
          layout="fill"
        />
      </div>
    </div>
  );
};

export default Assistant;
