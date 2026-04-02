/**
 * All styles for the FAB menu, scoped with `sfab-` prefix.
 * Design tokens aligned with solana.com nd-* design system.
 * Glass-morphism panel matching ui-chrome nav-menu.
 */
export const FAB_STYLES = /* css */ `
/* ── Root tokens ── */
.sfab-root {
  --sfab-z-index: 999999;
  --sfab-overlay-bg: rgba(0, 0, 0, 0.9);
  --sfab-panel-bg: rgba(25, 24, 27, 0.5);
  --sfab-panel-surface-bg: rgba(25, 24, 27, 0.72);
  --sfab-control-bg: rgba(255, 255, 255, 0.06);
  --sfab-control-bg-hover: rgba(255, 255, 255, 0.08);
  --sfab-border-subtle: rgba(255, 255, 255, 0.1);
  --sfab-text-primary: #FFFFFF;
  --sfab-text-secondary: #ABABBA;
  --sfab-text-muted: rgba(255, 255, 255, 0.3);
  --sfab-text-dim: rgba(255, 255, 255, 0.64);
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
  animation: sfab-entrance 0.4s ease-out;
  padding: 0;
}

.sfab-button:hover { transform: scale(1.08); }

.sfab-button:focus-visible {
  outline: 2px solid #FFFFFF;
  outline-offset: 3px;
}

.sfab-button svg { width: 20px; height: 20px; }

/* Logo Variants */
.sfab-button--dark-mono {
  background: #F5F3F1;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #0E0E11;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08);
}
.sfab-button--dark-mono:hover {
  background: #FFFFFF;
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 4px rgba(0,0,0,0.14), 0 12px 32px rgba(0,0,0,0.12);
}

.sfab-button--light-mono {
  background: #111118;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #EDEDEF;
  box-shadow: 0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.24);
}
.sfab-button--light-mono:hover {
  background: #18182A;
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 2px 4px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.32);
}

.sfab-button--color {
  background: #1A1A2E;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.24);
}
.sfab-button--color:hover {
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow: 0 2px 4px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.32);
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
  background: var(--sfab-overlay-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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
  max-width: 900px;
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  background: var(--sfab-panel-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--sfab-border-subtle);
  color: var(--sfab-text-primary);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
  animation: sfab-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (max-width: 767px) {
  .sfab-panel {
    top: auto;
    bottom: 0;
    left: 0;
    transform: none;
    width: 100%;
    max-height: 85vh;
  }
}

@keyframes sfab-slide-up {
  from { opacity: 0; transform: translate(-50%, -48%); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
}

@media (max-width: 767px) {
  @keyframes sfab-slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
}

/* ── Panel Header ── */
.sfab-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px 0;
}

@media (max-width: 767px) {
  .sfab-panel-header { padding: 16px 20px 0; }
}

.sfab-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sfab-brand svg { width: 24px; height: 24px; flex-shrink: 0; }

.sfab-brand-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--sfab-text-primary);
  letter-spacing: -0.32px;
  line-height: 1.5;
}

.sfab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--sfab-control-bg);
  color: var(--sfab-text-dim);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.sfab-close:hover {
  background: var(--sfab-control-bg-hover);
  color: var(--sfab-text-primary);
}

.sfab-close:focus-visible {
  outline: 2px solid #FFFFFF;
  outline-offset: 2px;
}

.sfab-close svg { width: 16px; height: 16px; }

/* ── Search ── */
.sfab-search {
  margin: 20px 32px 0;
  position: relative;
}

@media (max-width: 767px) {
  .sfab-search { margin: 16px 20px 0; }
}

.sfab-search-ico {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--sfab-text-muted);
  pointer-events: none;
  transition: color 0.3s ease;
}

.sfab-search-input {
  width: 100%;
  height: 40px;
  padding: 0 12px 0 36px;
  background: var(--sfab-control-bg);
  border: 1px solid var(--sfab-border-subtle);
  color: var(--sfab-text-primary);
  font-family: inherit;
  font-size: 14px;
  letter-spacing: -0.14px;
  outline: none;
  transition: all 0.3s ease;
}

.sfab-search-input::placeholder { color: var(--sfab-text-muted); }

.sfab-search-input:focus {
  border-color: rgba(153, 69, 255, 0.3);
  background: rgba(153, 69, 255, 0.04);
}

.sfab-search:focus-within .sfab-search-ico { color: #ABABBA; }

/* ── Tabs ── */
.sfab-tabs {
  display: flex;
  margin: 20px 32px 0;
  border-bottom: 1px solid var(--sfab-border-subtle);
}

@media (max-width: 767px) {
  .sfab-tabs { margin: 16px 20px 0; }
}

.sfab-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  border: none;
  background: transparent;
  color: var(--sfab-text-secondary);
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.14px;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
}

.sfab-tab:hover { color: var(--sfab-text-primary); }

.sfab-tab svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.6;
}

.sfab-tab--active { color: var(--sfab-text-primary); }

.sfab-tab--active svg { opacity: 1; }

.sfab-tab--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--sfab-text-primary);
}

/* ── Content ── */
.sfab-content {
  padding: 24px 32px 0;
  animation: sfab-content-fade 0.2s ease;
}

@media (max-width: 767px) {
  .sfab-content { padding: 20px 20px 0; }
}

@keyframes sfab-content-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Featured row ── */
.sfab-featured-row {
  display: flex;
  gap: 1px;
  background: var(--sfab-border-subtle);
}

@media (max-width: 767px) {
  .sfab-featured-row { flex-direction: column; }
}

.sfab-featured {
  flex: 1;
  min-width: 0;
  padding: 24px;
  background: var(--sfab-panel-surface-bg);
}

.sfab-featured-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--sfab-text-muted);
  margin-bottom: 12px;
}

.sfab-featured-title {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.48px;
  color: var(--sfab-text-primary);
  margin-bottom: 20px;
}

@media (max-width: 767px) {
  .sfab-featured-title {
    font-size: 20px;
    letter-spacing: -0.4px;
  }
}

.sfab-featured-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 20px;
  background: #FFFFFF;
  color: #000000;
  border-radius: 9999px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.14px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.sfab-featured-cta:hover {
  background: rgba(255, 255, 255, 0.9);
}

.sfab-featured-cta svg { width: 12px; height: 12px; }

/* ── Stat ── */
.sfab-stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 32px;
  min-width: 180px;
  background: var(--sfab-panel-surface-bg);
}

@media (max-width: 767px) {
  .sfab-stat {
    min-width: auto;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
  }
}

.sfab-stat-value {
  font-size: 40px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -1px;
  color: var(--sfab-text-primary);
}

@media (max-width: 767px) {
  .sfab-stat-value { font-size: 28px; }
}

.sfab-stat-unit {
  font-size: 14px;
  font-weight: 500;
  color: var(--sfab-text-secondary);
  margin-top: 8px;
  letter-spacing: -0.14px;
  line-height: 1.42;
}

@media (max-width: 767px) {
  .sfab-stat-unit { margin-top: 0; }
}

/* ── Section label ── */
.sfab-section-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--sfab-text-muted);
  padding: 20px 0 12px;
}

/* ── Links grid ── */
.sfab-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
}

@media (max-width: 767px) {
  .sfab-links { grid-template-columns: 1fr; }
}

.sfab-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  text-decoration: none;
  color: var(--sfab-text-dim);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.14px;
  transition: color 0.3s ease;
}

.sfab-link:hover { color: var(--sfab-text-primary); }

.sfab-link-ico {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sfab-link-ico svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.sfab-link-label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Divider ── */
.sfab-hr {
  border: none;
  border-top: 1px solid var(--sfab-border-subtle);
  margin: 0 32px;
}

@media (max-width: 767px) {
  .sfab-hr { margin: 0 20px; }
}

/* ── Promo ── */
.sfab-promo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 32px;
  padding: 16px 0;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

@media (max-width: 767px) {
  .sfab-promo { margin: 0 20px; }
}

.sfab-promo:hover { opacity: 0.85; }

.sfab-promo-badge {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #14F195;
  background: rgba(20, 241, 149, 0.08);
  padding: 3px 8px;
  flex-shrink: 0;
}

.sfab-promo-text {
  flex: 1;
  font-size: 13px;
  color: var(--sfab-text-secondary);
  letter-spacing: -0.13px;
  min-width: 0;
}

.sfab-promo-text strong {
  color: var(--sfab-text-primary);
  font-weight: 500;
}

.sfab-promo-arrow {
  width: 16px;
  height: 16px;
  color: var(--sfab-text-muted);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.sfab-promo:hover .sfab-promo-arrow { transform: translateX(2px); }

/* ── Footer ── */
.sfab-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-top: 1px solid var(--sfab-border-subtle);
}

@media (max-width: 767px) {
  .sfab-footer { padding: 12px 20px; }
}

.sfab-footer-brand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--sfab-text-muted);
  letter-spacing: -0.12px;
}

.sfab-footer-brand svg { width: 12px; height: 12px; }

.sfab-footer-links {
  display: flex;
  gap: 16px;
}

@media (max-width: 767px) {
  .sfab-footer-links { display: none; }
}

.sfab-footer-link {
  font-size: 12px;
  color: var(--sfab-text-muted);
  text-decoration: none;
  letter-spacing: -0.12px;
  transition: color 0.3s ease;
}

.sfab-footer-link:hover { color: var(--sfab-text-primary); }

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
