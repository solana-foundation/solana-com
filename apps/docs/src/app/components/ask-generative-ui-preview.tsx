"use client";

import * as React from "react";
import {
  GenerativeUiAnswer,
  getAskGenerativeUiDiagnostics,
} from "@solana-com/ui-chrome/ask-solana/generative-ui";
import { commonVisualGenerativeUiFixtures } from "@solana-com/ui-chrome/ask-solana/fixtures";

const FRAME_OPTIONS = [
  { id: "both", label: "Both" },
  { id: "desktop", label: "Desktop" },
  { id: "mobile", label: "Mobile" },
] as const;

type FrameMode = (typeof FRAME_OPTIONS)[number]["id"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function PreviewFrame({
  title,
  width,
  children,
  testId,
}: {
  title: string;
  width: number;
  children: React.ReactNode;
  testId: string;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-gray-500">
          {width}px
        </span>
      </div>
      <div
        data-testid={testId}
        className="overflow-x-auto rounded-xl border border-white/10 bg-[#050507] p-3"
      >
        <div
          data-testid={`${testId}-surface`}
          className="min-h-[560px] max-w-full rounded-lg border border-white/10 bg-[#09090d] p-4"
          style={{ width }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function DiagnosticsPanel({
  fixtureName,
  ui,
}: {
  fixtureName: string;
  ui: (typeof commonVisualGenerativeUiFixtures)[number]["ui"];
}) {
  const diagnostics = React.useMemo(
    () => getAskGenerativeUiDiagnostics(ui),
    [ui],
  );
  const errorCount = diagnostics.filter(
    (diagnostic) => diagnostic.level === "error",
  ).length;
  const warningCount = diagnostics.filter(
    (diagnostic) => diagnostic.level === "warning",
  ).length;

  return (
    <aside className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Payload health</h2>
          <p className="mt-1 text-xs text-gray-500">{fixtureName}</p>
        </div>
        <span
          data-testid="diagnostics-summary"
          className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-gray-400"
        >
          {errorCount} errors / {warningCount} warnings
        </span>
      </div>

      {diagnostics.length === 0 ? (
        <p className="mt-4 rounded-lg border border-[#14F195]/20 bg-[#14F195]/10 px-3 py-2 text-xs text-[#8ff0c6]">
          No renderer diagnostics.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {diagnostics.map((diagnostic, index) => (
            <li
              key={`${diagnostic.path}-${index}`}
              className="rounded-lg border border-white/10 bg-black/30 p-2.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
                  {diagnostic.level}
                </span>
                <code className="text-[11px] text-[#c9b6ff]">
                  {diagnostic.path}
                </code>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-gray-300">
                {diagnostic.message}
              </p>
            </li>
          ))}
        </ul>
      )}

      <details className="mt-4 rounded-lg border border-white/10 bg-black/30">
        <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-gray-300">
          Payload JSON
        </summary>
        <pre className="max-h-80 overflow-auto border-t border-white/10 p-3 text-[11px] leading-relaxed text-gray-400">
          {JSON.stringify(ui, null, 2)}
        </pre>
      </details>
    </aside>
  );
}

export function AskGenerativeUiPreview() {
  const [selectedFixture, setSelectedFixture] = React.useState<string>(
    commonVisualGenerativeUiFixtures[0].name,
  );
  const [frameMode, setFrameMode] = React.useState<FrameMode>("both");
  const fixture =
    commonVisualGenerativeUiFixtures.find(
      (candidate) => candidate.name === selectedFixture,
    ) ?? commonVisualGenerativeUiFixtures[0];
  const desktopVisible = frameMode === "both" || frameMode === "desktop";
  const mobileVisible = frameMode === "both" || frameMode === "mobile";

  return (
    <main className="min-h-dvh bg-[#07070b] px-4 py-8 text-white md:px-6">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#14F195]">
              Ask Solana QA
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              Generative UI fixture preview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
              Fixture-driven preview for the compact archetype contract,
              responsive layout, effect states, and payload diagnostics.
            </p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Frame">
            {FRAME_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={frameMode === option.id}
                onClick={() => setFrameMode(option.id)}
                className={[
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  frameMode === option.id
                    ? "border-[#14F195]/50 bg-[#14F195]/10 text-[#8ff0c6]"
                    : "border-white/10 bg-white/[0.035] text-gray-400 hover:border-white/20 hover:text-white",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <nav
            aria-label="Generative UI fixtures"
            className="rounded-xl border border-white/10 bg-white/[0.035] p-3"
          >
            <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Fixtures
            </div>
            <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              {commonVisualGenerativeUiFixtures.map((candidate) => (
                <button
                  key={candidate.name}
                  type="button"
                  data-testid={`fixture-${slugify(candidate.name)}`}
                  aria-pressed={candidate.name === fixture.name}
                  onClick={() => setSelectedFixture(candidate.name)}
                  className={[
                    "min-w-max rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors lg:min-w-0",
                    candidate.name === fixture.name
                      ? "border-[#9945FF]/50 bg-[#9945FF]/15 text-white"
                      : "border-transparent text-gray-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
                  ].join(" ")}
                >
                  {candidate.name}
                </button>
              ))}
            </div>
          </nav>

          <div className="min-w-0 space-y-5">
            <DiagnosticsPanel fixtureName={fixture.name} ui={fixture.ui} />
            <div
              className={[
                "grid gap-5",
                desktopVisible && mobileVisible
                  ? "xl:grid-cols-[minmax(0,1fr)_430px]"
                  : "",
              ].join(" ")}
            >
              {desktopVisible ? (
                <PreviewFrame
                  title="Desktop"
                  width={1040}
                  testId="desktop-preview"
                >
                  <GenerativeUiAnswer ui={fixture.ui} />
                </PreviewFrame>
              ) : null}
              {mobileVisible ? (
                <PreviewFrame
                  title="Mobile"
                  width={390}
                  testId="mobile-preview"
                >
                  <GenerativeUiAnswer ui={fixture.ui} />
                </PreviewFrame>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
