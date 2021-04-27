import React from 'react';
import './Home.scss';
import News from '../News/News';
import Weather from '../Weather/Weather';
import Upcoming from '../Upcoming/Upcoming';

function Home() {
    return (
        <div className="home-container">
            <div className="news-weather-container">
                <News />
                <Weather/>
            </div>
            <Upcoming />
        </div>
    )
}

export default Home;