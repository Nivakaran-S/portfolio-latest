import { ImageResponse } from "next/og";
import { getMainProjects, getProject } from "@/lib/data/projects";
import { profile } from "@/lib/data/profile";

export function generateStaticParams() {
  return getMainProjects().map((p) => ({ slug: p.slug }));
}

export const alt = "Project case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

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
          background:
            "radial-gradient(120% 100% at 50% 0%, #ffffff 0%, #faf9f4 50%, #f6f4ee 100%)",
          color: "#0b0b0b",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            color: "#c2410c",
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {project ? `${project.category} · Case study` : "Case study"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1.04 }}>
            {project?.name ?? "Project"}
          </div>
          <div style={{ fontSize: 34, color: "#6b6b6b", marginTop: 16 }}>
            {project?.valueProp ?? ""}
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
          <span>{profile.name}</span>
          <span>nivakaran.dev</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
