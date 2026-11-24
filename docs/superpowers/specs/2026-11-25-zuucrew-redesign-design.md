# Z Crew visual language redesign

Date: 2026-11-25

## Goal
Replace the dark Iron-Man "cinema" look of the portfolio with the Z Crew (zuucrew.ai) visual language and motion. Content, routes, blog, work pages, chat widget and admin are kept. Source of truth for the design is the static mirror at `Desktop/zuucrew-clone`.

## Decisions
- Replace the look, not layer on top.
- Copy the design language only, not Z Crew copy or imagery.
- All routes restyled.
- Add `gsap` and `lenis`.

## Foundation
- Delete `app/_components/cinema/*`, `lib/cinema/*`, scene backdrops and cinema-only scripts.
- Tokens in `globals.css`: bg `#f6f4ee`, paper `#faf9f4`, ink `#0b0b0b`, line `#e5e3dd`, muted `#6b6b6b`, ember/purple/red accent families, navy `#050e15`, max width 1320px.
- Fonts: Geist, Geist Mono, Caveat via `next/font`.
- Primitives: `SmoothScroll` (Lenis + GSAP ticker), `MaskReveal`, `Marquee`, `useScrollTrigger`. All respect `prefers-reduced-motion`.

## Pages
- Header: slim paper bar, hairline border, mono links, ember CTA pill, full-sheet mobile menu.
- Footer: dark ink, large wordmark, mono link columns.
- Transitions: soft fade-in in `template.tsx`.
- Home: hero, stats band, work cards, stack marquee, experience timeline, review cards, CTA block.
- Inner pages inherit tokens, chrome, section rhythm and reveals. `max` and `medverse` last.
- Chat widget and admin: token swap only.

## Verification
`next build`, lint, and Playwright screenshots at desktop and mobile widths against the mirror.
