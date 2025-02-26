import React, { useState } from "react";
import axios from "axios";

const PredictSales = () => {
  const [productId, setProductId] = useState("");
  const [date, setDate] = useState("");
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        product_id: parseInt(productId),
        date: date,
      });
      setPrediction(response.data.predicted_sales);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <div>
      <h2>Predict Future Sales</h2>
      <input
        type="number"
        placeholder="Enter Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={handlePredict}>Predict</button>

      {prediction !== null && <h3>Predicted Sales: {prediction}</h3>}
    </div>
  );
};

export default PredictSales;
