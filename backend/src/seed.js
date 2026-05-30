import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { KbDocument } from "./models/Document.js";
import { embed } from "./services/embeddings.js";

/**
 * Seed the chatbot knowledge base. Re-run any time to reset it.
 * Each chunk is embedded so the RAG retriever can find it.
 * Keep facts accurate — the bot answers strictly from this.
 */
const KNOWLEDGE = [
  {
    title: "Who is Nivakaran",
    category: "about",
    text: "Nivakaran S. is an AI and software engineer based in Colombo, Sri Lanka. He builds data-driven systems end to end — from data pipelines and ML models to the product people click — across AI/ML, software engineering, and data engineering.",
  },
  {
    title: "Healthcare background",
    category: "experience",
    text: "Some of Nivakaran's experience has been in healthcare: he worked as a remote medical scribe for US cardiologists, then in healthcare revenue-cycle operations, and currently builds for a healthcare platform. It's part of his background rather than his sole focus.",
  },
  {
    title: "Current roles",
    category: "experience",
    text: "As of 2026 Nivakaran works as a Junior Developer at Healplace (since March 2026), building features for a healthcare platform front to back, and as an Operations Analyst — Associate, Collections at HealthRecon Connect LLC (since January 2026), turning collections and operations data into decisions for a US healthcare revenue-cycle provider.",
  },
  {
    title: "Earlier work",
    category: "experience",
    text: "Earlier, Nivakaran was a Remote Medical Scribe at Medsource Healthcare LLC (July 2022 to December 2024), documenting clinical encounters for US cardiologists in real time with zero tolerance for error, and a Customer Service Executive at Startek (Commercial Bank PLC) in 2022.",
  },
  {
    title: "Education",
    category: "education",
    text: "Nivakaran is completing a B.Sc (Hons) in Information Technology specializing in Software Engineering at SLIIT (Sri Lanka Institute of Information Technology), 2021 to 2025. He did his G.C.E. Advanced Level in the Biological Science (Bio) stream at St. Benedict's College (2021/2022) before pivoting into software and AI.",
  },
  {
    title: "Skills and stack",
    category: "skills",
    text: "Nivakaran works across AI/ML (RAG systems, model training, inference), software engineering (full-stack products), and data engineering (pipelines). His stack includes Python, PyTorch, scikit-learn, XGBoost, Hugging Face, LangChain, FastAPI, TypeScript, Next.js, Node.js, and MongoDB.",
  },
  {
    title: "FreeRAG project",
    category: "projects",
    text: "FreeRAG is an open retrieval-augmented generation system that runs without paid inference APIs — local Hugging Face embeddings, vector retrieval, and grounded responses with citations over private documents, served via FastAPI. Stack: Python, LangChain, Hugging Face, FastAPI.",
  },
  {
    title: "Sparrow project",
    category: "projects",
    text: "Sparrow is an end-to-end parcel management platform with machine-learning prediction pipelines (Random Forest, XGBoost) for delivery estimation and routing, served behind a Next.js operations dashboard.",
  },
  {
    title: "MedSync project",
    category: "projects",
    text: "MedSync is a healthcare coordination platform that streamlines clinical workflows and patient data, built in TypeScript and Next.js and informed directly by Nivakaran's first-hand experience as a medical scribe.",
  },
  {
    title: "EcoHarvest project",
    category: "projects",
    text: "EcoHarvest is a full-stack surplus-food e-commerce platform with AI-driven recommendations that connects vendors and buyers to reduce food waste. Stack: Next.js, Node.js, MongoDB.",
  },
  {
    title: "Other projects",
    category: "projects",
    text: "Other projects include LaborGuard (workforce safety and compliance monitoring), lens (an interactive data-visualization UI), an NLP semantic book recommender using Hugging Face embeddings, and a from-scratch CNN image classifier in PyTorch with a Gradio interface. Nivakaran has 72+ public repositories on GitHub.",
  },
  {
    title: "Competitions and awards",
    category: "competitions",
    text: "Nivakaran competes actively: 2nd Runner-Up at Model X (solo competitor, IEEE Computational Intelligence Society, 2025); Semi-finalist at the SLIoT Challenge 2026 (University of Moratuwa); Top 10 at SLIITXtreme 2025 (IEEE Computer Society, SLIIT); Top 10 at CodeFest Algothon 2025 (Faculty of Computing, SLIIT); and currently competing in CodeSprint 11 (IEEE Student Branch, IIT).",
  },
  {
    title: "How he works",
    category: "about",
    text: "Nivakaran's principles: he owns the whole loop from data pipeline to product, stays precise and calm under load (a habit from real-time clinical documentation), and favors disciplined engineering over clever shortcuts — building things that last, not just things that demo.",
  },
  {
    title: "Contact and availability",
    category: "contact",
    text: "Nivakaran is open to roles in AI/ML, software, and data engineering — especially where healthcare meets technology. Reach him by email at nivakaran@hotmail.com, on GitHub at github.com/Nivakaran-S, or on LinkedIn at linkedin.com/in/nivakaran.",
  },
];

async function run() {
  await connectDB();
  await KbDocument.deleteMany({});
  for (const k of KNOWLEDGE) {
    const embedding = await embed(`${k.title}. ${k.text}`);
    await KbDocument.create({ ...k, embedding });
    console.log("  seeded:", k.title);
  }
  console.log(`✓ Seeded ${KNOWLEDGE.length} knowledge chunks.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
