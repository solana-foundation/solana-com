import { getTranslations } from "next-intl/server";
import {
  AGENT_PROMPT,
  JOB_PATHS,
  LEARN_ROUTES,
  MORE_USE_CASES,
  WHY_REASONS,
  localizedHref,
} from "@/data/developers/hub";
import { AGENT_PREAMBLE } from "./llms";

/**
 * The /developers landing as Markdown (`/developers.md`, or /developers with
 * `Accept: text/markdown`): the page's own copy (`developers.landing`) and
 * links, with docs pages linked as their `.md` twins.
 */
const SITE = "https://solana.com";

function link(locale: string, href: string): string {
  const path = localizedHref(locale, href);
  // Templates are another app's pages, with no Markdown twin.
  const md = path.startsWith("/developers/templates") ? path : `${path}.md`;
  return `${SITE}${md}`;
}

export async function developersMarkdown(locale: string): Promise<string> {
  const t = await getTranslations({ locale, namespace: "developers.landing" });
  return [
    AGENT_PREAMBLE,
    `# ${t("meta.title")}`,
    "",
    `> ${t("meta.description")}`,
    "",
    t("hero.lede"),
    "",
    `## ${t("agent.title")}`,
    "",
    "```text",
    AGENT_PROMPT.line(AGENT_PROMPT.origin),
    "```",
    "",
    `## ${t("picker.title")}`,
    "",
    t("picker.body"),
    "",
    ...JOB_PATHS.map(
      (job) =>
        `- [${t(`picker.cards.${job.id}.title`)}](${link(locale, job.href)}): ${t(`picker.cards.${job.id}.body`)}`,
    ),
    "",
    `${t("picker.moreLabel")} ${MORE_USE_CASES.map((item) => `[${t(`picker.more.${item.id}`)}](${link(locale, item.href)})`).join(", ")}`,
    "",
    `## ${t("why.title")}`,
    "",
    t("why.body"),
    "",
    ...WHY_REASONS.map(
      (id) =>
        `- **${t(`why.reasons.${id}.title`)}**: ${t(`why.reasons.${id}.body`)}`,
    ),
    "",
    `## ${t("routes.title")}`,
    "",
    t("routes.body"),
    "",
    ...LEARN_ROUTES.flatMap((route) =>
      route.href
        ? [
            `- [${t(`routes.items.${route.id}.title`)}](${link(locale, route.href)}): ${t(`routes.items.${route.id}.body`)}`,
          ]
        : [],
    ),
    "",
  ].join("\n");
}
