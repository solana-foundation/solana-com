import React from "react";

/**
 * Soft brand glows used behind the templates hero.
 * Matches the radial-glow treatment on newer nd-styled pages.
 */
export function BackgroundShapes() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute top-0 -left-[550px] hidden md:block h-[620px] w-[620px] rounded-full bg-nd-highlight-lavendar/10 blur-[130px]" />
      <div className="absolute -top-44 -right-[550px] hidden md:block h-[620px] w-[620px] rounded-full bg-nd-highlight-green/10 blur-[130px]" />
    </div>
  );
}
