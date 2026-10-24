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

type CodeDensity = "default" | "compact";

type CommandLine = {
  display: string;
  copyText: string | null;
  kind: "command" | "note" | "output";
};

const COMMAND_LANGUAGES = new Set([
  "bash",
  "console",
  "sh",
  "shell",
  "terminal",
  "zsh",
]);

const COMMAND_START_PATTERN =
  /^(?:anchor|avm|bun|cargo|cd|curl|export|git|mkdir|node|npm|npx|pnpm|rustup|solana|solana-test-validator|source|spl-token|surfpool|tsx|yarn)\b/;

function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join("");
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }
  return "";
}

export function markdownToPlainPreview(
  content: string,
  maxLength = 280,
): string {
  const preview = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (preview.length <= maxLength) return preview;
  return `${preview.slice(0, maxLength).trimEnd()}...`;
}

function getCodeLanguage(node: React.ReactNode): string | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const language = getCodeLanguage(child);
      if (language) return language;
    }
    return null;
  }

  if (
    React.isValidElement<{ className?: string; children?: React.ReactNode }>(
      node,
    )
  ) {
    const className = node.props.className;
    const match =
      typeof className === "string"
        ? className.match(/(?:^|\s)language-([^\s]+)/)
        : null;
    return match?.[1]?.toLowerCase() ?? getCodeLanguage(node.props.children);
  }

  return null;
}

function stripPrompt(line: string): string | null {
  const match = line.match(/^\s*(?:[$>%❯➜]\s+)(.+)$/);
  return match?.[1]?.trimEnd() ?? null;
}

function parseCommandLines(code: string): CommandLine[] {
  const rows: CommandLine[] = [];

  for (const line of code.replace(/\r\n/g, "\n").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("#")) {
      rows.push({
        display: trimmed.replace(/^#\s?/, ""),
        copyText: null,
        kind: "note",
      });
      continue;
    }

    const promptedCommand = stripPrompt(line);
    const command = promptedCommand ?? trimmed;
    if (promptedCommand || COMMAND_START_PATTERN.test(command)) {
      rows.push({
        display: command,
        copyText: command,
        kind: "command",
      });
      continue;
    }

    rows.push({ display: trimmed, copyText: null, kind: "output" });
  }

  return rows;
}

function shouldRenderCommandRows(code: string, language: string | null) {
  const normalizedLanguage = language?.toLowerCase() ?? null;
  const rows = parseCommandLines(code);
  const commandCount = rows.filter((row) => row.kind === "command").length;
  const hasCommandLanguage =
    normalizedLanguage !== null && COMMAND_LANGUAGES.has(normalizedLanguage);

  return (
    commandCount > 0 &&
    (hasCommandLanguage || commandCount === rows.length || code.includes("$ "))
  );
}

function CopyTextButton({
  text,
  isDark,
  label,
  className,
}: {
  text: string;
  isDark: boolean;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable; ignore.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#9945FF]",
        isDark
          ? "text-gray-400 hover:bg-white/10 hover:text-white"
          : "text-gray-500 hover:bg-black/5 hover:text-black",
        className,
      )}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function CommandRows({
  code,
  language,
  isDark,
  density,
}: {
  code: string;
  language: string | null;
  isDark: boolean;
  density: CodeDensity;
}) {
  const rows = parseCommandLines(code);
  const commands = rows.flatMap((row) => row.copyText ?? []);
  const showCopyAll = commands.length > 1;

  return (
    <div
      className={cn(
        "my-2 overflow-hidden rounded-lg border",
        isDark ? "border-white/15 bg-black/45" : "border-gray-300 bg-gray-50",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 border-b px-2.5 py-1.5",
          isDark ? "border-white/10 bg-white/[0.03]" : "border-gray-200",
        )}
      >
        <span
          className={cn(
            "font-mono text-[10px] uppercase",
            isDark ? "text-gray-500" : "text-gray-500",
          )}
        >
          {language ?? "commands"}
        </span>
        {showCopyAll ? (
          <CopyTextButton
            text={commands.join("\n")}
            isDark={isDark}
            label="Copy commands"
          />
        ) : null}
      </div>
      <div
        className={cn(
          "divide-y",
          isDark ? "divide-white/10" : "divide-gray-200",
        )}
      >
        {rows.map((row, index) => (
          <div
            key={`${index}-${row.display}`}
            className={cn(
              "flex min-w-0 items-center gap-2 px-2.5",
              density === "compact" ? "py-1.5" : "py-2",
              row.kind === "command" &&
                (isDark ? "bg-white/[0.015]" : "bg-white"),
            )}
          >
            <span
              className={cn(
                "w-3 shrink-0 text-center font-mono text-[12px]",
                row.kind === "command"
                  ? "text-[#14F195]"
                  : isDark
                    ? "text-gray-600"
                    : "text-gray-400",
              )}
            >
              {row.kind === "command" ? "$" : row.kind === "note" ? "#" : ""}
            </span>
            <code
              className={cn(
                "min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono leading-relaxed",
                density === "compact" ? "text-[12px]" : "text-[13px]",
                row.kind === "command"
                  ? isDark
                    ? "text-gray-100"
                    : "text-gray-900"
                  : isDark
                    ? "text-gray-500"
                    : "text-gray-500",
              )}
            >
              {row.display}
            </code>
            {row.copyText ? (
              <CopyTextButton
                text={row.copyText}
                isDark={isDark}
                label="Copy command"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeBlock({
  isDark,
  density,
  children,
}: {
  isDark: boolean;
  density: CodeDensity;
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
    <div
      className={cn(
        "group/code relative",
        density === "compact" ? "my-2" : "my-3",
      )}
    >
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
          "overflow-x-auto rounded-lg leading-relaxed",
          density === "compact"
            ? "max-h-56 p-3 text-[12px]"
            : "max-h-80 p-4 text-[13px]",
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
  density = "default",
}: {
  content: string;
  isDark: boolean;
  density?: "default" | "compact";
}) {
  return (
    <div
      className={cn(
        density === "compact"
          ? "text-[13px] leading-6 [&>*+*]:mt-2.5"
          : "text-sm leading-relaxed [&>*+*]:mt-3",
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
          pre: ({ children }) => {
            const code = getNodeText(children).replace(/\n$/, "");
            const language = getCodeLanguage(children);
            if (shouldRenderCommandRows(code, language)) {
              return (
                <CommandRows
                  code={code}
                  language={language}
                  isDark={isDark}
                  density={density}
                />
              );
            }

            return (
              <CodeBlock isDark={isDark} density={density}>
                {children}
              </CodeBlock>
            );
          },
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
