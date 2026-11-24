import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
}

/**
 * Infinite marquee. The run is rendered twice and the track slides by half its
 * width; the duplicate is aria-hidden so screen readers read it once.
 */
export function Marquee({ children, duration = 40, className = "" }: MarqueeProps) {
  return (
    <div className={`marquee ${className}`} style={{ ["--marquee-duration" as string]: `${duration}s` }}>
      <div className="marquee-track">
        <div className="flex shrink-0 items-center gap-10">{children}</div>
        <div className="flex shrink-0 items-center gap-10" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
