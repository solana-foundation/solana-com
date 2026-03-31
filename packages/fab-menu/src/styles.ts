/**
 * All styles for the FAB menu, scoped with `sfab-` prefix.
 * Design tokens extracted from solana.com's Tailwind config (nd-* palette).
 * Typography extracted from globals.css nd-heading-l, nd-body-l, nd-body-s.
 */
export const FAB_STYLES = /* css */ `
/* ── Tokens ── */
.sfab-root {
  --sfab-bg: #000000;
  --sfab-cta: #FFFFFF;
  --sfab-primary: #FFFFFF;
  --sfab-inverse: #000000;
  --sfab-high-em-text: #FFFFFF;
  --sfab-mid-em-text: #ABABBA;
  --sfab-mid-em-text-alpha: #FFFFFFA3;
  --sfab-border-light: #ECE4FD1F;
  --sfab-border-prominent: #ECE4FD33;
  --sfab-border-hovered: #ECE4FD52;

  font-family: 'Diatype', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── FAB Button ── */
.sfab-button {
  position: fixed;
  z-index: var(--sfab-z-index, 999999);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--sfab-cta);
  color: var(--sfab-inverse);
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: sfab-entrance 0.4s ease-out;
  padding: 0;
}

.sfab-button:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 32px rgba(0, 0, 0, 0.4);
}

.sfab-button:focus-visible {
  outline: 2px solid var(--sfab-cta);
  outline-offset: 3px;
}

.sfab-button svg {
  width: 24px;
  height: 24px;
}

/* Positions */
.sfab-pos-bottom-right { bottom: 24px; right: 24px; }
.sfab-pos-bottom-left  { bottom: 24px; left: 24px; }
.sfab-pos-top-right    { top: 24px; right: 24px; }
.sfab-pos-top-left     { top: 24px; left: 24px; }

@keyframes sfab-entrance {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}

/* ── Overlay ── */
.sfab-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--sfab-z-index, 999999);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: sfab-fade-in 0.2s ease-out;
}

@keyframes sfab-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Panel ── */
.sfab-panel {
  position: fixed;
  z-index: calc(var(--sfab-z-index, 999999) + 1);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 32px);
  max-width: 1280px;
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;
  animation: sfab-slide-up 0.3s ease-out;
}

@media (min-width: 768px) {
  .sfab-panel {
    padding: 48px;
  }
}

@media (max-width: 767px) {
  .sfab-panel {
    top: auto;
    bottom: 0;
    left: 0;
    transform: none;
    width: 100%;
    max-height: 85vh;
    border-radius: 16px 16px 0 0;
  }
}

@keyframes sfab-slide-up {
  from { opacity: 0; transform: translate(-50%, -45%); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
}

@media (max-width: 767px) {
  @keyframes sfab-slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
}

/* ── Close Button ── */
.sfab-close {
  position: fixed;
  z-index: calc(var(--sfab-z-index, 999999) + 2);
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--sfab-border-light);
  color: var(--sfab-mid-em-text-alpha);
  cursor: pointer;
  padding: 0;
  transition: background 0.15s ease, color 0.15s ease;
}

.sfab-close:hover {
  background: var(--sfab-border-prominent);
  color: var(--sfab-cta);
}

.sfab-close:focus-visible {
  outline: 2px solid var(--sfab-cta);
  outline-offset: 2px;
}

.sfab-close svg {
  width: 16px;
  height: 16px;
}

@media (min-width: 768px) {
  .sfab-close {
    width: 56px;
    height: 56px;
    top: 48px;
    right: 48px;
  }
  .sfab-close svg {
    width: 24px;
    height: 24px;
  }
}

/* ── Title ── */
.sfab-title {
  margin: 0;
  display: flex;
  align-items: center;
  color: var(--sfab-high-em-text);
  font-weight: 500;
  font-size: 32px;
  line-height: 1.25;
  letter-spacing: -1.28px;
}

.sfab-title svg {
  width: 28px;
  height: 28px;
  margin-right: 10px;
  margin-top: -4px;
}

@media (min-width: 768px) {
  .sfab-title {
    font-size: 40px;
    line-height: 1.1;
    letter-spacing: -1.6px;
  }
  .sfab-title svg {
    width: 56px;
    height: 56px;
    margin-right: 24px;
  }
}

@media (min-width: 1280px) {
  .sfab-title {
    font-size: 64px;
    line-height: 1.125;
    letter-spacing: -2.56px;
  }
}

/* ── Tabs Grid ── */
.sfab-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-top: 24px;
}

@media (min-width: 768px) {
  .sfab-tabs { margin-top: 40px; }
}

.sfab-tab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: var(--sfab-border-light);
  color: var(--sfab-mid-em-text-alpha);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.15s ease, color 0.15s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.sfab-tab:hover {
  background: var(--sfab-border-prominent);
  color: var(--sfab-cta);
}

.sfab-tab:focus-visible {
  outline: 2px solid var(--sfab-cta);
  outline-offset: 2px;
}

.sfab-tab svg {
  width: 20px;
  height: 20px;
}

.sfab-tab-title {
  font-weight: 500;
  font-size: 16px;
  line-height: 1.375;
  letter-spacing: -0.16px;
  margin: 0;
}

@media (min-width: 768px) {
  .sfab-tab {
    gap: 40px;
    padding: 24px;
  }
  .sfab-tab svg {
    width: 32px;
    height: 32px;
  }
  .sfab-tab-title {
    font-size: 28px;
    line-height: 1.33;
    letter-spacing: -0.28px;
  }
}

.sfab-tab-active {
  background: var(--sfab-primary) !important;
  color: var(--sfab-inverse) !important;
}

/* ── Links List ── */
.sfab-links {
  margin-top: 12px;
  overflow: hidden;
}

@media (min-width: 768px) {
  .sfab-links { margin-top: 32px; }
}

.sfab-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  width: 100%;
  text-decoration: none;
  color: var(--sfab-mid-em-text-alpha);
  border-bottom: 1px solid var(--sfab-border-light);
  transition: color 0.15s ease, border-color 0.15s ease;
}

.sfab-link:last-child {
  border-bottom: none;
}

.sfab-link:hover {
  color: var(--sfab-cta);
  border-color: var(--sfab-border-hovered);
}

@media (min-width: 768px) {
  .sfab-link {
    gap: 16px;
    padding: 20px;
  }
}

/* Link number badge */
.sfab-link-num {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--sfab-border-light);
  font-size: 14px;
  line-height: 1;
  color: var(--sfab-mid-em-text);
  transition: background 0.15s ease, color 0.15s ease;
}

.sfab-link:hover .sfab-link-num {
  background: var(--sfab-cta);
  color: var(--sfab-inverse);
}

.sfab-link-text {
  flex: 1;
  min-width: 0;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: -0.16px;
}

@media (min-width: 768px) {
  .sfab-link-text {
    font-size: 18px;
    line-height: 1.33;
    letter-spacing: -0.18px;
  }
}

@media (min-width: 1280px) {
  .sfab-link-text {
    font-size: 20px;
    line-height: 1.5;
    letter-spacing: -0.2px;
  }
}

.sfab-link-arrow {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  opacity: 0.64;
  color: var(--sfab-cta);
}

@media (min-width: 768px) {
  .sfab-link-arrow {
    width: 20px;
    height: 20px;
  }
}

/* ── Utility ── */
.sfab-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
`;

let styleInjected = false;

export function injectStyles(): void {
  if (styleInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.setAttribute("data-sfab", "");
  style.textContent = FAB_STYLES;
  document.head.appendChild(style);
  styleInjected = true;
}
