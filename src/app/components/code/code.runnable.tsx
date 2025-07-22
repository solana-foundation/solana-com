"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import React from "react";
import { cn } from "../utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/components/ui/resizable";

function ConsoleHeader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-2 justify-between items-center px-2 py-1 h-9 text-sm border-b-[1px] border-ch-border bg-ch-tabs-background min-h-9 shrink-0 text-ch-tab-active-foreground",
        className,
      )}
    >
      <span>Console</span>
    </div>
  );
}

function EmptyConsole({
  running,
  error,
  handleRun,
}: {
  running: boolean;
  error: string | null;
  handleRun: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 justify-center items-center py-3 w-full">
      <span className="md:h-4" />
      <button
        onClick={handleRun}
        className={`w-28 px-3 py-1 relative z-10 rounded bg-[#9945FF] text-white text-sm font-bold cursor-pointer flex justify-center items-center gap-2 ${running ? "opacity-80" : "hover:bg-[#8838e0]"}`}
        disabled={running}
      >
        {running ? (
          <>
            <Loader2 className="inline-block w-4 h-4 animate-spin" />
            <span>Running</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Run</span>
          </>
        )}
      </button>
      <span
        className={`text-sm h-4 ${running ? "opacity-0" : "opacity-80"} transition-opacity duration-100 ${error ? "text-red-500" : ""}`}
      >
        {!error
          ? "Click to execute the code."
          : "There was an error running the code."}
      </span>
    </div>
  );
}

type CodeRun = {
  output: string;
};

type RunnableCodeState = {
  running: boolean;
  result: CodeRun | null;
  error: string | null;
  handleRun: () => void;
};

function useRunnableCode(code: string, language: string): RunnableCodeState {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CodeRun | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/docs/api", {
        method: "POST",
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(
          `Error running code: ${JSON.stringify(data.details?.error || data.error || "Unknown error")}`,
        );
        return;
      }

      setResult(data as CodeRun);
    } catch (err) {
      setError(
        `Error running code: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setRunning(false);
    }
  };

  return {
    running,
    result,
    error,
    handleRun,
  };
}

function Console({
  state,
  className,
}: {
  state: RunnableCodeState;
  className?: string;
}) {
  const { running, result, error, handleRun } = state;
  return (
    <div
      className={cn(
        "rounded border bg-ch-background border-ch-border",
        className,
      )}
    >
      <ConsoleHeader />
      {!result ? (
        <EmptyConsole running={running} error={error} handleRun={handleRun} />
      ) : (
        <pre className="overflow-auto flex-1 p-2 font-mono text-sm text-ch-foreground">
          {result?.output}
        </pre>
      )}
    </div>
  );
}

export function RunnableLayout({
  children,
  code,
  language,
  className,
}: {
  children: React.ReactNode;
  code: string;
  language: string;
  className?: string;
}) {
  const state = useRunnableCode(code, language);

  // disable runnable for python, server does not support python code
  if (language === "py") {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <div className="md:hidden">
        {children}
        <Console state={state} className="mt-2" />
      </div>
      <div className="hidden wider md:block">
        <ResizablePanelGroup
          direction="horizontal"
          className={cn(
            "overflow-hidden max-h-[700px] min-h-[275px]",
            className,
          )}
        >
          <ResizablePanel defaultSize={50} minSize={0}>
            <div className="min-w-0 h-full min-h-0">{children}</div>
          </ResizablePanel>
          <ResizableHandle withHandle className="w-1 bg-transparent" />
          <ResizablePanel defaultSize={50} minSize={0}>
            <Console
              state={state}
              className="flex overflow-hidden flex-col h-full"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
