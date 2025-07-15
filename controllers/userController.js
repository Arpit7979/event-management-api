const pool = require("../models/db");

exports.registerUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  try {
    const checkEmail = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const result = await pool.query(
      `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id`,
      [name, email]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
