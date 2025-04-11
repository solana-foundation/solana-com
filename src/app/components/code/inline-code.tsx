import { highlight, Inline, RawCode } from "codehike/code";
import React from "react";
import { theme } from "./code-group";

export async function InlineCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, theme);
  return (
    <Inline
      code={highlighted}
      className="selection:bg-ch-selection rounded border border-ch-border px-1 py-0.5 whitespace-nowrap !bg-ch-background"
      style={highlighted.style}
    />
  );
}
