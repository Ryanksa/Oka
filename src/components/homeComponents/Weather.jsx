import React, { Component } from 'react';
import '../../styles/HomeComponents.css';

class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTemp: null,
            currentFeels: null,
            currentWeather: null,
            currentIcon: null,
            hourly: [],
            daily: []
        };
    }

    componentDidMount() {
        const hourly = [
            {time: new Date(1595242800), temp: 15, icon: "http://openweathermap.org/img/wn/50n.png"},
            {time: new Date(1598842800), temp: 16, icon: "http://openweathermap.org/img/wn/10d.png"},
            {time: new Date(1602442800), temp: 15, icon: "http://openweathermap.org/img/wn/10d.png"},
            {time: new Date(1606042800), temp: 17, icon: "http://openweathermap.org/img/wn/50n.png"},
            {time: new Date(1609642800), temp: 18, icon: "http://openweathermap.org/img/wn/02d.png"}
        ];

        const daily = [
            {time: new Date(1681642800), minTemp: 10, maxTemp: 16, icon: "http://openweathermap.org/img/wn/50n.png"},
            {time: new Date(1768042800), minTemp: 11, maxTemp: 16, icon: "http://openweathermap.org/img/wn/02d.png"},
            {time: new Date(1854442800), minTemp: 14, maxTemp: 20, icon: "http://openweathermap.org/img/wn/01d.png"},
            {time: new Date(1940842800), minTemp: 11, maxTemp: 16, icon: "http://openweathermap.org/img/wn/02d.png"},
            {time: new Date(2027242800), minTemp: 14, maxTemp: 20, icon: "http://openweathermap.org/img/wn/01d.png"}
        ];

        this.setState({
            currentTemp: 14,
            currentFeels: 10,
            currentWeather: "Mist",
            currentIcon: "http://openweathermap.org/img/wn/50n@2x.png",
            hourly: hourly,
            daily: daily
        });
    }
    
    render() { 
        const { currentTemp, currentFeels, currentWeather, currentIcon, hourly, daily } = this.state;
        var weekday = new Array(7);
        weekday[0] = "Mon";
        weekday[1] = "Tue";
        weekday[2] = "Wed";
        weekday[3] = "Thr";
        weekday[4] = "Fri";
        weekday[5] = "Sat";
        weekday[6] = "Sun";

        return (
            <div className="weather-container">
                <div className="current-weather-container">
                    <img src={currentIcon}/>{currentWeather}
                    <h6>Temperature</h6>
                    <p>{currentTemp}°C</p>
                    <h6>Feels Like</h6>
                    <p>{currentFeels}°C</p>
                </div>

                <div className="hourly-header">
                    <div className="hourly-header-text">
                        Hourly
                    </div>
                </div>
                <div className="hourly-weather-container">
                    {hourly.map((weather) => (
                        <div>
                            {weather.time.getHours() + ":00 "}
                            <img src={weather.icon}/>
                            {weather.temp}°C
                        </div>
                    ))}
                </div>
                
                <div className="daily-header">
                    <div className="daily-header-text">
                        Daily
                    </div>
                </div>
                <div className="daily-weather-container">
                    {daily.map((weather) => (
                        <div>
                            {weekday[weather.time.getDay()]}
                            <img src={weather.icon}/>
                            {weather.minTemp + "~" + weather.maxTemp + "°C"}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
 
export default Weather;