import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import en from "../../../../../packages/i18n/messages/web/en/common.json";
import {
  AGENT_SETUP,
  COST_MODEL,
  HERO_LINKS,
  HUB_STATS,
  INSTALL_SETUP,
  JOB_PATHS,
  LEARN_ROUTES,
  MORE_USE_CASES,
  WHY_REASONS,
  computeCosts,
  formatDate,
  formatStatValue,
  formatUsd,
  localizedHref,
  paymentsFromSliderPosition,
} from "@/data/developers/hub";

const landing = (en as { developers: { landing: Record<string, any> } })
  .developers.landing;

describe("developers hub stats", () => {
  it.each(HUB_STATS.map((stat) => [stat.id, stat] as const))(
    "%s records when it was checked against its source",
    (_id, stat) => {
      expect(stat.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    },
  );

  it("cites an https source and has copy for every stat", () => {
    for (const stat of HUB_STATS) {
      expect(new URL(stat.source.url).protocol).toBe("https:");
      expect(stat.source.name.length).toBeGreaterThan(0);
      expect(landing.why.stats[stat.id]?.label).toBeTruthy();
      expect(stat.asOf).toMatch(/^\d{4}-(\d{2}(-\d{2})?|Q[1-4])$/);
    }
  });

  it("formats values per locale", () => {
    const supply = HUB_STATS.find((s) => s.id === "stablecoinSupply")!;
    expect(formatStatValue(supply, "en")).toBe("$16.7B");
    const uptime = HUB_STATS.find((s) => s.id === "uptime")!;
    expect(formatStatValue(uptime, "en")).toBe("100%");
    const assets = HUB_STATS.find((s) => s.id === "tokenizedAssets")!;
    expect(formatStatValue(assets, "en")).toBe("$4.3B");
    const dex = HUB_STATS.find((s) => s.id === "dexVolume")!;
    expect(formatStatValue(dex, "en")).toBe("$200B+");
    // The locale reaches Intl. Compare with this runtime's own ja output, as
    // a Node build without full ICU formats ja like en.
    const jaCompact = new Intl.NumberFormat("ja", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(dex.value);
    expect(formatStatValue(dex, "ja")).toBe(`${jaCompact}+`);
  });

  it("formats dates", () => {
    expect(formatDate("2026-08-09", "en")).toBe("Aug 9, 2026");
  });
});

describe("cost calculator model", () => {
  it("defaults to 10,000 payments of $20", () => {
    const { paymentsPerMonth, averagePaymentUsd } = COST_MODEL.defaults;
    expect(
      paymentsFromSliderPosition(COST_MODEL.slider.payments.defaultPosition),
    ).toBe(paymentsPerMonth);
    const costs = computeCosts(paymentsPerMonth, averagePaymentUsd);
    expect(costs.card).toBeCloseTo(8800);
    expect(costs.solana).toBeCloseTo(10);
    expect(costs.savings).toBeCloseTo(8790);
    expect(formatUsd(costs.card, "en")).toBe("$8,800");
    expect(formatUsd(costs.solana, "en")).toBe("$10.00");
  });

  it("shows a saving equal to the difference of the shown costs", () => {
    // 1,230 x $7: card $618.69 (shown $619), Solana $1.23.
    const costs = computeCosts(1230, 7);
    expect(formatUsd(costs.card, "en")).toBe("$619");
    expect(formatUsd(costs.solana, "en")).toBe("$1.23");
    expect(formatUsd(costs.savings, "en")).toBe("$617.77");
    for (let position = 0; position <= 100; position++) {
      const payments = paymentsFromSliderPosition(position);
      for (const average of [1, 7, 20, 133, 500]) {
        const c = computeCosts(payments, average);
        const shown = (s: string) => Number(s.replace(/[$,]/g, ""));
        expect(
          shown(formatUsd(c.card, "en")) - shown(formatUsd(c.solana, "en")),
        ).toBeCloseTo(shown(formatUsd(c.savings, "en")), 6);
      }
    }
  });

  it("maps the payments slider onto 100 to 1,000,000 (log scale)", () => {
    expect(paymentsFromSliderPosition(0)).toBe(100);
    expect(paymentsFromSliderPosition(100)).toBe(1_000_000);
    expect(paymentsFromSliderPosition(25)).toBe(1000);
  });

  it("cites card pricing", () => {
    expect(COST_MODEL.card.source.url).toBe("https://stripe.com/pricing");
  });
});

describe("developers hub links", () => {
  it("points the four job cards at the job-path intros", () => {
    expect(JOB_PATHS.map((job) => job.href)).toEqual([
      "/developers/docs/assets/issue-asset",
      "/developers/docs/payments/paywall-api",
      "/developers/docs/payments/checkout",
      "/developers/docs/defi/settle-trade",
    ]);
    for (const job of JOB_PATHS) {
      expect(landing.picker.cards[job.id]).toMatchObject({
        title: expect.any(String),
        body: expect.any(String),
        cta: expect.any(String),
      });
    }
  });

  it("has copy for every secondary link, route and reason", () => {
    for (const item of MORE_USE_CASES)
      expect(landing.picker.more[item.id]).toBeTruthy();
    for (const route of LEARN_ROUTES)
      expect(landing.routes.items[route.id].title).toBeTruthy();
    for (const id of WHY_REASONS)
      expect(landing.why.reasons[id].title).toBeTruthy();
  });

  it("prefixes docs-owned links with the locale, but not templates or anchors", () => {
    expect(localizedHref("en", "/developers/docs/payments/checkout")).toBe(
      "/developers/docs/payments/checkout",
    );
    expect(localizedHref("ja", "/developers/docs/payments/checkout")).toBe(
      "/ja/developers/docs/payments/checkout",
    );
    expect(localizedHref("ar", "/developers/bootcamp")).toBe(
      "/ar/developers/bootcamp",
    );
    expect(localizedHref("ja", "/developers/templates")).toBe(
      "/developers/templates",
    );
    expect(localizedHref("ja", "#picker")).toBe("#picker");
    expect(localizedHref("ja", "https://stripe.com")).toBe(
      "https://stripe.com",
    );
  });

  it("does not use eyebrow copy keys", () => {
    expect(JSON.stringify(landing)).not.toMatch(/"eyebrow"/);
  });
});

const docsPage = (page: string) =>
  readFileSync(
    path.resolve(__dirname, "../../../content/docs/en", `${page}.mdx`),
    "utf8",
  );

describe("set up in one command card", () => {
  it("uses the official Solana MCP server URL and commands", () => {
    // Verbatim from https://mcp.solana.com.
    expect(AGENT_SETUP.serverUrl).toBe("https://mcp.solana.com/mcp");
    expect(AGENT_SETUP.allAgentsCommand).toBe(
      "npx add-mcp https://mcp.solana.com/mcp -n solana-mcp -g -y",
    );
    expect(AGENT_SETUP.clients).toEqual([
      {
        id: "claudeCode",
        name: "Claude Code",
        command:
          "claude mcp add --transport http solana-mcp https://mcp.solana.com/mcp",
      },
      {
        id: "codex",
        name: "Codex",
        command: "codex mcp add solana-mcp --url https://mcp.solana.com/mcp",
      },
    ]);
    expect(AGENT_SETUP.moreHref).toBe(
      "/developers/docs/intro/coding-with-agents",
    );
  });

  it("uses the one-line installer from the Quickstart's manual install tab", () => {
    expect(INSTALL_SETUP.href).toBe("/developers/docs/quickstart");
    expect(docsPage("quickstart")).toContain(INSTALL_SETUP.command);
  });

  it("matches the commands on the Build with AI agents page and the Quickstart", () => {
    const agents = docsPage("intro/coding-with-agents");
    expect(agents).toContain(AGENT_SETUP.allAgentsCommand);
    for (const client of AGENT_SETUP.clients)
      expect(agents).toContain(client.command);
    const quickstart = docsPage("quickstart");
    expect(quickstart).toContain(AGENT_SETUP.allAgentsCommand);
    expect(quickstart).toContain(INSTALL_SETUP.command);
  });

  it("does not link the removed All use cases page", () => {
    expect(JSON.stringify(MORE_USE_CASES)).not.toMatch(/docs\/finance/);
    expect(landing.picker.more).not.toHaveProperty("all");
  });

  it("has no Ethereum or EVM links or copy", () => {
    expect(JSON.stringify(HERO_LINKS)).not.toMatch(/ethereum|evm/i);
    expect(JSON.stringify(landing)).not.toMatch(/ethereum|\bevm\b|svm guide/i);
  });
});
