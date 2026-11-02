/**
 * Scrolls `target` to just below the sticky site header and the sticky
 * controls bar, whose height changes when the controls wrap on small screens.
 */
export function scrollBelowStickyControls(
  target: HTMLElement,
  stickyControls: HTMLElement | null,
) {
  const stickyOffset = stickyControls
    ? Number.parseFloat(getComputedStyle(stickyControls).top) +
      stickyControls.offsetHeight
    : 0;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.scrollTo({
    behavior: reduceMotion ? "auto" : "smooth",
    top:
      target.getBoundingClientRect().top + window.scrollY - stickyOffset - 16,
  });
}
