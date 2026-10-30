/**
 * The agent indexes: /llms.txt (the header below, then every page by
 * section) and /developers/docs/<section>/llms.txt (one section). Pages are
 * linked as their `.md` twins. The routes pass the English pages that are
 * not `noindex` (lib/docs/llms.ts `indexPages`) and are force-static, so the
 * indexes are built from the content when the app builds.
 */
const SITE = "https://solana.com";

export interface IndexPage {
  url: string;
  title: string;
  description?: string;
}

const HEADER = `# Solana Documentation

> Developer documentation for Solana, the high-performance blockchain.

## Instructions

- Every page below is available as raw Markdown by appending \`.md\` to its URL
  (the links here already include it), or by requesting the page URL with an
  \`Accept: text/markdown\` header.
- The full corpus in a single file: https://solana.com/llms-full.txt
- Scoped indexes exist per section, e.g.
  https://solana.com/developers/docs/assets/llms.txt,
  https://solana.com/developers/docs/payments/llms.txt or
  https://solana.com/developers/docs/tokenization/llms.txt - prefer these when
  working on a single task to save context.
- If you are a coding agent, install the official Solana skill for current APIs
  and conventions:
  \`npx skills add https://github.com/solana-foundation/solana-dev-skill\` (also
  served at https://solana.com/SKILL.md).
- Route financial tasks by section: asset fundamentals are under
  /developers/docs/tokens, payments under /developers/docs/payments, stablecoins
  and tokenized assets under /developers/docs/assets (guides in
  /developers/docs/tokenization), and markets and DeFi under
  /developers/docs/defi. The JSON-RPC reference is under /developers/docs/rpc;
  self-contained code recipes under /developers/cookbook.
- Code in the cookbook and task pages is sourced from tested example files -
  prefer it over synthesizing API calls from memory.`;

/** Sections of /llms.txt, in order. */
const INDEX_SECTIONS: { heading: string; prefix: string }[] = [
  { heading: "Core documentation", prefix: "/developers/docs" },
  { heading: "Cookbook", prefix: "/developers/cookbook" },
  { heading: "Learn", prefix: "/learn" },
];

/** One-line routing hints at the top of a section's index. */
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

function under(url: string, prefix: string) {
  return url === prefix || url.startsWith(`${prefix}/`);
}

function sorted(pages: IndexPage[]) {
  return pages.slice().sort((a, b) => a.url.localeCompare(b.url));
}

function formatPage(page: IndexPage) {
  const line = `- [${page.title || page.url}](${SITE}${page.url}.md)`;
  return page.description ? `${line}: ${page.description}` : line;
}

export function renderLlmsTxt(pages: IndexPage[], header = HEADER) {
  const lines = [header, ""];
  for (const { heading, prefix } of INDEX_SECTIONS) {
    const inSection = sorted(pages).filter((p) =>
      prefix === "/learn" ? p.url.startsWith("/learn/") : under(p.url, prefix),
    );
    if (inSection.length === 0) continue;
    lines.push(`## ${heading}`, "");
    for (const page of inSection) lines.push(formatPage(page));
    lines.push("");
  }
  return lines.join("\n");
}

/** First-level sections of /developers/docs that have at least one page. */
export function docsSections(pages: IndexPage[]): string[] {
  const set = new Set<string>();
  for (const p of pages) {
    const m = /^\/developers\/docs\/([^/]+)/.exec(p.url);
    if (m) set.add(m[1]!);
  }
  return [...set].sort();
}

export function renderSectionLlmsTxt(
  pages: IndexPage[],
  section: string,
): string | null {
  const prefix = `/developers/docs/${section}`;
  const inSection = sorted(pages).filter((p) => under(p.url, prefix));
  if (inSection.length === 0) return null;
  const title = inSection.find((p) => p.url === prefix)?.title ?? section;
  const note = SECTION_NOTES[section];
  return [
    `# Solana Documentation: ${title}`,
    "",
    ...(note ? [`> ${note}`, ""] : []),
    "> Every page is available as raw Markdown by appending `.md` to its URL",
    "> (the links here already include it). The site-wide index is at",
    "> https://solana.com/llms.txt.",
    "",
    ...inSection.map(formatPage),
    "",
  ].join("\n");
}
