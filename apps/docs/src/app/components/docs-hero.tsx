"use client";

import { JetBrains_Mono } from "next/font/google";
import { AskVectorHero } from "./ask-vector-hero";
import { VectorAnswerPreview } from "./vector-answer-preview";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

const dividerLine = {
  flex: 1,
  height: "1px",
  background: "rgba(255, 255, 255, 0.07)",
} as const;

export function DocsHero() {
  return (
    <>
      {/* Break the hero + answer preview out of the fumadocs article
          (max-w-[1086px]) so they span the full page column: #nd-page
          becomes the width reference (100cqw) and the article is kept
          centered at every breakpoint so the overhang is symmetric.
          The article body below stays at its readable width. */}
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
          gap: "12px",
        }}
      >
        <AskVectorHero />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <span style={dividerLine} />
          <span
            className={jetbrainsMono.className}
            style={{
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#8b8b9a",
            }}
          >
            Example
          </span>
          <span style={dividerLine} />
        </div>
        <VectorAnswerPreview />
      </div>
    </>
  );
}
