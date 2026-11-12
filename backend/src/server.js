import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { requireAdmin } from "./middleware/auth.js";
import { rateLimit } from "./middleware/rateLimit.js";
import documentsRouter from "./routes/documents.js";
import chatRouter from "./routes/chat.js";

const app = express();
// behind Render's proxy: use the real client IP for rate limiting
app.set("trust proxy", 1);

const origins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : "*";
app.use(cors({ origin: origins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, ai: Boolean(process.env.GROQ_API_KEY) })
);
// tight limit on admin (brute-force guard), looser on public chat (LLM cost guard)
app.use(
  "/api/documents",
  rateLimit({ windowMs: 60_000, max: 30 }),
  requireAdmin,
  documentsRouter
);
app.use("/api/chat", rateLimit({ windowMs: 60_000, max: 15 }), chatRouter);

// Express 4 doesn't catch async rejections; this keeps them from hanging requests.
app.use((err, _req, res, _next) => {
  console.error("unhandled route error:", err);
  res.status(500).json({ error: "Internal error" });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() =>
    app.listen(PORT, () => console.log(`✓ Backend listening on :${PORT}`))
  )
  .catch((err) => {
    console.error("Startup failed:", err.message);
    process.exit(1);
  });
