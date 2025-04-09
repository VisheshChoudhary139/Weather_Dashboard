import React from "react";
import "./Footer.css"; 

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="text-center mt-5 p-3"
      style={{
        background: "#f8f9fa",
        color: "#444",
        borderTop: "1px solid #ddd",
        fontSize: "0.9rem",
      }}
    >
      <div>
        Made by <strong>Vishesh Choudhary</strong> © {year}
      </div>
      <div style={{ fontStyle: "italic", marginTop: "5px" }}>
        “Keep your face always toward the sunshine—and shadows will fall behind you.”
      </div>
    </footer>
  );
};

export default Footer;
