// routes/auth.js
import express from "express";
import client from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../utils/authMiddleware.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { username, password, phone, email, balance } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username & password required" });
    }

    // Tekshirish: username allaqachon olinganmi?
    const exists = await client.query(
      "SELECT id FROM users WHERE username=$1",
      [username]
    );
    if (exists.rows.length) {
      return res.status(400).json({ error: "username already taken" });
    }

    // Parolni hashlash
    const hashed = await bcrypt.hash(password, 10);

    // Yangi foydalanuvchini DB ga qo‘shish
    const result = await client.query(
      "INSERT INTO users(username, password, phone, email, balance) VALUES($1, $2, $3, $4, $5) RETURNING id, username, balance",
      [username, hashed, phone || null, email || null, balance || 0]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username & password required" });
    }

    // Username bo‘yicha userni topish
    const result = await client.query(
      "SELECT id, password FROM users WHERE username=$1",
      [username]
    );

    if (!result.rows.length) {
      return res.status(400).json({ error: "invalid credentials" });
    }

    const user = result.rows[0];

    // Parolni solishtirish
    const ok = await bcrypt.compare(password, user.password || "");
    if (!ok) {
      return res.status(400).json({ error: "invalid credentials" });
    }

    // ✅ Token yaratish (hech qachon eskirmaydi)
    const token = jwt.sign(
      { id: user.id, username },
      JWT_SECRET
      // expiresIn olib tashlandi
    );

    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "server error" });
  }
});

// ================= ME (protected) =================
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, username, balance FROM users WHERE id=$1",
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ /me error:", err);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
