import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authRoutes = (pool) => {
  const router = express.Router();

  // Signup
  router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const userExists = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );
      if (userExists.rows.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        [name, email, hashedPassword]
      );

      res.json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

      if (user.rows.length === 0) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const isValid = await bcrypt.compare(password, user.rows[0].password);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.rows[0].id, email: user.rows[0].email },
        "your_jwt_secret_key", // change this to env var later
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful", token });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Login failed" });
    }
  });

  return router;
};

export default authRoutes;
