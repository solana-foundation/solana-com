import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { closeAskSolana } from "@solana-com/ui-chrome/ask-solana/store";
import en from "../../../../../packages/i18n/messages/web/en/common.json";
import { openAskAi } from "@/lib/docs/ask-ai";
import { resetAskStoreForTests } from "@/lib/docs/ask/store";
import { openDocsSearch } from "@/lib/docs/search-hand-off";

let pathname = "/developers";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => pathname,
  useRouter: () => ({ prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const { DocsAssistant } =
  await import("@/components/docs/docs-assistant.client");

function withIntl(element: ReactElement) {
  return (
    <NextIntlClientProvider locale="en" messages={en}>
      {element}
    </NextIntlClientProvider>
  );
}

/** Every kind of page the docs layout serves, in and out of a locale. */
const PAGES = [
  "/developers",
  "/ja/developers",
  "/developers/cookbook",
  "/developers/cookbook/transactions/send-sol",
  "/ja/developers/cookbook/tokens",
  "/developers/docs/core/accounts",
  "/developers/docs/does-not-exist",
];

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  resetAskStoreForTests();
  sessionStorage.clear();
  localStorage.clear();
  fetchMock = vi.fn(async (url: string) => {
    // The agent proxy without its secret, as in a local run.
    if (url.startsWith("/api/ask/"))
      return Response.json(
        { error: "ASK_SOLANA_PROXY_SECRET is not configured" },
        { status: 503 },
      );
    if (url.startsWith("/api/docs-search?"))
      return Response.json([
        {
          type: "page",
          url: "/developers/cookbook/accounts/calculate-rent",
          content: "Calculate account creation cost",
        },
      ]);
    return new Response(null, { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  act(() => closeAskSolana());
  vi.unstubAllGlobals();
  resetAskStoreForTests();
  history.replaceState(null, "", "/");
});

describe("DocsAssistant", () => {
  it("is Ask AI and the agent's search on every page, not only the docs", () => {
    for (const path of PAGES) {
      pathname = path;
      history.replaceState(null, "", path);
      const view = render(withIntl(<DocsAssistant />));
      expect(
        view.container.querySelector("[data-ask-launcher]"),
        path,
      ).not.toBeNull();

      act(() => openDocsSearch("rent"));
      const search = screen.getByRole("dialog", { name: "Search" });
      expect(
        within(search).getByRole("textbox", { name: "Search documentation…" }),
      ).toHaveValue("rent");
      act(() => closeAskSolana());

      // The code blocks' Ask, the page actions and the ✨ open the panel.
      act(() => openAskAi("let x;"));
      expect(
        screen.getByRole("dialog", { name: "Ask AI" }),
        path,
      ).toBeInTheDocument();
      act(() => resetAskStoreForTests());
      view.unmount();
    }
  });

  it("opens the search with ?q= on arrival on the landing and the cookbook", () => {
    for (const path of ["/developers", "/developers/cookbook/tokens"]) {
      pathname = path;
      history.replaceState(null, "", `${path}?q=mint`);
      const view = render(withIntl(<DocsAssistant />));
      expect(
        within(screen.getByRole("dialog", { name: "Search" })).getByRole(
          "textbox",
        ),
      ).toHaveValue("mint");
      expect(location.search).toBe("");
      act(() => closeAskSolana());
      view.unmount();
    }
  });

  it("falls back to the docs' own index off the docs when the agent is unavailable", async () => {
    pathname = "/developers/cookbook";
    history.replaceState(null, "", pathname);
    render(withIntl(<DocsAssistant />));
    act(() => openDocsSearch("rent"));
    const dialog = screen.getByRole("dialog", { name: "Search" });
    expect(
      await within(dialog).findByRole("link", {
        name: /Calculate account creation cost/,
      }),
    ).toHaveAttribute("href", "/developers/cookbook/accounts/calculate-rent");
    expect(
      fetchMock.mock.calls.some(([url]) =>
        String(url).startsWith("/api/docs-search?"),
      ),
    ).toBe(true);
  });

  it("opens the panel from the header's ✨ on the landing", () => {
    pathname = "/developers";
    history.replaceState(null, "", pathname);
    const ask = document.createElement("button");
    ask.setAttribute("data-docs-ask-open", "");
    document.body.appendChild(ask);
    render(withIntl(<DocsAssistant />));
    fireEvent.click(ask);
    expect(screen.getByRole("dialog", { name: "Ask AI" })).toBeInTheDocument();
    ask.remove();
  });

  it("keeps the panel and the search across client-side moves between the landing, the cookbook and the docs", () => {
    pathname = "/developers";
    history.replaceState(null, "", pathname);
    const view = render(withIntl(<DocsAssistant />));
    act(() => openAskAi({ question: "What is rent?" }));
    expect(screen.getByRole("dialog", { name: "Ask AI" })).toBeInTheDocument();
    for (const path of [
      "/developers/cookbook/accounts/calculate-rent",
      "/developers/docs/core/accounts",
    ]) {
      pathname = path;
      view.rerender(withIntl(<DocsAssistant />));
      expect(
        screen.getByRole("dialog", { name: "Ask AI" }),
        path,
      ).toBeInTheDocument();
    }
    act(() => resetAskStoreForTests());
    act(() => openDocsSearch("fees"));
    pathname = "/developers/cookbook";
    view.rerender(withIntl(<DocsAssistant />));
    expect(screen.getByRole("dialog", { name: "Search" })).toBeInTheDocument();
  });
});
