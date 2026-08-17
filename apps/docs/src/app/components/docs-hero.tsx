"use client";

import { AskVectorHero } from "./ask-vector-hero";

export function DocsHero() {
  return (
    <>
      {/* Break the hero out of the fumadocs article (max-w-[1086px]) so it
          spans the full page column: #nd-page becomes the width reference
          (100cqw) and the article is kept centered at every breakpoint so
          the overhang is symmetric. */}
      {/* The double-id selector + !important out-rank the global
          `.fumadocs article { padding-top: 2rem !important }` rules so the
          hero sits flush with the top of the content column. */}
      <style>{`
        #nd-page { container-type: inline-size; }
        #nd-docs-layout #nd-page article { margin-inline: auto; padding-top: 0 !important; }
      `}</style>
      <div
        style={{
          width: "100cqw",
          alignSelf: "center",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AskVectorHero />
      </div>
    </>
  );
}
