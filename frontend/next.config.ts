import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats when next/image is used; static <img>/background
    // assets are already pre-optimized (WebP / recompressed JPEG).
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
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
