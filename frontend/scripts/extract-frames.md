# Extract the 360° backdrop videos into scroll frames

Each route's rotation backdrop reads from `public/<route>/frames/frame-001.webp` … `frame-090.webp`. Until those exist, the [`<FaceRotation />`](../app/_components/scene/face-rotation.tsx) component falls back to the layout's Aurora — so the site is never broken.

**Routes that consume frames:**

| Route | Source video | Output dir | Subject (per the prompts) |
|---|---|---|---|
| `/`            | `assets/home.mp4`       | `public/home/frames/`       | "The Ember" — molten sphere |
| `/about`       | `assets/about.mp4`      | `public/about/frames/`      | "The Face" — 360° portrait |
| `/work`        | `assets/work.mp4`       | `public/work/frames/`       | "The Monolith" — forged cube |
| `/work/[slug]` | `assets/case-study.mp4` | `public/case-study/frames/` | "The Vessel" — dark glass cube |

**Target output:** 90 WebP frames at 720 × 720, ≈ 2–5 MB per route.

---

## One command per route

The repo ships an extractor backed by [`ffmpeg-static`](https://www.npmjs.com/package/ffmpeg-static) (dev dep), so no system ffmpeg is required.

```bash
# Pick whichever you have, in any order:
npm run frames:home          # assets/home.mp4         → public/home/frames/
npm run frames:about         # assets/about.mp4        → public/about/frames/
npm run frames:work          # assets/work.mp4         → public/work/frames/
npm run frames:case-study    # assets/case-study.mp4   → public/case-study/frames/
```

Each command:

1. Probes the source's duration via the bundled ffmpeg.
2. Computes `fps = 90 / duration` so any-length source produces exactly 90 evenly-spaced frames.
3. Scales + center-crops to 720 × 720 and encodes WebP at quality 80 in one pass.
4. Sweeps the previous WebPs in the output dir before writing.
5. Reports the file count and total size on stdout.

The source video is never modified, and `assets/` is gitignored — the originals stay local.

Free-form alternatives:

```bash
# Explicit input + route name:
node scripts/extract-frames.mjs assets/anything.mp4 my-route

# Auto-pick the first video in assets/ (route name derived from filename):
npm run frames
```

---

## After the frames land

Just refresh the dev server. The `<FaceRotation prefix="/<route>/frames/frame-" />` on each route:

- Probes `frame-001.webp` for that route.
- If found → batch-preloads the remaining 89, then rotates on scroll.
- If a later frame fails → tolerates per-frame errors (the scrub skips).
- If `frame-001.webp` itself 404s → returns `null`, layout's Aurora shows through unchanged.

Mobile + `prefers-reduced-motion` users see a static mid-rotation frame (`frame-045.webp` for `count=90`), with the src derived from the same `prefix`.

---

## Notes

- **Frame count.** Components default to `count={90}`. To ship more or fewer for a route, pass `count={N}` where `<FaceRotation />` is mounted **and** update the `COUNT` constant in [extract-frames.mjs](extract-frames.mjs).
- **Naming.** Strict zero-padding to 3 digits: `frame-001.webp` … `frame-090.webp`. To deviate, pass `prefix` / `pad` / `ext` props.
- **Crash-safe.** A missing first frame → `null` → Aurora fallback. The site never shows a broken-image icon.
- **CDN.** All frames are static assets served by Vercel with long-lived cache headers. Second visits hit the cache instantly.
