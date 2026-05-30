import { KbDocument } from "../models/Document.js";
import { embed, cosineSim } from "./embeddings.js";
import { getGroq, GROQ_MODEL } from "./groq.js";

/** Retrieve the top-k knowledge chunks most similar to the query. */
export async function retrieve(query, k = 4) {
  const qVec = await embed(query);
  // embedding is select:false on the model — pull it explicitly for scoring.
  const docs = await KbDocument.find({}).select("+embedding").lean();
  return docs
    .filter((d) => Array.isArray(d.embedding) && d.embedding.length)
    .map((d) => ({ doc: d, score: cosineSim(qVec, d.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

const SYSTEM_PROMPT = `You are Max, the friendly AI concierge on Nivakaran S.'s portfolio site (nivakaran.dev). You answer visitors' questions about Nivakaran — his experience, skills, projects, healthcare background, education, and competitions. If asked who you are, you're Max, his AI assistant.

Rules:
- Use ONLY the context provided. If the answer isn't in it, say you don't have that detail and suggest they reach out via the contact options.
- Speak about Nivakaran in the third person.
- Be concise, friendly, and professional — a few sentences, no fluff.
- Never invent facts, numbers, employers, or dates.`;

/**
 * Answer a question with RAG: retrieve context, then generate with Groq.
 * Falls back to returning the top retrieved snippet when no GROQ_API_KEY is set,
 * so the chatbot still works (just non-conversational).
 */
export async function answer(message, history = []) {
  const hits = await retrieve(message, 4);
  const sources = hits.map((h) => h.doc.title);
  const context = hits
    .map((h, i) => `[${i + 1}] ${h.doc.title}: ${h.doc.text}`)
    .join("\n\n");

  const groq = getGroq();
  if (!groq) {
    const top = hits[0]?.doc;
    return {
      answer: top
        ? `${top.text}\n\n(Conversational AI is off — set GROQ_API_KEY on the backend to enable it.)`
        : "I don't have an answer for that yet. You can reach Nivakaran directly via the contact options.",
      sources,
    };
  }

  const messages = [
    { role: "system", content: `${SYSTEM_PROMPT}\n\nContext:\n${context}` },
    ...history
      .slice(-6)
      .map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: String(m.content || ""),
      })),
    { role: "user", content: message },
  ];

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages,
    temperature: 0.3,
    max_tokens: 400,
  });

  return {
    answer:
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a reply just now.",
    sources,
  };
}
