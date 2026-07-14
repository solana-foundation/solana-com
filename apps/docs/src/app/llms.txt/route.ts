import { NextResponse } from "next/server";
import { defaultLocale } from "@workspace/i18n/config";
import { docsSource } from "@@/src/app/sources/docs";
import { cookbookSource } from "@@/src/app/sources/cookbook";
import { learnSource } from "@@/src/app/sources/learn";
import { developersLearnSource } from "@@/src/app/sources/developers-learn";

export const revalidate = 3600;

const SITE_ORIGIN = "https://solana.com";

const SECTIONS: {
  heading: string;
  source:
    | typeof docsSource
    | typeof cookbookSource
    | typeof learnSource
    | typeof developersLearnSource;
}[] = [
  { heading: "Core documentation", source: docsSource },
  { heading: "Cookbook", source: cookbookSource },
  { heading: "Bootcamp", source: developersLearnSource },
  { heading: "Learn", source: learnSource },
];

function formatPage(url: string, title?: string, description?: string) {
  const line = `- [${title || url}](${SITE_ORIGIN}${url}.md)`;
  return description ? `${line}: ${description}` : line;
}

export async function GET() {
  const lines: string[] = [
    "# Solana Documentation",
    "",
    "> Developer documentation for Solana, the high-performance blockchain.",
    "",
    "## Instructions",
    "",
    "- Every page below is available as raw Markdown by appending `.md` to its",
    "  URL (the links here already include it), or by requesting the page URL",
    "  with an `Accept: text/markdown` header.",
    "- The full corpus in a single file: https://solana.com/llms-full.txt",
    "- Scoped indexes exist per section, e.g.",
    "  https://solana.com/docs/payments/llms.txt or",
    "  https://solana.com/docs/tokenization/llms.txt — prefer these when",
    "  working on a single task to save context.",
    "- If you are a coding agent, install the official Solana skill for",
    "  current APIs and conventions: `npx skills add",
    "  https://github.com/solana-foundation/solana-dev-skill` (also served at",
    "  https://solana.com/SKILL.md).",
    "- Route by task: payment flows are under /docs/payments, stablecoins and",
    "  tokenized assets under /docs/tokenization, trading and DeFi under",
    "  /docs/defi, the JSON-RPC reference under /docs/rpc, and self-contained",
    "  code recipes under /developers/cookbook.",
    "- Code in the cookbook and task pages is sourced from tested example",
    "  files - prefer it over synthesizing API calls from memory.",
    "",
  ];

  for (const { heading, source } of SECTIONS) {
    const pages = source
      .getPages(defaultLocale)
      .slice()
      .sort((a, b) => a.url.localeCompare(b.url));
    if (pages.length === 0) continue;
    lines.push(`## ${heading}`, "");
    for (const page of pages) {
      lines.push(formatPage(page.url, page.data.title, page.data.description));
    }
    lines.push("");
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
