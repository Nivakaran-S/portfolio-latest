"use client";

import { useEffect, useRef, useState } from "react";
import { sendChat, isChatConfigured, type ChatTurn } from "@/lib/api";
import { useContactDrawer } from "@/app/_components/contact/contact-drawer";

interface Msg {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const SUGGESTIONS = [
  "What's his healthcare experience?",
  "What AI projects has he built?",
  "What's his tech stack?",
  "Is he open to work?",
];

const AMBER_GRADIENT =
  "linear-gradient(135deg, var(--color-neon-cyan-core), var(--color-neon-violet))";

/** Max's gradient "M" avatar. */
function MaxAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim =
    size === "lg"
      ? "h-14 w-14 text-2xl"
      : size === "sm"
        ? "h-7 w-7 text-xs"
        : "h-9 w-9 text-sm";
  return (
    <span
      aria-hidden="true"
      className={`${dim} flex shrink-0 items-center justify-center rounded-full font-display font-bold text-void ring-1 ring-white/10`}
      style={{ background: AMBER_GRADIENT }}
    >
      M
    </span>
  );
}

export function ChatWidget() {
  const configured = isChatConfigured();
  const contact = useContactDrawer();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(id);
    };
  }, [open]);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || loading || !configured) return;
    const history: ChatTurn[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await sendChat(q, history);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: res.answer, sources: res.sources },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I couldn't reach the assistant just now. You can still reach Nivakaran directly via the contact options.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <>
      {/* launcher - the name "Max" at the bottom-right */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Chat with Max"
        aria-hidden={open}
        className={`group fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-full border border-line bg-raised/80 py-2 pl-2 pr-5 shadow-[0_12px_36px_-10px_rgba(245,158,11,0.45)] backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-neon-cyan/40 hover:bg-elevated ${
          open
            ? "pointer-events-none translate-y-2 scale-90 opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        }`}
      >
        <span className="relative">
          <MaxAvatar size="md" />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-raised bg-neon-lime" />
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="font-display text-sm font-semibold tracking-tight text-fg">
            Max
          </span>
          <span className="label text-fg-muted transition-colors group-hover:text-neon-cyan">
            Ask me anything
          </span>
        </span>
      </button>

      {/* panel - grows out of the bottom-right corner toward the top-left */}
      <div
        role="dialog"
        aria-label="Chat with Max"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={`glass fixed bottom-5 right-5 z-[71] flex h-[72svh] max-h-[620px] w-[calc(100vw-2.5rem)] max-w-[24.5rem] origin-bottom-right flex-col overflow-hidden rounded-[1.75rem] border border-line shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-0 opacity-0"
        }`}
      >
        {/* top accent */}
        <div
          aria-hidden="true"
          className="h-0.5 w-full shrink-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-neon-cyan), transparent)",
          }}
        />

        {/* header (with a soft warm glow behind it) */}
        <div className="relative flex items-center justify-between px-5 py-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(80% 140% at 18% 0%, rgba(245,158,11,0.12), transparent 70%)",
            }}
          />
          <div className="relative flex items-center gap-3">
            <span className="relative">
              <MaxAvatar size="md" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-base bg-neon-lime" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold leading-tight text-fg">
                Max
              </p>
              <p className="label mt-0.5 text-fg-muted">
                {configured ? "AI concierge · replies instantly" : "Setting up"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-fg-muted transition-colors hover:border-white/30 hover:text-fg"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="h-px w-full shrink-0 bg-line/60" />

        {/* messages */}
        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* designed welcome (empty + configured) */}
          {empty && configured ? (
            <div className="animate-msg-in flex flex-col items-center pt-4 text-center">
              <MaxAvatar size="lg" />
              <p className="silver mt-4 font-display text-xl font-semibold tracking-tight">
                Hi, I&apos;m Max
              </p>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-fg-muted">
                Nivakaran&apos;s AI concierge. Ask me about his experience,
                projects, healthcare work, or skills.
              </p>
              <div className="mt-6 w-full space-y-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="group flex w-full items-center justify-between gap-2 rounded-xl border border-line bg-raised/60 px-4 py-2.5 text-left text-sm text-fg-dim transition-colors hover:border-neon-cyan/40 hover:bg-elevated hover:text-fg"
                  >
                    {s}
                    <span className="text-fg-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-neon-cyan">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* conversation */}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="animate-msg-in flex justify-end">
                <div className="max-w-[82%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-neon-cyan/15 px-4 py-2.5 text-sm leading-relaxed text-fg ring-1 ring-neon-cyan/30">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="animate-msg-in flex gap-2.5">
                <MaxAvatar size="sm" />
                <div className="flex max-w-[82%] flex-col gap-1.5">
                  <div className="whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-raised/80 px-4 py-2.5 text-sm leading-relaxed text-fg-dim">
                    {m.content}
                  </div>
                  {m.sources && m.sources.length ? (
                    <p className="label pl-1 text-fg-muted">
                      Sources: {m.sources.slice(0, 3).join(" · ")}
                    </p>
                  ) : null}
                </div>
              </div>
            )
          )}

          {loading ? (
            <div className="animate-msg-in flex gap-2.5">
              <MaxAvatar size="sm" />
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-raised/80 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-fg-muted" />
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-fg-muted [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-fg-muted [animation-delay:300ms]" />
              </div>
            </div>
          ) : null}

          {/* offline notice */}
          {!configured ? (
            <div className="flex flex-col items-center pt-4 text-center">
              <MaxAvatar size="lg" />
              <p className="silver mt-4 font-display text-xl font-semibold tracking-tight">
                Max is almost ready
              </p>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-fg-muted">
                The assistant isn&apos;t live yet. In the meantime, reach
                Nivakaran directly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  contact.open();
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-neon-cyan/15 px-5 py-2.5 text-sm font-medium text-neon-cyan-core ring-1 ring-neon-cyan/40 transition-colors hover:bg-neon-cyan/25"
              >
                Get in touch
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* composer */}
        {configured ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-line/60 bg-base/40 p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask Max…"
              className="min-w-0 flex-1 rounded-full border border-line bg-void/60 px-4 py-2.5 text-sm text-fg outline-none transition-all placeholder:text-fg-muted focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-void shadow-[0_4px_14px_-4px_rgba(245,158,11,0.6)] transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              style={{ background: AMBER_GRADIENT }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        ) : null}
      </div>
    </>
  );
}
