"use client";

/**
 * Hero background — CSS-only grain + animated purple glow.
 * Replaces the canvas-based water shader with a lighter-weight,
 * more editorial atmospheric effect.
 */
export function WaterHeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(171,102,253,0.26),transparent_28%),linear-gradient(180deg,#11081b_0%,#0b0614_55%,#09050f_100%)]" />
      <div className="absolute inset-0 bg-bp-grid bg-grid opacity-20" />
      <div
        className="absolute left-[-8%] top-[-12%] h-[60vh] w-[55vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(171,102,253,0.28) 0%, rgba(89,184,254,0.14) 38%, transparent 68%)",
          animation: "glowPulse 6s ease-in-out infinite",
          filter: "blur(90px)",
        }}
      />
      <div
        className="absolute bottom-[-12%] right-[-8%] h-[48vh] w-[40vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(20,241,149,0.14) 0%, rgba(171,102,253,0.12) 42%, transparent 68%)",
          animation: "glowDrift 10s ease-in-out infinite",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute left-[26%] top-[24%] h-[24vh] w-[18vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(231,210,249,0.1) 0%, transparent 60%)",
          animation: "glowPulse 8s ease-in-out 2s infinite",
          filter: "blur(40px)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(17,8,27,0.2)_68%,#11081b_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_85%_at_50%_10%,transparent_34%,rgba(17,8,27,0.7)_82%,#11081b_100%)]" />
    </div>
  );
}
