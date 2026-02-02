"use client";

import { InkeepSearchBar } from "@solana-com/ui-chrome";
import { LLMCopyButton, ViewOptions } from "./page-actions";

interface DocsHeroProps {
  title: string;
  description?: string;
  markdown: string;
}

export function DocsHero({ title, description, markdown }: DocsHeroProps) {
  return (
    <section className="relative mb-4 overflow-hidden rounded-xl border border-[hsl(var(--fd-border))] bg-gradient-to-b from-[hsl(var(--background))] via-[hsl(var(--background))] to-[hsl(var(--fd-muted-foreground)/0.06)] dark:to-[hsl(var(--fd-muted-foreground)/0.08)] px-6 py-12 md:px-10 md:py-16">
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
        <div className="mt-6 flex w-full justify-center">
          <div className="w-full max-w-2xl">
            <InkeepSearchBar className="!w-full !max-w-none" expanded />
          </div>
        </div>
        <div className="mt-5 flex flex-row justify-center gap-2">
          <LLMCopyButton markdown={markdown} />
          <ViewOptions markdown={markdown} />
        </div>
      </div>
    </section>
  );
}
