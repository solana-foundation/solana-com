"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { Check, Copy } from "react-feather";

function cn(...inputs: classNames.ArgumentArray) {
  return twMerge(classNames(inputs));
}

function CodeBlock({
  isDark,
  children,
}: {
  isDark: boolean;
  children: React.ReactNode;
}) {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable; ignore.
    }
  };

  return (
    <div className="group/code relative my-3">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className={cn(
          "absolute right-2 top-2 rounded p-1.5 opacity-0 transition-opacity group-hover/code:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#9945FF]",
          isDark
            ? "bg-white/10 text-gray-300 hover:text-white"
            : "bg-black/5 text-gray-500 hover:text-black",
        )}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre
        ref={preRef}
        className={cn(
          "overflow-x-auto rounded-lg p-4 text-[13px] leading-relaxed",
          isDark
            ? "bg-black/60 text-gray-200 border border-white/10"
            : "bg-gray-50 text-gray-800 border border-gray-200",
        )}
      >
        {children}
      </pre>
    </div>
  );
}

/**
 * Renders an assistant answer. Streaming-safe: re-renders as deltas append.
 */
export function AnswerMarkdown({
  content,
  isDark,
}: {
  content: string;
  isDark: boolean;
}) {
  return (
    <div
      className={cn(
        "text-sm leading-relaxed [&>*+*]:mt-3",
        "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li+li]:mt-1",
        "[&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold",
        "[&_table]:w-full [&_table]:text-left [&_th]:font-semibold [&_th]:pb-1",
        isDark ? "text-gray-200" : "text-gray-800",
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-[#9945FF] underline underline-offset-2 hover:no-underline"
            >
              {children}
            </a>
          ),
          pre: ({ children }) => (
            <CodeBlock isDark={isDark}>{children}</CodeBlock>
          ),
          code: ({ className, children }) => {
            // Block code is wrapped by the `pre` renderer above; everything
            // else is inline code.
            if (className?.includes("language-")) {
              return <code className={className}>{children}</code>;
            }
            return (
              <code
                className={cn(
                  "rounded px-1 py-0.5 text-[0.85em]",
                  isDark
                    ? "bg-white/10 text-gray-100"
                    : "bg-gray-100 text-gray-900",
                )}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
