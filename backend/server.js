// backend/server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { pool } from "./db.js";
import foodRoutes from "./routes/foodRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { initDB } from "./dbInit.js";
import { insertSampleData } from "./dbSampleData.js";
import events from "events";

// Fix MaxListenersWarning
events.defaultMaxListeners = 20;

// Create Express app
const app = express();

app.use("/uploads", express.static("uploads"));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize DB and insert sample data
async function setupDatabase() {
  await initDB();
  await insertSampleData();
}

// Routes
app.use("/api/food", foodRoutes(pool));
app.use("/api/auth", authRoutes(pool));

// Map data routes
app.get("/api/map/donors", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, latitude AS lat, longitude AS lng, food_type AS type FROM donors"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch donors" });
  }
});

app.get("/api/map/recipients", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, latitude AS lat, longitude AS lng FROM recipients"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recipients" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Smart Food Redistribution API is running 🚀");
});

// Start server after DB setup
const PORT = 5000;
setupDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to setup database:", err);
  });
