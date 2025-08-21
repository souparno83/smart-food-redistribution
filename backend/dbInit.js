const pool = require("./db");

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100),
        role VARCHAR(20)
      );
    `);

    console.log("✅ Database initialized");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
}

module.exports = initDB;
