import React, { useState, useEffect } from "react";
import "../styles/chatbot.css";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/data");
      if (!res.ok) throw new Error("Failed to fetch API data");

      const jsonData = await res.json();
      setResponse(Array.isArray(jsonData) ? jsonData : [jsonData]);
    } catch (error) {
      console.error("Error fetching API data:", error);
      setResponse([{ Message: "Failed to fetch data. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Response is not valid JSON:", text);
        setResponse([{ Message: text }]);
        return;
      }

      setResponse(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderResponse = () => {
    if (loading) return <p>Bixie is thinking....</p>;
    if (error) return <p className="error">{error}</p>;
    if (!response.length) return <p>No data available.</p>;

    return Array.isArray(response) && response.length > 0 && typeof response[0] === "object" ? (
      <table className="chatbot-table">
        <thead>
          <tr>
            {Object.keys(response[0]).map((key) => (
              <th key={key}>{key.replace("_", " ").toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {response.map((item, index) => (
            <tr key={index}>
              {Object.keys(item).map((key, idx) => (
                <td key={idx}>{item[key] !== null ? item[key] : "N/A"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>{response[0]?.Message || "No data available"}</p>
    );
  };

  return (
    <div className="chatbot">
      <div className="chatbot-div">
      <h2>Chatbot</h2>
      <input
        type="text"
        className="chatbot-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Bixie something..."
      />
      <button className="chatbot-button" onClick={sendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
      <div className="chatbot-response">{renderResponse()}</div>
    </div>
    </div>
    
  );
}

export default Chatbot;
