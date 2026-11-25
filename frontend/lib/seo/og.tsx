import { ImageResponse } from "next/og";
import { profile } from "@/lib/data/profile";

export const ogSize = { width: 1200, height: 630 };

/**
 * Per-page link-preview card (1200x630) in the site's paper theme. Routes
 * that define their own `openGraph` metadata do not inherit the root
 * opengraph-image, so each of them renders one of these.
 */
export function pageOg({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "radial-gradient(120% 100% at 50% 0%, #ffffff 0%, #faf9f4 50%, #f6f4ee 100%)",
          color: "#0b0b0b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#c2410c", fontSize: 24, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          {kicker}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.04 }}>{title}</div>
          <div style={{ fontSize: 34, color: "#6b6b6b", marginTop: 18 }}>{sub}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#6b6b6b",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span>{profile.fullName}</span>
          <span>nivakaran.dev</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
