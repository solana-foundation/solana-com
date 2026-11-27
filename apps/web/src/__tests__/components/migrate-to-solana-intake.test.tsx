import { render, screen } from "@testing-library/react";
import type { AbstractIntlMessages } from "next-intl";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "@workspace/i18n/client";
import { loadMergedMessages } from "@workspace/i18n/messages";

import { DevelopersChainMigrationPage } from "@/app/[locale]/developers/migrate-to-solana/developers-chain-migration";
import { INTAKE_FORM_URL } from "@/app/[locale]/developers/migrate-to-solana/migration-program";

vi.mock("next/dynamic", () => ({ default: () => () => null }));
vi.mock("@workspace/ui/landing", () => ({ HtmlParser: () => null }));
vi.mock("@/app/components/docs-code-snippet", () => ({
  DocsCodeSnippet: () => null,
}));

let messages: AbstractIntlMessages;

beforeAll(async () => {
  messages = await loadMergedMessages({ app: "web", locale: "en" });
});

afterEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState(null, "", "/");
});

function renderPage() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <DevelopersChainMigrationPage />
    </NextIntlClientProvider>,
  );
}

function intakeHrefs() {
  return screen
    .getAllByRole("link", { name: "Tell us about your launch" })
    .map((link) => link.getAttribute("href"));
}

describe("Migrate to Solana intake referral", () => {
  it("passes the ?ref= code to the intake form", () => {
    window.history.replaceState(null, "", "/?ref=JH");
    renderPage();
    for (const href of intakeHrefs()) {
      expect(href).toBe(`${INTAKE_FORM_URL}?ref=jh`);
    }
  });

  it("keeps the referral for the visit after the URL changes", () => {
    window.history.replaceState(null, "", "/?ref=jh");
    const { unmount } = renderPage();
    unmount();
    window.history.replaceState(null, "", "/");
    renderPage();
    for (const href of intakeHrefs()) {
      expect(href).toBe(`${INTAKE_FORM_URL}?ref=jh`);
    }
  });

  it("tags website visits without a staff code", () => {
    renderPage();
    for (const href of intakeHrefs()) {
      expect(href).toBe(`${INTAKE_FORM_URL}?ref=website`);
    }
  });

  it("ignores referral values that aren't staff codes", () => {
    window.history.replaceState(null, "", "/?ref=%3Cscript%3E");
    renderPage();
    for (const href of intakeHrefs()) {
      expect(href).toBe(`${INTAKE_FORM_URL}?ref=website`);
    }
  });
});
