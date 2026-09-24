import React from "react";

export function BackgroundShapes() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(ellipse_at_14%_8%,rgba(202,159,245,0.22),transparent_42%),radial-gradient(ellipse_at_88%_18%,rgba(102,147,247,0.16),transparent_38%),radial-gradient(ellipse_at_58%_72%,rgba(85,233,171,0.09),transparent_35%)]" />
      <div
        className="absolute inset-x-0 top-0 h-[760px] opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(236,228,253,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(236,228,253,0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 58% 34%, black 0%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 58% 34%, black 0%, transparent 72%)",
        }}
      />
      <div className="absolute inset-x-0 top-[360px] h-[520px] bg-gradient-to-b from-transparent via-black/75 to-black" />
    </div>
  );
}
