import express from "express";

const foodRoutes = (pool) => {
  const router = express.Router();

  // Test route
  router.get("/", (req, res) => {
    res.send("Food API is working 🚀");
  });

  // POST donate food
  router.post("/donate", async (req, res) => {
    try {
      const { donor_name, food_item, quantity, location } = req.body;

      if (!donor_name || !food_item || !quantity || !location) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const result = await pool.query(
        `INSERT INTO donations (donor_name, food_item, quantity, location) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [donor_name, food_item, quantity, location]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("❌ Database insert error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET all donations
  router.get("/donations", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM donations ORDER BY created_at DESC"
      );
      res.json(result.rows);
    } catch (err) {
      console.error("❌ Database fetch error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};

export default foodRoutes;
