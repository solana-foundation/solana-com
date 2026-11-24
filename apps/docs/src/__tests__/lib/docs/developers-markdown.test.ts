import { readFileSync } from "node:fs";
import path from "node:path";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

const messages = JSON.parse(
  readFileSync(
    path.resolve(
      __dirname,
      "../../../../../../packages/i18n/messages/web/en/common.json",
    ),
    "utf8",
  ),
);

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: string;
    namespace: string;
  }) => createTranslator({ locale, messages, namespace: namespace as never }),
}));
vi.mock("@/lib/docs/llms", () => ({ AGENT_PREAMBLE: "> preamble\n" }));

const { developersMarkdown } = await import("@/lib/docs/developers-markdown");

describe("/developers as Markdown", () => {
  it("has the landing's copy, with docs pages linked as Markdown", async () => {
    const md = await developersMarkdown("en");
    const landing = messages.developers.landing;
    // As the docs pages: the agent preamble, a blank line, the title.
    expect(md.startsWith("> preamble\n\n# ")).toBe(true);
    expect(md).toContain(`# ${landing.meta.title}`);
    expect(md).toContain(`## ${landing.picker.title}`);
    expect(md).toContain(
      `- [${landing.picker.cards.payments.title}](https://solana.com/developers/docs/payments/checkout.md): ${landing.picker.cards.payments.body}`,
    );
    expect(md).toContain(
      "https://solana.com/developers/docs/intro/agent-setup.md",
    );
    // Templates are another app: no .md twin. Coming-soon routes are left out.
    expect(md).toContain("(https://solana.com/developers/templates)");
    expect(md).not.toContain(landing.routes.items.playground.title);
  });

  it("links locale pages in other languages", async () => {
    const md = await developersMarkdown("ja");
    expect(md).toContain(
      "https://solana.com/ja/developers/docs/payments/checkout.md",
    );
  });
});
