import type { ReactNode } from "react";

interface GlowButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
}

/**
 * Bento anchor button. Primary = amber-tinted CTA; ghost = subtle border.
 * Min 44px touch target. Server component.
 */
export function GlowButton({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: GlowButtonProps) {
  const base =
    "group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-colors duration-200";
  const styles =
    variant === "primary"
      ? "bg-neon-cyan/15 text-neon-cyan-core ring-1 ring-neon-cyan/40 hover:bg-neon-cyan/25"
      : "text-fg-dim border border-white/15 hover:border-white/30 hover:text-fg";

  return (
    <a
      href={href}
      className={`${base} ${styles} ${className}`}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  );
}
