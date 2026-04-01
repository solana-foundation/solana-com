/**
 * Lightweight modal dialog behavior replacing Radix Dialog.
 * Handles focus trapping, Escape key, overlay click, and scroll lock.
 */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

let savedScrollY = 0;

export function lockScroll(): void {
  if (typeof document === "undefined") return;
  savedScrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.overflow = "hidden";
}

export function unlockScroll(): void {
  if (typeof document === "undefined") return;
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.overflow = "";
  window.scrollTo(0, savedScrollY);
}

export function trapFocus(container: HTMLElement): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
}

export function setupDialogBehavior(
  container: HTMLElement,
  onClose: () => void,
): () => void {
  lockScroll();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const focusTrap = trapFocus(container);

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keydown", focusTrap);

  // Focus first focusable element
  const firstFocusable =
    container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  if (firstFocusable) {
    requestAnimationFrame(() => firstFocusable.focus());
  }

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keydown", focusTrap);
    unlockScroll();
  };
}
