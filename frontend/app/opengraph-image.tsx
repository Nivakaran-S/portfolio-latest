import { ImageResponse } from "next/og";
import { profile } from "@/lib/data/profile";

export const alt = `${profile.name} - ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "84px",
          background:
            "radial-gradient(120% 100% at 50% 0%, #ffffff 0%, #faf9f4 50%, #f6f4ee 100%)",
          color: "#0b0b0b",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            color: "#6b6b6b",
            fontSize: 22,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: "#34d399",
            }}
          />
          Available for work
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#c2410c",
              fontSize: 26,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 22,
            }}
          >
            {profile.domains.join("   ·   ")}
          </div>
          <div style={{ fontSize: 86, fontWeight: 700, lineHeight: 1.04 }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 32, color: "#6b6b6b", marginTop: 18 }}>
            {profile.creed}
          </div>
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
          <span>nivakaran.dev</span>
          <span>{profile.location}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
