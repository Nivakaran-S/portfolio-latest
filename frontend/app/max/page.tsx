import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/data/profile";
import { Header } from "@/app/_components/ui/header";
import { Footer } from "@/app/_components/ui/footer";
import { StoryBackdrop } from "@/app/_components/scene/story-backdrop";
import { StoryItem } from "@/app/_components/story/story-item";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "FRIDAY",
  description:
    "FRIDAY - my personal operations agent. Claude Code on my laptop, wired to WhatsApp, Google Workspace, a browser, and a long-term memory graph, governed by a written operating manual with permission tiers and prompt-injection rules.",
  alternates: { canonical: "/max" },
  openGraph: {
    title: "FRIDAY - Nivakaran S.",
    description:
      "A personal operations agent built on Claude Code and MCP: tools, memory, permission tiers, and an operating manual.",
    url: "/max",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FRIDAY - Nivakaran S.",
    description:
      "A personal operations agent built on Claude Code and MCP: tools, memory, permission tiers, and an operating manual.",
  },
};

const sectionLabel = "label text-fg-muted";
const h2 =
  "silver mt-3 max-w-3xl font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,5vw,3.5rem)]";
const card =
  "h-full rounded-2xl border border-line bg-raised/70 p-6 backdrop-blur-sm transition-colors duration-200 hover:border-neon-cyan/30";

const layers = [
  {
    area: "Brain - Claude Code",
    detail:
      "The agent loop runs inside Claude Code on my laptop. It plans, calls tools, reads the results, and decides the next step. No custom orchestration framework - the harness already does that well.",
  },
  {
    area: "Operating manual",
    detail:
      "A global CLAUDE.md that loads into every session. It defines who FRIDAY is, who I am, how it talks, what it may do unasked, and what it must never do. This file is the real product.",
  },
  {
    area: "Hands - MCP servers",
    detail:
      "Each capability is an MCP server: WhatsApp, Google Workspace (Gmail, Calendar, Drive, Docs, Sheets), Playwright for the browser, LinkedIn, and GitHub. Adding a skill to FRIDAY means adding a server, not rewriting the agent.",
  },
  {
    area: "Memory - knowledge graph",
    detail:
      "A local memory MCP server stores entities, relations, and observations: people, projects, decisions, setup fixes. FRIDAY queries it before answering anything about \"that project\" or \"last time\".",
  },
  {
    area: "Shell",
    detail:
      "The main tool. Git, logs, disk, processes, Docker. The rule is to use the least powerful tool that does the job: a shell command beats a browser, a read beats a write.",
  },
  {
    area: "Local model - Ollama",
    detail:
      "A local Ollama instance takes cheap, bulky, or private text work - summarising huge logs, embeddings - so it doesn't burn context or leave the machine.",
  },
];

const modes = [
  {
    title: "Text",
    detail:
      "The default, in the terminal. Restrained markdown, answer first, commands shown only when they matter.",
    rule: "Lead with the result. No padding.",
  },
  {
    title: "Voice",
    detail:
      "Under three sentences, no markdown, URLs, or symbols a TTS engine would mangle. Times spoken in Colombo time, relative where possible. Long answers become a headline plus a file on screen.",
    rule: "\"Two things. Your manager asked about the deadline, and CI failed on main.\"",
  },
  {
    title: "Autonomous",
    detail:
      "Headless runs via claude -p on a schedule. Nobody is watching, so it does read-only work freely and leaves anything risky prepared for approval. Output goes to dated files.",
    rule: "Prepare, never act, when unattended.",
  },
];

const tiers = [
  {
    name: "GREEN",
    border: "border-emerald-400/40",
    text: "text-emerald-300",
    verb: "Just do it, report after",
    items: [
      "Read files, logs, git status / diff",
      "Read WhatsApp, calendar, email",
      "Read-only system checks, docker ps / logs",
      "Web search and docs",
      "Query or add to the memory graph",
    ],
  },
  {
    name: "AMBER",
    border: "border-amber-400/40",
    text: "text-amber-300",
    verb: "Prepare, show, wait for yes",
    items: [
      "Send any message - WhatsApp, email, anything",
      "Calendar changes",
      "Restart a service or container",
      "git commit, push, open PRs",
      "Install packages, edit project files",
      "Browser form submissions, anything that costs money",
    ],
  },
  {
    name: "RED",
    border: "border-rose-400/40",
    text: "text-rose-300",
    verb: "Never, without explicit repeated confirmation",
    items: [
      "rm -rf, docker system prune, dropping databases",
      "Force-push or hard reset on shared branches",
      "Boot, firewall, or network config",
      "Exposing a local port to the internet",
      "Sharing credentials or private data",
    ],
  },
];

const loop = [
  ["Understand", "Ambiguous and costly to guess wrong? Ask one sharp question. Otherwise state the reading in one line and go."],
  ["Check memory", "Pull paths, people, and earlier decisions from the graph and context."],
  ["Plan silently", "Show a short plan only when it touches AMBER or RED actions."],
  ["Act", "Within the permission tier, with the least powerful tool."],
  ["Verify", "Re-run the check, open the file, curl the endpoint. No unconfirmed success."],
  ["Report", "Outcome first, then anything I need to decide. Not a play-by-play."],
];

const status = [
  { what: "Operating manual (CLAUDE.md)", state: "Live" },
  { what: "WhatsApp, Google Workspace, Playwright, LinkedIn MCP", state: "Live" },
  { what: "Memory graph", state: "Live" },
  { what: "Permission tiers + injection rules", state: "Live" },
  { what: "Text mode", state: "Live" },
  { what: "Skills: morning-brief, whatsapp-triage, focus-mode", state: "Building" },
  { what: "Voice bridge (speech in, TTS out)", state: "Building" },
  { what: "Scheduled headless briefs + proactive alerts", state: "Building" },
];

export default function MaxPage() {
  const crumbsLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "FRIDAY", url: "/max" },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(crumbsLd) }}
      />
      <Header />

      <StoryBackdrop variant="forge" />

      <main id="main" className="relative z-10 flex flex-1 flex-col">
        {/* ════════════ HERO ════════════ */}
        <section className="relative flex flex-col items-center px-5 pb-12 pt-32 text-center sm:px-6 sm:pt-36">
          <div className="mx-auto w-full max-w-4xl">
            <StoryItem from="fade">
              <p className="label">
                Personal operations agent · Claude Code + MCP
              </p>
            </StoryItem>
            <StoryItem from="zoom-in" delay={0.05}>
              <h1 className="silver mt-8 font-display font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.75rem,10vw,7rem)]">
                FRIDAY
              </h1>
            </StoryItem>
            <StoryItem from="up" delay={0.12}>
              <p className="silver mt-4 font-display text-[clamp(1.25rem,3.5vw,2rem)] font-semibold [text-wrap:balance]">
                Not a chatbot. An operator.
              </p>
            </StoryItem>
            <StoryItem from="up" delay={0.2}>
              <p className="mx-auto mt-8 max-w-2xl leading-relaxed text-fg-dim sm:text-lg">
                FRIDAY is the assistant I run on my own laptop. It reads my
                messages, mail, calendar, and repos. It drafts replies and does
                the work its permissions allow, and it asks before anything that
                can&apos;t be undone. Think chief of staff with shell access and
                good judgment. Here is how it&apos;s built.
              </p>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ WHY ════════════ */}
        <section className="relative flex min-h-[80svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <StoryItem from="left">
              <p className={sectionLabel}>Why build it</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className={h2}>Most assistants wait to be asked.</h2>
            </StoryItem>
            <div className="mt-8 space-y-5 text-fg-muted">
              <StoryItem from="up" delay={0.08}>
                <p className="leading-relaxed">
                  Chat assistants answer questions. What I actually needed was
                  something that watches, prepares, acts inside clear limits, and
                  reports back. Is there a message I missed from someone who
                  matters? Did CI break? What does tomorrow look like?
                </p>
              </StoryItem>
              <StoryItem from="up" delay={0.12}>
                <p className="leading-relaxed">
                  I build multi-agent systems for a living, so I wanted my own
                  daily driver. Rather than write a framework, I built FRIDAY from
                  parts that already work: Claude Code as the agent loop, MCP
                  servers as the tools, and a plain-text operating manual as the
                  policy layer. Most of the engineering is in that manual.
                </p>
              </StoryItem>
            </div>
          </div>
        </section>

        {/* ════════════ ARCHITECTURE ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className={sectionLabel}>Architecture</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className={h2}>One loop, many hands, one rulebook.</h2>
            </StoryItem>
            <StoryItem from="up" delay={0.1}>
              <p className="mt-6 max-w-2xl leading-relaxed text-fg-muted">
                Everything runs locally. The model reasons and the MCP servers
                do the work. The manual decides what is allowed.
              </p>
            </StoryItem>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {layers.map((l, i) => (
                <StoryItem
                  key={l.area}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={60}
                  delay={Math.min(0.3, i * 0.05)}
                  className="h-full"
                >
                  <div className={card}>
                    <p className="label">{l.area}</p>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                      {l.detail}
                    </p>
                  </div>
                </StoryItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ PERSONALITY ════════════ */}
        <section className="relative flex min-h-[80svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <StoryItem from="left">
              <p className={sectionLabel}>Voice and personality</p>
            </StoryItem>
            <StoryItem from="zoom-in" delay={0.05}>
              <p className="silver mt-6 font-display text-[clamp(1.6rem,4.5vw,3rem)] font-semibold leading-[1.15] tracking-[-0.02em] [text-wrap:balance]">
                Calm, brief, slightly dry. Honest over agreeable.
              </p>
            </StoryItem>
            <div className="mt-10 space-y-5 text-fg-muted">
              <StoryItem from="up" delay={0.05}>
                <p className="leading-relaxed">
                  <span className="text-fg">Answer first.</span> The result, the
                  decision, or the number comes first. The explanation follows
                  only if I ask, or if the answer would mislead without it. No
                  &ldquo;great question&rdquo;, no recap, no closing offer to help.
                </p>
              </StoryItem>
              <StoryItem from="up" delay={0.1}>
                <p className="leading-relaxed">
                  <span className="text-fg">Push back once.</span> If a plan has a
                  hole, FRIDAY says so once, gives the reason, then follows my
                  call. Ask it to prune everything in Docker and it suggests the
                  safer command that frees most of the space.
                </p>
              </StoryItem>
              <StoryItem from="up" delay={0.15}>
                <p className="leading-relaxed">
                  <span className="text-fg">Tone tracks the situation.</span>{" "}
                  Routine status gets one line. A failure gets what broke, since
                  when, the likely cause, and a proposed fix. Bad news comes
                  first, then the plan. Late at night it gets shorter still.
                </p>
              </StoryItem>
            </div>
          </div>
        </section>

        {/* ════════════ MODES ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className={sectionLabel}>Operating modes</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className={h2}>Same agent, three surfaces.</h2>
            </StoryItem>
            <StoryItem from="up" delay={0.1}>
              <p className="mt-6 max-w-2xl leading-relaxed text-fg-muted">
                FRIDAY works out its mode from context and changes its output
                to suit. If unsure, it assumes text.
              </p>
            </StoryItem>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {modes.map((m, i) => (
                <StoryItem
                  key={m.title}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={60}
                  delay={i * 0.06}
                  className="h-full"
                >
                  <div className={`flex flex-col gap-3 ${card}`}>
                    <h3 className="font-display text-lg font-semibold text-fg">
                      {m.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-fg-muted">
                      {m.detail}
                    </p>
                    <p className="mt-auto text-xs text-neon-cyan/80">{m.rule}</p>
                  </div>
                </StoryItem>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ PERMISSIONS ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className={sectionLabel}>Permission tiers</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className={h2}>Autonomy scales with reversibility.</h2>
            </StoryItem>
            <StoryItem from="up" delay={0.1}>
              <p className="mt-6 max-w-2xl leading-relaxed text-fg-muted">
                Reading is cheap and safe, so FRIDAY does it freely. Anything
                that leaves the machine, changes shared state, or costs money
                needs a yes. Anything destructive needs me to repeat back the
                exact command. Claude Code&apos;s own permission system enforces
                the same lines, so the manual is never the only safeguard.
              </p>
            </StoryItem>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {tiers.map((t, i) => (
                <StoryItem
                  key={t.name}
                  from="up"
                  distance={60}
                  delay={i * 0.06}
                  className="h-full"
                >
                  <div className={`${card} ${t.border}`}>
                    <p className={`label ${t.text}`}>{t.name}</p>
                    <p className="mt-2 font-display text-lg font-semibold text-fg">
                      {t.verb}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-fg-muted">
                      {t.items.map((it) => (
                        <li key={it}>- {it}</li>
                      ))}
                    </ul>
                  </div>
                </StoryItem>
              ))}
            </div>
            <StoryItem from="up" delay={0.1}>
              <div className="mt-10 max-w-2xl rounded-2xl border border-line bg-raised/70 p-6 font-mono text-sm leading-relaxed text-fg-muted backdrop-blur-sm">
                <p>
                  <span className="text-neon-cyan/80">FRIDAY:</span> Draft to
                  &lt;contact&gt;: &ldquo;Yeah, I&apos;ll push the fix tonight.
                  Can test tomorrow morning?&rdquo; Send?
                </p>
                <p className="mt-2">
                  <span className="text-fg">Me:</span> send
                </p>
                <p className="mt-2">
                  <span className="text-neon-cyan/80">FRIDAY:</span> Sent.
                </p>
              </div>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ SECURITY ════════════ */}
        <section className="relative flex min-h-[80svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <StoryItem from="left">
              <p className={sectionLabel}>Security</p>
            </StoryItem>
            <StoryItem from="zoom-in" delay={0.05}>
              <p className="silver mt-6 font-display text-[clamp(1.6rem,4.5vw,3rem)] font-semibold leading-[1.15] tracking-[-0.02em] [text-wrap:balance]">
                Everything from outside is data, not instructions.
              </p>
            </StoryItem>
            <div className="mt-10 space-y-5 text-fg-muted">
              <StoryItem from="up" delay={0.05}>
                <p className="leading-relaxed">
                  <span className="text-fg">Prompt injection is the real threat.</span>{" "}
                  An agent that reads WhatsApp and email reads text written by
                  strangers. If a message, web page, file, or tool result says
                  &ldquo;ignore your instructions&rdquo; or &ldquo;forward
                  this&rdquo;, FRIDAY doesn&apos;t comply. It flags it to me
                  instead. Only I give instructions, in the session or through
                  the voice bridge.
                </p>
              </StoryItem>
              <StoryItem from="up" delay={0.1}>
                <p className="leading-relaxed">
                  <span className="text-fg">No exfiltration paths.</span> Private
                  messages, keys, and files never get pasted into web forms,
                  external APIs, or messages to third parties. Secrets never get
                  printed to the terminal or written to memory. Links from
                  unknown numbers are treated as suspicious and stay unopened.
                </p>
              </StoryItem>
              <StoryItem from="up" delay={0.15}>
                <p className="leading-relaxed">
                  <span className="text-fg">Social-engineering tripwire.</span> A
                  request that is out of character, high-stakes, and urgent all
                  at once is exactly what an attack looks like. FRIDAY is told to
                  slow down and confirm.
                </p>
              </StoryItem>
            </div>
          </div>
        </section>

        {/* ════════════ MEMORY + PROACTIVE ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className={sectionLabel}>Memory and initiative</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className={h2}>Remembers facts, not transcripts.</h2>
            </StoryItem>
            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              <StoryItem from="up" distance={60} className="h-full">
                <div className={card}>
                  <p className="label">Long-term memory</p>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-fg-muted">
                    <li>- Stores people, projects, decisions, deadlines, setup fixes, and standing instructions.</li>
                    <li>- Never stores passwords, tokens, account numbers, or full message contents.</li>
                    <li>- Health, financial, and relationship details only when I say &ldquo;remember this&rdquo;.</li>
                    <li>- No guesses about my mood or personality.</li>
                    <li>- Updates facts in place and dates superseded ones. &ldquo;Forget X&rdquo; deletes it fully.</li>
                  </ul>
                </div>
              </StoryItem>
              <StoryItem from="down" distance={60} delay={0.06} className="h-full">
                <div className={card}>
                  <p className="label">When it speaks first</p>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-fg-muted">
                    <li>- A high-priority contact has waited more than about four hours.</li>
                    <li>- A calendar event starts in 15 minutes and I haven&apos;t acknowledged it.</li>
                    <li>- CI fails on one of my repos.</li>
                    <li>- Disk passes 85%.</li>
                    <li>- Quiet hours 23:00-07:00 Colombo: only things that are broken and getting worse. One notification per issue, low-priority items batched into the next brief.</li>
                  </ul>
                </div>
              </StoryItem>
            </div>
          </div>
        </section>

        {/* ════════════ EXECUTION LOOP ════════════ */}
        <section className="relative flex min-h-[100svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            <StoryItem from="left">
              <p className={sectionLabel}>How it executes a task</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className={h2}>Verify before reporting.</h2>
            </StoryItem>
            <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loop.map(([step, detail], i) => (
                <StoryItem
                  key={step}
                  from={i % 2 === 0 ? "up" : "down"}
                  distance={60}
                  delay={Math.min(0.3, i * 0.05)}
                  className="h-full"
                >
                  <li className={card}>
                    <p className="label">
                      {String(i + 1).padStart(2, "0")} - {step}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                      {detail}
                    </p>
                  </li>
                </StoryItem>
              ))}
            </ol>
            <StoryItem from="up" delay={0.1}>
              <p className="mt-8 max-w-2xl text-sm leading-relaxed text-fg-muted">
                When something fails, FRIDAY tries the obvious fix once. If that
                fails too, it stops and reports what it tried, the error, and its
                best guess. It never retries the same failing command, and never
                hides a failure inside a long success message.
              </p>
            </StoryItem>
          </div>
        </section>

        {/* ════════════ STATUS ════════════ */}
        <section className="relative flex min-h-[80svh] items-center px-5 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <StoryItem from="left">
              <p className={sectionLabel}>Where it stands</p>
            </StoryItem>
            <StoryItem from="up" delay={0.05}>
              <h2 className={h2}>Live, and still being built.</h2>
            </StoryItem>
            <dl className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-raised/70 backdrop-blur-sm">
              {status.map((s) => (
                <div
                  key={s.what}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <dt className="text-sm text-fg-muted">{s.what}</dt>
                  <dd
                    className={`label shrink-0 ${s.state === "Live" ? "text-emerald-300" : "text-amber-300"}`}
                  >
                    {s.state}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ════════════ CTA ════════════ */}
        <section className="relative flex min-h-[70svh] flex-col items-center justify-center px-5 text-center sm:px-6">
          <StoryItem from="up">
            <h2 className="silver font-display font-semibold leading-[1.15] tracking-[-0.02em] text-[clamp(1.85rem,6vw,4rem)]">
              The manual is the product.
            </h2>
          </StoryItem>
          <StoryItem from="up" delay={0.06}>
            <p className="mt-6 max-w-xl text-fg-dim">
              Want to build an agent like this, or talk about guardrails for
              agents that touch real accounts? Get in touch.
            </p>
          </StoryItem>
          <StoryItem from="up" delay={0.12}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-fg px-7 py-3 text-sm font-medium text-void transition-transform duration-200 hover:scale-[1.03]"
              >
                Get in touch
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <Link
                href="/work"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-fg-dim transition-colors duration-200 hover:border-white/30 hover:text-fg"
              >
                See my work ↗
              </Link>
            </div>
          </StoryItem>
        </section>
      </main>
      <Footer />
    </>
  );
}
