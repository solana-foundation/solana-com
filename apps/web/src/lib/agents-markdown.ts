import {
  CLOSING_LINKS,
  CONNECTORS,
  FAQ_ITEMS,
  LINKS,
  MORE_LINKS,
  PATHS,
  PAY_INSTALL_COMMAND,
  PROMPTS,
  TRUST_ITEMS,
  AGENTS_PATH,
} from "@/data/agents";

const SITE = "https://solana.com";

type Copy = { [key: string]: string | Copy };

const absolute = (href: string) =>
  /^https?:\/\//.test(href) ? href : `${SITE}${href}`;

/**
 * Renders /agents as Markdown for agents, from the English `agents` messages
 * and the same data the page uses. Pass `messages.agents`.
 */
export function renderAgentsMarkdown(copy: Copy) {
  const get = (path: string) => {
    const value = path
      .split(".")
      .reduce<string | Copy | undefined>(
        (node, key) =>
          node && typeof node === "object" ? node[key] : undefined,
        copy,
      );
    if (typeof value !== "string") {
      throw new Error(`Missing agents message: ${path}`);
    }
    return value;
  };
  const lines: string[] = [
    `# ${get("hero.headline")}`,
    "",
    `> ${get("meta.description")}`,
    "",
    get("hero.body"),
    "",
    `Canonical page: ${SITE}${AGENTS_PATH}`,
    "",
  ];

  for (const path of PATHS) {
    lines.push(`## ${get(`paths.${path.id}.label`)}`, "");
    lines.push(get(`paths.${path.id}.summary`), "");
    for (const offering of path.offerings) {
      const key = `offerings.${offering.id}`;
      lines.push(`### ${get(`${key}.title`)}`, "", get(`${key}.body`), "");
      const { action } = offering;
      if (action.type === "command") {
        lines.push(
          `${get(`${key}.action`)}:`,
          "",
          "```bash",
          action.command,
          "```",
          "",
        );
      } else if (action.type === "link") {
        lines.push(`[${get(`${key}.action`)}](${absolute(action.href)})`, "");
      } else {
        lines.push(
          `${get("connectors.install")}:`,
          "",
          "```bash",
          PAY_INSTALL_COMMAND,
          "```",
          "",
          `${get("connectors.installNote")} ${absolute(`${LINKS.paySource}/releases/latest`)}`,
          "",
        );
        for (const connector of CONNECTORS) {
          const name = get(`connectors.items.${connector.id}.name`);
          lines.push(
            `- ${name}: \`${connector.command}\`. ${get(`connectors.items.${connector.id}.note`)}`,
          );
        }
        lines.push("", get("connectors.sandbox"), "");
      }
      lines.push(`${get("offering.result")}: ${get(`${key}.result`)}`, "");
      if (offering.links) {
        lines.push(
          offering.links
            .map(
              ({ id, href }) =>
                `[${get(`${key}.links.${id}`)}](${absolute(href)})`,
            )
            .join(" · "),
          "",
        );
      }
    }
  }

  lines.push(`## ${get("prompts.headline")}`, "");
  for (const prompt of PROMPTS) {
    lines.push(
      `### ${get(`prompts.items.${prompt.id}.title`)}`,
      "",
      "```text",
      get(`prompts.items.${prompt.id}.text`),
      "```",
      "",
    );
  }

  lines.push(`## ${get("trust.headline")}`, "", get("trust.body"), "");
  for (const id of TRUST_ITEMS) {
    lines.push(
      `- **${get(`trust.items.${id}.title`)}**: ${get(`trust.items.${id}.body`)}`,
    );
  }
  lines.push("");

  lines.push(`## ${get("faq.headline")}`, "");
  for (const id of FAQ_ITEMS) {
    lines.push(
      `### ${get(`faq.items.${id}.question`)}`,
      "",
      get(`faq.items.${id}.answer`),
      "",
    );
  }

  lines.push(`## ${get("closing.headline")}`, "", get("closing.body"), "");
  for (const { id, href } of CLOSING_LINKS) {
    lines.push(`- [${get(`closing.links.${id}`)}](${absolute(href)})`);
  }
  for (const { id, href } of MORE_LINKS) {
    lines.push(`- [${get(`closing.more.${id}`)}](${absolute(href)})`);
  }
  lines.push("");

  return lines.join("\n");
}
