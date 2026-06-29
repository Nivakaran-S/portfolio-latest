import type { CSSProperties } from "react";

/**
 * A tech-stack logo rendered as a CSS mask over a solid fill - so the same
 * SVG is a uniform muted silver by default and tints to its brand colour
 * when the surrounding `.group` pill is hovered/focused. Pure CSS (no JS),
 * so it works inside a server component. The pill must carry the `group`
 * class for the hover/focus tint to fire.
 */
export function TechLogo({
  icon,
  color,
  className = "h-4 w-4",
}: {
  icon: string;
  color: string;
  className?: string;
}) {
  const url = `url(/logos/${icon}.svg)`;
  const style: CSSProperties = {
    maskImage: url,
    WebkitMaskImage: url,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    // Consumed by the group-hover utility below.
    ["--tech-color" as string]: color,
  };
  return (
    <span
      aria-hidden
      style={style}
      className={`${className} shrink-0 [background-color:var(--color-fg-dim)] transition-colors duration-200 group-hover:[background-color:var(--tech-color)] group-focus-visible:[background-color:var(--tech-color)] motion-reduce:transition-none`}
    />
  );
}
