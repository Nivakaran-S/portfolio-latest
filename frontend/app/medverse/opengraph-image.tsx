import { pageOg } from "@/lib/seo/og";

export const alt = "MedVerse - Nivakaran Shanmugabavan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return pageOg({
    kicker: "MedVerse",
    title: "Sense the unseen.",
    sub: "A clinical telemetry platform, built end to end with Team ADAGARD",
  });
}
