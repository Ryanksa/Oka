import React from 'react';
import './Home.scss';
import News from '../News/News';
import Weather from '../Weather/Weather';
import Upcoming from '../Upcoming/Upcoming';

function Home() {
    return (
        <>
            <div className="home-container">
                <News />
                <Weather/>
            </div>
            <Upcoming />
        </>
    )
}

export default Home;