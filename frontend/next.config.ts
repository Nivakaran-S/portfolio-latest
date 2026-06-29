import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats when next/image is used; static <img>/background
    // assets are already pre-optimized (WebP / recompressed JPEG).
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
