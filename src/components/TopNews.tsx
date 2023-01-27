import { FC } from "react";
import styles from "../styles/TopNews.module.scss";
import { News } from "../models/news";
import Image from "./Image";

type Props = { newsList: News[] };

const TopNews: FC<Props> = ({ newsList }) => {
  return (
    <div className={styles.newsContainer}>
      <h2 className={styles.newsTop}>News</h2>
      {newsList.map((news, idx) => (
        <div key={idx} className={styles.newsItem}>
          <div className={styles.newsImgContainer}>
            <Image src={news.imageUrl} alt="" className={styles.newsImg} />
          </div>
          <div className={styles.newsText}>
            <a
              href={news.articleUrl}
              className={styles.newsTitle}
              target="_blank"
              rel="noreferrer"
            >
              {news.title}
            </a>
            <p className={styles.newsDescription}>
              {news.description ? news.description : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopNews;
