import { llms } from "fumadocs-core/source";
import { defaultLocale } from "@workspace/i18n/config";
import docsConfig from "@@/content/docs.json";
import { docsSource, learnSource, type DocsPage } from "./source";
import { frontmatter } from "./page-data";
import type { IndexPage } from "./llms-index";

/**
 * Markdown for agents: page `.md` twins, /llms-full.txt and the MCP server.
 * Pages are Fumadocs' processed Markdown (snippets inlined, see
 * remark-docs-compat), headed by the docs' agent instructions
 * (docs.json `markdown.instructions`) and an index pointer, as before.
 */
const SITE = "https://solana.com";

const INSTRUCTIONS: string[] = docsConfig.markdown.instructions;

export const AGENT_PREAMBLE = [
  "> ## Documentation Index",
  `> Fetch the complete documentation index at: ${SITE}/llms.txt`,
  "> Use this file to discover all available pages before exploring further.",
  "",
  "> ## Agent Instructions",
  ...INSTRUCTIONS.map((line) => `> ${line}`),
  "",
].join("\n");

async function body(page: DocsPage): Promise<string> {
  const text = await (
    page.data as unknown as { getText: (t: "processed") => Promise<string> }
  ).getText("processed");
  return text.trim();
}

/** A page as Markdown, as served at `<page>.md`. */
export async function pageMarkdown(page: DocsPage): Promise<string> {
  const fm = frontmatter(page);
  const head = [`# ${fm.title}`, ""];
  if (fm.description) head.push(`> ${fm.description}`, "");
  return `${AGENT_PREAMBLE}\n${head.join("\n")}\n${await body(page)}\n`;
}

async function renderPage(page: DocsPage): Promise<string> {
  const fm = frontmatter(page);
  return `# ${fm.title}\nSource: ${SITE}${page.url}\n\n${fm.description ? `${fm.description}\n\n` : ""}${await body(page)}`;
}

const docsPagesLlms = llms(docsSource, { renderPage });
const learnLlms = llms(learnSource, { renderPage });

/** /llms-full.txt: the docs pages, then the /learn articles (apps/web). */
export const docsLlms = {
  async full(lang: string): Promise<string> {
    const docsText = await docsPagesLlms.full(lang);
    const learnText = await learnLlms.full();
    return learnText ? `${docsText}\n\n${learnText}` : docsText;
  },
};

/**
 * English pages for the agent indexes (llms-index.ts), the /learn articles
 * included: not `noindex`, and not nav-only pages (`url` frontmatter), which
 * redirect elsewhere.
 */
export function indexPages(): IndexPage[] {
  const text = (v: unknown) =>
    typeof v === "string" && v.trim() ? v.trim() : undefined;
  return [...docsSource.getPages(defaultLocale), ...learnSource.getPages()]
    .filter((page) => {
      const fm = frontmatter(page);
      return fm.noindex !== true && !fm.url;
    })
    .map((page) => {
      const fm = frontmatter(page);
      return {
        url: page.url,
        title:
          text(fm.title) ?? text(fm.sidebarTitle) ?? page.url.split("/").pop()!,
        description: text(fm.description),
      };
    });
}
