import React, { useContext, useState, useEffect } from "react";
import styles from "../styles/Assistant.module.scss";

import {
  AssistantContext,
  addAssistantContextListener,
  removeAssistantContextListener,
} from "../contexts";
import { AssistantWithUrl } from "../models/assistant";

import * as SpeechRecognizer from "../utils/speech-recognizer";
import {
  useIpInfo,
  DEFAULT_LOCATION,
  DEFAULT_COUNTRY,
} from "../utils/ip-service";
import { getTopHeadlines } from "../utils/news-service";
import { getWeatherOneCall } from "../utils/weather-service";
import { tabs, capitalize, getRandomInt } from "../utils/general";
import { News } from "../models/news";
import { CurrentWeather } from "../models/weather";

import { updateTakeABreakOption } from "../firebase";
import { BreakOption } from "../models/takeABreak";

import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/router";

const newsMessage = (news: News) => {
  let msgs = [
    "This might interest you. Take a look.",
    "Here's one I found. Check out the Home tab for more.",
    "I saw this one in the headlines. What do you think?",
    "Have a look at this one, isn't it interesting?",
    "How about this piece? I was quite intrigued by it.",
  ];
  const msgIdx = getRandomInt(0, msgs.length);

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
    msg = "It's quite hot today. Remember to stay hydrated.";
  } else if (currentWeather.feelsLike > 15) {
    msg = "The weather's really nice! Would you like to head out for a walk?";
  } else if (currentWeather.feelsLike >= 0) {
    msg =
      "It's a bit chilly. Make sure to wear an extra layer if you're heading out.";
  } else if (currentWeather.feelsLike < 0) {
    msg =
      "It's cold outside. Wouldn't it be nice to stay wrapped up in a warm cozy blanket?";
  }

  return (
    <div className={styles.weatherMessage}>
      <div>{msg}</div>
      <div className={styles.display}>
        <div className={styles.icon}>
          <Image src={currentWeather.icon} alt="" width={120} height={120} />
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

const switchSceneMessage = (onSelect: () => any) => {
  const onClick = (option: BreakOption) => () => {
    updateTakeABreakOption(option);
    onSelect();
  };
  return (
    <div className={styles.switchSceneMessage}>
      Which scene would you like to switch to?
      <div className={styles.buttonsContainer}>
        <Button variant="contained" onClick={onClick(BreakOption.hotspring)}>
          Hot Spring
        </Button>
        <Button
          variant="contained"
          onClick={onClick(BreakOption.mountainocean)}
        >
          Mountain & Ocean
        </Button>
        <Button variant="contained" onClick={onClick(BreakOption.bulleting)}>
          Bulleting
        </Button>
      </div>
    </div>
  );
};

const morningMessage = () => {
  let msgs: string[] = [];
  const currentHour = new Date().getHours();
  if (currentHour < 4) {
    msgs = [
      "It's still the middle of the night... *yawn*",
      "Why are you awake at this hour? Go get some sleep!",
    ];
  } else if (currentHour > 11) {
    msgs = [
      "Did you just wake up? The morning sun is already gone!",
      "Morning is over. Wake up already!",
      "It's not the morning anymore... Were you up late last night?",
    ];
  } else {
    msgs = [
      "Good morning!",
      "Morning!",
      "Morning! How are you today?",
      "Good morning! Did you sleep well last night?",
    ];
  }
  return msgs[getRandomInt(0, msgs.length)];
};

const thanksMessage = () => {
  let msgs = [
    "You're welcome!",
    "No problem, glad I could help!",
    "No worries!",
  ];
  return msgs[getRandomInt(0, msgs.length)];
};

const Assistant = () => {
  const assistantContext = useContext(AssistantContext);
  const [assistant, setAssistant] = useState<AssistantWithUrl>(
    assistantContext.assistant
  );

  const [message, setMessage] = useState<string | JSX.Element>("");
  let messageTimer: ReturnType<typeof setTimeout> | null = null;

  const [_location, setLocation] = useState(DEFAULT_LOCATION);
  const [_country, setCountry] = useState(DEFAULT_COUNTRY);
  const { ipInfo, isLoading, isError } = useIpInfo();

  const router = useRouter();

  useEffect(() => {
    const callback = () => {
      setAssistant(assistantContext.assistant);
      onVoiceCommandToggle();
    };
    addAssistantContextListener(callback);
    return () => removeAssistantContextListener(callback);
  }, []);

  useEffect(() => {
    if (!isLoading && !isError) {
      setLocation(ipInfo.loc.split(","));
      setCountry(ipInfo.country);
    }
  }, [ipInfo, isLoading, isError]);

  const onVoiceCommandToggle = () => {
    if (assistantContext.assistant.voiceCommand) {
      SpeechRecognizer.clearCommands();

      SpeechRecognizer.addCommand({
        prompt: new RegExp("take me to (.+)"),
        callback: (tab: string) => {
          if (Object.keys(tabs).includes(tab)) {
            showMessage(`Taking you to ${capitalize(tab)}`, 3000);
            router.push(tabs[tab]);
          }
        },
      });

      SpeechRecognizer.addCommand({
        prompt: new RegExp("google (.+)"),
        callback: (query: string) => {
          showMessage(`Googling "${query}"`, 3000);
          window.open("https://www.google.com/search?q=" + query);
        },
      });

      SpeechRecognizer.addCommand({
        prompt: new RegExp("(thanks|thank you)"),
        callback: () => {
          showMessage(thanksMessage(), 5000);
        },
      });

      SpeechRecognizer.addCommand({
        prompt: new RegExp("morning"),
        callback: () => {
          showMessage(morningMessage(), 5000);
        },
      });

      SpeechRecognizer.addCommand({
        prompt: new RegExp("how's the weather"),
        callback: () => {
          setLocation((location) => {
            getWeatherOneCall(location[0], location[1]).then((data) => {
              if (!data.current) return;
              const curr = data.current;
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
            return location;
          });
        },
      });

      SpeechRecognizer.addCommand({
        prompt: new RegExp("what's on the news"),
        callback: () => {
          setCountry((country) => {
            getTopHeadlines(country).then((data) => {
              if (!data.articles) return;
              if (data.articles.length > 0) {
                const i = Math.floor(Math.random() * data.articles.length);
                const article = data.articles[i];
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
            return country;
          });
        },
      });

      SpeechRecognizer.addCommand({
        prompt: new RegExp("switch my take a break scene"),
        callback: () => {
          showMessage(switchSceneMessage(clearMessage), 20000);
        },
      });

      SpeechRecognizer.startRecognizer();
      SpeechRecognizer.enableRestart();
      return () => {
        SpeechRecognizer.disableRestart();
        SpeechRecognizer.stopRecognizer();
      };
    } else {
      SpeechRecognizer.disableRestart();
      SpeechRecognizer.stopRecognizer();
    }
  };

  const showMessage = (msg: string | JSX.Element, timeout: number) => {
    clearMessage();
    setMessage(msg);
    messageTimer = setTimeout(() => {
      setMessage("");
      messageTimer = null;
    }, timeout);
  };

  const clearMessage = () => {
    if (messageTimer) clearTimeout(messageTimer);
    messageTimer = null;
    setMessage("");
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
        {assistant.avatarUrl !== "" ? (
          <Image src={assistant.avatarUrl} alt="" layout="fill" />
        ) : (
          <PersonIcon style={{ width: "100%", height: "100%" }} />
        )}
      </div>
    </div>
  );
};

export default Assistant;
