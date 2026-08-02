"use client";

import { JetBrains_Mono } from "next/font/google";
import { AskSolanaSearchBar, isAskSolanaEnabled } from "@solana-com/ui-chrome";
import { LLMCopyButton, ViewOptions } from "./page-actions";
import { AskVectorHero } from "./ask-vector-hero";
import { VectorAnswerPreview } from "./vector-answer-preview";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

const dividerLine = {
  flex: 1,
  height: "1px",
  background: "rgba(255, 255, 255, 0.07)",
} as const;

interface DocsHeroProps {
  title: string;
  description?: string;
  markdown: string;
}

export function DocsHero({ title, description, markdown }: DocsHeroProps) {
  if (isAskSolanaEnabled()) {
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
  return (
    <section className="relative mb-4 overflow-hidden rounded-xl border border-[hsl(var(--fd-border))] bg-gradient-to-b from-[hsl(var(--background))] via-[hsl(var(--background))] to-[hsl(var(--fd-muted-foreground)/0.06)] dark:to-[hsl(var(--fd-muted-foreground)/0.08)] px-8 py-32 md:px-20 md:py-32">
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--fd-accent-foreground))] md:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-base text-[hsl(var(--fd-muted-foreground))] md:text-lg">
          {description}
        </p>
        <div className="mt-8 flex w-full justify-center">
          <div className="w-full max-w-2xl">
            <AskSolanaSearchBar className="!w-full !max-w-none" expanded />
          </div>
        </div>
        <div className="mt-6 flex flex-row justify-center gap-2">
          <LLMCopyButton markdown={markdown} />
          <ViewOptions markdown={markdown} />
        </div>
      </div>
    </section>
  );
}
