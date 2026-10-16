"use client";

import { AskSolanaChatView, VectorRobotIcon } from "@solana-com/ui-chrome";

/**
 * Standalone full-page Ask Solana chat, opened in a new tab from the hero
 * ask bar (Enter) with the typed question in ?q=. Always dark, using the same
 * gradient + grid background as the AskVectorHero landing.
 */
export function AskPage({ initialQuery }: { initialQuery: string }) {
  return (
    <div className="relative min-h-dvh bg-[radial-gradient(130%_120%_at_20%_0%,#1a0f2e,#0b0813_48%,#070709)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:38px_38px]"
      />
      <main className="relative mx-auto flex h-dvh min-h-[480px] w-full flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-white/10 px-6 py-3 md:px-10">
          {/* RobotIcon is 54x66; scale it to header size (75%). */}
          <span
            className="mx-3 block h-[50px] w-[41px] shrink-0"
            aria-hidden="true"
          >
            <span className="block origin-top-left scale-75">
              <VectorRobotIcon />
            </span>
          </span>
          <div>
            <h1 className="text-[15px] font-semibold leading-tight text-white">
              Vector
            </h1>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-gray-500">
              <span
                className="inline-block size-1.5 animate-pulse rounded-full bg-[#14F195]"
                aria-hidden="true"
              />
              Online · solana ai docs assistant
            </div>
          </div>
        </header>
        <AskSolanaChatView
          isDark
          initialQuery={initialQuery}
          className="min-h-0 flex-1"
          surface="inline"
          fullWidthComposer
        />
      </main>
    </div>
  );
}
