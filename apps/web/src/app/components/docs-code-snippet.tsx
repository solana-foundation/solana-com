"use client";

import styles from "@/app/components/docs-code-snippet.module.css";
import { cn } from "@/app/components/utils";
import { Check, Code2, Copy } from "lucide-react";
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

      <pre className="m-0 overflow-x-auto bg-[#171717] px-0 py-3 font-mono text-sm leading-6 text-[#d4d4d4]">
        <code
          className={cn(
            styles.code,
            "block min-w-full whitespace-pre px-4",
            `language-${language}`,
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}
