"use client";

import { createContext, useContext, useState } from "react";
import { LoaderLines } from "@boxicons/react/LoaderLines";
import { Play } from "@boxicons/react/Play";
import { X } from "@boxicons/react/X";
import React from "react";
import { cn } from "../utils";
import { hasRunners, loadRunner } from "./runners/registry";

type Example = {
  /** The code shown in the active tab. */
  code: string;
  language: string;
  /** The active tab's title, which selects the runner for this example. */
  title: string;
  /** What running the example prints, from an `.output.txt` beside its source. */
  output?: string;
  /** Id into the runner registry, from the `runner` prop on `<CodeTabs>`. */
  runner?: string;
};

type RunnableState = {
  /** False when the block has neither a captured output nor a runner. */
  canRun: boolean;
  running: boolean;
  output: React.ReactNode | null;
  error: string | null;
  consoleOpen: boolean;
  run: () => void;
  closeConsole: () => void;
};

const RunnableContext = createContext<RunnableState | null>(null);

/** How long "Running" stays on screen, so output doesn't appear instantly. */
const MIN_RUN_MS = 500;

/**
 * Holds the run state for one code block. Nothing is executed: a block either
 * has a browser-side runner (for examples whose output is freshly generated
 * data) or a static output captured from the real example. Blocks with
 * neither render as a plain code block, with no Run button.
 */
export function Runnable({
  children,
  ...example
}: Example & { children: React.ReactNode }) {
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consoleOpen, setConsoleOpen] = useState(false);

  const canRun = example.output !== undefined || hasRunners(example.runner);

  const run = async () => {
    setRunning(true);
    setConsoleOpen(true);
    setOutput(null);
    setError(null);

    const startedAt = Date.now();
    try {
      const result = await resolveOutput(example);
      await settle(startedAt);
      setOutput(result);
    } catch (err) {
      await settle(startedAt);
      setError(err instanceof Error ? err.message : "Could not run example");
    } finally {
      setRunning(false);
    }
  };

  return (
    <RunnableContext.Provider
      value={{
        canRun,
        running,
        output,
        error,
        consoleOpen,
        run,
        closeConsole: () => setConsoleOpen(false),
      }}
    >
      {children}
    </RunnableContext.Provider>
  );
}

async function resolveOutput({
  code,
  language,
  title,
  output,
  runner,
}: Example): Promise<React.ReactNode> {
  if (runner) {
    const run = await loadRunner(runner, { title, language });
    if (run) return run({ code, language, title });
  }
  return output ?? "";
}

function settle(startedAt: number): Promise<void> {
  const remaining = MIN_RUN_MS - (Date.now() - startedAt);
  if (remaining <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, remaining));
}

/** Sits in the code block's header beside the copy button. */
export function RunButton({ className }: { className?: string }) {
  const state = useContext(RunnableContext);
  if (!state?.canRun) return null;
  const { running, run } = state;

  return (
    <button
      onClick={run}
      disabled={running}
      aria-label="Run example"
      className={cn(
        "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-sans font-semibold",
        "text-[#9945FF] hover:bg-[#9945FF]/10 disabled:opacity-70 disabled:cursor-default",
        className,
      )}
    >
      {running ? (
        <LoaderLines width={14} height={14} className="animate-spin" />
      ) : (
        <Play width={14} height={14} />
      )}
      <span>{running ? "Running" : "Run"}</span>
    </button>
  );
}

/** Opens beneath the code once Run is pressed; closes from its header. */
export function RunnableConsole() {
  const state = useContext(RunnableContext);
  if (!state?.canRun || !state.consoleOpen) return null;
  const { running, output, error, closeConsole } = state;

  return (
    <div className="flex flex-col border-t border-ch-border bg-ch-background shrink-0 min-h-0">
      <div className="flex justify-between items-center px-3 h-8 text-xs border-b border-ch-border bg-ch-tabs-background text-ch-tab-inactive-foreground shrink-0">
        <span className="font-mono">Console</span>
        <button
          onClick={closeConsole}
          aria-label="Close console"
          className="p-1 -mr-1 rounded hover:text-ch-tab-active-foreground"
        >
          <X width={14} height={14} />
        </button>
      </div>
      <pre
        className={cn(
          "overflow-auto m-0 p-3 font-mono text-sm rounded-none !bg-ch-background text-ch-foreground max-h-72 whitespace-pre-wrap",
          error && "text-red-500",
          running && "opacity-50",
        )}
      >
        {running ? "Running…" : (error ?? output)}
      </pre>
    </div>
  );
}
