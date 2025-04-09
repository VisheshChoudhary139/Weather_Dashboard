import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import { motion } from "framer-motion";
import Footer from "./Footer";
import TemperatureChart from "./TemperatureChart";

const API_KEY = "269ffbaff8bf91d2f87b0dc2de2bcf71";

const Home = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showQuote, setShowQuote] = useState(true);
  const [isListening, setIsListening] = useState(false); 
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

    const timer = setTimeout(() => setShowQuote(false), 5000);
    getWeatherByLocation();

    return () => clearTimeout(timer);
  }, []);

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1;
      window.speechSynthesis.speak(utter);
    }
  };

  const getAdvice = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("rain")) return "Don't forget your umbrella! ☔";
    if (conditionLower.includes("clear")) return "It’s a sunny day! Sunglasses recommended 😎";
    if (conditionLower.includes("cloud")) return "Looks a bit gloomy outside, maybe carry a light jacket.";
    if (conditionLower.includes("snow")) return "Bundle up! It might be freezing out there ❄️";
    if (conditionLower.includes("storm")) return "Stay safe! Better to be indoors during a storm. ⚡";
    return "Enjoy the weather and have a great day!";
  };

  const fetchForecast = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current,alerts&units=metric&appid=${API_KEY}`
      );
      setForecast(response.data.daily.slice(0, 7));
    } catch (err) {
      console.error("Failed to fetch forecast:", err);
    }
  };

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = response.data;
      setWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);

      const updatedHistory = [cityName, ...history.filter(c => c !== cityName)].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));

      const summary = `Weather in ${data.name}: ${data.weather[0].main}, ${data.main.temp} degrees Celsius, humidity at ${data.main.humidity} percent.`;
      const advice = getAdvice(data.weather[0].main);
      speakText(`${summary} ${advice}`);
    } catch (err) {
      setError("City not found or API error!");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const data = res.data;
            setWeather(data);
            fetchForecast(latitude, longitude);

            const summary = `Weather in ${data.name}: ${data.weather[0].main}, ${data.main.temp} degrees Celsius, humidity at ${data.main.humidity} percent.`;
            const advice = getAdvice(data.weather[0].main);
            speakText(`${summary} ${advice}`);
          } catch (err) {
            setError("Could not fetch weather from location.");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
          setError("Location access denied. Please search manually.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported in this browser.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city.trim());
    setCity("");
  };

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log("Listening...");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Recognized:", transcript);
      setCity(transcript);
      fetchWeather(transcript);
    };

    recognition.start();
  };

  return (
    <div className="home-container">
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
      <form className="search-form mb-4" onSubmit={handleSearch}>
        <div className="row g-2">
          <div className="col-12 col-md-6">
            <div className="d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button
  type="button"
  className={`btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center ms-2 ${isListening ? "disabled" : ""}`}
  onClick={handleVoiceSearch}
  title="Speak city name"
  style={{
    width: "45px",
    height: "45px",
    fontSize: "1.2rem",
    padding: 0,
  }}
>
  🎤
</button>

            </div>
          </div>

          <div className="col-12 col-md-2">
            <button type="submit" className="btn btn-primary w-100 mb-2 mb-md-0">
              Search
            </button>
          </div>

          <div className="col-12 col-md-3">
            <button
              type="button"
              className="btn btn-outline-secondary w-100 mb-2 mb-md-0"
              onClick={handleToggleHistory}
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
          </div>

          <div className="col-12 col-md-3">
            <button
              type="button"
              className="btn btn-success w-100"
              onClick={getWeatherByLocation}
            >
              📍 Use My Location
            </button>
          </div>
        </div>
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

      {error && <div className="alert alert-danger">{error}</div>}
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
          <h3>{weather.name}</h3>
          <p>🌡️ Temp: {weather.main.temp} °C</p>
          <p>☁️ Condition: {weather.weather[0].main}</p>
          <p>💧 Humidity: {weather.main.humidity} %</p>
          <p>🌬️ Wind: {weather.wind.speed} km/h</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt="weather icon"
            style={{ width: "100px", height: "100px", marginTop: "15px" }}
          />
          <div style={{ marginTop: "15px", fontStyle: "italic", color: "#555" }}>
            💡 {getAdvice(weather.weather[0].main)}
          </div>
        </div>
      )}

      {forecast && (
        <div
          className="chart-container mt-5 mb-5"
          style={{ maxWidth: "800px", margin: "0 auto", height: "300px" }}
        >
          <TemperatureChart dailyData={forecast} />
        </div>
      )}

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

      <Footer />
    </div>
  );
};

export default Home;
