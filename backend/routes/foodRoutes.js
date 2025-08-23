import express from "express";
import multer from "multer";
import path from "path";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  }
});
const upload = multer({ storage });

const foodRoutes = (pool) => {
  const router = express.Router();

  // POST donate food (with image upload)
  router.post("/donate", upload.single("image"), async (req, res) => {
    try {
      const { donor_name, food_item, quantity, location } = req.body;
      const image_path = req.file ? `/uploads/images/${req.file.filename}` : null;

      if (!donor_name || !food_item || !quantity || !location) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const result = await pool.query(
        `INSERT INTO donations (donor_name, food_item, quantity, location, image_path)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [donor_name, food_item, quantity, location, image_path]
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
