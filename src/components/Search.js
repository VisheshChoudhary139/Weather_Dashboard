import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";


const API_KEY = "269ffbaff8bf91d2f87b0dc2de2bcf71";

const Search = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError("City not found or API error!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city.trim());
    setCity("");
  };

  const readWeatherAloud = () => {
    if (!weather) return;

    const message = `The temperature in ${weather.name} is ${weather.main.temp} degrees Celsius with ${weather.weather[0].description}. Humidity is ${weather.main.humidity} percent and wind speed is ${weather.wind.speed} kilometers per hour.`;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="search-container">
      <div className="text-center my-4">
        <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
          Search Weather by your City!
        </h2>
        <p className="text-muted">
          Type your city below and hit Search to get live weather data.
        </p>
      </div>

      <form className="search-form mb-4 d-flex justify-content-center" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="btn btn-primary ms-2">
          Search
        </button>
      </form>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            margin: "2rem auto",
            width: "50px",
            height: "50px",
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #3498db",
            borderRadius: "50%",
          }}
        />
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {weather && (
        <div
          style={{
            background: "linear-gradient(to bottom, #e0f7fa, #ffffff)",
            borderRadius: "15px",
            padding: "30px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: "400px",
            margin: "30px auto",
          }}
        >
          <h3 style={{ fontSize: "2rem", marginBottom: "10px" }}>{weather.name}</h3>
          <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>🌡️ Temp: {weather.main.temp} °C</p>
          <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>☁️ Condition: {weather.weather[0].main}</p>
          <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>💧 Humidity: {weather.main.humidity} %</p>
          <p style={{ fontSize: "1.2rem", margin: "5px 0" }}>🌬️ Wind: {weather.wind.speed} km/h</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt="weather icon"
            style={{
              width: "100px",
              height: "100px",
              marginTop: "15px",
              objectFit: "contain",
            }}
          />
          <button className="btn btn-outline-secondary mt-3" onClick={readWeatherAloud}>
            🔊 Read Aloud
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
