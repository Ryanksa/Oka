import React, { useContext, useState, useEffect } from "react";
import styles from "../styles/Assistant.module.scss";

import {
  AssistantContext,
  addAssistantContextListener,
  removeAssistantContextListener,
  TakeABreakContext,
} from "../contexts";
import { AssistantWithUrl } from "../models/assistant";
import { BreakOption } from "../models/takeABreak";

import { updateTakeABreakOption } from "../firebase";

import * as SpeechRecognizer from "../utils/speech-recognizer";
import {
  useIpInfo,
  DEFAULT_LOCATION,
  DEFAULT_COUNTRY,
} from "../utils/ip-service";
import { getTopHeadlines } from "../utils/news-service";
import { getWeatherOneCall } from "../utils/weather-service";
import { capitalize, getRandomInt } from "../utils/general";
import { News } from "../models/news";
import { CurrentWeather } from "../models/weather";

import PersonIcon from "@mui/icons-material/Person";
import Image from "next/image";
import { useRouter } from "next/router";

const tabs: { [key: string]: string } = {
  landing: "/",
  home: "/home",
  "work map": "/workmap",
  "take a break": "/takeabreak",
  settings: "/settings",
};

const Assistant = () => {
  const assistantContext = useContext(AssistantContext);
  const [assistant, setAssistant] = useState<AssistantWithUrl>(
    assistantContext.assistant
  );

  const takeABreakContext = useContext(TakeABreakContext);

  const [message, setMessage] = useState<string | JSX.Element>("");
  let messageTimer: ReturnType<typeof setTimeout> | null = null;

  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const { ipInfo, isLoading, isError } = useIpInfo();

  const router = useRouter();

  useEffect(() => {
    const callback = () => {
      setAssistant(assistantContext.assistant);
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

  useEffect(() => {
    if (!assistant.voiceCommand) {
      SpeechRecognizer.disableRestart();
      SpeechRecognizer.stopRecognizer();
      return;
    }
    return enableVoiceCommands();
  }, [assistant, location, country]);

  const getCurrentWeather = () => {
    return getWeatherOneCall(location[0], location[1]).then((data) => {
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
      return current;
    });
  };

  const getNews = () => {
    return getTopHeadlines(country).then((data) => {
      if (!data.articles) return;
      if (data.articles.length > 0) {
        const i = Math.floor(Math.random() * data.articles.length);
        const article = data.articles[i];
        return {
          title: article.title,
          description: article.description,
          articleUrl: article.url.startsWith("https") ? article.url : "#",
          imageUrl: article.image.startsWith("https") ? article.image : "#",
        } as News;
      }
    });
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

  const enableVoiceCommands = () => {
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
        getCurrentWeather().then((current) => {
          if (current) {
            showMessage(weatherMessage(current), 10000);
          }
        });
      },
    });

    SpeechRecognizer.addCommand({
      prompt: new RegExp("what's on the news"),
      callback: () => {
        getNews().then((news) => {
          if (news) {
            showMessage(newsMessage(news), 20000);
          }
        });
      },
    });

    SpeechRecognizer.addCommand({
      prompt: new RegExp("switch my take a break scene"),
      callback: () => {
        showMessage(
          switchSceneMessage(
            takeABreakContext.takeABreak.breakOption,
            clearMessage
          ),
          20000
        );
      },
    });

    SpeechRecognizer.startRecognizer();
    SpeechRecognizer.enableRestart();

    return () => {
      SpeechRecognizer.disableRestart();
      SpeechRecognizer.stopRecognizer();
    };
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

/* Templates for various assistant messages */

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

const switchSceneMessage = (breakOption: BreakOption, onSelect: () => any) => {
  const onClick = (option: BreakOption) => () => {
    updateTakeABreakOption(option);
    onSelect();
  };
  const hotSpringClass = `${styles.option} ${
    breakOption === BreakOption.hotspring ? styles.selected : ""
  }`;
  const mountainClass = `${styles.option} ${
    breakOption === BreakOption.mountainocean ? styles.selected : ""
  }`;
  const bulletingClass = `${styles.option} ${
    breakOption === BreakOption.bulleting ? styles.selected : ""
  }`;

  return (
    <div className={styles.switchSceneMessage}>
      Which scene would you like to switch to?
      <div className={styles.optionsContainer}>
        <div
          className={hotSpringClass}
          onClick={onClick(BreakOption.hotspring)}
        >
          Hot Spring
        </div>
        <div
          className={mountainClass}
          onClick={onClick(BreakOption.mountainocean)}
        >
          Mountain & Ocean
        </div>
        <div
          className={bulletingClass}
          onClick={onClick(BreakOption.bulleting)}
        >
          Bulleting
        </div>
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
      "Did you just wake up? The sun is already gone!",
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
