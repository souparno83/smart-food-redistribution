// backend/dbSampleData.js
import { pool } from "./db.js";

export async function insertSampleData() {
  try {
    // Example donors
    await pool.query(`
      INSERT INTO donors (name, latitude, longitude, food_type)
      VALUES 
        ('John Doe', 22.5726, 88.3639, 'Vegetables'),
        ('Jane Smith', 22.5720, 88.3640, 'Fruits')
      ON CONFLICT DO NOTHING;
    `);

    console.log("✅ Sample data inserted");
  } catch (err) {
    console.error("❌ Error inserting sample data:", err);
  }
}
