import { render, screen } from "@testing-library/react";
import type { AbstractIntlMessages } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { loadMergedMessages } from "@workspace/i18n/messages";

import { DevelopersChainMigrationPage } from "@/app/[locale]/developers/migrate-to-solana/developers-chain-migration";
import {
  PARTNER_CATEGORIES,
  getVisiblePartnerCategories,
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
        screen.getByRole("link", { name: `Visit ${partner.name}` }),
      ).toBeTruthy();
    }
    for (const partner of pending) {
      expect(
        screen.queryByRole("link", { name: `Visit ${partner.name}` }),
      ).toBeNull();
    }
    expect(screen.queryByText("Pending")).toBeNull();
  });

  it("hides the intake CTA until a form URL is configured", () => {
    renderPage();
    expect(
      screen.queryByRole("link", { name: "Get matched with partners" }),
    ).toBeNull();
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

  it("drops categories that have no visible partners", () => {
    const visible = getVisiblePartnerCategories(false);
    expect(visible.every((c) => c.partners.length > 0)).toBe(true);
    expect(getVisiblePartnerCategories(true)).toHaveLength(
      PARTNER_CATEGORIES.length,
    );
  });
});
