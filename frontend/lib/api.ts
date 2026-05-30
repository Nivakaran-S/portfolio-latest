/**
 * Tiny client for the backend (Node/Express + Groq RAG).
 * Set NEXT_PUBLIC_API_URL to the backend origin (e.g. http://localhost:4000
 * in dev, or the deployed URL in prod).
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
}

/** Whether a backend URL is configured at build time. */
export function isChatConfigured(): boolean {
  return Boolean(API_URL);
}

/** Ask the RAG chatbot a question. */
export async function sendChat(
  message: string,
  history: ChatTurn[]
): Promise<ChatResponse> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error(`Chat request failed (${res.status})`);
  return res.json();
}

/* ------------------------------------------------------------------ */
/*  Knowledge-base admin (CRUD) — needs the admin token (x-admin-token) */
/* ------------------------------------------------------------------ */

export interface KbDoc {
  _id: string;
  title: string;
  category?: string;
  text: string;
}

async function adminRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token,
      ...(options.headers || {}),
    },
  });
  if (res.status === 401 || res.status === 503) {
    throw new Error("Unauthorized — check the admin token.");
  }
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

export function listDocs(token: string): Promise<KbDoc[]> {
  return adminRequest<KbDoc[]>("/api/documents", token);
}

export function createDoc(
  token: string,
  body: { title: string; text: string; category?: string }
): Promise<KbDoc> {
  return adminRequest<KbDoc>("/api/documents", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateDoc(
  token: string,
  id: string,
  body: { title?: string; text?: string; category?: string }
): Promise<KbDoc> {
  return adminRequest<KbDoc>(`/api/documents/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteDoc(token: string, id: string): Promise<{ ok: boolean }> {
  return adminRequest<{ ok: boolean }>(`/api/documents/${id}`, token, {
    method: "DELETE",
  });
}
