import { pageOg } from "@/lib/seo/og";

export const alt = "Max - Nivakaran Shanmugabavan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return pageOg({
    kicker: "Max",
    title: "Ask Max anything.",
    sub: "An AI operations assistant, and how it was built",
  });
}
