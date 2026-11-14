# Cinematic Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every route a cinematic film layer (grain, vignette, letterbox, light leaks, scene cuts, title-card intro) and add two lazy-loaded WebGL set pieces (hero light field, warp tunnel) on the home route for capable desktops.

**Architecture:** A capability-tier decision (`static` | `css` | `webgl`) made once on the client, exposed through a `CinemaProvider` context. A fixed, pointer-transparent `FilmLayer` is mounted in the root layout and driven by CSS plus a `data-letterbox` attribute on `<html>`. One shared WebGL canvas (single renderer, two layers) is loaded only on the `webgl` tier, after first paint, through a client wrapper that uses `next/dynamic` with `ssr: false`.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19.2.4, `motion` 12, Tailwind v4, plain `three` (named imports only, hand-written GLSL), `node:test` for pure-logic tests (Node 26 strips TypeScript natively).

**Spec:** `docs/superpowers/specs/2026-11-14-cinematic-foundation-design.md`

All commands run from `C:\Users\LENOVO\Desktop\Portfolio\portfolio-latest\frontend` unless stated. Commit messages carry **no** `Co-Authored-By` trailer (standing user rule).

## Global Constraints

- Next.js 16.2.6: `ssr: false` with `next/dynamic` is **not allowed in Server Components**; `app/page.tsx` is one, so the loader lives in a `"use client"` wrapper.
- `html` keeps `overflow-x: clip` (never `hidden`); the film layer adds no overflow and no new scroll container.
- Film-layer effects use only `transform` and `opacity`; nothing triggers layout.
- Grain: tiling noise (~1-2 KB data URI), stepped at 8 fps, opacity about 0.05, off in `static`.
- Tier rules: `static` = `prefers-reduced-motion` or `saveData`; `css` = coarse pointer, no WebGL2, `hardwareConcurrency < 6`, or `deviceMemory < 4`; `webgl` otherwise. Tier starts as `css` on server and first client render.
- Runtime downgrade: median frame time over the first 2 s above 24 ms downgrades `webgl` to `css`, and never upgrades back.
- three.js: plain three, **named imports only**, no react-three-fiber; DPR capped at 1.5; loaded only on `webgl` tier, after first paint, via `requestIdleCallback` with a timeout fallback.
- Both WebGL scenes: render only while their section is in view, pause when the tab is hidden, dispose geometry/materials/renderer on unmount, handle `webglcontextlost`, and fall back to the CSS `StoryBackdrop` on any failure.
- Title card: about 2.4 s, first visit per session only (`sessionStorage`), skippable by click/key/scroll, never on `static`, never on a direct deep link to a non-home route; the hero `h1` stays in the DOM at first paint.
- Stacking: film layer above page content and below the header (`z-50`), chat (`z-[70]`) and contact drawer (`z-[80]`).
- Home first-load JS stays within +25 KB gzip of today; three.js is a separate async chunk absent from the `css`/`static` tiers.
- No change to content copy, data files, SEO metadata or JSON-LD.

## Review Focus

Failure modes the spec implies but a happy-path build would not exercise, most likely first. Each is pinned to the task that owns the code.

1. **`sessionStorage` blocked or throwing** (Safari private mode, storage disabled): the intro must silently not play, never throw. Pinned in Task 1 (`hasSeenIntro` test).
2. **Deep link to `/work/<slug>` or any non-home route**: no intro, and the session is marked seen so it will not replay on the later trip home. Pinned in Task 1 (`shouldShowIntro` test).
3. **Slow GPU / fewer than 60 frame samples**: no downgrade on too little data; downgrade when the median exceeds 24 ms. Pinned in Task 1 (`isFrameBudgetExceeded` tests).
4. **WebGL context lost mid-session or the three.js chunk fails to load**: scenes unmount, tier drops to `css`, no console error, hero returns to its black stage. Pinned in Task 6 (`.catch` on the dynamic import) and Task 8 (forced context-loss check in a real browser).
5. **Fast scrolling across several scene cuts**: letterbox pulses are throttled so bars never flicker. Pinned in Task 1 (`shouldPulse` test).
6. **`prefers-reduced-motion` toggled at runtime**: the tier recomputes to `static`; the dev-only `?cinema=` override must never apply in production builds. Pinned in Task 2 (provider listener, `NODE_ENV` gate) and Task 1 (`decideTier` test).

---

## File Structure

New:
- `lib/cinema/tier.ts`: pure tier decision, override parsing, frame-budget check.
- `lib/cinema/timing.ts`: pure intro/pulse rules.
- `lib/cinema/motion.ts`: pure move-start table for the motion vocabulary.
- `lib/cinema/math.ts`: pure `clamp01`, `smoothstep`.
- `lib/cinema/*.test.ts`: `node:test` suites for the four modules above.
- `app/_components/cinema/cinema-provider.tsx`: context, tier detection, letterbox control, frame reporting, `useCinema`, `useCinemaTier`. (The spec listed a separate `use-cinema-tier.ts`; folded in to avoid a circular import between hook and context.)
- `app/_components/cinema/film-layer.tsx`: grain, vignette, light leaks, sweep, letterbox bars.
- `app/_components/cinema/title-card.tsx`: first-visit intro overlay.
- `app/_components/cinema/scene-cut.tsx`: scroll sentinel that pulses the letterbox.
- `app/_components/cinema/webgl/engine.ts`: renderer, loop, resize, context-loss, dispose.
- `app/_components/cinema/webgl/shaders.ts`: GLSL strings.
- `app/_components/cinema/webgl/hero-layer.ts`, `warp-layer.ts`: the two scenes.
- `app/_components/cinema/webgl/cinema-canvas.tsx`: React host for the shared canvas.
- `app/_components/cinema/webgl/lazy-scenes.tsx`: `"use client"` gate and dynamic loader.
- `app/template.tsx`: cross-page fade and letterbox pulse.

Modified: `package.json`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/_components/story/depth-item.tsx`, `app/_components/scene/story-backdrop.tsx`, `app/_components/hero/hero.tsx`.

**Deliberate deviations from the spec (flag in review):**
- `Reveal` is not given a `cinema` prop: it wraps `StoryItem` (a one-shot fade), not a scroll-scrubbed transform, so the move vocabulary does not apply. Only `DepthItem` gets it.
- The route transition is opacity-only plus a letterbox pulse, not a push-in: a persistent `transform` on a wrapper becomes the containing block for the fixed header and backdrops.
- Letterbox bars sit at `z-[55]` (above the header, below chat and drawer) because the solid header would otherwise hide the top bar entirely.
- The warp-tunnel open decision is resolved as a **shared canvas** (one renderer, two layers): one WebGL context instead of two.

---

### Task 1: Pure cinema logic and test harness

**Files:**
- Create: `lib/cinema/tier.ts`, `lib/cinema/timing.ts`, `lib/cinema/math.ts`
- Test: `lib/cinema/tier.test.ts`, `lib/cinema/timing.test.ts`, `lib/cinema/math.test.ts`
- Modify: `package.json` (add `test` script), `tsconfig.json` (allow `.ts` import extensions)

**Interfaces:**
- Produces (`tier.ts`):
  - `type CinemaTier = "static" | "css" | "webgl"`
  - `interface TierSignals { reducedMotion: boolean; saveData: boolean; coarsePointer: boolean; hasWebGL2: boolean; hardwareConcurrency?: number; deviceMemory?: number; override?: CinemaTier | null }`
  - `decideTier(s: TierSignals): CinemaTier`
  - `parseOverride(raw: string | null): CinemaTier | null`
  - `median(values: number[]): number`
  - `const FRAME_SAMPLES_NEEDED = 60`
  - `isFrameBudgetExceeded(samples: number[], maxMedianMs?: number): boolean` (default 24)
- Produces (`timing.ts`):
  - `shouldPulse(now: number, last: number, minGapMs?: number): boolean` (default 1500)
  - `shouldShowIntro(i: { tier: CinemaTier; pathname: string; seen: boolean }): boolean`
  - `hasSeenIntro(getStorage: () => Pick<Storage, "getItem">): boolean`
  - `const INTRO_KEY = "cinema:intro"`
- Produces (`math.ts`): `clamp01(x: number): number`, `smoothstep(e0: number, e1: number, x: number): number`

- [ ] **Step 1: Enable `.ts` import extensions and add the test script**

In `tsconfig.json`, add `"allowImportingTsExtensions": true,` inside `compilerOptions` (directly after `"noEmit": true,`). It is legal because `noEmit` is already true.

In `package.json`, add to `scripts`:

```json
    "test": "node --test \"lib/**/*.test.ts\"",
```

- [ ] **Step 2: Write the failing tests**

`lib/cinema/tier.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decideTier,
  parseOverride,
  median,
  isFrameBudgetExceeded,
  FRAME_SAMPLES_NEEDED,
  type TierSignals,
} from "./tier.ts";

const capable: TierSignals = {
  reducedMotion: false,
  saveData: false,
  coarsePointer: false,
  hasWebGL2: true,
  hardwareConcurrency: 8,
  deviceMemory: 8,
};

test("capable desktop gets webgl", () => {
  assert.equal(decideTier(capable), "webgl");
});

test("unknown cores and memory still get webgl (Safari/Firefox hide them)", () => {
  assert.equal(
    decideTier({ ...capable, hardwareConcurrency: undefined, deviceMemory: undefined }),
    "webgl",
  );
});

test("reduced motion and saveData force static", () => {
  assert.equal(decideTier({ ...capable, reducedMotion: true }), "static");
  assert.equal(decideTier({ ...capable, saveData: true }), "static");
});

test("touch, no WebGL2, few cores or low memory fall to css", () => {
  assert.equal(decideTier({ ...capable, coarsePointer: true }), "css");
  assert.equal(decideTier({ ...capable, hasWebGL2: false }), "css");
  assert.equal(decideTier({ ...capable, hardwareConcurrency: 4 }), "css");
  assert.equal(decideTier({ ...capable, deviceMemory: 2 }), "css");
});

test("reduced motion beats capability", () => {
  assert.equal(decideTier({ ...capable, reducedMotion: true, coarsePointer: false }), "static");
});

test("override wins over everything", () => {
  assert.equal(decideTier({ ...capable, reducedMotion: true, override: "webgl" }), "webgl");
  assert.equal(decideTier({ ...capable, override: "css" }), "css");
});

test("parseOverride accepts only the three tiers", () => {
  assert.equal(parseOverride("css"), "css");
  assert.equal(parseOverride("webgl"), "webgl");
  assert.equal(parseOverride("static"), "static");
  assert.equal(parseOverride("nonsense"), null);
  assert.equal(parseOverride(null), null);
});

test("median of odd, even and empty input", () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(median([]), 0);
});

test("frame budget: too few samples never downgrades", () => {
  const slow = Array.from({ length: FRAME_SAMPLES_NEEDED - 1 }, () => 100);
  assert.equal(isFrameBudgetExceeded(slow), false);
});

test("frame budget: median over 24ms downgrades, at or under does not", () => {
  const slow = Array.from({ length: FRAME_SAMPLES_NEEDED }, () => 30);
  const edge = Array.from({ length: FRAME_SAMPLES_NEEDED }, () => 24);
  const fast = Array.from({ length: FRAME_SAMPLES_NEEDED }, () => 16.7);
  assert.equal(isFrameBudgetExceeded(slow), true);
  assert.equal(isFrameBudgetExceeded(edge), false);
  assert.equal(isFrameBudgetExceeded(fast), false);
});

test("frame budget: a few spikes do not trip the median", () => {
  const mostlyFast = Array.from({ length: FRAME_SAMPLES_NEEDED }, (_, i) => (i < 5 ? 120 : 16.7));
  assert.equal(isFrameBudgetExceeded(mostlyFast), false);
});
```

`lib/cinema/timing.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldPulse, shouldShowIntro, hasSeenIntro, INTRO_KEY } from "./timing.ts";

test("pulses closer than the min gap are ignored", () => {
  assert.equal(shouldPulse(1000, 0), false);
  assert.equal(shouldPulse(1499, 0), false);
  assert.equal(shouldPulse(1500, 0), true);
});

test("the very first pulse always fires", () => {
  assert.equal(shouldPulse(5, -Infinity), true);
});

test("intro plays only on first home visit with motion allowed", () => {
  assert.equal(shouldShowIntro({ tier: "css", pathname: "/", seen: false }), true);
  assert.equal(shouldShowIntro({ tier: "webgl", pathname: "/", seen: false }), true);
});

test("intro never plays on static, repeat visits, or deep links", () => {
  assert.equal(shouldShowIntro({ tier: "static", pathname: "/", seen: false }), false);
  assert.equal(shouldShowIntro({ tier: "css", pathname: "/", seen: true }), false);
  assert.equal(shouldShowIntro({ tier: "css", pathname: "/work/medverse", seen: false }), false);
});

test("hasSeenIntro reads the flag", () => {
  assert.equal(hasSeenIntro(() => ({ getItem: (k: string) => (k === INTRO_KEY ? "1" : null) })), true);
  assert.equal(hasSeenIntro(() => ({ getItem: () => null })), false);
});

test("hasSeenIntro treats blocked or throwing storage as seen (no intro, no throw)", () => {
  assert.equal(
    hasSeenIntro(() => {
      throw new DOMException("denied", "SecurityError");
    }),
    true,
  );
  assert.equal(
    hasSeenIntro(() => ({
      getItem: () => {
        throw new Error("boom");
      },
    })),
    true,
  );
});
```

`lib/cinema/math.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { clamp01, smoothstep } from "./math.ts";

test("clamp01 bounds its input", () => {
  assert.equal(clamp01(-3), 0);
  assert.equal(clamp01(0.4), 0.4);
  assert.equal(clamp01(9), 1);
});

test("smoothstep is 0 below, 1 above, and 0.5 at the midpoint", () => {
  assert.equal(smoothstep(0, 1, -1), 0);
  assert.equal(smoothstep(0, 1, 2), 1);
  assert.equal(smoothstep(0, 1, 0.5), 0.5);
});

test("smoothstep works for a reversed edge pair", () => {
  assert.equal(smoothstep(1, 0, 0.5), 0.5);
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `./tier.ts`, `./timing.ts`, `./math.ts`.

- [ ] **Step 4: Implement the modules**

`lib/cinema/tier.ts`:

```ts
export type CinemaTier = "static" | "css" | "webgl";

export interface TierSignals {
  reducedMotion: boolean;
  saveData: boolean;
  coarsePointer: boolean;
  hasWebGL2: boolean;
  /** Undefined where the browser hides it (Safari, Firefox). */
  hardwareConcurrency?: number;
  /** Undefined where the browser hides it. */
  deviceMemory?: number;
  /** Dev-only manual override. */
  override?: CinemaTier | null;
}

export function decideTier(s: TierSignals): CinemaTier {
  if (s.override) return s.override;
  if (s.reducedMotion || s.saveData) return "static";
  if (s.coarsePointer || !s.hasWebGL2) return "css";
  if (s.hardwareConcurrency !== undefined && s.hardwareConcurrency < 6) return "css";
  if (s.deviceMemory !== undefined && s.deviceMemory < 4) return "css";
  return "webgl";
}

export function parseOverride(raw: string | null): CinemaTier | null {
  return raw === "static" || raw === "css" || raw === "webgl" ? raw : null;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** About two seconds of frames at 30-60 fps. */
export const FRAME_SAMPLES_NEEDED = 60;

export function isFrameBudgetExceeded(samples: number[], maxMedianMs = 24): boolean {
  if (samples.length < FRAME_SAMPLES_NEEDED) return false;
  return median(samples) > maxMedianMs;
}
```

`lib/cinema/timing.ts`:

```ts
import type { CinemaTier } from "./tier.ts";

export const INTRO_KEY = "cinema:intro";

/** Ignore letterbox pulses that follow another too closely, so fast scrolling never flickers the bars. */
export function shouldPulse(now: number, last: number, minGapMs = 1500): boolean {
  return now - last >= minGapMs;
}

export function shouldShowIntro(i: { tier: CinemaTier; pathname: string; seen: boolean }): boolean {
  return i.tier !== "static" && i.pathname === "/" && !i.seen;
}

/** Blocked or throwing storage counts as "seen": no intro, no exception. */
export function hasSeenIntro(getStorage: () => Pick<Storage, "getItem">): boolean {
  try {
    return getStorage().getItem(INTRO_KEY) === "1";
  } catch {
    return true;
  }
}
```

`lib/cinema/math.ts`:

```ts
export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/** GLSL-style smoothstep; works with reversed edges. */
export function smoothstep(e0: number, e1: number, x: number): number {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, all tests green, 0 failures.

- [ ] **Step 6: Typecheck and commit**

Run: `npx tsc --noEmit`
Expected: no errors.

```bash
git add package.json tsconfig.json lib/cinema
git commit -m "feat(cinema): add tier, timing and math logic with node:test suites"
```

---

### Task 2: Cinema provider and root wiring

**Files:**
- Create: `app/_components/cinema/cinema-provider.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `decideTier`, `parseOverride`, `isFrameBudgetExceeded`, `FRAME_SAMPLES_NEEDED`, `CinemaTier`, `TierSignals` from `@/lib/cinema/tier`; `shouldPulse` from `@/lib/cinema/timing`.
- Produces:
  - `interface CinemaContextValue { tier: CinemaTier; ready: boolean; setLetterbox(on: boolean): void; pulseLetterbox(ms?: number): void; reportFrameTime(ms: number): void; downgrade(): void }`
  - `CinemaProvider({ children })`, `useCinema(): CinemaContextValue`, `useCinemaTier(): CinemaTier`
  - Side effects on `<html>`: `data-cinema-tier="static|css|webgl"`, `data-letterbox="on"` (attribute absent when off).

- [ ] **Step 1: Write the provider**

`app/_components/cinema/cinema-provider.tsx`:

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  decideTier,
  isFrameBudgetExceeded,
  parseOverride,
  FRAME_SAMPLES_NEEDED,
  type CinemaTier,
  type TierSignals,
} from "@/lib/cinema/tier";
import { shouldPulse } from "@/lib/cinema/timing";

export interface CinemaContextValue {
  tier: CinemaTier;
  /** False until the client has read the device signals; gate one-off effects on it. */
  ready: boolean;
  setLetterbox(on: boolean): void;
  pulseLetterbox(ms?: number): void;
  reportFrameTime(ms: number): void;
  downgrade(): void;
}

const CinemaContext = createContext<CinemaContextValue>({
  tier: "css",
  ready: false,
  setLetterbox() {},
  pulseLetterbox() {},
  reportFrameTime() {},
  downgrade() {},
});

/** Probe once and release the context immediately so it does not count against the browser's limit. */
function detectWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function readSignals(hasWebGL2: boolean): TierSignals {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData === true,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    hasWebGL2,
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    // Manual override is a dev tool only; production builds never honour it.
    override:
      process.env.NODE_ENV !== "production"
        ? parseOverride(new URLSearchParams(window.location.search).get("cinema"))
        : null,
  };
}

function setHtmlFlag(name: string, value: string | null) {
  const el = document.documentElement;
  if (value === null) el.removeAttribute(name);
  else el.setAttribute(name, value);
}

export function CinemaProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<CinemaTier>("css");
  const [ready, setReady] = useState(false);
  const downgraded = useRef(false);
  const samples = useRef<number[]>([]);
  const lastPulse = useRef(-Infinity);
  const pulseTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const hasWebGL2 = detectWebGL2();
    const compute = () => {
      let next = decideTier(readSignals(hasWebGL2));
      if (downgraded.current && next === "webgl") next = "css";
      setTier(next);
      setReady(true);
    };
    compute();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", compute);
    return () => mq.removeEventListener("change", compute);
  }, []);

  useEffect(() => {
    setHtmlFlag("data-cinema-tier", tier);
  }, [tier]);

  const setLetterbox = useCallback((on: boolean) => {
    setHtmlFlag("data-letterbox", on ? "on" : null);
  }, []);

  const pulseLetterbox = useCallback(
    (ms = 900) => {
      const now = performance.now();
      if (!shouldPulse(now, lastPulse.current)) return;
      lastPulse.current = now;
      setLetterbox(true);
      window.clearTimeout(pulseTimer.current);
      pulseTimer.current = window.setTimeout(() => setLetterbox(false), ms);
    },
    [setLetterbox],
  );

  const downgrade = useCallback(() => {
    downgraded.current = true;
    samples.current = [];
    setTier((t) => (t === "webgl" ? "css" : t));
  }, []);

  const reportFrameTime = useCallback(
    (ms: number) => {
      const s = samples.current;
      if (s.length >= FRAME_SAMPLES_NEEDED * 2) return; // only judge the first ~2 s
      s.push(ms);
      if (s.length === FRAME_SAMPLES_NEEDED && isFrameBudgetExceeded(s)) downgrade();
    },
    [downgrade],
  );

  const value = useMemo<CinemaContextValue>(
    () => ({ tier, ready, setLetterbox, pulseLetterbox, reportFrameTime, downgrade }),
    [tier, ready, setLetterbox, pulseLetterbox, reportFrameTime, downgrade],
  );

  return <CinemaContext.Provider value={value}>{children}</CinemaContext.Provider>;
}

export function useCinema(): CinemaContextValue {
  return useContext(CinemaContext);
}

export function useCinemaTier(): CinemaTier {
  return useContext(CinemaContext).tier;
}
```

- [ ] **Step 2: Mount the provider in the root layout**

In `app/layout.tsx` add the import next to the other component imports:

```tsx
import { CinemaProvider } from "@/app/_components/cinema/cinema-provider";
```

Replace the `MotionProvider` block so `CinemaProvider` sits inside it and wraps the drawer provider:

```tsx
        <MotionProvider>
          <CinemaProvider>
            <ContactDrawerProvider>
              {children}
              <ChatWidget />
            </ContactDrawerProvider>
          </CinemaProvider>
        </MotionProvider>
```

- [ ] **Step 3: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: no errors. If the `react-hooks` lint rule objects to `setTier`/`setReady` inside `compute()`, keep the call routed through the `compute` function exactly as written (it mirrors `usePrefersReducedMotion`); do not disable the rule file-wide.

Run: `npm run dev` (background), open `http://localhost:3000/?cinema=webgl`, and in the console run `document.documentElement.dataset.cinemaTier`.
Expected: `"webgl"`. Without the query on a normal desktop it is `"webgl"` or `"css"` per device; with OS reduced motion on it is `"static"`.

- [ ] **Step 4: Commit**

```bash
git add app/_components/cinema/cinema-provider.tsx app/layout.tsx
git commit -m "feat(cinema): add capability-tier provider and mount it in the root layout"
```

---

### Task 3: Film layer

**Files:**
- Create: `app/_components/cinema/film-layer.tsx`
- Modify: `app/globals.css` (append a cinema block before the "Accessibility safety nets" section), `app/layout.tsx`

**Interfaces:**
- Consumes: `data-cinema-tier` and `data-letterbox` flags on `<html>` set by Task 2.
- Produces: `FilmLayer()` component; CSS classes `.cine-root`, `.cine-grain`, `.cine-vignette`, `.cine-leak`, `.cine-sweep`, `.cine-bars`, `.cine-bar`.

- [ ] **Step 1: Add the CSS**

In `app/globals.css`, insert immediately above the comment block that begins `/*  Accessibility safety nets */`:

```css
/* ------------------------------------------------------------------ */
/*  Cinema film layer (transform + opacity only)                       */
/* ------------------------------------------------------------------ */

.cine-root {
  contain: strict;
}

/* Tiling noise, jittered in 8 discrete steps per second (film-like). */
.cine-grain {
  position: absolute;
  inset: -50%;
  opacity: 0.055;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  animation: cine-grain 1s steps(1) infinite;
  will-change: transform;
}
@keyframes cine-grain {
  0% { transform: translate3d(0, 0, 0); }
  12.5% { transform: translate3d(-5%, -8%, 0); }
  25% { transform: translate3d(-12%, 4%, 0); }
  37.5% { transform: translate3d(7%, -14%, 0); }
  50% { transform: translate3d(-4%, 14%, 0); }
  62.5% { transform: translate3d(-14%, 6%, 0); }
  75% { transform: translate3d(13%, 0, 0); }
  87.5% { transform: translate3d(2%, 11%, 0); }
}

.cine-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 100% at 50% 50%, transparent 62%, rgba(0, 0, 0, 0.42) 100%);
}

/* Soft amber light leaks drifting with scroll. Gradients, not blur filters, so they stay cheap. */
.cine-leak {
  position: absolute;
  width: 70vmax;
  height: 70vmax;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.13), transparent 65%);
}

/* A slow amber sweep that plays whenever the letterbox closes. */
.cine-sweep {
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 35%, rgba(251, 191, 36, 0.1) 50%, transparent 65%);
  transform: translateX(-120%);
}
html[data-letterbox="on"] .cine-sweep {
  animation: cine-sweep 1.1s var(--ease-out-soft) both;
}
@keyframes cine-sweep {
  from { transform: translateX(-120%); }
  to { transform: translateX(120%); }
}

/* Letterbox bars sit above the header (z-55) but below chat and the drawer. */
.cine-bar {
  position: absolute;
  left: 0;
  right: 0;
  height: 4svh;
  background: #000;
  transform: scaleY(0);
  transition: transform 0.7s var(--ease-out-soft);
}
.cine-bar-top { top: 0; transform-origin: top; }
.cine-bar-bottom { bottom: 0; transform-origin: bottom; }
html[data-letterbox="on"] .cine-bar { transform: scaleY(1); }

[data-cinema-tier="static"] .cine-grain,
[data-cinema-tier="static"] .cine-leak,
[data-cinema-tier="static"] .cine-sweep,
[data-cinema-tier="static"] .cine-bars {
  display: none;
}

@media print {
  .cine-root,
  .cine-bars {
    display: none;
  }
}
```

- [ ] **Step 2: Write the component**

`app/_components/cinema/film-layer.tsx`:

```tsx
"use client";

import { motion, useScroll, useTransform } from "motion/react";

/**
 * Persistent film look: grain, vignette, scroll-driven light leaks, a sweep
 * and letterbox bars. Fixed, pointer-transparent, transform/opacity only.
 * Sits above page content (z-30) and below the header (z-50). The bars get
 * their own container at z-55 so the top bar is not hidden by the solid header.
 */
export function FilmLayer() {
  const { scrollYProgress } = useScroll();
  const leakAY = useTransform(scrollYProgress, [0, 1], ["-10%", "-55%"]);
  const leakBY = useTransform(scrollYProgress, [0, 1], ["35%", "80%"]);

  return (
    <>
      <div aria-hidden="true" className="cine-root pointer-events-none fixed inset-0 z-30 overflow-hidden">
        <motion.div className="cine-leak -left-[20vmax] top-0" style={{ y: leakAY }} />
        <motion.div className="cine-leak -right-[25vmax] top-0" style={{ y: leakBY }} />
        <div className="cine-sweep" />
        <div className="cine-vignette" />
        <div className="cine-grain" />
      </div>
      <div aria-hidden="true" className="cine-bars pointer-events-none fixed inset-0 z-[55]">
        <div className="cine-bar cine-bar-top" />
        <div className="cine-bar cine-bar-bottom" />
      </div>
    </>
  );
}
```

- [ ] **Step 3: Mount it**

In `app/layout.tsx` add `import { FilmLayer } from "@/app/_components/cinema/film-layer";` and render `<FilmLayer />` as the first child inside `<CinemaProvider>`:

```tsx
          <CinemaProvider>
            <FilmLayer />
            <ContactDrawerProvider>
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: clean.

With the dev server up, open `/`, then run in the console `document.documentElement.setAttribute('data-letterbox','on')`.
Expected: black bars slide in top and bottom, an amber sweep crosses the screen; removing the attribute retracts them. Grain is faintly visible on flat dark areas. Open `/?cinema=static`: no grain, bars or leaks, vignette only. Header, chat button and contact drawer remain clickable and above the grain.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/_components/cinema/film-layer.tsx app/layout.tsx
git commit -m "feat(cinema): add film layer with grain, vignette, light leaks and letterbox bars"
```

---

### Task 4: Motion vocabulary on DepthItem

**Files:**
- Create: `lib/cinema/motion.ts`
- Test: `lib/cinema/motion.test.ts`
- Modify: `app/_components/story/depth-item.tsx`

**Interfaces:**
- Consumes: `CinemaTier` from `lib/cinema/tier.ts`; `useCinemaTier` from `app/_components/cinema/cinema-provider`.
- Produces:
  - `type CinemaMove = "dolly" | "pushIn" | "rackFocus" | "whipPan"`
  - `interface MoveStart { x: number; y: number; scale: number; blur: number }`
  - `moveStart(move: CinemaMove, distance: number, tier: CinemaTier): MoveStart` (the transform each element starts from; it settles to identity)
  - `DepthItem` gains an optional `cinema?: CinemaMove` prop. When set it replaces `from`.

- [ ] **Step 1: Write the failing test**

`lib/cinema/motion.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { moveStart } from "./motion.ts";

test("static tier never moves", () => {
  for (const m of ["dolly", "pushIn", "rackFocus", "whipPan"] as const) {
    assert.deepEqual(moveStart(m, 80, "static"), { x: 0, y: 0, scale: 1, blur: 0 });
  }
});

test("blur is webgl-only; css tier keeps the transform", () => {
  const css = moveStart("rackFocus", 80, "css");
  const gl = moveStart("rackFocus", 80, "webgl");
  assert.equal(css.blur, 0);
  assert.ok(gl.blur > 0);
  assert.equal(css.scale, gl.scale);
});

test("pushIn starts oversized, dolly starts small and low", () => {
  assert.ok(moveStart("pushIn", 80, "css").scale > 1);
  const d = moveStart("dolly", 80, "css");
  assert.ok(d.scale < 1);
  assert.ok(d.y > 0);
});

test("whipPan travels sideways, scaled by distance", () => {
  assert.equal(moveStart("whipPan", 100, "css").x, 220);
  assert.equal(moveStart("whipPan", 50, "css").x, 110);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `ERR_MODULE_NOT_FOUND` for `./motion.ts`.

- [ ] **Step 3: Implement `motion.ts`**

`lib/cinema/motion.ts`:

```ts
import type { CinemaTier } from "./tier.ts";

export type CinemaMove = "dolly" | "pushIn" | "rackFocus" | "whipPan";

export interface MoveStart {
  x: number;
  y: number;
  scale: number;
  /** Gaussian blur radius in px at the start of the move. */
  blur: number;
}

/**
 * Where a scroll-scrubbed element starts before settling to identity.
 * Blur is expensive, so only the webgl tier (capable desktops) gets it;
 * the css tier keeps the transform half of each move.
 */
export function moveStart(move: CinemaMove, distance: number, tier: CinemaTier): MoveStart {
  if (tier === "static") return { x: 0, y: 0, scale: 1, blur: 0 };
  const base: Record<CinemaMove, MoveStart> = {
    dolly: { x: 0, y: distance * 0.6, scale: 0.9, blur: 0 },
    pushIn: { x: 0, y: 0, scale: 1.14, blur: 0 },
    rackFocus: { x: 0, y: distance * 0.2, scale: 1.04, blur: 12 },
    whipPan: { x: distance * 2.2, y: 0, scale: 1, blur: 10 },
  };
  const s = base[move];
  return { ...s, blur: tier === "webgl" ? s.blur : 0 };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Add the `cinema` prop to `DepthItem`**

In `app/_components/story/depth-item.tsx`:

Add imports:

```tsx
import { useCinemaTier } from "@/app/_components/cinema/cinema-provider";
import { moveStart, type CinemaMove } from "@/lib/cinema/motion";
```

Add to `DepthItemProps`:

```tsx
  /** Named camera move; when set it replaces `from`. */
  cinema?: CinemaMove;
```

Add `cinema,` to the destructured props, and replace the body from `const o = OFFSET[from];` through the `return` with:

```tsx
  const tier = useCinemaTier();
  const o = OFFSET[from];
  const cm = cinema ? moveStart(cinema, distance, tier) : null;
  const k = reduced ? 0 : 1;
  const start = Math.min(0.5, Math.max(0, delay));
  const range = [start, 0.92];

  const x = useTransform(scrollYProgress, range, [(cm ? cm.x : (o.x ?? 0) * distance) * k, 0]);
  const y = useTransform(scrollYProgress, range, [(cm ? cm.y : (o.y ?? 0) * distance) * k, 0]);
  const scale = useTransform(scrollYProgress, range, [
    cm ? 1 + (cm.scale - 1) * k : 1 + (o.z ?? 0) * 0.16 * k,
    1,
  ]);
  const blur = useTransform(scrollYProgress, range, [(cm ? cm.blur : 0) * k, 0]);
  const filter = useTransform(blur, (v) => (v < 0.2 ? "none" : `blur(${v}px)`));

  return (
    <motion.div
      ref={ref}
      className={className}
      style={cm ? { x, y, scale, filter } : { x, y, scale }}
    >
      {children}
    </motion.div>
  );
```

Update the doc comment's last sentence to: `Reduced motion: no travel. An optional named camera move (cinema) swaps the entry for a push-in, dolly, rack-focus or whip-pan.`

- [ ] **Step 6: Verify and commit**

Run: `npm test && npm run lint && npx tsc --noEmit`
Expected: all green.

```bash
git add lib/cinema/motion.ts lib/cinema/motion.test.ts app/_components/story/depth-item.tsx
git commit -m "feat(cinema): add named camera moves to DepthItem"
```

---

### Task 5: Title card, scene cuts and route transition

**Files:**
- Create: `app/_components/cinema/title-card.tsx`, `app/_components/cinema/scene-cut.tsx`, `app/template.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `useCinema()` (`tier`, `ready`, `setLetterbox`, `pulseLetterbox`) from Task 2; `shouldShowIntro`, `hasSeenIntro`, `INTRO_KEY` from `@/lib/cinema/timing`; `profile.name` from `@/lib/data/profile`.
- Produces: `TitleCard()`, `SceneCut()` (no props), default-export `Template` in `app/template.tsx`.

- [ ] **Step 1: Write the title card**

`app/_components/cinema/title-card.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/lib/data/profile";
import { hasSeenIntro, shouldShowIntro, INTRO_KEY } from "@/lib/cinema/timing";
import { useCinema } from "./cinema-provider";

const DURATION_MS = 2400;

function markSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* storage blocked: nothing to persist */
  }
}

/**
 * First-visit title card. An overlay only: the hero h1 is already in the DOM,
 * so this never delays LCP or hides content from crawlers. It decides once,
 * after the tier is known, and marks the session seen on any first landing so
 * a deep link does not trigger it on a later trip home.
 */
export function TitleCard() {
  const { tier, ready, setLetterbox } = useCinema();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const decided = useRef(false);

  useEffect(() => {
    if (!ready || decided.current) return;
    decided.current = true;
    const show = shouldShowIntro({
      tier,
      pathname,
      seen: hasSeenIntro(() => sessionStorage),
    });
    markSeen();
    if (show) setVisible(true);
  }, [ready, tier, pathname]);

  useEffect(() => {
    if (!visible) return;
    setLetterbox(true);
    const close = () => {
      setVisible(false);
      setLetterbox(false);
    };
    const timer = window.setTimeout(close, DURATION_MS);
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, close, { once: true, passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, close));
      setLetterbox(false);
    };
  }, [visible, setLetterbox]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="title-card"
          aria-hidden="true"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black px-5 text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        >
          <motion.p
            className="label text-fg-muted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            A film by
          </motion.p>
          <motion.h2
            className="mt-4 font-display font-semibold uppercase text-fg text-[clamp(1.25rem,4.2vw,3rem)]"
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.32em" }}
            transition={{ delay: 0.45, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {profile.name}
          </motion.h2>
          <motion.span
            className="mt-8 h-px w-[min(60vw,28rem)] origin-center bg-gradient-to-r from-transparent via-neon-cyan-core to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 1.2 }}
          />
          <p className="label mt-10 text-fg-disabled">Scroll, tap or press any key to skip</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Write the scene cut**

`app/_components/cinema/scene-cut.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useCinema } from "./cinema-provider";

/**
 * A 1px sentinel placed between story beats. When it crosses the middle of
 * the viewport it pulses the letterbox (throttled by the provider), which
 * reads as a cut between scenes. Renders nothing on the static tier.
 */
export function SceneCut() {
  const ref = useRef<HTMLDivElement>(null);
  const { tier, pulseLetterbox } = useCinema();

  useEffect(() => {
    const el = ref.current;
    if (!el || tier === "static") return;
    let first = true; // the observer's initial callback is not a crossing
    const io = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          return;
        }
        if (entry.isIntersecting) pulseLetterbox();
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [tier, pulseLetterbox]);

  if (tier === "static") return null;
  return <div ref={ref} aria-hidden="true" className="h-px w-full" />;
}
```

- [ ] **Step 3: Write the route template**

`app/template.tsx`:

```tsx
"use client";

import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { useCinema } from "@/app/_components/cinema/cinema-provider";

// Module state: false on the server and on first client render, so the very
// first paint is never faded (content must never wait on JS). Flips true after
// the first mount; every later navigation remounts the template and fades in.
let mountedOnce = false;

/**
 * Cross-page cut: a short fade plus a letterbox pulse. Opacity only: a
 * persistent transform here would become the containing block for the fixed
 * header and backdrops. The wrapper keeps the body's flex chain intact.
 */
export default function Template({ children }: { children: ReactNode }) {
  const { tier, pulseLetterbox } = useCinema();
  const fadeIn = mountedOnce && tier !== "static";

  useEffect(() => {
    if (mountedOnce) pulseLetterbox(700);
    mountedOnce = true;
  }, [pulseLetterbox]);

  return (
    <motion.div
      className="flex flex-1 flex-col"
      initial={fadeIn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Mount the title card**

In `app/layout.tsx` add `import { TitleCard } from "@/app/_components/cinema/title-card";` and render it after `<FilmLayer />`:

```tsx
            <FilmLayer />
            <TitleCard />
```

- [ ] **Step 5: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: clean.

Dev server, fresh incognito window (no session flag):
- `/` plays a ~2.4 s title card with bars closing, then fades into the hero; clicking or pressing a key skips it.
- Reload the same tab: no intro.
- New incognito window directly on `/work`: no intro; then navigate home: still no intro.
- `/?cinema=static` in a fresh window: no intro.
- Navigate home to `/work` via the header: a brief fade and a letterbox pulse; header stays fixed and the page layout is unchanged (footer still sits at the bottom).

- [ ] **Step 6: Commit**

```bash
git add app/_components/cinema/title-card.tsx app/_components/cinema/scene-cut.tsx app/template.tsx app/layout.tsx
git commit -m "feat(cinema): add title-card intro, scene cuts and route transition"
```

---

### Task 6: WebGL set pieces (hero light field and warp tunnel)

**Files:**
- Create: `app/_components/cinema/webgl/shaders.ts`, `engine.ts`, `hero-layer.ts`, `warp-layer.ts`, `cinema-canvas.tsx`, `lazy-scenes.tsx`
- Modify: `package.json`/`package-lock.json` (via npm), `app/_components/scene/story-backdrop.tsx`, `app/_components/hero/hero.tsx`

**Interfaces:**
- Consumes: `useCinema()` (`tier`, `reportFrameTime`, `downgrade`); `clamp01`, `smoothstep` from `@/lib/cinema/math`.
- Produces:
  - `interface FrameState { time: number; dt: number; scrollY: number; viewportH: number; pointer: { x: number; y: number } }`
  - `interface Layer { scene: Scene; camera: PerspectiveCamera; update(s: FrameState): boolean; resize(w: number, h: number): void; dispose(): void }` (`update` returns whether the layer should draw this frame)
  - `createEngine(canvas, layers, hooks: { onFrameTime(ms: number): void; onFail(): void }): { dispose(): void }`
  - `createHeroLayer(): Layer`, `createWarpLayer(section: HTMLElement): Layer`
  - `CinemaCanvas({ warpId }: { warpId: string })` (default export), `LazyScenes({ warpId }: { warpId: string })`

- [ ] **Step 1: Install three.js**

Run: `npm install three && npm install -D @types/three`
Expected: both added to `package.json`; `npm ls three` lists one version.

- [ ] **Step 2: Shaders**

`app/_components/cinema/webgl/shaders.ts`:

```ts
/** Drifting dust and embers with depth-of-field bokeh. */
export const HERO_POINTS_VERT = /* glsl */ `
uniform float uTime;
uniform float uFocus;
uniform float uPixelRatio;
attribute float aSeed;
varying float vAlpha;
varying float vHeat;
void main() {
  vec3 p = position;
  p.y = mod(position.y + 5.0 + uTime * (0.15 + aSeed * 0.3), 10.0) - 5.0;
  p.x += sin(uTime * 0.2 + aSeed * 40.0) * 0.35;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float dist = max(-mv.z, 0.01);
  float coc = abs(dist - uFocus);
  gl_PointSize = (1.5 + coc * 3.0 + aSeed * 3.0) * uPixelRatio * (8.0 / max(dist, 0.5));
  vAlpha = clamp(1.0 / (1.0 + coc * 0.6), 0.08, 1.0) * smoothstep(0.0, 2.0, dist);
  vHeat = aSeed;
  gl_Position = projectionMatrix * mv;
}
`;

export const HERO_POINTS_FRAG = /* glsl */ `
varying float vAlpha;
varying float vHeat;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float disc = smoothstep(0.5, 0.35, d);
  vec3 col = mix(vec3(0.85, 0.45, 0.05), vec3(1.0, 0.78, 0.25), vHeat);
  gl_FragColor = vec4(col, disc * vAlpha * 0.55);
}
`;

/** Volumetric light cone falling from above and behind the portrait. */
export const RAYS_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const RAYS_FRAG = /* glsl */ `
uniform float uTime;
uniform float uProgress;
varying vec2 vUv;
void main() {
  vec2 d = vUv - vec2(0.5, 1.05);
  float ang = atan(d.x, -d.y);
  float r = length(d);
  float cone = smoothstep(0.65, 0.0, abs(ang));
  float fall = smoothstep(1.25, 0.0, r);
  float rays = 0.5 + 0.5 * sin(ang * 14.0 + uTime * 0.15) * sin(ang * 5.0 - uTime * 0.07);
  float a = cone * fall * (0.55 + 0.45 * rays) * 0.32 * (1.0 - uProgress * 0.8);
  gl_FragColor = vec4(vec3(1.0, 0.72, 0.22) * a, a);
}
`;

/** Light streaks rushing at the camera. Each segment has a tail (aEnd = 0) and head (aEnd = 1). */
export const WARP_VERT = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform float uProgress;
attribute float aSeed;
attribute float aEnd;
attribute float aAngle;
attribute float aRadius;
varying float vAlpha;
void main() {
  float speed = 12.0 + aSeed * 18.0;
  float z = mod(aSeed * 60.0 + uProgress * speed * 6.0 + uTime * speed * 0.15 * uIntensity, 60.0) - 55.0;
  float len = 0.4 + uIntensity * 6.0 * (0.3 + aSeed);
  z += aEnd * len;
  vec3 p = vec3(cos(aAngle) * aRadius, sin(aAngle) * aRadius, z);
  vAlpha = uIntensity * aEnd * smoothstep(-55.0, -20.0, z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const WARP_FRAG = /* glsl */ `
varying float vAlpha;
void main() {
  vec3 col = mix(vec3(1.0, 0.55, 0.1), vec3(1.0, 0.9, 0.6), vAlpha);
  gl_FragColor = vec4(col, vAlpha);
}
`;
```

- [ ] **Step 3: Engine**

`app/_components/cinema/webgl/engine.ts`:

```ts
import { WebGLRenderer, type PerspectiveCamera, type Scene } from "three";

export interface FrameState {
  time: number;
  dt: number;
  scrollY: number;
  viewportH: number;
  /** Eased pointer position, -1..1 on both axes. */
  pointer: { x: number; y: number };
}

export interface Layer {
  scene: Scene;
  camera: PerspectiveCamera;
  /** Return true when this layer should draw this frame. */
  update(s: FrameState): boolean;
  resize(w: number, h: number): void;
  dispose(): void;
}

export interface EngineHooks {
  onFrameTime(ms: number): void;
  onFail(): void;
}

const MAX_DPR = 1.5;

/** One renderer, one loop, any number of layers. Throws if a context cannot be created. */
export function createEngine(
  canvas: HTMLCanvasElement,
  layers: Layer[],
  hooks: EngineHooks,
): { dispose(): void } {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;

  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let raf = 0;
  let last = performance.now();
  let shown = false;

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.setSize(w, h, false);
    layers.forEach((l) => l.resize(w, h));
  };

  const onPointer = (e: PointerEvent) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  const onLost = (e: Event) => {
    e.preventDefault();
    hooks.onFail();
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const rawMs = now - last;
    last = now;
    const dt = Math.min(0.1, rawMs / 1000);
    const k = Math.min(1, dt * 3);
    pointer.x += (target.x - pointer.x) * k;
    pointer.y += (target.y - pointer.y) * k;

    const state: FrameState = {
      time: now / 1000,
      dt,
      scrollY: window.scrollY,
      viewportH: window.innerHeight,
      pointer,
    };

    renderer.clear();
    let drew = false;
    for (const layer of layers) {
      if (layer.update(state)) {
        renderer.render(layer.scene, layer.camera);
        drew = true;
      }
    }
    if (drew !== shown) {
      shown = drew;
      canvas.style.opacity = drew ? "1" : "0";
    }
    // Only judge frames that did real work, and ignore the gap after a hidden tab.
    if (drew && rawMs < 200) hooks.onFrameTime(rawMs);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  canvas.addEventListener("webglcontextlost", onLost);
  raf = requestAnimationFrame(frame);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
      layers.forEach((l) => l.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
```

- [ ] **Step 4: Hero layer**

`app/_components/cinema/webgl/hero-layer.ts`:

```ts
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
} from "three";
import { clamp01 } from "@/lib/cinema/math";
import type { FrameState, Layer } from "./engine";
import { HERO_POINTS_FRAG, HERO_POINTS_VERT, RAYS_FRAG, RAYS_VERT } from "./shaders";

const COUNT = 6500;

/** Small deterministic PRNG so the field is identical every load. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Light field behind the pinned hero (230svh tall): the camera dollies forward as you scroll. */
export function createHeroLayer(): Layer {
  const scene = new Scene();
  const camera = new PerspectiveCamera(55, 1, 0.1, 60);
  camera.position.set(0, 0, 6);

  const rand = mulberry32(1337);
  const positions = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (rand() - 0.5) * 18;
    positions[i * 3 + 1] = (rand() - 0.5) * 10;
    positions[i * 3 + 2] = rand() * 15 - 12;
    seeds[i] = rand();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));

  const pointsMat = new ShaderMaterial({
    vertexShader: HERO_POINTS_VERT,
    fragmentShader: HERO_POINTS_FRAG,
    uniforms: { uTime: { value: 0 }, uFocus: { value: 4 }, uPixelRatio: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const points = new Points(geometry, pointsMat);
  points.frustumCulled = false;

  const raysGeo = new PlaneGeometry(2, 2);
  const raysMat = new ShaderMaterial({
    vertexShader: RAYS_VERT,
    fragmentShader: RAYS_FRAG,
    uniforms: { uTime: { value: 0 }, uProgress: { value: 0 } },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const rays = new Mesh(raysGeo, raysMat);
  rays.frustumCulled = false;
  rays.renderOrder = -1;

  scene.add(rays, points);

  return {
    scene,
    camera,
    update(s: FrameState) {
      if (s.scrollY > s.viewportH * 2.3) return false; // past the hero
      const p = clamp01(s.scrollY / (s.viewportH * 1.3));
      camera.position.set(s.pointer.x * 0.35, -s.pointer.y * 0.2, 6 - p * 5);
      camera.lookAt(0, 0, -5);
      pointsMat.uniforms.uTime.value = s.time;
      pointsMat.uniforms.uFocus.value = 4 - p * 1.5;
      raysMat.uniforms.uTime.value = s.time;
      raysMat.uniforms.uProgress.value = p;
      return true;
    },
    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      pointsMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 1.5);
    },
    dispose() {
      geometry.dispose();
      pointsMat.dispose();
      raysGeo.dispose();
      raysMat.dispose();
    },
  };
}
```

- [ ] **Step 5: Warp layer**

`app/_components/cinema/webgl/warp-layer.ts`:

```ts
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  LineSegments,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
} from "three";
import { smoothstep } from "@/lib/cinema/math";
import type { FrameState, Layer } from "./engine";
import { WARP_FRAG, WARP_VERT } from "./shaders";

const STREAKS = 1400;

/**
 * The jump into the work rail. Streaks of light rush at the camera while the
 * "Then it ships." section passes through the viewport, peaking mid-section and
 * fading out before the rail pins.
 */
export function createWarpLayer(section: HTMLElement): Layer {
  const scene = new Scene();
  const camera = new PerspectiveCamera(60, 1, 0.1, 80);

  const seed = new Float32Array(STREAKS * 2);
  const end = new Float32Array(STREAKS * 2);
  const angle = new Float32Array(STREAKS * 2);
  const radius = new Float32Array(STREAKS * 2);
  const position = new Float32Array(STREAKS * 2 * 3); // unused by the shader, required by three
  for (let i = 0; i < STREAKS; i++) {
    const s = (i * 0.61803398875) % 1;
    const a = ((i * 2.399963) % (Math.PI * 2));
    const r = 0.6 + ((i * 0.7548776662) % 1) * 6.4;
    for (let v = 0; v < 2; v++) {
      const k = i * 2 + v;
      seed[k] = s;
      end[k] = v;
      angle[k] = a;
      radius[k] = r;
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seed, 1));
  geometry.setAttribute("aEnd", new BufferAttribute(end, 1));
  geometry.setAttribute("aAngle", new BufferAttribute(angle, 1));
  geometry.setAttribute("aRadius", new BufferAttribute(radius, 1));

  const material = new ShaderMaterial({
    vertexShader: WARP_VERT,
    fragmentShader: WARP_FRAG,
    uniforms: { uTime: { value: 0 }, uIntensity: { value: 0 }, uProgress: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const lines = new LineSegments(geometry, material);
  lines.frustumCulled = false;
  scene.add(lines);

  return {
    scene,
    camera,
    update(s: FrameState) {
      const r = section.getBoundingClientRect();
      const p = (s.viewportH - r.top) / (r.height + s.viewportH); // 0 as it enters, 1 as it leaves
      if (p <= 0 || p >= 1) return false;
      material.uniforms.uTime.value = s.time;
      material.uniforms.uProgress.value = p;
      material.uniforms.uIntensity.value = smoothstep(0, 0.35, p) * (1 - smoothstep(0.75, 1, p));
      return true;
    },
    resize(w, h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
```

- [ ] **Step 6: Canvas host and lazy loader**

`app/_components/cinema/webgl/cinema-canvas.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useCinema } from "../cinema-provider";
import { createEngine, type Layer } from "./engine";
import { createHeroLayer } from "./hero-layer";
import { createWarpLayer } from "./warp-layer";

/**
 * The single shared WebGL canvas. Sits at z -5: above the CSS StoryBackdrop
 * (-z-10) and below page content. The engine fades it out whenever neither
 * scene is on screen. Any failure hands control back to the CSS tier.
 */
export default function CinemaCanvas({ warpId }: { warpId: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reportFrameTime, downgrade } = useCinema();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const warpEl = document.getElementById(warpId);
    const layers: Layer[] = [createHeroLayer(), ...(warpEl ? [createWarpLayer(warpEl)] : [])];
    try {
      const engine = createEngine(canvas, layers, { onFrameTime: reportFrameTime, onFail: downgrade });
      return () => engine.dispose();
    } catch {
      layers.forEach((l) => l.dispose());
      downgrade();
    }
  }, [warpId, reportFrameTime, downgrade]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-5] h-full w-full opacity-0 transition-opacity duration-500"
    />
  );
}
```

`app/_components/cinema/webgl/lazy-scenes.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCinema } from "../cinema-provider";

// ssr: false is only legal inside a Client Component, which is why this file exists.
// A failed chunk load resolves to an empty component: the CSS backdrop simply stays.
const CinemaCanvas = dynamic(
  () => import("./cinema-canvas").catch(() => ({ default: () => null })),
  { ssr: false },
);

/** Loads three.js only on the webgl tier, and only once the page is idle. */
export function LazyScenes({ warpId }: { warpId: string }) {
  const { tier } = useCinema();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (tier !== "webgl") return;
    const arm = () => setArmed(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(arm, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(arm, 1200);
    return () => window.clearTimeout(t);
  }, [tier]);

  if (tier !== "webgl" || !armed) return null;
  return <CinemaCanvas warpId={warpId} />;
}
```

- [ ] **Step 7: Hand the hero and backdrop over on the webgl tier**

In `app/_components/scene/story-backdrop.tsx`: add `import { useCinemaTier } from "@/app/_components/cinema/cinema-provider";`, add `const tier = useCinemaTier();` after `const reduced = useReducedMotion();`, and change the ember sparks wrapper:

```tsx
          {/* Sparks are desktop-only; the WebGL light field replaces them on the webgl tier. */}
          <motion.div
            className={`absolute inset-0 hidden ${tier === "webgl" ? "" : "sm:block"}`}
            style={near}
          >
```

(Replace the existing `<motion.div className="absolute inset-0 hidden sm:block" style={near}>` and its comment line.)

In `app/_components/hero/hero.tsx`: add `import { useCinemaTier } from "@/app/_components/cinema/cinema-provider";`, add `const tier = useCinemaTier();` after `const reduced = usePrefersReducedMotion();`, and replace the sticky container's `className` so the black stage becomes transparent while the light field shows through:

```tsx
        className={`sticky top-0 h-[100svh] overflow-hidden ${
          tier === "webgl"
            ? "bg-transparent"
            : "bg-[linear-gradient(to_bottom,#000_0%,#000_72%,transparent_100%)]"
        }`}
```

- [ ] **Step 8: Verify the build compiles**

Run: `npm run lint && npx tsc --noEmit`
Expected: clean. (The scenes are not mounted yet; Task 7 mounts `LazyScenes`.)

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json app/_components/cinema/webgl app/_components/scene/story-backdrop.tsx app/_components/hero/hero.tsx
git commit -m "feat(cinema): add shared WebGL canvas with hero light field and warp tunnel"
```

---

### Task 7: Wire the home page

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `SceneCut`, `LazyScenes`, `DepthItem` `cinema` prop.
- Produces: the section with `id="ships"` that the warp layer anchors to.

- [ ] **Step 1: Imports**

In `app/page.tsx` add:

```tsx
import { SceneCut } from "@/app/_components/cinema/scene-cut";
import { LazyScenes } from "@/app/_components/cinema/webgl/lazy-scenes";
```

- [ ] **Step 2: Give `Statement` an anchor id and a camera move**

Change the `Statement` signature and root so it accepts `id`:

```tsx
function Statement({
  id,
  kicker,
  children,
  sub,
}: {
  id?: string;
  kicker?: string;
  children: ReactNode;
  sub?: string;
}) {
  return (
    <section
      id={id}
      className="relative flex min-h-[90svh] flex-col items-center justify-center px-5 text-center sm:px-6"
    >
```

and on the big statement line change `<DepthItem from="up" delay={0.05}>` to `<DepthItem from="up" delay={0.05} cinema="rackFocus">`.

- [ ] **Step 3: Mount the scenes and place the cuts**

Right after `<StoryBackdrop variant="ember" />` add:

```tsx
      {/* WebGL light field + warp tunnel. Mounts only on the webgl tier, after idle. */}
      <LazyScenes warpId="ships" />
```

Add `<SceneCut />` as a sibling immediately before each of these existing blocks: the `BEAT 02 - THE DISCIPLINES` section, the `BEAT 04 - THE STACK` section, the `STATEMENT - IT SHIPS` `Statement`, the `BEAT 06 - BY THE NUMBERS` section, and the `BEAT 09 - THE INVITATION` section.

Change the "it ships" statement to carry the anchor id:

```tsx
        <Statement
          id="ships"
          kicker="A system is just a promise"
```

On the contact heading, change `<DepthItem from="up" delay={0.06}>` (the one wrapping "Now, let's build yours.") to `<DepthItem from="up" delay={0.06} cinema="pushIn">`.

- [ ] **Step 4: Verify**

Run: `npm run lint && npx tsc --noEmit`
Expected: clean.

Dev server at `http://localhost:3000/?cinema=webgl`: after about 1-2 s a canvas appears (`document.querySelector('canvas')` is non-null), drifting amber bokeh and a light cone sit behind the hero, the camera pushes forward as you scroll the hero, then the canvas fades. Scrolling into "Then it ships." shows light streaks that peak mid-section and fade before the work rail pins. The work rail still scrolls horizontally in step with the scroll.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat(cinema): wire scene cuts, camera moves and WebGL scenes into the home page"
```

---

### Task 8: Full verification

**Files:** none (read-only checks). Fix anything found in the task that owns it and re-run.

- [ ] **Step 1: Static checks and unit tests**

Run: `npm test && npm run lint && npx tsc --noEmit`
Expected: every test passes, lint and tsc clean.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds with no warnings about `ssr: false` in Server Components.

- [ ] **Step 3: Bundle split**

Run: `grep -rl "WebGLRenderer" .next/static/chunks | head`
Expected: exactly one or two chunk files.

Run: `grep -o 'static/chunks/[^"]*\.js' .next/server/app/index.html | sort -u` (use the prerendered home HTML under `.next/server/app/`) and confirm none of the files from the previous command appear in it.
Expected: the three.js chunk is **not** referenced by the home page's initial scripts; it is only fetched at runtime on the `webgl` tier.

Compare the home route's initial JS against the previous commit if there is any doubt: `git stash`-free approach is to build once on `main`~ (before Task 1) in a scratch worktree and diff the total gzip size of the initial chunks; the increase must be at most 25 KB gzip.

- [ ] **Step 4: Tier matrix in a real browser**

Run `npm run start` (production build) and use Playwright MCP at 1440x900:
- `/` (default desktop): `document.documentElement.dataset.cinemaTier` is `webgl` or `css`; no console errors or hydration warnings; screenshot the hero.
- Dev server `/?cinema=css`: film layer present, no `<canvas>`, hero has its black stage.
- Dev server `/?cinema=static`: no grain, bars or leaks, no intro.
- 375x812 viewport on `/`: tier is `css`, no `<canvas>`, no horizontal scroll (`document.documentElement.scrollWidth <= 375`).
- Emulated reduced motion (`browser_emulate_media`): tier `static`, content fully visible.

Expected: all as listed.

- [ ] **Step 5: Failure handling (Review Focus 4)**

On `/?cinema=webgl` in dev, once the canvas exists, run:

```js
document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()
```

Expected: within a frame the canvas unmounts, `document.documentElement.dataset.cinemaTier` becomes `css`, the hero shows its black stage, and the console shows no uncaught errors.

- [ ] **Step 6: Layout and behaviour regressions**

On `/`: the pinned hero still steps through its beats; the work rail still travels horizontally and releases at its end; header links, the chat button and the contact drawer are clickable and render above the grain; `/work`, `/about`, `/blog` load with the film layer, and navigating between them fades and pulses without moving the header or footer; `/blog/<slug>` still shows its `<title>` and JSON-LD.

- [ ] **Step 7: Frame-rate sanity**

On the dev machine with `/?cinema=webgl`, record a performance trace over 5 s of hero scroll, or sample `requestAnimationFrame` deltas in the console. Expected: median under about 22 ms; if it is higher the runtime downgrade should flip the tier to `css` by itself within about 2 s.

- [ ] **Step 8: Final commit (only if fixes were needed)**

```bash
git add -A
git commit -m "fix(cinema): address issues found during verification"
```
