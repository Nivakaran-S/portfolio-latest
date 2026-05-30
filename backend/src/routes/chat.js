import { Router } from "express";
import { answer } from "../services/rag.js";

const router = Router();

// POST /api/chat  { message: string, history?: {role,content}[] }
router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }
    const result = await answer(
      message.slice(0, 1000),
      Array.isArray(history) ? history : []
    );
    res.json(result);
  } catch (err) {
    console.error("chat error:", err);
    res.status(500).json({ error: "Chat failed. Please try again." });
  }
});

export default router;
