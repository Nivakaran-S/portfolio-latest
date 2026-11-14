# Cinematic Foundation: Design

Sub-project 1 of 3. Sub-project 2 (WebGL set pieces) is folded in here per the
approved scope. Sub-project 3 (per-page scenes for About, Work, Research,
Events, Blog, Medverse, Max) gets its own spec after this ships.

## Intent

Make the portfolio feel like a film rather than a scroll deck, on every screen,
while staying a professional portfolio for recruiters and clients. Hybrid
approach: a CSS/motion film layer everywhere, plus two lazy-loaded WebGL set
pieces on the home route only.

**Audience:** unchanged. Recruiters, hiring managers and clients who must still
reach projects, stack and contact quickly.

**Success criteria**
- First-time visitors get a short, skippable title-card intro; return visitors do not.
- Every route shows the film layer (grain, vignette, letterbox, light) without layout shift.
- Home hero and the work transition are WebGL on capable desktops, CSS elsewhere.
- No regression in content, SEO metadata, JSON-LD, header, chat widget or contact drawer.
- Reduced-motion users get a static, fully usable site. Low-end devices never load three.js.
- Home route first-load JS stays within +25 KB gzip of today; three.js arrives only after first paint.

## What exists today (reuse, don't rebuild)

- `app/page.tsx` already tells a scroll story: Hero, Statement beats, WorkRail, stats, writing, contact.
- `scene/story-backdrop.tsx`: per-page CSS backdrop (`ember`, `forge`, `ink`, `origin`), mounted by each page.
- `hero/hero.tsx`: pinned hero driven by `scrollY`, with a reduced-motion static branch.
- `story/work-rail.tsx`: pinned horizontal rail, same reduced-motion pattern.
- `story/depth-item.tsx`, `ui/reveal.tsx`, `ui/parallax.tsx`: reveal primitives on `motion`.
- `providers/motion-config.tsx`: `MotionConfig reducedMotion="user"`.
- `lib/hooks/use-prefers-reduced-motion.ts`: hydration-safe reduced-motion hook.
- Design tokens in `globals.css`: zinc dark with an amber accent. The film palette stays inside this: warm amber light on near-black.

Known constraint: `html` uses `overflow-x: clip` (not `hidden`) so `position: sticky` and `useScroll` keep working. The film layer must not add overflow or a new scroll container.

## Architecture

### 1. Capability tier (`lib/cinema/tier.ts`, `use-cinema-tier.ts`)

One hook decides the tier once per session and exposes it via context:

| Tier | Condition | Gets |
|---|---|---|
| `static` | `prefers-reduced-motion`, or `saveData` | No motion, no grain animation, no intro. Content only. |
| `css` | default; mobile, touch, low `deviceMemory`/`hardwareConcurrency`, no WebGL2 | Film layer, scene transitions, CSS backdrops (today's behaviour plus polish). |
| `webgl` | desktop pointer, WebGL2 available, `hardwareConcurrency >= 6` (or unknown), not `saveData` | `css` plus the two WebGL set pieces. |

Starts as `css` on server and first client render (no hydration mismatch), then upgrades after mount. A runtime frame-time check downgrades `webgl` to `css` if the median frame exceeds 24 ms over the first 2 s. Never loops back up.

### 2. Film layer (`app/_components/cinema/film-layer.tsx`)

Mounted once in `app/layout.tsx` inside `MotionProvider`, alongside `EasterEggs`. Fixed, `pointer-events: none`, above content but below header, chat and drawers (z-index below `z-50`).

- **Grain:** a pre-rendered tiling noise (tiny PNG/SVG `feTurbulence` data URI, ~1-2 KB), animated with stepped `transform` jitter at 8 fps via CSS. Opacity about 0.05. Off in `static`.
- **Vignette:** one radial gradient. Replaces the per-backdrop vignette duplication over time.
- **Letterbox bars:** 2.35:1 feel via top/bottom bars that sit at 0 height at rest and animate to about 4svh during scene transitions and the intro (`transform: scaleY`, no layout).
- **Light leaks:** two blurred amber gradients whose position is tied to scroll progress through `useScroll` (transform only).

All effects use only `transform` and `opacity`. Nothing triggers layout.

### 3. Motion vocabulary (`lib/cinema/motion.ts`)

Shared variants and easings so every page speaks the same language:
`dolly` (scale and translate Z-feel), `pushIn`, `rackFocus` (blur to sharp via `filter`, capped on `css` tier to opacity-only on weak devices), `whipPan` (fast horizontal translate with blur). Exposed as small helpers consumed by `DepthItem`/`Reveal` via a new optional `cinema` prop, so existing call sites keep working unchanged.

### 4. Title-card intro (`cinema/title-card.tsx`)

First visit only (flag in `sessionStorage`, so it is per session rather than permanent). About 2.4 s: letterbox closes, "NIVAKARAN SHANMUGABAVAN" title card with a thin light sweep, bars open into the hero. Skippable by click, key press or scroll. Not rendered on `static` tier. Not rendered for crawlers or on direct deep links to non-home routes. The hero `h1` stays in the DOM at first paint, so the intro is an overlay and never delays LCP or hides content from SEO.

### 5. Scene transitions

- **In-page:** a `SceneCut` wrapper between home beats triggers the letterbox pulse and a light-leak sweep as it crosses the viewport centre.
- **Cross-page:** a lightweight route transition (cross-fade plus push-in) via a template (`app/template.tsx`) using `motion`. No View Transitions API dependency, since cross-browser support is uneven. Must not break the pinned hero or rail on return navigation.

### 6. WebGL set pieces (home only, `webgl` tier only)

Dependencies added to `frontend/package.json`: `three` (tree-shaken named imports only). Plain three.js with hand-written shaders rather than react-three-fiber, to keep the bundle small and avoid React reconciler overhead for two effects.

Loading follows the Next 16 lazy-loading guide. `ssr: false` is not allowed in Server Components, and `app/page.tsx` is one. So a client wrapper (`cinema/webgl/lazy-scenes.tsx`, `"use client"`) calls `next/dynamic(() => import(...), { ssr: false })`, and `page.tsx` imports the wrapper. three.js is only fetched when tier is `webgl`, and after first paint via `requestIdleCallback` with a timeout fallback.

**a. Hero field (`webgl/hero-field.tsx`):** replaces the ember backdrop's visual role behind the hero. A full-viewport canvas with about 6-8k GPU points (drifting dust and embers) in a volumetric amber light cone from behind the portrait; camera dollies forward with hero scroll progress and parallaxes slightly to the cursor. Fragment shader adds soft bokeh and depth-of-field falloff. Canvas is `position: fixed`, behind content, `pointer-events: none`. DPR capped at 1.5. The portrait and text remain DOM, so accessibility and SEO are unchanged.

**b. Warp transition (`webgl/warp-tunnel.tsx`):** between "Then it ships." and the work rail. Streaks of light rush toward the camera, driven by scroll progress through that statement section (0 to 1), peaking and resolving into the rail's first card. Rendered into the same canvas as (a) as a second pass or a separate lazily mounted canvas, whichever measures better; decide during implementation.

Both: render only while their section is in view (`IntersectionObserver`), pause on `visibilitychange`, dispose geometry, materials and the renderer on unmount, handle `webglcontextlost`, and fall back to the existing `StoryBackdrop` CSS on any failure.

### 7. Backdrop integration

`StoryBackdrop` stays the CSS tier's visual and the universal fallback. On `webgl` tier, `ember` hides its CSS sparks (the WebGL field replaces them) but keeps the wash and glow. Other variants are untouched in this sub-project.

## File map

New:
- `lib/cinema/tier.ts`, `lib/cinema/motion.ts`, `lib/cinema/use-cinema-tier.ts`
- `app/_components/cinema/film-layer.tsx`, `title-card.tsx`, `scene-cut.tsx`, `cinema-provider.tsx`
- `app/_components/cinema/webgl/lazy-scenes.tsx`, `hero-field.tsx`, `warp-tunnel.tsx`, `shaders.ts`
- `app/template.tsx`

Modified:
- `app/layout.tsx` (mount provider and film layer)
- `app/page.tsx` (insert `SceneCut` beats, mount lazy scenes)
- `app/globals.css` (grain/leak keyframes, reduced-motion overrides)
- `story/depth-item.tsx`, `ui/reveal.tsx` (optional `cinema` prop)
- `scene/story-backdrop.tsx` (hide CSS sparks on `webgl` tier)
- `frontend/package.json` (`three`, `@types/three`)

## Error handling and edge cases

- WebGL context creation fails or is lost: unmount the scene, show CSS backdrop, no console spam.
- Tab hidden: stop the render loop. Resize: debounce and resize the renderer.
- Back/forward navigation and bfcache: scenes remount cleanly. The intro does not replay (session flag).
- Print and `noscript`: film layer is absent, content visible (the existing `noscript` opacity override remains).
- Mobile Safari address-bar resizing: use `svh`/`lvh` consistently, as the existing code does.
- Chat widget, header and contact drawer keep their stacking order above the film layer.

## Testing and verification

- `npm run lint` and `npm run build` clean (Next 16.2.6).
- Manual matrix with the dev server and Playwright screenshots: desktop `webgl`, forced `css` tier (via a `?cinema=css` query override, dev only), `static` (emulated reduced motion), and a 375 px mobile viewport.
- Check hero pin and work rail progress still behave (known fragility: sticky layouts and `useScroll`).
- Console clean. No hydration warnings. Layout shift unchanged (CLS).
- Bundle check: compare home first-load JS before and after, and confirm three.js is a separate async chunk absent from the `css`/`static` tiers.
- Frame-time sanity on the target i5 laptop: hero scene holds at least 45 fps or downgrades itself.

## Out of scope

Per-page scenes (sub-project 3), sound design, video assets, a 3D portrait or model, cursor-trail gimmicks, and any change to content copy or data files.

## Open decisions (resolve during planning, not blockers)

- Warp tunnel: shared canvas with the hero field vs separate canvas (measure memory and complexity).
- Intro length and whether to show it on every session or once per browser (`localStorage`); default is per session.
