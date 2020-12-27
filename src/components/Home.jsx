import React, { Component } from 'react';
import '../styles/Components.css';
import News from './homeComponents/News';
import Weather from './homeComponents/Weather';
import Quote from './homeComponents/Quote';

class Home extends Component {
    render() { 
        return (
            <div className="home-container">
                <News/>
                <Weather/>
                <Quote />
            </div>
        );
    }
}
 
export default Home;