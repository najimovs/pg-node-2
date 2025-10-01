import express from "express";
import client from "../db.js";

const router = express.Router();

// Barcha userlarni olish
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

// Yangi user qo'shish
router.post("/", async (req, res) => {
  try {
    const { username, balance } = req.body;
    const result = await client.query(
      "INSERT INTO users(username, balance) VALUES($1, $2) RETURNING *",
      [username, balance || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

export default router;
