import React, { useState } from "react";
import "./Auth.css";

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    localStorage.setItem("user", JSON.stringify(user));
    setMessage("Signup successful! Please login.");
    onSignupSuccess(); 
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-success w-100">Signup</button>
      </form>

      {message && <p className="text-success mt-2">{message}</p>}

      <p className="mt-3">
        Already have an account?{" "}
        <button className="btn btn-link p-0" onClick={onSwitchToLogin}>
          Login here
        </button>
      </p>
    </div>
  );
};

export default Signup;
