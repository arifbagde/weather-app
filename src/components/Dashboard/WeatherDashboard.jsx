import React, { useEffect, useRef, useState } from "react";
import "./weatherDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faWind,
  faThermometer3,
} from "@fortawesome/free-solid-svg-icons";

function WeatherDashboard() {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState();
  const [locationError, setLocationError] = useState();

  useEffect(() => {
    getWeatherData();
  }, []);

  const getWeatherData = async (location) => {
    const city = location ? location : "Mumbai";
    try {
      const response = await fetch(
        process.env.REACT_APP_BASE_URL +
          `/current.json?key=${process.env.REACT_APP_API_KEY}&q=${city}&aqi=yes`
      );
      const result = await response.json();
      console.log("Result:", result);
      if (result?.error?.code === 1006) {
        return setLocationError(result.error.message);
      } else {
        setLocationError(false);
      }
      const data = {
        country: result?.location?.country,
        city: result?.location?.name,
        temp: result?.current?.temp_c,
        feelsLike: result?.current?.feelslike_c,
        humidity: result?.current?.humidity,
        windKMPH: result?.current?.wind_kph,
        condition: result?.current?.condition?.text,
        icon: result?.current?.condition?.icon,
        isDay: result?.current?.is_day,
      };
      setWeatherData(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="parent-container">
      <div
        className={
          weatherData?.isDay === 1
            ? "weather-dashboard-container day"
            : "weather-dashboard-container night"
        }
      >
        <div className="searchBar-container">
          <input type="text" placeholder="Search Location" ref={inputRef} />
          <button
            type="submit"
            onClick={() => getWeatherData(inputRef.current.value)}
          >
            <FontAwesomeIcon className="icon" icon={faSearch} color="grey" />
          </button>
        </div>
        {locationError ? (
          <div className="weather-details-container">
            <p>{locationError}</p>
          </div>
        ) : (
          <>
            <div className="weather-details-container">
              <div className="temperature-details">
                <img
                  className="weatherIcon"
                  src={weatherData?.icon}
                  alt="weatherCondition"
                />
                <p className="temperature">{weatherData?.temp}°c</p>
              </div>
              <p className="condition">{weatherData?.condition}</p>
              <p className="location">{weatherData?.city}</p>
              <p className="location" style={{ marginTop: "0px" }}>
                {weatherData?.country}
              </p>
              <p>Feels Like {weatherData?.feelsLike}°c</p>
              <div className="weather-info">
                <div className="wind">
                  <FontAwesomeIcon icon={faWind} />
                  <span> Wind : {weatherData?.windKMPH} Kph</span>
                </div>
                <div className="humidity">
                  <FontAwesomeIcon icon={faThermometer3} />
                  <span> Humidity : {weatherData?.humidity}%</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WeatherDashboard;
