import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import Chatbot from "./components/Chatbot";
import PredictIT from "./components/PredictIT";
import AnalyzeIT from "./components/AnalyzeIT";

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data");
      if (!response.ok) throw new Error("Failed to fetch data");

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching API data:", error);
      setData({ message: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div>
        <Navigation />
        
        {loading ? <p>Loading...</p> : data?.message && <h3>{data.message}</h3>}

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ask-bixie" element={<Chatbot />} />
          <Route path="/predict-it" element={<PredictIT />} />
          <Route path="/analyze-it" element={<AnalyzeIT />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
