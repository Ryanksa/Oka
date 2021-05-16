import React, { useState, useEffect } from 'react';
import './Weather.scss';
import { getWeatherOneCall } from '../../utils/weather-service';
import { getIpInfo } from '../../utils/ipinfo-service';
import { formatHour } from '../../utils/date-helper';

let weekday = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

function Weather() {
    // current weather info stored in an array as follows:
    // [temperature, feels-like, weather, weather-icon, weather-code]
    const [current, setCurrent] = useState({});
    // houly weather info, stores temperature up to 5 hours
    const [hourly, setHourly] = useState([]);
    // daily weather info, stores min/max temperature up to 5 days
    const [daily, setDaily] = useState([]);
    // location of user to be obtained from ipinfo.io
    const [location, setLocation] = useState({});

    useEffect(() => {
        const iconUrl = "https://openweathermap.org/img/wn/";

        getIpInfo().then(
            ({ data }) => {
                const loc = data.loc.split(",");
                setLocation({
                    city: data.city,
                    region: data.region,
                    country: data.country
                });
                
                getWeatherOneCall(loc[0], loc[1]).then(
                    (r) => {
                        const offset = r.data.timezone_offset;

                        // data for current weather
                        const curr = r.data.current;
                        const iconCode = curr.weather[0].icon;

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

                        // decide which background image to display
                        let weatherClass;
                        if (iconCode.startsWith("01")) {
                            weatherClass = "weather-clear-bg";
                        } else if (iconCode.match("(02|03|04).*")) {
                            weatherClass = "weather-cloud-bg";
                        } else if (iconCode.match("(09|10|11).*")) {
                            weatherClass = "weather-rain-bg";
                        } else if (iconCode.startsWith("13")) {
                            weatherClass = "weather-snow-bg";
                        } else {
                            weatherClass = "weather-mist-bg";
                        }

                        setCurrent({
                            temperature: Math.round(curr.temp),
                            feels_like: Math.round(curr.feels_like),
                            weather: curr.weather[0].main,
                            icon: iconUrl + iconCode + "@2x.png",
                            code: iconCode,
                            class: weatherClass
                        });
                        setHourly(hourly);
                        setDaily(daily);
                    }
                );
            }
        );
    }, []);

    return (
        <div>
            <div className="weather-header">
                <h2>Weather</h2>
                {location.city && location.region &&
                <span>{location.city}, {location.region}</span>}
            </div>
            <div className="weather-container">
                <div className={"current-weather-container weather-shifting-bg " + current.class}>
                    <div className="current-weather-icon">
                        <img src={current.icon} alt=""/>
                        <span>{current.weather}</span>
                    </div>
                    <h4>Temperature</h4>
                    <p className="temperature">{current.temperature}°C</p>
                    <h4>Feels Like</h4>
                    <p className="temperature">{current.feels_like}°C</p>
                </div>

                <div className="hourly-weather-container">
                    <div className="hourly-header">
                        <div className="hourly-header-text">
                            Hourly
                        </div>
                    </div>
                    <div className={"hourly-daily-weather weather-shifting-bg " + current.class}>
                        {hourly.map((weather) => (
                            <div key={weather.time} className="weather-row">
                                <span>{formatHour(weather.time.getHours())}</span>
                                <img src={weather.icon} alt=""/>
                                <span className="temperature">{weather.temp}°C</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="daily-weather-container">
                    <div className="daily-header">
                        <div className="daily-header-text">
                            Daily
                        </div>
                    </div>
                    <div className={"hourly-daily-weather weather-shifting-bg " + current.class}>
                        {daily.map((weather) => (
                            <div key={weather.time} className="weather-row">
                                <span>{weekday[weather.time.getDay()]}</span>
                                <img src={weather.icon} alt=""/>
                                <span className="temperature">
                                    {weather.minTemp + " ~ " + weather.maxTemp + "°C"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Weather;