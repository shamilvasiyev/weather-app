import classes from "./App.module.css";
import React, { useCallback, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import Search from "./Search";

const date = new Date();

let contentClass = "";
let weather_details = "";
let bgImage = "";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#dcdede" }} spin />
);

const App = () => {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({});

  const [city, setCity] = useState({});
  const [loading, setLoading] = useState(false);

  const inputValueHandler = (e) => {
    setInput(e.target.value);
  };

  const fetcDataHandler = useCallback(async (input) => {
    setLoading(true);

    try {
      const fetchCityImage = await fetch(
        `https://pixabay.com/api/?key=${process.env.React_APP_PHOTO_API_KEY}&q=${input}`
      );
      const photoResp = await fetchCityImage.json();

      console.log(photoResp);

      if (photoResp.total === 0) {
        setCity({});
      } else {
        setCity(photoResp);
      }
    } catch (error) {
      setCity({ message: error.message, cod: 500 });
    }

    try {
      const fetchingData = await fetch(
        `https://${process.env.React_APP_BASE_API}weather?q=${input}&appid=${process.env.REACT_APP_API_KEY}`
      );

      const response = await fetchingData.json();

      if (response.cod === "404") {
        setCity({});
      } else {
        setWeather(response);
      }

      setInput("");
    } catch (error) {
      setWeather({ message: error.message, cod: 500 });
    }

    setLoading();
  }, []);

  if ((weather.cod && weather.cod !== 200) || city === {}) {
    contentClass = (
      <div className={classes.content}>
        <h1 className={classes.error}>
          Sorry,we can't find anyting you want.Please try again
        </h1>
      </div>
    );
  }

  if (loading) {
    contentClass = (
      <div style={{ display: "flex", justifyContent: "center", flex: "1" }}>
        <Spin indicator={antIcon} />
      </div>
    );
  }

  if (weather.main) {
    contentClass = (
      <div className={classes.content}>
        <div className={classes.temp_box}>
          <span>{Math.round(weather.main.temp - 273.15)}°</span>
        </div>
        <div className={classes.city_info}>
          <h1>{weather.name}</h1>
          <span>{date.toDateString()}</span>
        </div>
        <div className={classes.weather_icon}>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <span>{weather.weather[0].description}</span>
        </div>
      </div>
    );
    weather_details = (
      <div className={classes.weather_info_box}>
        <h2>Weather details</h2>
        <div className={classes.weather_info}>
          <span>Humidity</span>
          <span>{weather.main.humidity}%</span>
        </div>
        <div className={classes.weather_info}>
          <span>Feeling temprature</span>
          <span>{(weather.main.feels_like - 273.15).toFixed(1)}°C</span>
        </div>
        <div className={classes.weather_info}>
          <span>Wind speed</span>
          <span>{weather.wind.speed} m / sec</span>
        </div>
      </div>
    );
  }

  if (city.hits) {
    bgImage = (
      <div className="bg">
        <img src={city.hits[0].largeImageURL} alt="" />
      </div>
    );
  }

  return (
    <React.Fragment>
      {bgImage}
      <section className={classes.wrapper}>
        <div className={classes.search_info}>
          <Search
            onChanceInput={inputValueHandler}
            inputValue={input}
            onClickButton={() => fetcDataHandler(input)}
          />
          <div className={classes.static_cities}>
            <button onClick={() => fetcDataHandler("london")}>London</button>
            <button onClick={() => fetcDataHandler("new york")}>
              New York
            </button>
            <button onClick={() => fetcDataHandler("milan")}>Milan</button>
            <button onClick={() => fetcDataHandler("baku")}>Baku</button>
          </div>
          {weather_details}
        </div>
        {contentClass}
      </section>
    </React.Fragment>
  );
};

export default App;
