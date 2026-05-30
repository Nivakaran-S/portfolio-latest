"use client";

import { type ReactNode } from "react";
import { useContactDrawer } from "./contact-drawer";

/**
 * A button that opens the global contact drawer instead of navigating to
 * "/#contact". Styling is supplied by the caller via `className` so it can
 * drop into any existing button/link slot unchanged. `onClick` runs before
 * the drawer opens (e.g. to close a mobile menu).
 */
export function ContactButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { open } = useContactDrawer();
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        open();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
