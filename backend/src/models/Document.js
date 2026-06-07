import mongoose from "mongoose";

/**
 * A knowledge-base chunk the RAG chatbot retrieves from. `embedding` is the
 * normalized vector (1024-d, jina-embeddings-v3) computed on create/update
 * and used for cosine-similarity retrieval.
 */
const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "general", trim: true },
    text: { type: String, required: true },
    embedding: { type: [Number], default: [], select: false },
  },
  { timestamps: true }
);

export const KbDocument = mongoose.model("Document", DocumentSchema);
