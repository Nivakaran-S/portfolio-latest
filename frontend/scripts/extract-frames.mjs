// One-command frame extractor for the rotation backdrops.
//
//   npm run frames:home          # assets/home.mp4         → public/home/frames/
//   npm run frames:about         # assets/about.mp4        → public/about/frames/
//   npm run frames:work          # assets/work.mp4         → public/work/frames/
//   npm run frames:case-study    # assets/case-study.mp4   → public/case-study/frames/
//
//   node scripts/extract-frames.mjs assets/foo.mp4 foo     # explicit
//   node scripts/extract-frames.mjs                        # picks first video in assets/
//
// Spawns the bundled ffmpeg (ffmpeg-static) to emit COUNT WebP frames at
// SIZE×SIZE into `public/<route>/frames/`.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ffmpegPath = require("ffmpeg-static");

const COUNT = 90;            // frames the RotationBackdrop expects per route
const SIZE = 720;            // 720×720 square crop
const QUALITY = 80;          // libwebp quality 0–100
const ASSETS_DIR = "assets";

const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".mkv", ".m4v", ".avi"]);

function pickInput() {
  const arg = process.argv[2];
  if (arg) {
    if (!existsSync(arg)) {
      console.error(`✗ Input not found: ${arg}`);
      process.exit(1);
    }
    return arg;
  }
  if (!existsSync(ASSETS_DIR)) {
    console.error(`✗ ${ASSETS_DIR}/ doesn't exist. Drop your video there.`);
    process.exit(1);
  }
  const candidate = readdirSync(ASSETS_DIR)
    .filter((f) => VIDEO_EXT.has(extname(f).toLowerCase()))
    .map((f) => join(ASSETS_DIR, f))[0];
  if (!candidate) {
    console.error(`✗ No video files in ${ASSETS_DIR}/`);
    process.exit(1);
  }
  return candidate;
}

function deriveRoute(input) {
  // explicit second arg wins
  const arg = process.argv[3];
  if (arg) return arg;
  // otherwise derive from the input filename (assets/foo.mp4 → "foo")
  return basename(input, extname(input));
}

function probeDuration(input) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, ["-hide_banner", "-i", input]);
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    child.on("close", () => {
      const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
      if (!m) return reject(new Error("Couldn't parse Duration"));
      const [, h, mm, s] = m;
      resolve(+h * 3600 + +mm * 60 + parseFloat(s));
    });
  });
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, {
      stdio: ["ignore", "ignore", "pipe"],
    });
    child.stderr.on("data", (chunk) => {
      const s = chunk.toString();
      const fm = s.match(/frame=\s*(\d+)/);
      if (fm) {
        process.stdout.write(`\r  frame ${fm[1].padStart(3, " ")}/${COUNT}`);
      }
    });
    child.on("close", (code) => {
      process.stdout.write("\n");
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}`));
    });
  });
}

function dirSizeMB(dir) {
  let total = 0;
  for (const f of readdirSync(dir)) total += statSync(join(dir, f)).size;
  return (total / 1024 / 1024).toFixed(2);
}

async function main() {
  const input = pickInput();
  const route = deriveRoute(input);
  const outDir = join("public", route, "frames");

  console.log(`→ Input:  ${input}`);
  console.log(`→ Route:  ${route} (writing to ${outDir})`);

  const duration = await probeDuration(input);
  if (!Number.isFinite(duration) || duration <= 0) {
    console.error("✗ Invalid duration");
    process.exit(1);
  }
  const fps = COUNT / duration;
  console.log(
    `→ Source: ${duration.toFixed(2)}s · target ${COUNT} frames at ${SIZE}×${SIZE} · sampling at ${fps.toFixed(3)} fps`
  );

  // Fresh output dir (preserve other files, just sweep the previous frames)
  if (existsSync(outDir)) {
    for (const f of readdirSync(outDir)) {
      if (f.endsWith(".webp") || f.endsWith(".png")) {
        rmSync(join(outDir, f), { force: true });
      }
    }
  } else {
    mkdirSync(outDir, { recursive: true });
  }

  const vf = `scale=${SIZE}:${SIZE}:force_original_aspect_ratio=increase,crop=${SIZE}:${SIZE},fps=${fps.toFixed(6)}`;
  const out = join(outDir, "frame-%03d.webp");
  console.log(`→ Writing ${out}`);

  await runFfmpeg([
    "-y",
    "-hide_banner",
    "-loglevel", "error",
    "-stats",
    "-i", input,
    "-vf", vf,
    "-frames:v", String(COUNT),
    "-c:v", "libwebp",
    "-q:v", String(QUALITY),
    "-compression_level", "6",
    "-preset", "photo",
    out,
  ]);

  const files = readdirSync(outDir).filter((f) => f.endsWith(".webp"));
  console.log(
    `✓ ${files.length} frames written to ${outDir} (${dirSizeMB(outDir)} MB)`
  );
  if (files.length !== COUNT) {
    console.warn(
      `⚠ Expected ${COUNT} frames, got ${files.length}. The route will still work — adjust COUNT in scripts/extract-frames.mjs if intentional.`
    );
  }
  console.log(
    `→ Source video (${basename(input)}) is untouched. Frames are ready to serve at /${route}/frames/.`
  );
}

main().catch((err) => {
  console.error("✗", err.message);
  process.exit(1);
});
