import { Router } from "express";
import { KbDocument } from "../models/Document.js";
import { embed } from "../services/embeddings.js";

/**
 * CRUD for the chatbot knowledge base. The frontend talks to these endpoints.
 * Embeddings are (re)computed on create/update so retrieval stays in sync.
 *
 * NOTE: these are unauthenticated for now. Before exposing publicly, put the
 * write routes (POST/PUT/DELETE) behind an admin token — see README.
 */
const router = Router();

// READ all (no embeddings in the payload)
router.get("/", async (_req, res) => {
  const docs = await KbDocument.find({}).sort({ updatedAt: -1 }).lean();
  res.json(docs);
});

// READ one
router.get("/:id", async (req, res) => {
  const doc = await KbDocument.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
});

// CREATE
router.post("/", async (req, res) => {
  const { title, text, category } = req.body || {};
  if (!title || !text) {
    return res.status(400).json({ error: "title and text are required" });
  }
  const embedding = await embed(`${title}. ${text}`);
  const doc = await KbDocument.create({ title, text, category, embedding });
  res.status(201).json({
    _id: doc._id,
    title: doc.title,
    category: doc.category,
    text: doc.text,
  });
});

// UPDATE (re-embeds when title/text change)
router.put("/:id", async (req, res) => {
  const { title, text, category } = req.body || {};
  const current = await KbDocument.findById(req.params.id).lean();
  if (!current) return res.status(404).json({ error: "Not found" });

  const update = {};
  if (title !== undefined) update.title = title;
  if (text !== undefined) update.text = text;
  if (category !== undefined) update.category = category;
  if (title !== undefined || text !== undefined) {
    update.embedding = await embed(
      `${update.title ?? current.title}. ${update.text ?? current.text}`
    );
  }

  const doc = await KbDocument.findByIdAndUpdate(req.params.id, update, {
    new: true,
  }).lean();
  res.json({
    _id: doc._id,
    title: doc.title,
    category: doc.category,
    text: doc.text,
  });
});

// DELETE
router.delete("/:id", async (req, res) => {
  const doc = await KbDocument.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
