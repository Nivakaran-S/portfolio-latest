import { pageOg } from "@/lib/seo/og";

export const alt = "About - Nivakaran Shanmugabavan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return pageOg({
    kicker: "About",
    title: "Before the systems, the person.",
    sub: "AI and software engineer · Colombo, Sri Lanka",
  });
}
