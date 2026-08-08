import React from "react";

/**
 * Full-page soft brand glows used behind the templates pages.
 * Matches the radial-glow treatment on newer nd-styled pages.
 */
export function BackgroundShapes() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute -top-44 -left-56 h-[640px] w-[640px] rounded-full bg-nd-highlight-lavendar/25 blur-[140px]" />
      <div className="absolute top-16 -right-56 h-[600px] w-[600px] rounded-full bg-nd-highlight-blue/20 blur-[140px]" />
      <div className="absolute -bottom-48 -right-40 h-[640px] w-[640px] rounded-full bg-nd-highlight-green/20 blur-[140px]" />
    </div>
  );
}
