"use client";

import { useState } from "react";
import { profile } from "@/lib/data/profile";

/**
 * v1 contact: a real, accessible form that composes a prefilled mailto
 * on submit — zero backend, zero secrets. A Server Action + Resend
 * upgrade is documented for later (needs an API key in Vercel env).
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry — ${name || "hello"}`);
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` (${email})` : ""}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="cf-name" className="label mb-2 block text-fg-muted">
          Name
        </label>
        <input
          id="cf-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-raised/50 px-4 py-3.5 text-fg outline-none transition-colors focus:border-white/35"
        />
      </div>
      <div>
        <label htmlFor="cf-email" className="label mb-2 block text-fg-muted">
          Email
        </label>
        <input
          id="cf-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-raised/50 px-4 py-3.5 text-fg outline-none transition-colors focus:border-white/35"
        />
      </div>
      <div>
        <label htmlFor="cf-message" className="label mb-2 block text-fg-muted">
          Message
        </label>
        <textarea
          id="cf-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-xl border border-white/10 bg-raised/50 px-4 py-3.5 text-fg outline-none transition-colors focus:border-white/35"
        />
      </div>
      <button
        type="submit"
        className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-fg transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
      >
        {sent ? "Opening mail client…" : "Transmit"}
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
      {sent ? (
        <p role="status" className="label text-neon-lime">
          Signal sent — finish in your mail app.
        </p>
      ) : null}
    </form>
  );
}
