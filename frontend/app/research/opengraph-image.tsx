import { pageOg } from "@/lib/seo/og";

export const alt = "Research - Nivakaran Shanmugabavan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return pageOg({
    kicker: "Research",
    title: "Research.",
    sub: "Models, experiments and write-ups",
  });
}
