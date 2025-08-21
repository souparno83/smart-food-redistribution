// backend/db.js
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fooddb",
  password: "Souparno@2006",
  port: 5432,
});
