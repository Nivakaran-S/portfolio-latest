import Groq from "groq-sdk";

/** Lazily build the Groq client. Returns null if no key is configured. */
let client = null;

export function getGroq() {
  if (!process.env.GROQ_API_KEY) return null;
  if (!client) client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return client;
}

export const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
