import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "./database.js";
import session from "express-session";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "chatbot_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production
  })
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getTopSellingQuery(time_period) {
  const validPeriods = { day: "DAY", week: "WEEK", month: "MONTH", year: "YEAR" };
  return validPeriods[time_period]
    ? `SELECT p.name, SUM(s.quantity_sold) AS total_sold FROM sales s
       JOIN products p ON s.product_id = p.id
       WHERE s.sale_date >= CURDATE() - INTERVAL 1 ${validPeriods[time_period]}
       GROUP BY p.name ORDER BY total_sold DESC LIMIT 10;`
    : null;
}

const queries = [
  { keywords: ["all products", "products", "items"], query: "SELECT * FROM products;" },
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
    JOIN products p ON s.product_id = p.id WHERE s.sale_date = CURDATE();`
  }
];

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
        if (!query) return res.json({ reply: "Specify a valid period: 'day', 'week', 'month', or 'year'." });
        const [rows] = await pool.query(query);
        resultText = rows.length ? JSON.stringify(rows) : "No data available.";
      } else {
        const [rows] = await pool.query(matchedQuery.query);
        resultText = rows.length ? JSON.stringify(rows) : "No data available.";
      }

      // 🔹 Use Gemini AI
      const model = genAI.getGenerativeModel({ model: "gemini-pro-1.0" });
      const chat = await model.generateContent(
        `User's past messages: ${req.session.history.join(", ")}. 
         Format this data: ${resultText}`
      );
      const textResponse = await chat.response.text();
      response = textResponse || "Sorry, I could not generate a response.";
    } else {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-1.0" });
      const chat = await model.generateContent(
        `User asked: "${message}". Previous messages: ${req.session.history.join(", ")}.`
      );
      const textResponse = await chat.response.text();
      response = textResponse || "Sorry, I could not generate a response.";
    }

    res.json({ reply: response });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result;");
    res.json({ message: "Database connected!", result: rows[0].result });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
