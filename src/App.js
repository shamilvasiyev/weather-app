import classes from "./App.module.css";
import { useCallback, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#f89406" }} spin />
);

const App = () => {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);

  const inputValueHandler = (e) => {
    setInput(e.target.value);
  };

  const fetcDataHandler = useCallback(async () => {
    setLoading(true);

    try {
      const fetchingData = await fetch(
        `${process.env.REACT_APP_BASE_API}weather?q=${input}&appid=${process.env.REACT_APP_API_KEY}`
      );

      const response = await fetchingData.json();

      setWeather(response);

      setInput("");
    } catch (error) {
      setWeather({ message: error.message, cod: 500 });
    }

    setLoading();
  }, [input]);

  let contentClass = "";

  if (loading) {
    contentClass = (
      <div className={classes.content}>
        <Spin indicator={antIcon} />
      </div>
    );
  }

  if (weather.cod && weather.cod !== 200) {
    contentClass = (
      <h1 className={classes.error}>
        Sorry,we can't find anyting you want🙄.Please try again
      </h1>
    );
  }

  if (weather.main) {
    contentClass = (
      <div className={classes.content}>
        <div className={classes.item}>
          <h1>{`${weather.name},  ${weather.sys.country}`}</h1>

          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <span>{weather.weather[0].description}</span>
          <div className={classes.temp_box}>
            <span className={classes.temp}>
              {Math.round(weather.main.temp - 273.15)}°C
            </span>
            <div className={classes.extra_info}>
              <span>
                Feeling : {(weather.main.feels_like - 273.15).toFixed(1)}°C
              </span>
              <span>Humidity : {weather.main.humidity}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={classes.wrapper}>
      <div className={classes.search_bar}>
        <input
          type="text"
          placeholder="Search your city"
          onChange={inputValueHandler}
          value={input}
        />
        <button onClick={fetcDataHandler}>Search</button>
      </div>

      {contentClass}
    </section>
  );
};

export default App;
