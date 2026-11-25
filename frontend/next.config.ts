import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Chat backend (NEXT_PUBLIC_API_URL) must be reachable from the browser.
const apiOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).origin : "";
  } catch {
    return "";
  }
})();

// 'unsafe-inline' for scripts: Next's hydration payload and the JSON-LD blocks
// are inline, and nonces would force every page to render dynamically.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin} https://va.vercel-scripts.com https://vitals.vercel-insights.com https://cloudflareinsights.com${isDev ? " ws:" : ""}`.replace(/\s+/g, " "),
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats when next/image is used; static <img>/background
    // assets are already pre-optimized (WebP / recompressed JPEG).
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // /case-studies duplicated /work (and lagged it by one project).
      { source: "/case-studies", destination: "/work", statusCode: 301 },
      // Retired filler post.
      { source: "/blog/hello-studio", destination: "/blog", statusCode: 301 },
      // Projects demoted from full case study to GitHub-linked card.
      ...["delivery-time-prediction", "driving-license-system", "hms", "laborguard", "lens", "book-recommendation", "vision-classifier", "gun-detection"].map((slug) => ({
        source: `/work/${slug}`,
        destination: "/work",
        statusCode: 301,
      })),
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // scroll-scrubbed frame sequences. Filenames aren't hashed, so keep
        // the TTL short; otherwise replaced frames stay stale for weeks.
        source: "/:route/frames/:file",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
