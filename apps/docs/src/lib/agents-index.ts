import { loadAppMessages } from "@workspace/i18n/messages";
import { defaultLocale } from "@workspace/i18n/config";

const GUIDE_URL = "https://solana.com/agents.md";

/** Path order on solana.com/agents (apps/web/src/data/agents.ts). */
const PATH_IDS = ["pay", "build", "earn", "sell"] as const;

const slug = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/**
 * The /llms.txt section for solana.com/agents: one line per job the page
 * covers, linking into its Markdown twin. Copy comes from the web app's
 * English `agents` messages so the index matches the page.
 */
export async function getAgentsIndex() {
  const messages = await loadAppMessages("web", defaultLocale);
  const page = messages.agents as {
    meta: { description: string };
    paths: Record<string, { label: string; summary: string }>;
  };

  return [
    "## AI agents on Solana",
    "",
    `Use the [agents guide](${GUIDE_URL}) to set up an agent on Solana: ${page.meta.description}`,
    "",
    ...PATH_IDS.map((id) => {
      const { label, summary } = page.paths[id]!;
      return `- [${label}](${GUIDE_URL}#${slug(label)}): ${summary}`;
    }),
    "",
  ].join("\n");
}
