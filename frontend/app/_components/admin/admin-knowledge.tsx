"use client";

import { useCallback, useState } from "react";
import {
  isChatConfigured,
  listDocs,
  createDoc,
  updateDoc,
  deleteDoc,
  type KbDoc,
} from "@/lib/api";

export function AdminKnowledge() {
  const configured = isChatConfigured();
  const [token, setToken] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [docs, setDocs] = useState<KbDoc[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // new-document form
  const [nTitle, setNTitle] = useState("");
  const [nCategory, setNCategory] = useState("general");
  const [nText, setNText] = useState("");

  const refresh = useCallback(async (tok: string) => {
    setBusy(true);
    setError("");
    try {
      setDocs(await listDocs(tok));
      setUnlocked(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setUnlocked(false);
    } finally {
      setBusy(false);
    }
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nTitle.trim() || !nText.trim()) return;
    setBusy(true);
    setError("");
    try {
      await createDoc(token, {
        title: nTitle.trim(),
        text: nText.trim(),
        category: nCategory.trim() || "general",
      });
      setNTitle("");
      setNText("");
      setNCategory("general");
      await refresh(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSave(doc: KbDoc) {
    setBusy(true);
    setError("");
    try {
      await updateDoc(token, doc._id, {
        title: doc.title,
        text: doc.text,
        category: doc.category,
      });
      await refresh(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    setBusy(true);
    setError("");
    try {
      await deleteDoc(token, id);
      setDocs((d) => d.filter((x) => x._id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  function patch(id: string, field: keyof KbDoc, value: string) {
    setDocs((d) => d.map((x) => (x._id === id ? { ...x, [field]: value } : x)));
  }

  if (!configured) {
    return (
      <main className="mx-auto flex min-h-[60svh] max-w-xl flex-col justify-center px-6 py-24">
        <h1 className="silver font-display text-2xl font-semibold">KB Admin</h1>
        <p className="mt-4 text-fg-muted">
          Set <code className="rounded bg-elevated px-1.5 py-0.5">NEXT_PUBLIC_API_URL</code>{" "}
          to your backend, then reload this page.
        </p>
      </main>
    );
  }

  if (!unlocked) {
    return (
      <main className="mx-auto flex min-h-[70svh] max-w-md flex-col justify-center px-6">
        <h1 className="silver font-display text-2xl font-semibold">
          Knowledge-base admin
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          Enter your admin token to manage what the chatbot knows.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (token.trim()) refresh(token.trim());
          }}
          className="mt-6 flex gap-2"
        >
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ADMIN_TOKEN"
            className="min-w-0 flex-1 rounded-lg border border-line bg-void/60 px-4 py-2.5 text-sm text-fg outline-none focus:border-neon-cyan/50"
          />
          <button
            type="submit"
            disabled={busy || !token.trim()}
            className="rounded-lg bg-neon-cyan/15 px-5 py-2.5 text-sm font-medium text-neon-cyan-core ring-1 ring-neon-cyan/40 transition-colors hover:bg-neon-cyan/25 disabled:opacity-50"
          >
            {busy ? "…" : "Unlock"}
          </button>
        </form>
        {error ? <p className="mt-4 text-sm text-neon-magenta">{error}</p> : null}
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="silver font-display text-2xl font-semibold">
          Knowledge base
        </h1>
        <span className="label text-fg-muted">{docs.length} chunks</span>
      </div>
      <p className="mt-2 text-sm text-fg-muted">
        Edits re-embed automatically and update what the chatbot retrieves.
      </p>
      {error ? <p className="mt-4 text-sm text-neon-magenta">{error}</p> : null}

      {/* new */}
      <form
        onSubmit={onCreate}
        className="mt-8 rounded-2xl border border-line bg-raised/60 p-5"
      >
        <p className="label text-neon-cyan">New chunk</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            value={nTitle}
            onChange={(e) => setNTitle(e.target.value)}
            placeholder="Title"
            className="min-w-0 flex-1 rounded-lg border border-line bg-void/60 px-3 py-2 text-sm text-fg outline-none focus:border-neon-cyan/50"
          />
          <input
            value={nCategory}
            onChange={(e) => setNCategory(e.target.value)}
            placeholder="Category"
            className="rounded-lg border border-line bg-void/60 px-3 py-2 text-sm text-fg outline-none focus:border-neon-cyan/50 sm:w-40"
          />
        </div>
        <textarea
          value={nText}
          onChange={(e) => setNText(e.target.value)}
          placeholder="Text the chatbot can use as context…"
          rows={3}
          className="mt-3 w-full rounded-lg border border-line bg-void/60 px-3 py-2 text-sm text-fg outline-none focus:border-neon-cyan/50"
        />
        <button
          type="submit"
          disabled={busy || !nTitle.trim() || !nText.trim()}
          className="mt-3 rounded-lg bg-neon-cyan/15 px-4 py-2 text-sm font-medium text-neon-cyan-core ring-1 ring-neon-cyan/40 transition-colors hover:bg-neon-cyan/25 disabled:opacity-50"
        >
          Add chunk
        </button>
      </form>

      {/* list */}
      <ul className="mt-6 space-y-4">
        {docs.map((doc) => (
          <li
            key={doc._id}
            className="rounded-2xl border border-line bg-raised/50 p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={doc.title}
                onChange={(e) => patch(doc._id, "title", e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-line bg-void/60 px-3 py-2 text-sm font-medium text-fg outline-none focus:border-neon-cyan/50"
              />
              <input
                value={doc.category ?? ""}
                onChange={(e) => patch(doc._id, "category", e.target.value)}
                className="rounded-lg border border-line bg-void/60 px-3 py-2 text-sm text-fg-muted outline-none focus:border-neon-cyan/50 sm:w-40"
              />
            </div>
            <textarea
              value={doc.text}
              onChange={(e) => patch(doc._id, "text", e.target.value)}
              rows={3}
              className="mt-3 w-full rounded-lg border border-line bg-void/60 px-3 py-2 text-sm text-fg-dim outline-none focus:border-neon-cyan/50"
            />
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => onSave(doc)}
                disabled={busy}
                className="rounded-lg border border-neon-cyan/40 px-4 py-1.5 text-sm text-neon-cyan-core transition-colors hover:bg-neon-cyan/15 disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => onDelete(doc._id)}
                disabled={busy}
                className="rounded-lg border border-white/15 px-4 py-1.5 text-sm text-fg-muted transition-colors hover:border-neon-magenta/50 hover:text-neon-magenta disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
