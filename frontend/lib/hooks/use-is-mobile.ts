"use client";

import { useEffect, useState } from "react";

/**
 * Coarse-pointer or narrow-viewport or low-memory device → "lite" path.
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const narrow = window.matchMedia("(max-width: 767px)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const lowMem =
        typeof navigator !== "undefined" &&
        "deviceMemory" in navigator &&
        (navigator as Navigator & { deviceMemory?: number }).deviceMemory !==
          undefined &&
        (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;
      setMobile(narrow || (coarse && lowMem));
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return mobile;
}
