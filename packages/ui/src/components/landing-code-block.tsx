"use client";

import { useMemo, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-latex";

import { Section } from "./landing-shared";

export interface CodeBlockProps {
  code: string;
  language:
    | "jsx"
    | "typescript"
    | "tsx"
    | "rust"
    | "solidity"
    | "json"
    | "bash"
    | "latex";
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const highlighted = useMemo(
    () =>
      Prism.highlight(
        code,
        Prism.languages[language] || Prism.languages.markup!,
        language,
      ),
    [code, language],
  );

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Section fullWidth>
      <div className="overflow-hidden rounded-lg border border-white/20 bg-[#111114] shadow-lg">
        <div className="flex items-center justify-between bg-[#211535] px-3 py-2 text-sm">
          <span>{language}</span>
          <button
            type="button"
            onClick={copyCode}
            className="font-semibold text-[#14F195] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA9FF5]"
            aria-label={copied ? "Code copied" : "Copy code"}
          >
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
        <pre className="max-w-full overflow-x-auto p-4 text-sm leading-relaxed text-white [&_.token.comment]:text-[#8b8b9d] [&_.token.keyword]:text-[#CA9FF5] [&_.token.string]:text-[#14F195] [&_.token.number]:text-[#F48252]">
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </Section>
  );
}
