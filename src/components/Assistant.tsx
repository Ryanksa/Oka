import { useEffect } from "react";
import styles from "../styles/Assistant.module.scss";
import store from "../store";
import { BreakOption } from "../models/takeABreak";
import { updateTakeABreakOption } from "../firebase";
import * as SpeechRecognition from "../utils/speechRecognition";
import { useIpInfo, DEFAULT_COORDS, DEFAULT_COUNTRY } from "../services/ip";
import { getTopHeadlines } from "../services/news";
import { getWeatherOneCall } from "../services/weather";
import { capitalize } from "../utils/general";
import { News } from "../models/news";
import { CurrentWeather, Location } from "../models/weather";
import { BsPersonFill } from "react-icons/bs";
import Image from "./Image";
import { default as NextImage } from "next/image";
import { useRouter } from "next/router";
import { useSignal } from "@preact/signals-react";

const tabs: { [key: string]: string } = {
  landing: "/",
  home: "/home",
  "work map": "/workmap",
  "take a break": "/takeabreak",
  settings: "/settings",
};

const Assistant = () => {
  const assistant = store.assistant.value;

  const message = useSignal<string | JSX.Element>("");
  let messageTimer: ReturnType<typeof setTimeout> | null = null;

  const { ipInfo, isLoading, isError } = useIpInfo();
  const hasIpInfo = !isLoading && !isError;
  const coords = hasIpInfo ? ipInfo.loc.split(",") : DEFAULT_COORDS;
  const location: Location = {
    city: hasIpInfo ? ipInfo.city : "",
    region: hasIpInfo ? ipInfo.region : "",
    country: hasIpInfo ? ipInfo.country : DEFAULT_COUNTRY,
  };

  const router = useRouter();

  useEffect(() => {
    if (!assistant.voiceCommand) {
      SpeechRecognition.disableRestart();
      SpeechRecognition.stopRecognizer();
      return;
    }
    return enableVoiceCommands();
  }, [assistant.voiceCommand, location, coords]);

  const showMessage = (msg: string | JSX.Element, timeout: number) => {
    clearMessage();
    message.value = msg;
    messageTimer = setTimeout(() => {
      message.value = "";
      messageTimer = null;
    }, timeout);
  };

  const clearMessage = () => {
    if (messageTimer) clearTimeout(messageTimer);
    messageTimer = null;
    message.value = "";
  };

  const getNews = () => {
    return getTopHeadlines(location.country).then((data) => {
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

  const getCurrentWeather = () => {
    return getWeatherOneCall(coords[0], coords[1]).then((data) => {
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

  const enableVoiceCommands = () => {
    SpeechRecognition.clearCommands();

    SpeechRecognition.addCommand({
      prompt: new RegExp("what's on the news"),
      callback: () => {
        getNews().then((news) => {
          if (news) {
            showMessage(newsMessage(news), 20000);
          }
        });
      },
    });
    SpeechRecognition.addCommand({
      prompt: new RegExp("how's the weather"),
      callback: () => {
        getCurrentWeather().then((current) => {
          if (current) {
            showMessage(weatherMessage(current, location), 10000);
          }
        });
      },
    });
    SpeechRecognition.addCommand({
      prompt: new RegExp("take me to (.+)"),
      callback: (tab: string) => {
        if (Object.keys(tabs).includes(tab)) {
          showMessage(`Taking you to ${capitalize(tab)}`, 3000);
          router.push(tabs[tab]);
        }
      },
    });
    SpeechRecognition.addCommand({
      prompt: new RegExp("google (.+)"),
      callback: (query: string) => {
        showMessage(`Googling "${query}"`, 3000);
        window.open("https://www.google.com/search?q=" + query);
      },
    });
    SpeechRecognition.addCommand({
      prompt: new RegExp("switch my take a break scene"),
      callback: () => {
        showMessage(
          switchSceneMessage(store.takeABreak.value.breakOption, clearMessage),
          20000
        );
      },
    });

    SpeechRecognition.startRecognizer();
    SpeechRecognition.enableRestart();

    return () => {
      SpeechRecognition.disableRestart();
      SpeechRecognition.stopRecognizer();
    };
  };

  return (
    <div
      className={`${styles.wrapper} ${
        message.value === "" ? styles.hide : styles.show
      }`}
    >
      {message.value !== "" && (
        <div className={styles.assistantTextBox}>{message}</div>
      )}
      <div className={styles.assistantContainer}>
        {assistant.avatarUrl !== "" ? (
          <NextImage src={assistant.avatarUrl} alt="" fill sizes="6em 6em" />
        ) : (
          <BsPersonFill className={styles.defaultAvatar} />
        )}
      </div>
    </div>
  );
};

export default Assistant;

/* Templates for various assistant messages */

const newsMessage = (news: News) => {
  return (
    <div className={styles.newsMessage}>
      <div className={styles.newsContainer}>
        <div className={styles.newsImgContainer}>
          <Image src={news.imageUrl} alt="" className={styles.newsImg} />
        </div>
        <a
          href={news.articleUrl}
          className={styles.newsTitle}
          target="_blank"
          rel="noreferrer"
        >
          {news.title}
        </a>
        <div className={styles.newsDescription}>
          {news.description ? news.description : ""}
        </div>
      </div>
    </div>
  );
};

const weatherMessage = (currentWeather: CurrentWeather, location: Location) => {
  const hasLocation = location.city && location.region;
  return (
    <div className={styles.weatherMessage}>
      {hasLocation && (
        <div className={styles.location}>
          {location.city}, {location.region}
        </div>
      )}
      <div className={styles.display}>
        <div className={styles.icon}>
          <NextImage
            src={currentWeather.icon}
            alt=""
            width={100}
            height={100}
          />
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
