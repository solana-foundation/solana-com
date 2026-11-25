"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "./copy-button.client";
import { AGENT_PROMPT } from "@/data/developers/hub";

/**
 * The line a reader pastes into their coding agent, scrolling sideways, and a
 * Copy button that copies it in full (the field drops "https://"; the ">" is
 * CSS). After hydration it points at the current origin, so previews link to
 * their own copy of the guide.
 */
export function AgentPrompt({
  copyText,
  copiedText,
  label,
}: {
  copyText: string;
  copiedText: string;
  label: string;
}) {
  const [text, setText] = useState(AGENT_PROMPT.line(AGENT_PROMPT.origin));

  useEffect(() => {
    const origin = window.location.origin;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:|$)/.test(origin)) return;
    setText(AGENT_PROMPT.line(origin));
  }, []);

  const shown = text.replace(" https://", " ").replace(" http://", " ");

  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-[var(--dl-line-strong)] bg-[var(--dl-surface)] py-1.5 pe-1.5 ps-4">
      <code
        dir="ltr"
        data-testid="agent-prompt"
        title={text}
        className="min-w-0 flex-1 select-all overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden font-[family-name:var(--dl-mono)] !text-[13px] leading-[1.6] text-[var(--dl-text)] before:me-2 before:text-[var(--dl-accent-text)] before:content-['>']"
      >
        {shown}
      </code>
      <CopyButton
        text={text}
        label={label}
        copyText={copyText}
        copiedText={copiedText}
      />
    </div>
  );
}
