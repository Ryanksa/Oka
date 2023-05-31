import { MouseEvent } from "react";
import styles from "../styles/TopNews.module.scss";
import { News } from "../models/news";
import Image from "./Image";
import { getRandomArbitrary } from "../utils/general";

const HOVER_NOISE_PROBABILITY = 0.3;

type Props = { newsList: News[] };

const TopNews = ({ newsList }: Props) => {
  const handleHoverNews = (event: MouseEvent) => {
    if (getRandomArbitrary(0, 1) > HOVER_NOISE_PROBABILITY) return;

    const newsElement = event.currentTarget!;
    newsElement.classList.add(styles.staticNoise);
    setTimeout(() => {
      newsElement.classList.remove(styles.staticNoise);
    }, 120);
  };

  return (
    <>
      <div className={styles.newsContainer}>
        <h2 className={styles.newsTop}>News</h2>
        {newsList.map((news, idx) => (
          <a
            key={idx}
            className={styles.newsItem}
            href={news.articleUrl}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={handleHoverNews}
          >
            <div className={styles.newsImgContainer}>
              <Image src={news.imageUrl} alt="" className={styles.newsImg} />
            </div>
            <div className={styles.newsText}>
              <div className={styles.newsTitle}>{news.title}</div>
              <p className={styles.newsDescription}>
                {news.description ? news.description : ""}
              </p>
            </div>
          </a>
        ))}
      </div>
      <svg className={styles.svg}>
        <filter id="static-noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            id="turbulence"
            type="fractalNoise"
            baseFrequency="0 0"
            result="NOISE"
            numOctaves="3"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="NOISE"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="R"
          ></feDisplacementMap>
          <animate
            xlinkHref="#turbulence"
            attributeName="baseFrequency"
            dur="300ms"
            keyTimes="0;0.5;1"
            values="0 0;0 9;0 0"
            repeatCount="indefinite"
          />
        </filter>
      </svg>
    </>
  );
};

export default TopNews;
