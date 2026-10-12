"use client";

import { cn } from "@/app/components/utils";
import { Check } from "@boxicons/react/Check";
import { Code as Code2 } from "@boxicons/react/Code";
import { Copy } from "@boxicons/react/Copy";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-latex";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import { useState } from "react";

const LANGUAGE_LABELS: Record<string, string> = {
  bash: "Bash",
  javascript: "JavaScript",
  json: "JSON",
  jsx: "JSX",
  latex: "LaTeX",
  python: "Python",
  rust: "Rust",
  solidity: "Solidity",
  text: "Text",
  toml: "TOML",
  tsx: "TSX",
  typescript: "TypeScript",
};

export type DocsCodeSnippetProps = {
  code: string;
  language:
    | "bash"
    | "javascript"
    | "json"
    | "jsx"
    | "latex"
    | "python"
    | "rust"
    | "solidity"
    | "text"
    | "toml"
    | "tsx"
    | "typescript";
  title?: string;
  className?: string;
};

function getSnippetTitle(
  language: DocsCodeSnippetProps["language"],
  title?: string,
) {
  if (title) return title;
  return LANGUAGE_LABELS[language] ?? language.toUpperCase();
}

function escapeHtml(code: string) {
  return code
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getPrismLanguage(language: DocsCodeSnippetProps["language"]) {
  if (language === "text" || language === "toml" || language === "python") {
    return null;
  }
  return Prism.languages[language];
}

export function DocsCodeSnippet({
  code,
  language,
  title,
  className,
}: DocsCodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const snippetTitle = getSnippetTitle(language, title);
  const prismLanguage = getPrismLanguage(language);
  const highlightedCode = prismLanguage
    ? Prism.highlight(code, prismLanguage, language)
    : escapeHtml(code);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error("Unable to copy code snippet", error);
    }
  };

  return (
    <div
      className={cn(
        "relative my-4 overflow-hidden rounded border border-white/10 bg-[#171717]",
        className,
      )}
    >
      <div className="flex h-9 items-center justify-between border-b border-white/10 bg-[#222] px-3 text-sm text-white/60">
        <div className="flex items-center gap-2 font-mono">
          <Code2 className="size-4 text-white/45" aria-hidden />
          <span className="leading-none">{snippetTitle}</span>
        </div>

        <button
          type="button"
          onClick={copyToClipboard}
          aria-label={copied ? "Copied code snippet" : "Copy code snippet"}
          className="inline-flex items-center rounded p-1 text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          {copied ? (
            <Check className="size-4" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
        </button>
      </div>

      <pre
        suppressHydrationWarning
        className="m-0 overflow-x-auto bg-[#171717] px-0 py-3 font-mono text-sm leading-6 text-[#d4d4d4]"
      >
        <code
          suppressHydrationWarning
          className={cn(
            "block min-w-full whitespace-pre px-4 text-[#d4d4d4]",
            "[&_.token.comment]:text-[#8b949e] [&_.token.prolog]:text-[#8b949e] [&_.token.doctype]:text-[#8b949e] [&_.token.cdata]:text-[#8b949e]",
            "[&_.token.punctuation]:text-[#c9d1d9]",
            "[&_.token.property]:text-[#ff7b72] [&_.token.tag]:text-[#ff7b72] [&_.token.constant]:text-[#ff7b72] [&_.token.symbol]:text-[#ff7b72] [&_.token.deleted]:text-[#ff7b72]",
            "[&_.token.boolean]:text-[#f2cc60] [&_.token.number]:text-[#f2cc60]",
            "[&_.token.selector]:text-[#7ee787] [&_.token.attr-name]:text-[#7ee787] [&_.token.string]:text-[#7ee787] [&_.token.char]:text-[#7ee787] [&_.token.builtin]:text-[#7ee787] [&_.token.inserted]:text-[#7ee787]",
            "[&_.token.operator]:text-[#79c0ff] [&_.token.entity]:text-[#79c0ff] [&_.token.url]:text-[#79c0ff] [&_.language-css_.token.string]:text-[#79c0ff] [&_.style_.token.string]:text-[#79c0ff]",
            "[&_.token.atrule]:text-[#d2a8ff] [&_.token.keyword]:text-[#d2a8ff]",
            "[&_.token.function]:text-[#ffa657] [&_.token.class-name]:text-[#ffa657]",
            "[&_.token.regex]:text-[#a5d6ff] [&_.token.important]:text-[#a5d6ff] [&_.token.variable]:text-[#a5d6ff]",
            `language-${language}`,
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}
