import React, { Component } from 'react';
import './Weather.scss';
import { getWeatherOneCall } from '../../services/weather-service';
import { getIpInfo } from '../../services/ipinfo-service';

class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTemp: null,
            currentFeels: null,
            currentWeather: null,
            currentIcon: null,
            currentCode: null,
            hourly: [],
            daily: []
        };
    }

    componentDidMount() {
        const iconUrl = "https://openweathermap.org/img/wn/";

        getIpInfo().then(
            (r) => {
                const location = r.data.loc.split(",");
                
                getWeatherOneCall(location[0], location[1]).then(
                    (r) => {
                        const offset = r.data.timezone_offset;

                        // data for current weather
                        const current = r.data.current;
                        const iconCode = current.weather[0].icon;

                        // data for hourly weather
                        const hourly = [];
                        for (let i = 0; i < 5; i++) {
                            const nextHour = r.data.hourly[i];
                            const nextIconCode = nextHour.weather[0].icon;
                            const time = new Date(1970, 0, 1);
                            time.setSeconds(nextHour.dt + offset);
                            hourly.push({
                                time: time,
                                temp: Math.round(nextHour.temp),
                                icon: iconUrl + nextIconCode + ".png"
                            });
                        }

                        // data for daily weather
                        const daily = [];
                        for (let j = 0; j < 5; j++) {
                            const nextDay = r.data.daily[j];
                            const nextIconCode = nextDay.weather[0].icon;
                            const time = new Date(1970, 0, 1);
                            time.setSeconds(nextDay.dt + offset);
                            daily.push({
                                time: time,
                                minTemp: Math.round(nextDay.temp.min),
                                maxTemp: Math.round(nextDay.temp.max),
                                icon: iconUrl + nextIconCode + ".png"
                            });
                        }

                        this.setState({
                            currentTemp: Math.round(current.temp),
                            currentFeels: Math.round(current.feels_like),
                            currentWeather: current.weather[0].main,
                            currentIcon: iconUrl + iconCode + "@2x.png",
                            currentCode: iconCode,
                            hourly: hourly,
                            daily: daily
                        });
                    }
                );
            }
        );
    }
    
    render() { 
        const { currentTemp, currentFeels, currentWeather, currentIcon, currentCode, hourly, daily } = this.state;
        let weekday = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
        
        let weatherClass;
        if (currentCode) {
            if (currentCode.startsWith("01")) {
                weatherClass = "weather-clear-bg";
            } else if (currentCode.match("(02|03|04).*")) {
                weatherClass = "weather-cloud-bg";
            } else if (currentCode.match("(09|10|11).*")) {
                weatherClass = "weather-rain-bg";
            } else if (currentCode.startsWith("13")) {
                weatherClass = "weather-snow-bg";
            } else {
                weatherClass = "weather-mist-bg";
            }
        }

        return (
            <div className="weather-container">
                <div className={"current-weather-container weather-shifting-bg " + weatherClass}>
                    <img src={currentIcon} alt=""/>{currentWeather}
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
                <div className={"hourly-weather-container weather-shifting-bg " + weatherClass}>
                    {hourly.map((weather) => (
                        <div key={weather.time}>
                            <span>{weather.time.getHours() + ":00 " }</span>
                            <img src={weather.icon} alt=""/>
                            <span>{weather.temp}°C</span>
                        </div>
                    ))}
                </div>
                
                <div className="daily-header">
                    <div className="daily-header-text">
                        Daily
                    </div>
                </div>
                <div className={"daily-weather-container weather-shifting-bg " + weatherClass}>
                    {daily.map((weather) => (
                        <div key={weather.time}>
                            <span>{weekday[weather.time.getDay()]}</span>
                            <img src={weather.icon} alt=""/>
                            <span>{weather.minTemp + " ~ " + weather.maxTemp + "°C"}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
 
export default Weather;