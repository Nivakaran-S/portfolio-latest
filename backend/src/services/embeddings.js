import { Embeddings } from "@langchain/core/embeddings";

/**
 * Sentence embeddings via Jina AI (`jina-embeddings-v3`, 1024-d, normalized).
 * Free tier: ~1–10M tokens on sign-up at https://jina.ai.
 *
 * Implemented as a thin LangChain `Embeddings` subclass so the retriever and
 * any future LCEL chain can plug it in via the standard interface — and so
 * the bundle stays small (we avoid pulling in `@langchain/community`).
 *
 * Why hosted: keeps the backend memory footprint tiny (~50 MB) so it runs
 * comfortably on Render's free tier (512 MB) without OOM risk.
 */
const JINA_URL = "https://api.jina.ai/v1/embeddings";

export class JinaEmbeddings extends Embeddings {
  constructor(fields = {}) {
    super(fields);
    this.apiKey = fields.apiKey ?? process.env.JINA_API_KEY;
    this.model = fields.model ?? process.env.JINA_MODEL ?? "jina-embeddings-v3";
    // `text-matching` is symmetric — same task for KB docs and chat queries.
    this.task = fields.task ?? "text-matching";
  }

  /** Internal: batch embed an array of strings → number[][] */
  async _embed(inputs) {
    if (!this.apiKey) {
      throw new Error("JINA_API_KEY is not set — copy .env.example to .env");
    }
    const res = await fetch(JINA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        task: this.task,
        input: inputs,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Jina embeddings failed (${res.status}): ${body.slice(0, 200)}`
      );
    }
    const json = await res.json();
    if (!Array.isArray(json?.data)) {
      throw new Error("Jina embeddings: unexpected response shape");
    }
    return json.data.map((d) => d.embedding);
  }

  /** LangChain Embeddings interface: single string → number[] */
  async embedQuery(text) {
    const [vec] = await this._embed([text]);
    return vec;
  }

  /** LangChain Embeddings interface: array of strings → number[][] */
  async embedDocuments(texts) {
    return this._embed(texts);
  }
}

/** Lazy singleton — instantiate the embedder once per process. */
let _embeddings = null;
export function getEmbeddings() {
  if (!_embeddings) _embeddings = new JinaEmbeddings();
  return _embeddings;
}

/**
 * Back-compat helper for callers that just want one vector (seed.js,
 * routes/documents.js). Equivalent to `getEmbeddings().embedQuery(text)`.
 */
export async function embed(text) {
  return getEmbeddings().embedQuery(text);
}

/** Cosine similarity. Jina v3 returns L2-normalized vectors, so this is a dot product. */
export function cosineSim(a, b) {
  let dot = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) dot += a[i] * b[i];
  return dot;
}
