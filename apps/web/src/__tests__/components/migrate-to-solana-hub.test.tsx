import { render, screen } from "@testing-library/react";
import type { AbstractIntlMessages } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { loadMergedMessages } from "@workspace/i18n/messages";

import { DevelopersChainMigrationPage } from "@/app/[locale]/developers/migrate-to-solana/developers-chain-migration";
import {
  INTAKE_FORM_URL,
  PARTNER_CATEGORIES,
  buildIntakeUrl,
  getVisiblePartnerCategories,
  sanitizeReferral,
} from "@/app/[locale]/developers/migrate-to-solana/migration-program";

// Background animations aren't part of what these tests cover.
vi.mock("next/dynamic", () => ({ default: () => () => null }));
// The hub imports MIGRATION_NAV from the guide layout; stub the layout's
// rendering dependencies, which the hub page doesn't use.
vi.mock("@workspace/ui/landing", () => ({ HtmlParser: () => null }));
vi.mock("@/app/components/docs-code-snippet", () => ({
  DocsCodeSnippet: () => null,
}));

let messages: AbstractIntlMessages;

beforeAll(async () => {
  messages = await loadMergedMessages({ app: "web", locale: "en" });
});

function renderPage() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <DevelopersChainMigrationPage />
    </NextIntlClientProvider>,
  );
}

describe("Migrate to Solana hub", () => {
  it("renders every program section", () => {
    renderPage();

    for (const heading of [
      "Bring your project to Solana",
      "Migration support for every project",
      "Get hands-on help from ecosystem partners",
      "Funding for the engineering work",
      "Announce your launch on Solana",
      "Questions about migrating",
      "Start your migration",
    ]) {
      expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
    }
    expect(screen.getAllByText(/\$1M TVL/).length).toBeGreaterThan(0);
  });

  it("only lists confirmed partners outside local development", () => {
    renderPage();

    const live = PARTNER_CATEGORIES.flatMap((c) => c.partners).filter(
      (p) => p.status === "live",
    );
    const pending = PARTNER_CATEGORIES.flatMap((c) => c.partners).filter(
      (p) => p.status === "pending",
    );

    for (const partner of live) {
      expect(
        screen.getAllByRole("link", { name: `Visit ${partner.name}` }).length,
      ).toBeGreaterThan(0);
    }
    for (const partner of pending) {
      expect(
        screen.queryByRole("link", { name: `Visit ${partner.name}` }),
      ).toBeNull();
    }
    expect(screen.queryByText("Pending")).toBeNull();
  });

  it("opens the intake form from the partner CTAs", () => {
    renderPage();
    const links = screen.getAllByRole("link", {
      name: "Get matched with partners",
    });
    expect(links.length).toBeGreaterThanOrEqual(2);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe(`${INTAKE_FORM_URL}?ref=website`);
      expect(link.getAttribute("target")).toBe("_blank");
    }
  });

  it("offers the guides and the support tracks from the hero", () => {
    renderPage();
    expect(
      screen
        .getByRole("link", { name: "See migration support" })
        .getAttribute("href"),
    ).toBe("#how-it-works");
    expect(document.getElementById("how-it-works")).not.toBeNull();
  });

  it("links the partners step to the partners section", () => {
    renderPage();
    const link = screen.getByRole("link", { name: "See migration partners" });
    expect(link.getAttribute("href")).toBe("#partners");
    expect(document.getElementById("partners")).not.toBeNull();
  });

  it("lists Helius under RPC and privacy with its resource links", () => {
    renderPage();
    const hrefs = screen
      .getAllByRole("link", { name: "Visit Helius" })
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([
      "https://www.helius.dev",
      "https://www.helius.dev/docs/privacy",
    ]);
    expect(
      screen
        .getByRole("link", { name: "Solana vs Ethereum guide" })
        .getAttribute("href"),
    ).toBe("https://www.helius.dev/solana-vs-ethereum");
    expect(
      screen
        .getByRole("link", { name: "Wallet integration guide" })
        .getAttribute("href"),
    ).toBe("https://www.helius.dev/docs/privacy/integration/wallet");
    expect(screen.getByRole("heading", { name: "Privacy" })).toBeTruthy();
  });

  it("drops categories that have no visible partners", () => {
    const visible = getVisiblePartnerCategories(false);
    expect(visible.every((c) => c.partners.length > 0)).toBe(true);
    expect(getVisiblePartnerCategories(true)).toHaveLength(
      PARTNER_CATEGORIES.length,
    );
  });

  it("adds the referral code to the intake form URL", () => {
    expect(buildIntakeUrl("https://tally.so/r/abc", "jh")).toBe(
      "https://tally.so/r/abc?ref=jh",
    );
    expect(buildIntakeUrl("https://tally.so/r/abc", "")).toBe(
      "https://tally.so/r/abc?ref=website",
    );
    expect(buildIntakeUrl("", "jh")).toBe("");
  });

  it("accepts only short staff codes as referrals", () => {
    expect(sanitizeReferral(" JH ")).toBe("jh");
    expect(sanitizeReferral("jonas-h_2")).toBe("jonas-h_2");
    expect(sanitizeReferral("<script>")).toBe("");
    expect(sanitizeReferral("a".repeat(33))).toBe("");
    expect(sanitizeReferral(null)).toBe("");
  });
});
