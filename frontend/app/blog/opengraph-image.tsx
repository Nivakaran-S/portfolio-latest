import { pageOg } from "@/lib/seo/og";

export const alt = "Blog - Nivakaran Shanmugabavan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return pageOg({
    kicker: "Blog",
    title: "Thinking out loud.",
    sub: "Short, opinionated posts on AI, ML and distributed systems",
  });
}
