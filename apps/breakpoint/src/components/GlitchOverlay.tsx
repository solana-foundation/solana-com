"use client";

import React from "react";

interface Props {
  active: boolean;
  size?: "sm" | "lg";
  children: React.ReactNode;
}

// Renders the shared glitch shader — 3 clipped slices cloning the given
// visual, plus scanlines and a 2-layer fractal-noise static burst. The
// base element (button, card, etc.) is the caller's responsibility and
// can pick up a synced jitter via the `bp-glitch-jitter` class.
export default function GlitchOverlay({
  active,
  size = "lg",
  children,
}: Props) {
  if (!active) return null;
  return (
    <div
      aria-hidden="true"
      className={`bp-glitch-root pointer-events-none absolute inset-0 ${
        size === "sm" ? "bp-glitch-sm" : ""
      }`}
    >
      <div className="bp-glitch-slice bp-glitch-slice-1 absolute inset-0">
        {children}
      </div>
      <div className="bp-glitch-slice bp-glitch-slice-2 absolute inset-0">
        {children}
      </div>
      <div className="bp-glitch-slice bp-glitch-slice-3 absolute inset-0">
        {children}
      </div>
      <div className="bp-glitch-scanlines absolute inset-0" />
      <div className="bp-glitch-static absolute inset-0" />
    </div>
  );
}
