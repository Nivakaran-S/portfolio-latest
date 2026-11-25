import { pageOg } from "@/lib/seo/og";

export const alt = "Work - Nivakaran Shanmugabavan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return pageOg({
    kicker: "Work",
    title: "Proof, not promises.",
    sub: "Five case studies and a catalogue of mini projects",
  });
}
