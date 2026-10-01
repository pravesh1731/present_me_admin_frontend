// Shared styling constants and helpers for the landing page sections.

export const FONT = { fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif" };
export const INK = "text-[#0B1B34]";
export const BRAND_GRADIENT = "bg-gradient-to-r from-[#7CC8E0] to-[#4B7BE3]";
export const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4B7BE3]/30";

export const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};
