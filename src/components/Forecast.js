import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "./Forecast.css";

const Forecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const [city, setCity] = useState("Delhi");
  const [loading, setLoading] = useState(false);

  const API_KEY = "269ffbaff8bf91d2f87b0dc2de2bcf71";

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const groupedData = res.data.list.reduce((acc, item) => {
        const date = dayjs(item.dt_txt).format("YYYY-MM-DD");
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
      }, {});

      setForecastData(Object.entries(groupedData));
    } catch (error) {
      alert("Error fetching forecast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forecast-container">
      <h2 className="mb-4 text-center">5-Day Weather Forecast 📅</h2>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        className="form-control mb-3"
      />
      <button className="btn btn-primary mb-4" onClick={fetchForecast}>
        Get Forecast
      </button>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        forecastData.map(([date, entries]) => (
          <div key={date} className="card mb-3 p-3 shadow-sm">
            <h5>{dayjs(date).format("dddd, MMM D")}</h5>
            <div className="d-flex flex-wrap">
              {entries.map((entry) => (
                <div key={entry.dt} className="p-2 text-center" style={{ minWidth: "120px" }}>
                  <p>{dayjs(entry.dt_txt).format("h A")}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
                    alt={entry.weather[0].description}
                    style={{ width: "50px" }}
                  />
                  <p>{entry.main.temp.toFixed(1)}°C</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Forecast;
