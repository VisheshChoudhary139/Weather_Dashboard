import React from "react";

const Navbar = ({ onNavigate, onLogout, isAuthenticated, onThemeToggle, theme }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <span
        className="navbar-brand"
        style={{ cursor: "pointer", fontWeight: "bold" }}
        onClick={() => onNavigate("home")}
      >
        🌦️ Weather-Dashboard
      </span>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => onNavigate("home")}>
              Home
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => onNavigate("search")}>
              Search
            </span>
          </li>
          <li className="nav-item">
            <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => onNavigate("forecast")}>
              5-Day Forecast
            </span>
          </li>
        </ul>

        <div className="d-flex align-items-center gap-2">
        <button
  className={`btn ${theme === "light" ? "btn-outline-primary" : "btn-outline-light"}`}
  onClick={onThemeToggle}
>
  {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
</button>


          {isAuthenticated ? (
            <button className="btn btn-danger ms-2" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="btn btn-outline-success me-2" onClick={() => onNavigate("login")}>
                Login
              </button>
              <button className="btn btn-success" onClick={() => onNavigate("signup")}>
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
