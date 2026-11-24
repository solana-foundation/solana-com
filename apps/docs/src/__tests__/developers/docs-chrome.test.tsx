import { render, screen, within } from "@testing-library/react";
import { createTranslator, NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../../../../packages/i18n/messages/web/en/common.json";
import docsConfig from "@@/content/docs.json";
import enNav from "@@/content/navigation/en.json";

vi.mock("@workspace/i18n/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: string;
    namespace?: string;
  }) => createTranslator({ locale, messages: en, namespace } as never),
}));

const { DocsHeader } =
  await import("@/app/(docs)/[locale]/developers/docs-header");
const { DocsFooter } =
  await import("@/app/(docs)/[locale]/developers/docs-footer");
const { DOCS_THEME_PREPAINT_SCRIPT } =
  await import("@/app/(docs)/[locale]/developers/theme-prepaint");
const {
  DOCS_SEARCH_PROMPT,
  docsSearchHref,
  getDocsFooterColumns,
  getDocsTabs,
  labelSlug,
} = await import("@/data/developers/docs-nav");

function renderWithIntl(ui: ReactElement, locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={en}>
      {ui}
    </NextIntlClientProvider>,
  );
}

/** The visible docs tabs, straight from the docs navigation. */
const visibleTabs = (enNav.tabs as { tab: string; hidden?: boolean }[]).filter(
  (tab) => !tab.hidden,
);

describe("docs tabs on /developers", () => {
  it("match content/navigation/en.json: labels, order and first pages", () => {
    const tabs = getDocsTabs("en");
    expect(tabs.map((tab) => tab.label)).toEqual(
      visibleTabs.map((tab) => tab.tab),
    );
    expect(tabs.map((tab) => tab.href)).toEqual([
      "/developers/docs",
      "/developers/docs/payments",
      "/developers/docs/assets",
      "/developers/docs/defi",
      "/developers/docs/core",
      "/developers/docs/tools",
      "/developers/docs/rpc",
      "/developers/docs/video-guides",
    ]);
    expect(tabs.filter((tab) => tab.alignEnd).map((tab) => tab.key)).toEqual([
      "video-tutorials",
    ]);
    // The divider follows the 4th tab, as in content/styles/theme.css.
    expect(tabs[3]!.label).toBe("Markets");
  });

  it("uses English labels and locale-prefixed hrefs in every locale", () => {
    const tabs = getDocsTabs("ja");
    expect(tabs[1]!.label).toBe("Payments");
    expect(tabs[1]!.key).toBe(labelSlug("Payments"));
    expect(tabs[1]!.href).toBe("/ja/developers/docs/payments");
    expect(getDocsTabs("el")[0]!.label).toBe("Start here");
  });

  it("builds the search hand-off URLs", () => {
    expect(docsSearchHref("en")).toBe("/developers/docs?q=");
    expect(docsSearchHref("en", "  token extensions ")).toBe(
      "/developers/docs?q=token%20extensions",
    );
    expect(docsSearchHref("ja", "mint")).toBe("/ja/developers/docs?q=mint");
    expect(DOCS_SEARCH_PROMPT).toBe(docsConfig.search.prompt);
  });

  it("takes the footer columns from docs.json, relative to this site", () => {
    const columns = getDocsFooterColumns("en");
    expect(columns.map((column) => column.header)).toEqual(
      docsConfig.footer.links.map((column) => column.header),
    );
    const hrefs = columns.flatMap((column) =>
      column.items.map((item) => item.href),
    );
    expect(hrefs).toContain("/developers");
    expect(hrefs.every((href) => href.startsWith("/"))).toBe(true);
  });
});

describe("DocsHeader", () => {
  it("renders the logo home link, the tabs in the same tab and no active tab", async () => {
    const { container } = renderWithIntl(await DocsHeader({ locale: "en" }));
    const header = container.querySelector("header")!;
    expect(
      within(header).getByRole("link", { name: "Solana Developers" }),
    ).toHaveAttribute("href", "/developers");

    const desktop = header.querySelector(".dh-bar nav")!;
    expect(desktop).toHaveAttribute("aria-label", "Docs sections");
    const tabs = within(desktop as HTMLElement).getAllByRole("link");
    expect(tabs.map((tab) => tab.textContent)).toEqual(
      visibleTabs.map((tab) => tab.tab),
    );
    for (const tab of tabs) {
      expect(tab).not.toHaveAttribute("target");
      expect(tab).not.toHaveAttribute("aria-current");
    }
    // The mobile menu lists the same tabs.
    const mobile = header.querySelector(".dh-mobile nav")!;
    expect(
      within(mobile as HTMLElement)
        .getAllByRole("link")
        .map((tab) => tab.getAttribute("href")),
    ).toEqual(tabs.map((tab) => tab.getAttribute("href")));
  });

  it("has a search form to the docs, a theme switch and a language menu", async () => {
    const { container } = renderWithIntl(await DocsHeader({ locale: "ja" }));
    const form = container.querySelector('form[role="search"]')!;
    expect(form).toHaveAttribute("action", "/ja/developers/docs");
    expect(form).toHaveAttribute("method", "get");
    expect(form.querySelector('input[name="q"]')).toHaveAttribute(
      "placeholder",
      DOCS_SEARCH_PROMPT,
    );
    expect(
      container.querySelector(".dh-search-icon")!.getAttribute("href"),
    ).toBe("/ja/developers/docs?q=");

    const toggles = container.querySelectorAll("button[data-theme-toggle]");
    expect(toggles.length).toBeGreaterThan(0);
    expect(toggles[0]!.getAttribute("aria-label")).toMatch(
      /^Switch to (dark|light) mode$/,
    );

    const languages = container.querySelector(".dh-bar .dh-lang")!;
    expect(languages.tagName).toBe("DETAILS");
    expect(
      languages.querySelector('a[hreflang="en"]')!.getAttribute("href"),
    ).toBe("/developers");
    expect(
      languages.querySelector('a[hreflang="ja"]')!.getAttribute("aria-current"),
    ).toBe("true");
  });
});

describe("DocsHeader Ask AI", () => {
  it("has Ask AI's ✨ on the docs only (the landing and cookbook have Inkeep)", async () => {
    const ask = (container: HTMLElement) =>
      container.querySelector("header [data-docs-ask-open]");
    const docs = renderWithIntl(
      await DocsHeader({ locale: "en", askAi: true }),
    );
    expect(ask(docs.container)).toHaveAttribute("aria-label", "Ask AI");
    docs.unmount();
    const landing = renderWithIntl(await DocsHeader({ locale: "en" }));
    expect(ask(landing.container)).toBeNull();
    landing.unmount();
    // The prerendered 404's: not in the server render, which doesn't know
    // the URL (shown once hydrated on a docs URL; inkeep.test.tsx).
    const missing = renderToString(
      <NextIntlClientProvider locale="en" messages={en}>
        {await DocsHeader({ locale: "en", askAi: "by-path" })}
      </NextIntlClientProvider>,
    );
    expect(missing).not.toContain('data-docs-ask-open=""');
  });
});

describe("DocsFooter", () => {
  it("has the docs footer columns and the legal links", async () => {
    renderWithIntl(await DocsFooter({ locale: "en" }));
    const footer = screen.getByRole("contentinfo");
    expect(
      within(footer).getByRole("link", { name: "Developer hub" }),
    ).toHaveAttribute("href", "/developers");
    expect(
      within(footer).getByRole("link", { name: "Privacy policy" }),
    ).toHaveAttribute("href", "/privacy-policy");
    expect(
      within(footer).getByRole("link", { name: "Terms of service" }),
    ).toHaveAttribute("href", "/tos");
  });
});

describe("docs theme pre-paint script", () => {
  const html = document.documentElement;
  let dark = false;

  beforeEach(() => {
    html.className = "";
    html.removeAttribute("data-theme-preference");
    localStorage.clear();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: dark })) as unknown as typeof matchMedia,
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    dark = false;
  });

  const run = () => new Function(DOCS_THEME_PREPAINT_SCRIPT)();

  it("follows the system when nothing is stored", () => {
    dark = true;
    run();
    expect(html.classList.contains("dark")).toBe(true);
    expect(html.getAttribute("data-theme-preference")).toBe("system");
    expect(html.hasAttribute("data-dh-js")).toBe(true);
  });

  it("reads the docs' choice from localStorage isDarkMode", () => {
    dark = true;
    localStorage.setItem("isDarkMode", "light");
    run();
    expect(html.className).toBe("light tw-light");
    expect(html.style.colorScheme).toBe("light");

    localStorage.setItem("isDarkMode", "true"); // next-themes legacy value
    run();
    expect(html.className).toBe("dark tw-dark");
    expect(html.getAttribute("data-theme-preference")).toBe("dark");
  });
});
