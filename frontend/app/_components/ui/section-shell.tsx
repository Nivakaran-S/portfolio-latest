import type { ReactNode } from "react";
import { Parallax } from "@/app/_components/ui/parallax";

interface SectionShellProps {
  id: string;
  /** Kept for API stability; no longer rendered (bento drops the strip). */
  index?: string;
  title: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Bento section scaffold: anchor target + clean kicker + display title.
 * The heading block carries a gentle parallax so it drifts independently
 * of the section content below it.
 */
export function SectionShell({
  id,
  title,
  kicker,
  children,
  className = "",
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-16 sm:px-6 md:py-24 ${className}`}
    >
      <Parallax distance={34} className="mb-10 md:mb-14">
        <div className="flex flex-col gap-3">
          {kicker ? <p className="label">{kicker}</p> : null}
          <h2 className="silver font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[clamp(1.85rem,4.6vw,3.25rem)]">
            {title}
          </h2>
        </div>
      </Parallax>
      {children}
    </section>
  );
}
