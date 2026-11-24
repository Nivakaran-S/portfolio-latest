"use client";

import type { ReactNode } from "react";
import { StoryItem } from "@/app/_components/story/story-item";

type From = "up" | "down" | "left" | "right" | "zoom-in" | "zoom-out" | "fade";

interface DepthItemProps {
  children: ReactNode;
  from?: From;
  distance?: number;
  /** Stagger in seconds. */
  delay?: number;
  className?: string;
}

/**
 * Section entrance. Kept as the page-level name; the Z Crew treatment is a
 * short fade-and-rise the first time an element scrolls into view, with
 * content always rendered visible before JavaScript.
 */
export function DepthItem({ children, from = "up", distance, delay = 0, className = "" }: DepthItemProps) {
  return (
    <StoryItem from={from} distance={distance} delay={delay} className={className}>
      {children}
    </StoryItem>
  );
}
