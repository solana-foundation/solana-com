import { NextRequest, NextResponse } from "next/server";
import { defaultLocale } from "@workspace/i18n/config";
import { docsSource } from "@@/src/app/sources/docs";

export const revalidate = 3600;

const SITE_ORIGIN = "https://solana.com";

/** One-line routing hints shown to agents at the top of each scoped index. */
const SECTION_NOTES: Record<string, string> = {
  finance:
    "Financial products on Solana - assets, payments, markets, and DeFi.",
  payments:
    "Sending, accepting, and processing payments on Solana - subscriptions, batching, and agentic flows.",
  tokenization:
    "Issuing stablecoins, tokenizing real-world assets, and operating compliant tokens on Solana.",
  defi: "Trading systems, DEX and oracle integration, and financial applications on Solana.",
  rpc: "The complete Solana JSON-RPC reference - HTTP methods and websocket subscriptions.",
  tools:
    "Developer resources - tools, indexing, references, and ecosystem links.",
  core: "Core concepts - accounts, transactions, programs, PDAs, and CPIs.",
  tokens: "The token programs, token accounts, and token extensions.",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;
  const prefix = `/docs/${section}`;
  const pages = docsSource
    .getPages(defaultLocale)
    .filter((page) => page.url === prefix || page.url.startsWith(`${prefix}/`))
    .sort((a, b) => a.url.localeCompare(b.url));

  if (pages.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const sectionTitle =
    pages.find((page) => page.url === prefix)?.data.title ?? section;
  const lines: string[] = [
    `# Solana Documentation: ${sectionTitle}`,
    "",
    ...(SECTION_NOTES[section] ? [`> ${SECTION_NOTES[section]}`, ""] : []),
    "> Every page is available as raw Markdown by appending `.md` to its URL",
    "> (the links here already include it). The site-wide index is at",
    "> https://solana.com/llms.txt.",
    "",
  ];

  for (const page of pages) {
    const line = `- [${page.data.title || page.url}](${SITE_ORIGIN}${page.url}.md)`;
    lines.push(
      page.data.description ? `${line}: ${page.data.description}` : line,
    );
  }
  lines.push("");

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
