import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "./database.js";
import session from "express-session";
import fetch from "node-fetch"; // Ensure this is installed

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS: Allow frontend access
app.use(cors({
  origin: "http://localhost:3000", // Change to your frontend URL
  credentials: true
}));

app.use(express.json());

// ✅ Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "chatbot_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure: true in production
  })
);

// ✅ Initialize Gemini AI
if (!process.env.GEMINI_API_KEY) {
  console.error("⚠️ Error: Missing GEMINI_API_KEY in .env");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Function to get top-selling products
function getTopSellingQuery(time_period) {
  const validPeriods = { day: "DAY", week: "WEEK", month: "MONTH", year: "YEAR" };
  return validPeriods[time_period]
    ? `SELECT p.name, SUM(s.quantity_sold) AS total_sold FROM sales s
      JOIN products p ON s.product_id = p.id
      WHERE s.sale_date >= CURDATE() - INTERVAL 1 ${validPeriods[time_period]}
      GROUP BY p.name ORDER BY total_sold DESC LIMIT 10;`
    : null;
}

// ✅ Query Handling
const queries = [
  { keywords: ["all products", "products", "items", "current stock"], query: "SELECT * FROM products;" },
  {
    keywords: ["top 10 selling", "best selling"],
    dynamicQuery: (message) => {
      const timePeriod = ["day", "week", "month", "year"].find(period => message.includes(period));
      return timePeriod ? getTopSellingQuery(timePeriod) : null;
    }
  },
  { keywords: ["low stock"], query: "SELECT name, stock FROM products WHERE stock < 15 ORDER BY stock ASC;" },
  {
    keywords: ["total sales today"], query: `SELECT SUM(s.quantity_sold * p.price) AS total_sales FROM sales s
    JOIN products p ON s.product_id = p.id WHERE s.sale_date = CURDATE();` },
  {
    keywords: ["customer insights"],
    query: `SELECT u.name, COUNT(s.id) AS purchases
    FROM sales s
    JOIN users u ON s.user_id = u.id
    GROUP BY u.name
    ORDER BY purchases DESC;`
  }
];

// ✅ Function to format JSON data into a Markdown table
function formatAsTable(rows) {
  if (!rows.length) return "No data available.";

  const headers = Object.keys(rows[0]);
  const separator = headers.map(() => "---").join(" | ");
  const headerRow = headers.join(" | ");
  const dataRows = rows.map(row => headers.map(field => row[field]).join(" | ")).join("\n");

  return `| ${headerRow} |\n| ${separator} |\n${dataRows}`;
}

// ✅ Chatbot Route
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!req.session.history) req.session.history = [];

  try {
    const lowerMessage = message.toLowerCase();
    req.session.history.push(lowerMessage);

    let response;
    const matchedQuery = queries.find(({ keywords }) =>
      keywords.some(keyword => lowerMessage.includes(keyword))
    );

    if (matchedQuery) {
      let resultText = "";
      if (matchedQuery.dynamicQuery) {
        const query = matchedQuery.dynamicQuery(lowerMessage);
        if (!query) return res.json({ reply: "Please specify 'day', 'week', 'month', or 'year'." });
        const [rows] = await pool.query(query);
        resultText = formatAsTable(rows);
      } else {
        const [rows] = await pool.query(matchedQuery.query);
        resultText = formatAsTable(rows);
      }

      // ✅ Use Gemini AI for response formatting
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = await model.generateContent(
        `User's history: ${req.session.history.join(", ")}.
         Format this data properly: ${resultText}`
      );
      const textResponse = await chat.response.text();
      response = { reply: textResponse || "Sorry, I could not generate a response." };
    } else {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = await model.generateContent(
        `User asked: "${message}". History: ${req.session.history.join(", ")}. Provide a helpful response.`
      );
      const textResponse = await chat.response.text();
      response = { reply: textResponse || "Sorry, I could not generate a response." };
    }

    res.json(response);
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Sales Analytics Route
app.get("/analytics/sales-trends", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DATE(s.sale_date) AS date, SUM(s.quantity_sold) AS total_sales
      FROM sales s
      GROUP BY date ORDER BY date ASC;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Sales trends error:", error);
    res.status(500).json({ error: "Failed to fetch sales trends." });
  }
});

// ✅ Forecast Route (Python API)
app.post("/forecast", async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:5001/forecast", { // Ensure Python is running on port 5001
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) throw new Error("Python API error");
    const forecastData = await response.json();
    res.json(forecastData);
  } catch (error) {
    console.error("Error calling Python API:", error);
    res.status(500).json({ error: "Failed to get forecast" });
  }
});

// ✅ Database Test Route
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result;");
    res.json({ message: "Database connected!", result: rows[0].result });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});
app.get("/api/data", (req, res) => {
  console.log("API is working!"); // ✅ Log it instead of sending to frontend
  res.json({ message: "" }); // ✅ Send an empty message to avoid displaying it
});


// ✅ Start the Server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
