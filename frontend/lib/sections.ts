export interface SectionMeta {
  id: string;
  label: string;
  index: string;
}

/**
 * On-home anchor map - used by anything that scrolls within the home
 * page (Hero CTAs, internal links). Order matches `app/page.tsx`.
 */
export const homeSections: SectionMeta[] = [
  { id: "hero", label: "Home", index: "01" },
  { id: "projects", label: "Work", index: "02" },
  { id: "about", label: "About", index: "03" },
  { id: "skills", label: "Skills", index: "04" },
  { id: "experience", label: "Experience", index: "05" },
  { id: "certifications", label: "Certs", index: "06" },
  { id: "contact", label: "Contact", index: "07" },
];

/** Back-compat alias - older imports still use `sections`. */
export const sections = homeSections;

export interface RouteLink {
  href: string;
  label: string;
}

/**
 * Top-level route navigation for the global header. Order is intentional:
 * Work and Blog come first (visuals-first), About anchors the personal
 * side, Contact stays an anchor on the home for now.
 */
export const routeNav: RouteLink[] = [
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/#contact", label: "Contact" },
];
