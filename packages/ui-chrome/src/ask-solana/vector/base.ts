import styles from "./vector.module.css";
import { jetbrainsMono, spaceGrotesk } from "./fonts";

type ClassValue = string | false | null | undefined;

export function cx(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

/* Root className for block-level family components: normalizes line-height
   and applies the family typeface so a piece dropped straight into a docs
   article keeps the design's metrics. Nesting inside the answer card (which
   already provides both) is a no-op. */
export function vectorRoot(...classes: ClassValue[]) {
  return cx(styles.root, spaceGrotesk.className, ...classes);
}

/* Same, for components whose whole subtree is monospace (account cards). */
export function vectorMonoRoot(...classes: ClassValue[]) {
  return cx(styles.root, jetbrainsMono.className, ...classes);
}
