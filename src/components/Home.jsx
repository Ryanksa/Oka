import React, { Component } from 'react';
import '../styles/Components.css';
import News from './homeComponents/News';
import Weather from './homeComponents/Weather';
import Upcoming from './homeComponents/Upcoming';

class Home extends Component {
    render() { 
        return (
            <div className="home-container">
                <News />
                <Weather/>
                <Upcoming />
            </div>
        );
    }
}
 
export default Home;