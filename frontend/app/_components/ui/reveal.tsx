import type { ReactNode } from "react";
import { StoryItem } from "@/app/_components/story/story-item";

interface RevealProps {
  children: ReactNode;
  /** Stagger in ms. */
  delay?: number;
  className?: string;
}

/**
 * In-view fade for cards. Same contract as StoryItem: rendered visible,
 * one brief fade only for items below the fold at load, none for reduced
 * motion.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  return (
    <StoryItem from="fade" delay={delay / 1000} className={className}>
      {children}
    </StoryItem>
  );
}
