import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import { motion } from "framer-motion";
import Search from "./Search";


const API_KEY = "269ffbaff8bf91d2f87b0dc2de2bcf71";

const Home = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showQuote, setShowQuote] = useState(true);

  const quotes = [
    "“Wherever you go, no matter what the weather, always bring your own sunshine.” ☀️",
    "“There’s no such thing as bad weather, only inappropriate clothing.” 🌧️",
    "“Sunshine is delicious, rain is refreshing, wind braces us up...” 🌦️",
    "“Some people feel the rain, others just get wet.” 🌧️",
    "“After rain comes sunshine.” 🌤️"
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setHistory(storedHistory);

    // Hide quote after 5 seconds
    const timer = setTimeout(() => setShowQuote(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const isAuthenticated = () => {
    return localStorage.getItem("auth") === "true";
  };

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

      const updatedHistory = [cityName, ...history.filter(c => c !== cityName)].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
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

  const handleToggleHistory = () => {
    if (!isAuthenticated()) {
      alert("⚠️ You must login to see your history or sign up if you're a new user.");
      return;
    }
    setShowHistory(!showHistory);
  };

  return (
    <div className="home-container">
      {/* Animated quote section */}
      {showQuote && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="alert alert-info text-center"
          style={{
            maxWidth: "600px",
            margin: "20px auto",
            fontStyle: "italic",
            fontWeight: 500
          }}
        >
          {randomQuote}
        </motion.div>
      )}

      {/* Search form */}
      <form className="search-form mb-4 d-flex" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="btn btn-primary ms-2">
          Search
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary ms-2"
          onClick={handleToggleHistory}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </form>

      {/* Loader animation */}
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

      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Weather display */}
      {weather && (
        <div
          style={{
            background: "linear-gradient(to bottom, #e0f7fa, #ffffff)",
            borderRadius: "15px",
            padding: "30px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: "400px",
            margin: "0 auto",
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
        </div>
      )}

      {/* History */}
      {showHistory && history.length > 0 && (
        <div className="history-section mt-4">
          <h5>🕘 Recent Searches</h5>
          <ul className="list-group">
            {history.map((item, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                style={{ cursor: "pointer" }}
                onClick={() => fetchWeather(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
