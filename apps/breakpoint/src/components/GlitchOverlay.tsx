"use client";

import React from "react";

interface Props {
  active: boolean;
  size?: "sm" | "lg";
  durationMs?: number;
  intensity?: number;
  children: React.ReactNode;
}

export type GlitchCssProperties = React.CSSProperties &
  Partial<Record<`--bp-glitch-${string}`, string>>;

const clampIntensity = (value: number) => Math.min(Math.max(value, 0), 1);
const scalePx = (value: number, intensity: number) =>
  `${Number((value * intensity).toFixed(2))}px`;
const scaleOpacity = (value: number, intensity: number) =>
  String(Number((value * intensity).toFixed(3)));

export function getGlitchIntensityStyle(
  intensity: number,
): GlitchCssProperties {
  const clampedIntensity = clampIntensity(intensity);

  return {
    "--bp-glitch-intensity": String(clampedIntensity),
    "--bp-glitch-slice-opacity": String(clampedIntensity),
    "--bp-glitch-scanline-alpha": `${Math.round(45 * clampedIntensity)}%`,
    "--bp-glitch-jitter-10-x": scalePx(-2, clampedIntensity),
    "--bp-glitch-jitter-10-y": scalePx(1, clampedIntensity),
    "--bp-glitch-jitter-25-x": scalePx(3, clampedIntensity),
    "--bp-glitch-jitter-25-y": scalePx(-1, clampedIntensity),
    "--bp-glitch-jitter-40-x": scalePx(-1, clampedIntensity),
    "--bp-glitch-jitter-40-y": scalePx(2, clampedIntensity),
    "--bp-glitch-jitter-55-x": scalePx(2, clampedIntensity),
    "--bp-glitch-jitter-55-y": scalePx(-2, clampedIntensity),
    "--bp-glitch-jitter-70-x": scalePx(-3, clampedIntensity),
    "--bp-glitch-jitter-70-y": scalePx(1, clampedIntensity),
    "--bp-glitch-jitter-85-x": scalePx(1, clampedIntensity),
    "--bp-glitch-slice-a-10-x": scalePx(-14, clampedIntensity),
    "--bp-glitch-slice-a-25-x": scalePx(16, clampedIntensity),
    "--bp-glitch-slice-a-40-x": scalePx(-8, clampedIntensity),
    "--bp-glitch-slice-a-55-x": scalePx(18, clampedIntensity),
    "--bp-glitch-slice-a-70-x": scalePx(-20, clampedIntensity),
    "--bp-glitch-slice-a-85-x": scalePx(6, clampedIntensity),
    "--bp-glitch-slice-b-15-x": scalePx(12, clampedIntensity),
    "--bp-glitch-slice-b-30-x": scalePx(-16, clampedIntensity),
    "--bp-glitch-slice-b-50-x": scalePx(24, clampedIntensity),
    "--bp-glitch-slice-b-65-x": scalePx(-12, clampedIntensity),
    "--bp-glitch-slice-b-80-x": scalePx(4, clampedIntensity),
    "--bp-glitch-slice-c-20-x": scalePx(-6, clampedIntensity),
    "--bp-glitch-slice-c-40-x": scalePx(20, clampedIntensity),
    "--bp-glitch-slice-c-60-x": scalePx(-24, clampedIntensity),
    "--bp-glitch-slice-c-80-x": scalePx(10, clampedIntensity),
    "--bp-glitch-flicker-10-opacity": scaleOpacity(0.7, clampedIntensity),
    "--bp-glitch-flicker-30-opacity": scaleOpacity(0.15, clampedIntensity),
    "--bp-glitch-flicker-50-opacity": scaleOpacity(0.85, clampedIntensity),
    "--bp-glitch-flicker-70-opacity": scaleOpacity(0.25, clampedIntensity),
    "--bp-glitch-flicker-90-opacity": scaleOpacity(0.6, clampedIntensity),
    "--bp-glitch-static-15-opacity": scaleOpacity(0.55, clampedIntensity),
    "--bp-glitch-static-30-opacity": scaleOpacity(0.2, clampedIntensity),
    "--bp-glitch-static-30-x": scalePx(-10, clampedIntensity),
    "--bp-glitch-static-30-y": scalePx(4, clampedIntensity),
    "--bp-glitch-static-50-opacity": scaleOpacity(0.7, clampedIntensity),
    "--bp-glitch-static-50-x": scalePx(8, clampedIntensity),
    "--bp-glitch-static-50-y": scalePx(-3, clampedIntensity),
    "--bp-glitch-static-75-opacity": scaleOpacity(0.3, clampedIntensity),
    "--bp-glitch-static-75-x": scalePx(-6, clampedIntensity),
    "--bp-glitch-static-75-y": scalePx(5, clampedIntensity),
    "--bp-glitch-static-90-opacity": scaleOpacity(0.45, clampedIntensity),
    "--bp-glitch-static-90-x": scalePx(4, clampedIntensity),
    "--bp-glitch-static-90-y": scalePx(-2, clampedIntensity),
  };
}

// Renders the shared glitch shader — 3 clipped slices cloning the given
// visual, plus scanlines and a 2-layer fractal-noise static burst. The
// base element (button, card, etc.) is the caller's responsibility and
// can pick up a synced jitter via the `bp-glitch-jitter` class.
export default function GlitchOverlay({
  active,
  size = "lg",
  durationMs,
  intensity = 1,
  children,
}: Props) {
  if (!active) return null;

  const style: GlitchCssProperties = {
    ...(durationMs != null
      ? { "--bp-glitch-duration": `${durationMs}ms` }
      : {}),
    ...(intensity !== 1 ? getGlitchIntensityStyle(intensity) : {}),
  };

  return (
    <div
      aria-hidden="true"
      className={`bp-glitch-root pointer-events-none absolute inset-0 ${
        size === "sm" ? "bp-glitch-sm" : ""
      }`}
      style={style}
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
