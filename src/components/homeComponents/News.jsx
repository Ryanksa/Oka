import React, { Component } from 'react';
import '../../styles/HomeComponents.css';

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newsList: []
        }
    }
    
    componentDidMount() {
        const newsList = [
            {title: "Google API is bad", description: "10 reasons why you shouldn't use Google API", articleUrl: "https://www.google.ca", imageUrl: "https://lh3.googleusercontent.com/J6_coFbogxhRI9iM864NL_liGXvsQp2AupsKei7z0cNNfDvGUmWUy20nuUhkREQyrpY4bEeIBuc=w300-rw"},
            {title: "Google API is good", description: "10 reasons why you should use Google API", articleUrl: "https://www.google.ca", imageUrl: "https://lh3.googleusercontent.com/J6_coFbogxhRI9iM864NL_liGXvsQp2AupsKei7z0cNNfDvGUmWUy20nuUhkREQyrpY4bEeIBuc=w300-rw"},
            {title: "Google API is alright", description: "10 reasons why you should maybe use Google's API", articleUrl: "https://www.google.ca", imageUrl: "https://lh3.googleusercontent.com/J6_coFbogxhRI9iM864NL_liGXvsQp2AupsKei7z0cNNfDvGUmWUy20nuUhkREQyrpY4bEeIBuc=w300-rw"}
        ];
        this.setState({newsList: newsList});
    }

    render() { 
        return (
            <div className="news-container">
                <h2 className="news-top">Top News</h2>
                {this.state.newsList.map((news) => (
                    <a href={news.articleUrl}>
                        <img src={news.imageUrl} className="news-img"/>
                        <h4 className="news-title">{news.title}</h4>
                        <p className="news-description">{news.description}</p>
                    </a>
                ))}
            </div>
        );
    }
}
 
export default News;