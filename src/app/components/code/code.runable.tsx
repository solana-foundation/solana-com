"use client";

import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { useState } from "react";
import { CodeRun } from "@/utils/mirror";
import { Callout } from "fumadocs-ui/components/callout";
import { Loader2 } from "lucide-react";

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
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleRun();
        }}
        className={`px-3 py-1 ml-auto relative z-10 rounded bg-[#9945FF] text-white text-sm cursor-pointer ${running ? "opacity-70" : "hover:bg-[#8838e0]"}`}
      >
        {running ? (
          <Loader2 className="inline-block w-4 h-4 animate-spin" />
        ) : (
          "Run"
        )}
      </div>
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
                  <ol>
                    {result.logs.map((log: any) => (
                      <li key={log.id}>
                        <a href={log.url} target="_blank">
                          {log.log}
                        </a>
                      </li>
                    ))}
                  </ol>
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
