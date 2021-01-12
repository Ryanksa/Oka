import React, { Component } from 'react';
import '../../styles/HomeComponents.css';
import { getTopHeadlines } from '../../services/news-service';
import { getIpInfo } from '../../services/ipinfo-service';

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newsList: []
        }
    }
    
    componentDidMount() {
        getIpInfo().then(
            (r) => {
                getTopHeadlines(r.data.country).then(
                    (r) => {
                        const newsList = [];
                        var article;
                        for (var i = 0; i < 3; i++) {
                            article = r.data.articles[i];
                            newsList.push({
                                title: article.title.replace(new RegExp(" - [^-]*$"), ""),
                                description: article.description,
                                articleUrl: article.url,
                                imageUrl: article.urlToImage
                            });
                        }
                        this.setState({ newsList: newsList });
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }
        );
    }

    render() { 
        return (
            <div className="news-container">
                <h2 className="news-top">Top News</h2>
                {this.state.newsList.map((news) => (
                    <a key={news.articleUrl} href={news.articleUrl} className="news-item">
                        <img src={news.imageUrl} className="news-img" alt=""/>
                        <h6 className="news-title">{news.title}</h6>
                        <p className="news-description">{news.description ? news.description : ""}</p>
                    </a>
                ))}
            </div>
        );
    }
}
 
export default News;