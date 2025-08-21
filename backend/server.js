import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg"; // PostgreSQL
import foodRoutes from "./routes/foodRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const { Pool } = pkg;

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  user: "postgres",         // your PostgreSQL username
  host: "localhost",
  database: "fooddb",       // make sure this DB exists
  password: "Souparno@2006", // replace with your PostgreSQL password
  port: 5432,
});

// Test DB connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection error", err));

// Routes (pass pool)
app.use("/api/food", foodRoutes(pool));
app.use("/api/auth", authRoutes(pool));

// Default route
app.get("/", (req, res) => {
  res.send("Smart Food Redistribution API is running 🚀");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
