import React from "react";
import { Link } from "react-router-dom";
import "../styles/navigation.css";

const Navigation = () => {
  return (
    <header className="navbar">
      <h1 className="logo">BixieDesk</h1>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/ask-bixie">Ask Bixie</Link></li> 
          <li><Link to="/predict-it">PredictIT</Link></li>
          <li><Link to="/analyze-it">AnalyzeIT</Link></li>
          
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
