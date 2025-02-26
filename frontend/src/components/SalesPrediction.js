import React, { useState } from "react";

const SalesPrediction = () => {
  const [productID, setProductID] = useState("");
  const [userID, setUserID] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async () => {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productID,
        user_id: userID,
        day_of_week: dayOfWeek,
      }),
    });

    const data = await response.json();
    setPrediction(data.prediction);
  };

  return (
    <div>
      <h2>Sales Prediction</h2>

      <label>Product ID:</label>
      <input type="number" value={productID} onChange={(e) => setProductID(e.target.value)} />

      <label>User ID:</label>
      <input type="number" value={userID} onChange={(e) => setUserID(e.target.value)} />

      <label>Day of Week:</label>
      <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
        <option value="">Select a day</option>
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
        <option value="Saturday">Saturday</option>
        <option value="Sunday">Sunday</option>
      </select>

      <button onClick={handlePredict}>Predict</button>

      {prediction !== null && <h3>Predicted Sales: {prediction}</h3>}
    </div>
  );
};

export default SalesPrediction;
