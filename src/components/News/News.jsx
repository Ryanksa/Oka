import React, { useState, useEffect } from 'react';
import './News.scss';
import { getTopHeadlines } from '../../utils/news-service';
import { getIpInfo } from '../../utils/ipinfo-service';

export default function News() {
    const [newsList, setNewsList] = useState([]);
    
    useEffect(() => {
        getIpInfo().then(
            (r) => {
                getTopHeadlines(r.data.country).then(
                    (r) => {
                        const news = [];
                        let article;
                        for (let i = 0; i < r.data.articles.length; i++) {
                            article = r.data.articles[i];
                            news.push({
                                title: article.title,
                                description: article.description,
                                articleUrl: article.url.startsWith("https") ? article.url : "#",
                                imageUrl: article.image.startsWith("https") ? article.image : "#"
                            });
                        }
                        setNewsList(news);
                    }
                );
            }
        );
    }, []);

    return (
        <div className="news-container">
            <h2 className="news-top">News</h2>
            {newsList.map((news, idx) => (
                <div key={idx} className="news-item">
                    <div className="news-img">
                        <img src={news.imageUrl} alt=""/>
                    </div>
                    <div className="news-text">
                        <a href={news.articleUrl}><h6 className="news-title">{news.title}</h6></a>
                        <p className="news-description">{news.description ? news.description : ""}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}