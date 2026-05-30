import { pipeline } from "@xenova/transformers";

/**
 * Local sentence embeddings via Transformers.js (all-MiniLM-L6-v2, 384-d).
 * Free, no API key. The model (~25 MB) downloads on first use and is cached.
 * The pipeline is a lazy singleton so it loads once per process.
 *
 * Note: needs ~300–400 MB RAM. On a memory-constrained host, swap this for a
 * hosted embedding API (OpenAI / Jina / HF Inference) — only `embed()` and the
 * vector dimension would change.
 */
let extractorPromise = null;

function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return extractorPromise;
}

/** Embed a string → normalized 384-d vector (plain array). */
export async function embed(text) {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

/** Cosine similarity. Inputs are already L2-normalized, so this is a dot product. */
export function cosineSim(a, b) {
  let dot = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) dot += a[i] * b[i];
  return dot;
}
