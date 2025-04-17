"use client";

import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Button } from "@solana-foundation/solana-lib";
import { useState } from "react";
import { CodeRun } from "@/utils/mirror";
import { Callout } from "fumadocs-ui/components/callout";

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

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    setError(null);
    const res = await fetch("/docs/api", {
      method: "POST",
      body: JSON.stringify({ code, language }),
    });
    setRunning(false);
    if (!res.ok) {
      const error = await res.json();
      setError("Error running code: " + error.details.error);
      return;
    }
    const data = await res.json();
    if (data.error) {
      setError("Error running code: " + data.error);
      return;
    }
    setResult(data as CodeRun);
  };

  return (
    <>
      <Button onClick={handleRun} disabled={running}>
        {running ? "Running..." : "Run"}
      </Button>
      <Callout type="info">
        Note: Output logs are clickable. You must have{" "}
        <span>Enable Custom URL Param</span> set to true in the explorer. If
        not, the link will default to <span>localhost:8899</span>
      </Callout>
      <Accordions type="single" className="mt-4">
        <Accordion title="Output (powered by Mirror.ad)">
          {result ? (
            <>
              <pre>{result.output}</pre>
              {result.logs.length > 0 && (
                <div>
                  <h3>Logs</h3>
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
            <p>{error || "No output yet."}</p>
          )}
        </Accordion>
      </Accordions>
    </>
  );
}
