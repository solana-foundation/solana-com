import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { defaultLocale } from "@workspace/i18n/config";
import { loadAppMessages } from "@workspace/i18n/messages";
import middleware from "@@/src/middleware";
import { GET as getAgentsMarkdown } from "@/app/agents.md/route";
import { buildAgentsFaqJsonLd } from "@/app/[locale]/agents/structured-data";
import { CONNECTORS, DEFAULT_PATH, FAQ_ITEMS, PATHS } from "@/data/agents";
import { renderAgentsMarkdown } from "@/lib/agents-markdown";

type Copy = Parameters<typeof renderAgentsMarkdown>[0];

const loadCopy = async () =>
  (await loadAppMessages("web", defaultLocale)).agents as Copy;

describe("/agents paths", () => {
  it("selects Pay for APIs on load", () => {
    expect(DEFAULT_PATH).toBe("pay");
    expect(PATHS[0]?.id).toBe("pay");
  });

  it("ends every offering in one command, one link, or the Pay.sh picker", () => {
    for (const path of PATHS) {
      expect(path.offerings.length).toBeGreaterThan(0);
      for (const { action } of path.offerings) {
        if (action.type === "command") expect(action.command).not.toBe("");
        if (action.type === "link") expect(action.href).toMatch(/^(\/|https:)/);
      }
    }
    const pickers = PATHS.flatMap((path) =>
      path.offerings.filter(({ action }) => action.type === "connectors"),
    );
    expect(pickers).toHaveLength(1);
  });

  it("never labels an action with a generic call to action", async () => {
    const copy = (await loadCopy()) as {
      offerings: Record<string, { action: string }>;
    };
    for (const { action } of Object.values(copy.offerings)) {
      expect(action).not.toMatch(/^(learn more|explore|get started)$/i);
    }
  });
});

describe("/agents.md", () => {
  it("renders every path, connector command, and FAQ from the English copy", async () => {
    const copy = (await loadCopy()) as {
      paths: Record<string, { label: string }>;
      faq: { items: Record<string, { question: string }> };
    };
    const markdown = renderAgentsMarkdown(copy as Copy);

    for (const path of PATHS) {
      expect(markdown).toContain(`## ${copy.paths[path.id]!.label}`);
    }
    for (const { command } of CONNECTORS) {
      expect(markdown).toContain(`\`${command}\``);
    }
    for (const id of FAQ_ITEMS) {
      expect(markdown).toContain(copy.faq.items[id]!.question);
    }
    expect(markdown).toContain("https://solana.com/docs/payments/pay-sh");
  });

  it("fails loudly when a message is missing", () => {
    expect(() => renderAgentsMarkdown({} as Copy)).toThrow(
      /Missing agents message/,
    );
  });

  it("is served as text/markdown", async () => {
    const response = await getAgentsMarkdown();
    expect(response.headers.get("Content-Type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(await response.text()).toMatch(/^# /);
  });
});

describe("/agents content negotiation", () => {
  const request = (path: string, accept: string) =>
    new NextRequest(`https://solana.com${path}`, { headers: { accept } });

  it.each(["/agents", "/fr/agents"])(
    "rewrites %s to the Markdown twin for Accept: text/markdown",
    async (path) => {
      const response = await middleware(request(path, "text/markdown"));
      expect(response.headers.get("x-middleware-rewrite")).toBe(
        "https://solana.com/agents.md",
      );
    },
  );

  it("leaves browser requests on the HTML page", async () => {
    const response = await middleware(
      request("/agents", "text/html,application/xhtml+xml"),
    );
    expect(response.headers.get("x-middleware-rewrite") ?? "").not.toContain(
      "agents.md",
    );
  });
});

describe("/agents FAQ JSON-LD", () => {
  it("emits one Question with a plain-text answer per FAQ item", async () => {
    const copy = (await loadCopy()) as {
      faq: { items: Record<string, { question: string; answer: string }> };
    };
    const faq = FAQ_ITEMS.map((id) => copy.faq.items[id]!);
    const data = buildAgentsFaqJsonLd({ canonicalPath: "/es/agents", faq });

    expect(data["@type"]).toBe("FAQPage");
    expect(data.url).toBe("https://solana.com/es/agents");
    expect(data.mainEntity).toHaveLength(FAQ_ITEMS.length);
    for (const entry of data.mainEntity) {
      expect(entry["@type"]).toBe("Question");
      expect(entry.name).not.toBe("");
      expect(entry.acceptedAnswer.text).not.toMatch(/<[a-z]/i);
    }
  });
});
