import type { MetadataRoute } from "next";
import { profile } from "@/lib/data/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} - ${profile.title}`,
    short_name: profile.shortName,
    description: profile.mission,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f4ee",
    theme_color: "#f6f4ee",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
