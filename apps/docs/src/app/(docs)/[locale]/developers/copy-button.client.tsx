"use client";

import { useEffect, useRef, useState } from "react";

const COPIED_MS = 2000;

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers and non-secure origins: copy through a hidden textarea.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

const BUTTON =
  "inline-flex h-[34px] shrink-0 items-center gap-1.5 rounded-lg bg-[var(--dl-accent)] px-3 font-brand text-[13px] font-medium text-[var(--dl-on-accent)] transition-colors hover:bg-[var(--dl-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dl-accent)]";

/**
 * A purple Copy button (a tick once copied) that copies `text` exactly. It is
 * hidden and disabled until hydration, as it cannot work without JavaScript.
 */
export function CopyButton({
  text,
  label,
  copyText,
  copiedText,
}: {
  text: string;
  /** Accessible name, e.g. "Copy the Claude Code command". */
  label: string;
  copyText: string;
  copiedText: string;
}) {
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setReady(true);
    return () => clearTimeout(timer.current);
  }, []);

  const onClick = async () => {
    if (!(await writeClipboard(text))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={!ready}
        aria-hidden={ready ? undefined : true}
        aria-label={label}
        data-copied={copied ? "" : undefined}
        className={`${BUTTON} ${ready ? "" : "invisible"}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="size-3.5"
        >
          {copied ? (
            <path d="M3 8.5 6.5 12 13 4.5" />
          ) : (
            <>
              <rect x="5" y="5" width="9" height="9" rx="2" />
              <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
            </>
          )}
        </svg>
        {copied ? copiedText : copyText}
      </button>
      <span role="status" className="sr-only">
        {copied ? copiedText : ""}
      </span>
    </>
  );
}
