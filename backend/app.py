from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load trained model
model = joblib.load("sales_forecast_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    product_id = int(data["product_id"])
    user_id = int(data["user_id"])
    day_of_week = data["day_of_week"]

    # Convert day of the week to a numeric value (0=Monday, ..., 6=Sunday)
    day_map = {"Monday": 0, "Tuesday": 1, "Wednesday": 2, "Thursday": 3, "Friday": 4, "Saturday": 5, "Sunday": 6}
    day_numeric = day_map.get(day_of_week, -1)

    if day_numeric == -1:
        return jsonify({"error": "Invalid day of the week"}), 400

    # Create input dataframe for prediction
    input_data = pd.DataFrame({"product_id": [product_id], "user_id": [user_id], "day_of_week": [day_numeric]})

    # Make prediction
    predicted_sales = model.predict(input_data)[0]

    return jsonify({"prediction": int(predicted_sales)})

if __name__ == "__main__":
    app.run(debug=True)
