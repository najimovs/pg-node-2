// routes/transfers.js
import express from "express";
import client from "../db.js";
import { authenticateToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    let { recipient_id, amount } = req.body;
    const sender_id = req.user.id;

    console.log("=== TRANSFER REQUEST ===");
    console.log("BODY:", req.body);

    // Convert to number
    recipient_id = parseInt(recipient_id);
    amount = parseFloat(amount);

    // Validation
    if (isNaN(recipient_id) || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: "❌ recipient_id va musbat amount talab qilinadi",
      });
    }

    if (recipient_id === sender_id) {
      return res.status(400).json({
        error: "❌ O'zingizga pul o'tkaza olmaysiz",
      });
    }

    // Transaction boshlash
    await client.query("BEGIN");

    // Senderni lock qilamiz
    const senderResult = await client.query(
      "SELECT id, balance FROM users WHERE id = $1 FOR UPDATE",
      [sender_id]
    );

    if (senderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "❌ Yuboruvchi topilmadi" });
    }

    const sender = senderResult.rows[0];

    if (sender.balance < amount) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "❌ Mablag' yetarli emas" });
    }

    // Recipientni lock qilamiz
    const recipientResult = await client.query(
      "SELECT id, balance FROM users WHERE id = $1 FOR UPDATE",
      [recipient_id]
    );

    if (recipientResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "❌ Qabul qiluvchi topilmadi" });
    }

    // Pul yechib olish
    await client.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [amount, sender_id]
    );

    // Pul qo‘shish
    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [amount, recipient_id]
    );

    // Transferni loglash
    const transfer = await client.query(
      `INSERT INTO transfers (sender_id, recipient_id, amount, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [sender_id, recipient_id, amount]
    );

    // Commit
    await client.query("COMMIT");

    console.log("✅ TRANSFER SUCCESS:", transfer.rows[0]);

    res.json({
      success: true,
      message: `✅ ${amount} so'm muvaffaqiyatli o'tkazildi`,
      transfer: transfer.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Transferda xatolik:", err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

export default router;
