/**
 * Sentence embeddings via Jina AI's hosted API (`jina-embeddings-v3`, 1024-d
 * by default, normalized). Free tier covers easily a million tokens on
 * sign-up — get a key at https://jina.ai → API.
 *
 * Why hosted: keeps the backend memory footprint tiny (~50 MB total) so it
 * runs comfortably on Render's free tier (512 MB) without OOM risk. Previously
 * we used `@xenova/transformers` locally which needed ~300–400 MB just for the
 * model.
 *
 * If you ever want to swap embedding providers, only `embed()` and the vector
 * dimension change — the rest of the RAG pipeline doesn't care.
 */
const JINA_URL = "https://api.jina.ai/v1/embeddings";
const JINA_MODEL = process.env.JINA_MODEL || "jina-embeddings-v3";

/** Embed a string → normalized vector (plain array). */
export async function embed(text) {
  const key = process.env.JINA_API_KEY;
  if (!key) {
    throw new Error("JINA_API_KEY is not set — copy .env.example to .env");
  }

  const res = await fetch(JINA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: JINA_MODEL,
      // `text-matching` is symmetric — fine for both KB docs and chat queries.
      task: "text-matching",
      input: [text],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Jina embeddings failed (${res.status}): ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  const vector = json?.data?.[0]?.embedding;
  if (!Array.isArray(vector)) {
    throw new Error("Jina embeddings: unexpected response shape");
  }
  return vector;
}

/** Cosine similarity. Jina v3 normalizes by default, so this is a dot product. */
export function cosineSim(a, b) {
  let dot = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) dot += a[i] * b[i];
  return dot;
}
