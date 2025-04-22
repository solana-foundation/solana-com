"use client";

import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { useState } from "react";
import { CodeRun } from "@/utils/mirror";
import { Callout } from "fumadocs-ui/components/callout";
import { Info, Loader2, Play } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { cn } from "../utils";

type LogMessage = {
  text: string;
  prefix: string;
  style: "muted" | "info" | "success" | "warning";
};

type InstructionLogs = {
  invokedProgram: string | null;
  logs: LogMessage[];
  computeUnits: number;
  truncated: boolean;
  failed: boolean;
};

// Function to parse program logs
function parseProgramLogs(logs: string[]): InstructionLogs[] {
  let depth = 0;
  const prettyLogs: InstructionLogs[] = [];

  function prefixBuilder(indentLevel: number) {
    let prefix;
    if (indentLevel <= 0) {
      prefix = "";
    } else {
      prefix = new Array(indentLevel * 8).fill("\u00A0").join("");
    }
    return prefix;
  }

  logs.forEach((log) => {
    if (log.startsWith("Program log:")) {
      // Use passive tense
      const formattedLog = log.replace(/Program log: (.*)/g, (match, p1) => {
        return `Program logged: "${p1}"`;
      });

      if (prettyLogs.length > 0) {
        prettyLogs[prettyLogs.length - 1].logs.push({
          prefix: prefixBuilder(depth),
          style: "muted",
          text: formattedLog,
        });
      }
    } else if (log.startsWith("Log truncated")) {
      if (prettyLogs.length > 0) {
        prettyLogs[prettyLogs.length - 1].truncated = true;
      }
    } else {
      // Check for program invocations
      const invokeRegex = /Program (\w*) invoke \[(\d)\]/;
      const invokeMatch = log.match(invokeRegex);

      if (invokeMatch) {
        const programAddress = invokeMatch[1];
        const invokeLevel = parseInt(invokeMatch[2]);

        // Only create a new instruction for top-level invokes
        if (invokeLevel === 1) {
          prettyLogs.push({
            computeUnits: 0,
            failed: false,
            invokedProgram: programAddress,
            logs: [],
            truncated: false,
          });
        } else if (prettyLogs.length > 0) {
          // For nested invokes, add to the current instruction's logs
          const programName = mapProgramAddressToName(programAddress);
          prettyLogs[prettyLogs.length - 1].logs.push({
            prefix: prefixBuilder(depth),
            style: "info",
            text: `Program invoked: ${programName}`,
          });
        }

        depth++;
      } else if (log.includes("success")) {
        if (prettyLogs.length > 0) {
          prettyLogs[prettyLogs.length - 1].logs.push({
            prefix: prefixBuilder(depth),
            style: "success",
            text: `Program returned success`,
          });
        }
        depth--;
      } else if (log.includes("failed")) {
        if (prettyLogs.length > 0) {
          const instructionLog = prettyLogs[prettyLogs.length - 1];
          instructionLog.failed = true;

          let currText = `Program returned error: "${log.slice(log.indexOf(": ") + 2)}"`;
          // failed to verify log of previous program so reset depth and print full log
          if (log.startsWith("failed")) {
            depth++;
            currText = log.charAt(0).toUpperCase() + log.slice(1);
          }

          instructionLog.logs.push({
            prefix: prefixBuilder(depth),
            style: "warning",
            text: currText,
          });
        }
        depth--;
      } else {
        if (depth === 0) {
          prettyLogs.push({
            computeUnits: 0,
            failed: false,
            invokedProgram: null,
            logs: [],
            truncated: false,
          });
          depth++;
        }

        // Remove redundant program address from logs
        const formattedLog = log.replace(
          /Program \w* consumed (\d*) (.*)/g,
          (match, p1, p2) => {
            // Only aggregate compute units consumed from top-level tx instructions
            if (depth === 1 && prettyLogs.length > 0) {
              prettyLogs[prettyLogs.length - 1].computeUnits +=
                Number.parseInt(p1);
            }

            return `Program consumed: ${p1} ${p2}`;
          },
        );

        if (prettyLogs.length > 0) {
          // native program logs don't start with "Program log:"
          prettyLogs[prettyLogs.length - 1].logs.push({
            prefix: prefixBuilder(depth),
            style: "muted",
            text: formattedLog,
          });
        }
      }
    }
  });

  return prettyLogs;
}

// Helper function to map program addresses to friendly names
function mapProgramAddressToName(address: string): string {
  const programMap: { [key: string]: string } = {
    "11111111111111111111111111111111": "System Program",
    TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: "Token Program",
    TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb: "Token-2022 Program",
    ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL: "Associated Token Program",
    metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s: "Token Metadata Program",
  };

  return programMap[address] || address;
}

// Component for rendering a single log message
function LogMessage({ log }: { log: LogMessage }) {
  const styleClassMap = {
    info: "text-blue-600 dark:text-blue-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-amber-600 dark:text-pink-400",
    muted: "text-gray-800 dark:text-gray-300",
  };

  const logClassName = styleClassMap[log.style] || styleClassMap.muted;

  const isInvocation = log.text.includes("Program invoked:");
  const isReturn = log.text.includes("Program returned success");

  let spacingClass = "";
  if (isInvocation) spacingClass = "mt-2";
  else if (isReturn) spacingClass = "mb-2";

  return (
    <div className={`whitespace-nowrap ${logClassName} ${spacingClass}`}>
      <span className="opacity-70">{log.prefix}</span>
      {log.text}
    </div>
  );
}

// Component for rendering a single instruction
function Instruction({
  instruction,
  ixIndex,
}: {
  instruction: InstructionLogs;
  ixIndex: number;
}) {
  const instructionLabelClass =
    "inline-block px-2 py-0.5 text-sm rounded-sm leading-tight font-bold bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";

  return (
    <div className="pl-2 mt-2">
      {ixIndex > 0 && (
        <div className="my-4 mr-0 -ml-4 border-t border-gray-200 dark:border-gray-700"></div>
      )}
      <div className="mb-1 overflow-x-visible">
        <div className="font-semibold whitespace-nowrap">
          <span className={`${instructionLabelClass} mr-1`}>
            Instruction #{ixIndex + 1}
          </span>
          {instruction.computeUnits > 0 && (
            <span className={`${instructionLabelClass} ml-2`}>
              {instruction.computeUnits} Compute Units
            </span>
          )}
          {instruction.failed && (
            <span className="ml-2 text-red-500">Failed</span>
          )}
        </div>
      </div>
      <div className="pl-4 overflow-x-visible">
        <div className="whitespace-nowrap">
          {instruction.invokedProgram && (
            <div className="mb-1 text-blue-600 whitespace-nowrap dark:text-blue-400">
              {mapProgramAddressToName(instruction.invokedProgram)} Instruction
            </div>
          )}
          {instruction.logs.map((log, logIndex) => (
            <LogMessage key={logIndex} log={log} />
          ))}
          {instruction.truncated && (
            <div className="mt-1 italic text-gray-400 whitespace-nowrap">
              Log truncated...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for rendering a transaction
function Transaction({
  group,
  groupIndex,
  instructions,
}: {
  group: { url: string; logIndices: number[] };
  groupIndex: number;
  instructions: InstructionLogs[];
}) {
  return (
    <div key={group.url} className="mb-4">
      <div className="font-medium">
        <a href={group.url} target="_blank" className="font-bold">
          Solana Explorer: Transaction {groupIndex + 1}
        </a>
      </div>
      <div className="relative pl-2">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        <div>
          {instructions.map((instruction, ixIndex) => (
            <Instruction
              key={ixIndex}
              instruction={instruction}
              ixIndex={ixIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Function to process logs and group them by transaction
function processLogs(logs: { log: string; url: string }[]) {
  // Parse all logs at once
  const allLogTexts = logs.map((log) => log.log);
  const parsedLogs = parseProgramLogs(allLogTexts);

  // Group logs by URL for transaction display
  const txGroups: { url: string; logIndices: number[] }[] = [];

  logs.forEach((log, index) => {
    // Find the transaction group for this log
    const existingGroup = txGroups.find((group) => group.url === log.url);
    if (existingGroup) {
      existingGroup.logIndices.push(index);
    } else {
      txGroups.push({
        url: log.url,
        logIndices: [index],
      });
    }
  });

  // Map each transaction to a set of instructions
  const txToInstructions = new Map<string, InstructionLogs[]>();
  let processedInvokeCount = 0;

  // Associate instructions with transactions based on log indices
  txGroups.forEach((group) => {
    const instructionsForTx: InstructionLogs[] = [];

    // Find instructions that correspond to this transaction's log indices
    const topLevelIndices: number[] = [];
    allLogTexts.forEach((log, index) => {
      const invokeMatch = log.match(/Program (\w*) invoke \[1\]/);
      if (invokeMatch && group.logIndices.includes(index)) {
        topLevelIndices.push(index);
      }
    });

    // Then extract instructions using the parsed logs
    if (topLevelIndices.length > 0) {
      topLevelIndices.forEach((_startIndex, _i) => {
        // Find if there's a parsed instruction that matches this range
        // This is a heuristic method - we're assuming instructions are in the same order
        if (processedInvokeCount < parsedLogs.length) {
          instructionsForTx.push(parsedLogs[processedInvokeCount]);
          processedInvokeCount++;
        }
      });
    }

    txToInstructions.set(group.url, instructionsForTx);
  });

  return { txGroups, txToInstructions };
}

export function RunableCode({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CodeRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    "open",
  );

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
          `Error running code: ${data.error || data.details?.error || "Unknown error"}`,
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

  // Custom title component with div that looks like a button to put in the Accordion
  // Can't have button since Accordion itself is a button and throws a react error
  const AccordionTitle = (
    <div className="flex items-center justify-between w-full">
      <span>
        Output{" "}
        <a
          href="https://mirror.ad"
          target="_blank"
          className="!text-[#a257ff] dark:!text-[#00ffbb] hover:!underline"
        >
          (Powered by Mirror)
        </a>
      </span>
      <button
        onClick={handleRun}
        className={`px-3 py-1 ml-auto relative z-10 rounded bg-[#9945FF] text-white text-sm cursor-pointer ${running ? "opacity-70" : "hover:bg-[#8838e0]"}`}
        disabled={running}
      >
        {running ? (
          <Loader2 className="inline-block w-4 h-4 animate-spin" />
        ) : (
          "Run"
        )}
      </button>
    </div>
  );

  return (
    <>
      <Accordions
        type="single"
        className="mt-4"
        // @ts-ignore - Using value from underlying Radix UI component
        value={openAccordion}
        onValueChange={setOpenAccordion}
      >
        <Accordion
          // @ts-ignore - Using React element as title
          title={AccordionTitle}
          // @ts-ignore - Using value from underlying Radix UI component
          value="open"
        >
          {result ? (
            <>
              <pre>{result.output}</pre>
              {result.logs.length > 0 && (
                <div>
                  <h4>Program Logs</h4>
                  <div className="pl-4 overflow-x-auto">
                    {(() => {
                      const { txGroups, txToInstructions } = processLogs(
                        result.logs,
                      );
                      return txGroups.map((group, groupIndex) => (
                        <Transaction
                          key={group.url}
                          group={group}
                          groupIndex={groupIndex}
                          instructions={txToInstructions.get(group.url) || []}
                        />
                      ));
                    })()}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              {error ||
                (running ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Code...
                  </div>
                ) : (
                  "Click 'Run' to see output."
                ))}
            </div>
          )}
        </Accordion>
      </Accordions>
      <Callout type="info">
        <b>Program Logs</b> in the Output are clickable links to Solana
        Explorer.
        <br></br>You must enable the <b>&quot;Enable Custom URL Param&quot;</b>{" "}
        setting on Solana Explorer. <br></br>If not enabled, links will default
        to localhost:8899 instead of the Mirror.ad RPC URL.
      </Callout>
    </>
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
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CodeRun | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEmpty = !result;

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
          `Error running code: ${data.error || data.details?.error || "Unknown error"}`,
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

  const button = (
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
  );

  return (
    <div
      className={cn(
        "flex gap-1 max-h-[700px] min-h-0 overflow-hidden ",
        className,
      )}
    >
      <div className="w-1/2 min-h-0">{children}</div>
      <div className="w-1/2 flex flex-col gap-1 min-h-0">
        <div className="rounded bg-ch-background border border-ch-border flex flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b-[1px] border-ch-border px-2 py-1 bg-ch-tabs-background h-9 min-h-9 shrink-0 text-sm text-ch-tab-active-foreground">
            <span>Console</span>
            <a
              href="https://mirror.ad"
              target="_blank"
              className="text-sm hover:underline"
            >
              Powered by Mirror
            </a>
          </div>
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center w-full py-3 gap-2">
              <span className="h-4" />
              {button}
              <span
                className={`text-sm h-4 ${running ? "opacity-0" : "opacity-80"} transition-opacity duration-100 ${error ? "text-red-500" : ""}`}
              >
                {!error
                  ? "Click to execute the code."
                  : "There was an error running the code."}
              </span>
            </div>
          ) : (
            <pre className="p-2 text-sm text-ch-foreground font-mono overflow-auto flex-1">
              {result?.output}
            </pre>
          )}
        </div>
        <div className="flex-1 rounded bg-ch-background border border-ch-border flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b-[1px] border-ch-border px-2 py-1 bg-ch-tabs-background h-9 min-h-9 shrink-0 text-sm text-ch-tab-active-foreground">
            <span>Output</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={18} />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p>
                    <b>Program Logs</b> in the Output are clickable links to
                    Solana Explorer.
                  </p>
                  <p>
                    You must enable the{" "}
                    <b>&quot;Enable Custom URL Param&quot;</b> setting on Solana
                    Explorer. If not enabled, links will default to
                    localhost:8899 instead of the Mirror.ad RPC URL.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="p-2 flex-1 overflow-auto">
            {isEmpty ? (
              <div className="text-sm opacity-80">No output yet</div>
            ) : (
              (() => {
                const { txGroups, txToInstructions } = processLogs(
                  result?.logs || [],
                );
                return txGroups.map((group, groupIndex) => (
                  <Transaction
                    key={group.url}
                    group={group}
                    groupIndex={groupIndex}
                    instructions={txToInstructions.get(group.url) || []}
                  />
                ));
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
