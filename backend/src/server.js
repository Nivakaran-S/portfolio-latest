import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { requireAdmin } from "./middleware/auth.js";
import documentsRouter from "./routes/documents.js";
import chatRouter from "./routes/chat.js";

const app = express();

const origins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : "*";
app.use(cors({ origin: origins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, ai: Boolean(process.env.GROQ_API_KEY) })
);
app.use("/api/documents", requireAdmin, documentsRouter);
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() =>
    app.listen(PORT, () => console.log(`✓ Backend listening on :${PORT}`))
  )
  .catch((err) => {
    console.error("Startup failed:", err.message);
    process.exit(1);
  });
