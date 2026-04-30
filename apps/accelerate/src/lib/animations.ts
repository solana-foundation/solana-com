import type { Variants } from "framer-motion";

/** Fade-in with upward slide — used across all section components. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/** Stagger children on enter — pairs with fadeInUp for section reveals. */
export const stagger: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/** Faster stagger for dense grids (FAQ items, sponsor logos). */
export const staggerFast: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

/** Slide-in from left — used for list items in EventDetails. */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};
