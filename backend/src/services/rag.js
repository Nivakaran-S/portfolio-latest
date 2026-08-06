import { ChatGroq } from "@langchain/groq";
import { Document } from "@langchain/core/documents";
import { BaseRetriever } from "@langchain/core/retrievers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { KbDocument } from "../models/Document.js";
import { getEmbeddings, cosineSim } from "./embeddings.js";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

/** LangChain ChatGroq instance (null when no API key — graceful fallback). */
const llm = process.env.GROQ_API_KEY
  ? new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: MODEL,
      temperature: 0.3,
      maxTokens: 400,
    })
  : null;

/**
 * Custom LangChain retriever: embeds the query, scores cosine similarity
 * against every chunk in MongoDB, returns the top-k as LangChain Documents.
 *
 * In-process scoring is fine at this scale (<100 chunks). For larger corpora,
 * swap to `MongoDBAtlasVectorSearch` from `@langchain/mongodb` — the schema
 * already has the `embedding` field ready for a $vectorSearch index.
 */
class MongoCosineRetriever extends BaseRetriever {
  lc_namespace = ["nivakaran", "retrievers", "mongo_cosine"];

  constructor(fields = {}) {
    super(fields);
    this.embeddings = fields.embeddings ?? getEmbeddings();
    this.topK = fields.topK ?? 4;
  }

  async _getRelevantDocuments(query) {
    const qVec = await this.embeddings.embedQuery(query);
    const docs = await KbDocument.find({}).select("+embedding").lean();
    return docs
      .filter((d) => Array.isArray(d.embedding) && d.embedding.length)
      .map((d) => ({ doc: d, score: cosineSim(qVec, d.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, this.topK)
      .map(
        ({ doc }) =>
          new Document({
            pageContent: `${doc.title}: ${doc.text}`,
            metadata: { title: doc.title, category: doc.category },
          })
      );
  }
}

const retriever = new MongoCosineRetriever();

const SYSTEM = `You are Max, the friendly AI concierge on Nivakaran S.'s portfolio site (nivakaran.dev). You answer visitors' questions about Nivakaran — his experience, skills, projects, healthcare background, education, and competitions. If asked who you are, you're Max, his AI assistant.

Rules:
- Use ONLY the context provided. If the answer isn't in it, say you don't have that detail and suggest they reach out via the contact options.
- Speak about Nivakaran in the third person.
- Be concise, friendly, and professional — a few sentences, no fluff.
- Never invent facts, numbers, employers, or dates.

Context:
{context}`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM],
  new MessagesPlaceholder("history"),
  ["human", "{question}"],
]);

/** Format retrieved Documents into a numbered context block. */
function formatDocs(docs) {
  return docs.map((d, i) => `[${i + 1}] ${d.pageContent}`).join("\n\n");
}

/**
 * Answer a question with RAG via LCEL:
 *   retriever → prompt (with history) → ChatGroq → StringOutputParser
 *
 * Returns `sources` so the frontend can show which KB chunks were retrieved.
 * Falls back to the top retrieved snippet when no GROQ_API_KEY is set.
 */
export async function answer(message, history = []) {
  const docs = await retriever.invoke(message);
  const sources = docs.map((d) => d.metadata.title).filter(Boolean);

  if (!llm) {
    const top = docs[0];
    return {
      answer: top
        ? `${top.pageContent}\n\n(Conversational AI is off — set GROQ_API_KEY on the backend to enable it.)`
        : "I don't have an answer for that yet. You can reach Nivakaran directly via the contact options.",
      sources,
    };
  }

  const lcHistory = history.slice(-6).map((m) =>
    m.role === "user"
      ? new HumanMessage(String(m.content ?? ""))
      : new AIMessage(String(m.content ?? ""))
  );

  const chain = prompt.pipe(llm).pipe(new StringOutputParser());
  const out = await chain.invoke({
    context: formatDocs(docs),
    question: message,
    history: lcHistory,
  });

  return {
    answer: out.trim() || "Sorry, I couldn't generate a reply just now.",
    sources,
  };
}
