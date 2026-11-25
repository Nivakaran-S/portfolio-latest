import { pageOg } from "@/lib/seo/og";

export const alt = "Events - Nivakaran Shanmugabavan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return pageOg({
    kicker: "Events",
    title: "Competitions and community.",
    sub: "Hackathons, algorithm contests and tech conferences",
  });
}
