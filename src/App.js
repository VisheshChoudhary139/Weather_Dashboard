import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Forecast from "./components/Forecast";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import Search from "./components/Search";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "home",
      isAuthenticated: localStorage.getItem("auth") === "true",
      theme: localStorage.getItem("theme") || "light",
    };
  }

  componentDidMount() {
      document.body.className = this.state.theme;
    
  }

  handleLogin = () => {
    this.setState({ isAuthenticated: true, currentPage: "home" });
    localStorage.setItem("auth", "true");
  };

  handleLogout = () => {
    this.setState({ isAuthenticated: false, currentPage: "login" });
    localStorage.removeItem("auth");
  };

  onNavigate = (page) => {
    this.setState({ currentPage: page });
  };

  toggleTheme = () => {
    const newTheme = this.state.theme === "light" ? "dark" : "light";
    this.setState({ theme: newTheme });
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  render() {
    const { currentPage, isAuthenticated, theme } = this.state;

    return (
      <div>
        <Navbar
          onNavigate={this.onNavigate}
          onLogout={this.handleLogout}
          isAuthenticated={isAuthenticated}
          theme={theme}
          onThemeToggle={this.toggleTheme}
        />

        <div className="container mt-4">
          {currentPage === "home" && <Home />}
          {currentPage === "login" && <Login onLogin={this.handleLogin} />}
          {currentPage === "signup" && (
            <Signup onSignupSuccess={() => this.setState({ currentPage: "login" })} />
          )}
          {currentPage === "search" && (
            <div className="text-center">
              
            </div>
          )}
          {currentPage === "search" && <Search />}

          {currentPage === "forecast" && <Forecast />}
        </div>
      </div>
    );
  }
}
