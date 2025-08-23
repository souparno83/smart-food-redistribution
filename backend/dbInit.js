// backend/dbInit.js
import { pool } from "./db.js";

export async function initDB() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100),
        role VARCHAR(20)
      );
    `);

    // Donors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        food_type VARCHAR(50)
      );
    `);

    // Recipients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION
      );
    `);

    // Donations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        donor_name VARCHAR(100),
        food_item VARCHAR(100),
        quantity VARCHAR(50),
        location VARCHAR(150),
        image_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
}
