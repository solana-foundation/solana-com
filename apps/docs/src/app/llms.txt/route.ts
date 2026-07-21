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
  /** limit to URLs starting with this prefix (after baseUrl) */
  prefix?: string;
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
    "> Every page below is available as raw Markdown by appending `.md` to",
    "> its URL (the links here already include it), or by requesting the",
    "> page URL with an `Accept: text/markdown` header.",
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
