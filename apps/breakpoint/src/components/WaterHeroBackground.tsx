"use client";

/**
 * Hero background — CSS-only grain + animated purple glow.
 * Replaces the canvas-based water shader with a lighter-weight,
 * more editorial atmospheric effect.
 */
export function WaterHeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient — deep purple void */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#0b0614_0%,#110a1e_30%,#0a0a0a_70%,#050505_100%)]" />

      {/* Primary glow orb — top-left, pulsing */}
      <div
        className="absolute left-[15%] top-[10%] h-[70%] w-[60%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(98,58,196,0.3) 0%, rgba(68,44,110,0.1) 40%, transparent 70%)",
          animation: "glowPulse 6s ease-in-out infinite",
          filter: "blur(80px)",
        }}
      />

      {/* Secondary glow orb — bottom-right, drifting */}
      <div
        className="absolute bottom-[5%] right-[10%] h-[50%] w-[45%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(123,79,214,0.15) 0%, rgba(98,58,196,0.05) 40%, transparent 65%)",
          animation: "glowDrift 10s ease-in-out infinite",
          filter: "blur(100px)",
        }}
      />

      {/* Tertiary accent — tight, bright center dot */}
      <div
        className="absolute left-[30%] top-[25%] h-[30%] w-[25%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(236,214,249,0.06) 0%, transparent 60%)",
          animation: "glowPulse 8s ease-in-out 2s infinite",
          filter: "blur(40px)",
        }}
      />

      {/* Bottom fade to page black */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,var(--bp-black)_100%)]" />

      {/* Side vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_40%,transparent_30%,var(--bp-black)_100%)]" />
    </div>
  );
}
