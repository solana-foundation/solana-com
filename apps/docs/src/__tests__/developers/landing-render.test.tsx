import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import { createTranslator, NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import en from "../../../../../packages/i18n/messages/web/en/common.json";

vi.mock("@workspace/i18n/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: string;
    namespace?: string;
  }) => createTranslator({ locale, messages: en, namespace } as never),
}));
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: { src: string } | string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : src.src} alt={alt} />
  ),
}));
vi.mock("@@/assets/learn/learn-hero.webp", () => ({
  default: { src: "/learn-hero.webp", width: 960, height: 720 },
}));

const { DevelopersHub } =
  await import("@/app/(docs)/[locale]/developers/developers-hub");
const { LearnLanding } = await import("@/app/[locale]/learn/learn-landing");
const {
  AGENT_PROMPT,
  AGENT_SETUP,
  HUB_STATS,
  INSTALL_SETUP,
  JOB_PATHS,
  PAYMENT_SNIPPET,
} = await import("@/data/developers/hub");

function renderWithIntl(ui: ReactElement, locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={en}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("/developers landing", () => {
  it("renders the hero, the agent card and every section without client data", async () => {
    const { container } = renderWithIntl(
      await DevelopersHub({ locale: "en", updates: [] }),
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Build on internet capital markets.",
      }),
    ).toBeInTheDocument();
    for (const name of [
      "Paste this into your coding agent",
      "What are you building?",
      "Why Solana",
      "What would your payments cost?",
      "Other ways to learn",
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
    expect(container.querySelector("main#dl-main")).not.toBeNull();
  });

  it("server-renders the agent setup line with no links", async () => {
    renderWithIntl(await DevelopersHub({ locale: "ja", updates: [] }), "ja");
    const card = screen.getByTestId("agent-card");
    // The field shows the URL without "https://"; Copy copies the full line.
    expect(within(card).getByTestId("agent-prompt").textContent).toBe(
      AGENT_PROMPT.line("https://solana.com").replace("https://", ""),
    );
    // Just the line: no links, tabs, or raw commands. Those live in the docs.
    expect(card.querySelector("a")).toBeNull();
    expect(card.querySelector('input[type="radio"]')).toBeNull();
    expect(card.textContent).not.toContain(AGENT_SETUP.allAgentsCommand);
    expect(card.textContent).not.toContain(INSTALL_SETUP.command);
  });

  it("has no Ethereum or EVM links", async () => {
    const { container } = renderWithIntl(
      await DevelopersHub({ locale: "en", updates: [] }),
    );
    expect(container.textContent).not.toMatch(/ethereum|\bEVM\b/i);
    for (const link of container.querySelectorAll("a")) {
      expect(link.getAttribute("href") ?? "").not.toMatch(
        /ethereum|evm|migrate-to-solana/i,
      );
    }
  });

  it("opens docs links in the same tab; only off-site links open a new tab", async () => {
    const { container } = renderWithIntl(
      await DevelopersHub({ locale: "en", updates: [] }),
    );
    for (const link of container.querySelectorAll("a")) {
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("/") || href.startsWith("#")) {
        expect(link.getAttribute("target"), href).toBeNull();
      }
      if (link.getAttribute("target") === "_blank") {
        expect(href).toMatch(/^https:\/\//);
        expect(link.getAttribute("rel")).toBe("noopener noreferrer");
        expect(link.textContent).toContain("(opens in a new tab)");
      }
    }
    expect(
      within(screen.getByTestId("job-cards"))
        .getAllByRole("link")
        .every((card) => !card.hasAttribute("target")),
    ).toBe(true);
  });

  it("shows Solana Playground greyed out as coming soon, not as a link", async () => {
    renderWithIntl(await DevelopersHub({ locale: "en", updates: [] }), "en");
    const card = screen.getByTestId("route-playground");
    expect(card).toHaveAttribute("aria-disabled", "true");
    expect(card.closest("a")).toBeNull();
    expect(card.textContent).toContain("Solana Playground");
    expect(card.textContent).toContain("Coming soon");
    expect(screen.queryByRole("link", { name: /Cookbook/ })).toBeNull();
  });

  it("links to hackathons in a new tab", async () => {
    renderWithIntl(await DevelopersHub({ locale: "en", updates: [] }));
    const link = within(screen.getByTestId("hackathons")).getByRole("link", {
      name: /Join a hackathon/,
    });
    expect(link).toHaveAttribute("href", "https://hackathons.solana.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAccessibleName("Join a hackathon (opens in a new tab)");
  });

  it("keeps the hero to the docs' framing, with a purple primary CTA", async () => {
    renderWithIntl(await DevelopersHub({ locale: "en", updates: [] }));
    const lede = screen.getByText(/^Solana is the network for internet/);
    expect(lede.textContent).not.toMatch(/blockchain/i);
    expect(lede.textContent!.split(/(?<=\.)\s/)).toHaveLength(2);
    const cta = screen.getByRole("link", { name: "Pick a tutorial" });
    expect(cta).toHaveAttribute("href", "#picker");
    expect(cta.className).toContain("bg-[var(--dl-accent)]");
  });

  it("links the four job cards to the job-path intros", async () => {
    renderWithIntl(await DevelopersHub({ locale: "en", updates: [] }));
    const cards = within(screen.getByTestId("job-cards")).getAllByRole("link");
    expect(cards.map((card) => card.getAttribute("href"))).toEqual(
      JOB_PATHS.map((job) => job.href),
    );
  });

  it("prefixes docs links with the locale", async () => {
    renderWithIntl(await DevelopersHub({ locale: "ja", updates: [] }), "ja");
    const cards = within(screen.getByTestId("job-cards")).getAllByRole("link");
    expect(cards[0]).toHaveAttribute(
      "href",
      "/ja/developers/docs/assets/issue-asset",
    );
    expect(
      screen.getByRole("link", {
        name: "Templates Starter apps for Next.js, mobile, and programs.",
      }),
    ).toHaveAttribute("href", "/developers/templates");
  });

  it("shows every stat without footnotes or a sources list", async () => {
    renderWithIntl(await DevelopersHub({ locale: "en", updates: [] }));
    for (const stat of HUB_STATS) {
      const tile = screen.getByTestId(`stat-${stat.id}`);
      expect(within(tile).queryByRole("link")).toBeNull();
    }
    expect(screen.queryByTestId("stat-sources")).toBeNull();
  });

  it("server-renders the calculator defaults and the static table", async () => {
    renderWithIntl(await DevelopersHub({ locale: "en", updates: [] }));
    expect(screen.getByTestId("calc-payments")).toHaveTextContent("10,000");
    expect(screen.getByTestId("calc-card")).toHaveTextContent("$8,800");
    expect(screen.getByTestId("calc-solana")).toHaveTextContent("$10.00");
    expect(screen.getByTestId("calc-savings")).toHaveTextContent("$8,790");
    const rows = within(screen.getByTestId("calc-table")).getAllByRole("row");
    expect(rows).toHaveLength(4);
    expect(rows[2]).toHaveTextContent("10,000$8,800$10.00");
  });

  it("shows the payment snippet beside the calculator, copied from the tested Quickstart example", async () => {
    renderWithIntl(await DevelopersHub({ locale: "en", updates: [] }));
    const snippet = screen.getByTestId("pay-snippet");
    expect(snippet).toHaveTextContent("Sending a payment is one call.");
    expect(
      within(snippet).getByRole("link", { name: "See the full example" }),
    ).toHaveAttribute("href", "/developers/docs/quickstart/send-dollars");
    const shown = Array.from(
      screen.getByTestId("pay-snippet-code").children,
      (line) => line.textContent,
    );
    expect(shown).toEqual([...PAYMENT_SNIPPET.lines]);

    // Every line but the leading "// …" is a contiguous run of the tested
    // file, so the snippet cannot drift from code that runs.
    const source = readFileSync(
      path.resolve(__dirname, "../../../../..", PAYMENT_SNIPPET.source),
      "utf8",
    ).split("\n");
    const [lead, ...code] = PAYMENT_SNIPPET.lines;
    expect(lead).toMatch(/^\/\/ … /);
    const start = source.indexOf(code[0]!);
    expect(start).toBeGreaterThan(-1);
    expect(
      source.slice(start, start + code.length + 1).filter(Boolean),
    ).toEqual(code);
    expect(source.join("\n")).toContain(
      'import { client, tokenBalance, USDC_MINT } from "./client";',
    );
  });

  it("uses a native Iterable form for the newsletter", async () => {
    const { container } = renderWithIntl(
      await DevelopersHub({ locale: "en", updates: [] }),
    );
    const form = container.querySelector("#newsletter form")!;
    expect(form.getAttribute("action")).toMatch(
      /^https:\/\/links\.iterable\.com\/lists\/publicAddSubscriberForm\?publicIdString=/,
    );
    expect(form.getAttribute("method")).toBe("post");
    expect(form.getAttribute("onsubmit")).toBeNull();
    expect(
      form.querySelector('input[name="email"][type="email"]'),
    ).not.toBeNull();
    expect(form.querySelector('button[type="submit"]')).not.toBeNull();
  });

  it("hides the updates section when the feed is empty and shows it otherwise", async () => {
    const empty = renderWithIntl(
      await DevelopersHub({ locale: "en", updates: [] }),
    );
    // The email sign-up always shows; the posts and "All news" only with a feed.
    expect(
      within(
        empty.container.querySelector("#updates") as HTMLElement,
      ).getByRole("heading", { level: 3, name: "Solana developer update" }),
    ).toBeInTheDocument();
    expect(
      empty.container.querySelector('[data-testid="updates-all"]'),
    ).toBeNull();
    empty.unmount();

    renderWithIntl(
      await DevelopersHub({
        locale: "en",
        updates: [
          {
            kind: "Release",
            title: "Agave 3.1",
            description: "New release.",
            href: "/news/agave-3-1",
            publishedAt: "2026-10-01T00:00:00Z",
          },
        ],
      }),
    );
    expect(
      screen.getByRole("heading", { name: "Developer updates" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Agave 3\.1/ })).toHaveAttribute(
      "href",
      "/news/agave-3-1",
    );
    expect(screen.getByTestId("updates-all")).toHaveAttribute("href", "/news");
  });

  it("has no eyebrow labels or left-border accents", async () => {
    const { container } = renderWithIntl(
      await DevelopersHub({ locale: "en", updates: [] }),
    );
    const html = container.innerHTML;
    expect(html).not.toMatch(
      /border-l-2|border-s-2|uppercase tracking-\[0\.18em\]/,
    );
    expect(html).not.toMatch(/sendUsdc/);
  });
});

describe("/learn landing", () => {
  it("lists the ten tutorials in order with docs links", async () => {
    renderWithIntl(await LearnLanding({ locale: "fr" }), "fr");
    const links = within(screen.getByTestId("learn-tutorials")).getAllByRole(
      "link",
    );
    expect(links).toHaveLength(10);
    expect(links[0]).toHaveAttribute("href", "/fr/learn/what-is-solana");
    expect(links[9]).toHaveAttribute(
      "href",
      "/fr/learn/staying-safe-on-solana",
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Learn about Solana" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Courses/ })).toHaveAttribute(
      "target",
      "_blank",
    );
  });
});
