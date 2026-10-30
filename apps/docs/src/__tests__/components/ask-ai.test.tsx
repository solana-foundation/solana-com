import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ASK_SOLANA_ANALYTICS_EVENT } from "@solana-com/ui-chrome/ask-solana/analytics";
import { clearAskSession } from "@solana-com/ui-chrome/ask-solana/api";
import { closeAskSolana } from "@solana-com/ui-chrome/ask-solana/store";
import en from "../../../../../packages/i18n/messages/web/en/common.json";
import { DOCS_ASK_OPEN_EVENT, openAskAi } from "@/lib/docs/ask-ai";
import { resetAskStoreForTests } from "@/lib/docs/ask/store";
import { openDocsSearch } from "@/lib/docs/search-hand-off";

vi.mock("next/navigation", () => ({
  usePathname: () => "/developers/docs",
  useRouter: () => ({ prefetch: vi.fn() }),
}));

const { AskSearch } = await import("@/components/docs/ask/ask-search.client");
const { AskAi } = await import("@/components/docs/ask/ask-ai.client");

function withIntl(element: ReactElement) {
  return (
    <NextIntlClientProvider locale="en" messages={en}>
      {element}
    </NextIntlClientProvider>
  );
}

let results: unknown[] = [];
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  resetAskStoreForTests();
  clearAskSession();
  localStorage.clear();
  sessionStorage.clear();
  results = [
    {
      title: "Transaction fees",
      url: "/docs/core/fees",
      breadcrumbs: ["Core", "Fees"],
      snippet: "Every transaction pays a base fee.",
    },
    {
      title: "PDA Creation",
      url: "/docs/tools/litesvm/examples/pda-creation",
      breadcrumbs: ["PDA Creation"],
      snippet: "## Key Points **Seeds** and the `bump`",
    },
  ];
  fetchMock = vi.fn(async (url: string) => {
    if (url.includes("/search?")) return Response.json({ results });
    if (url.endsWith("/session"))
      return Response.json({ session_token: "mock-token" });
    return new Response(null, { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  act(() => closeAskSolana());
  vi.unstubAllGlobals();
  resetAskStoreForTests();
});

describe("AskSearch", () => {
  it("opens with what was typed and lists the docs pages it finds", async () => {
    render(withIntl(<AskSearch />));
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => openDocsSearch("fees"));
    const dialog = screen.getByRole("dialog", { name: "Search" });
    const field = within(dialog).getByRole("textbox", {
      name: "Search documentation…",
    });
    expect(field).toHaveValue("fees");
    expect(document.activeElement).toBe(field);
    const page = await within(dialog).findByRole("link", {
      name: /Transaction fees/,
    });
    // Old /docs links open at /developers/docs.
    expect(page).toHaveAttribute("href", "/developers/docs/core/fees");
    expect(page.textContent).toContain("Core › Fees");
    expect(page.textContent).toContain("Every transaction pays a base fee.");
    expect(String(fetchMock.mock.calls[0]![0])).toBe("/api/ask/search?q=fees");
    // A trail that is only the page is left out, and so are Markdown marks.
    const pda = within(dialog).getByRole("link", { name: /PDA Creation/ });
    expect(pda.textContent).toBe("PDA CreationKey Points Seeds and the bump");
  });

  it("says when nothing matches", async () => {
    results = [];
    render(withIntl(<AskSearch />));
    act(() => openDocsSearch("nothing"));
    expect(await screen.findByText("No results found.")).toBeInTheDocument();
  });

  it("opens search on arrival with ?q=", () => {
    history.replaceState(null, "", "/developers/docs?q=mint");
    render(withIntl(<AskSearch />));
    expect(screen.getByRole("textbox")).toHaveValue("mint");
    expect(location.search).toBe("");
  });

  it("opens search on arrival with ?search=, as Inkeep did", () => {
    history.replaceState(null, "", "/developers/docs?search=%20rent%20");
    render(withIntl(<AskSearch />));
    expect(screen.getByRole("textbox")).toHaveValue("rent");
    expect(location.search).toBe("?search=%20rent%20");
    history.replaceState(null, "", "/developers/docs");
  });

  it("hands “Ask AI” to the docs' Ask AI panel", () => {
    const asked = vi.fn();
    const onAsk = (event: Event) => asked((event as CustomEvent).detail);
    window.addEventListener(DOCS_ASK_OPEN_EVENT, onAsk);
    render(withIntl(<AskSearch />));
    act(() => openDocsSearch("rent"));
    act(() =>
      fireEvent.click(screen.getByRole("button", { name: "Ask AI: “rent”" })),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(asked).toHaveBeenCalledWith({ question: "rent" });
    window.removeEventListener(DOCS_ASK_OPEN_EVENT, onAsk);
  });
});

describe("AskSearch keyboard", () => {
  it("moves through the rows with the arrow keys", async () => {
    render(withIntl(<AskSearch />));
    act(() => openDocsSearch("fees"));
    const field = screen.getByRole("textbox");
    const page = await screen.findByRole("link", { name: /Transaction fees/ });
    const ask = screen.getByRole("button", { name: "Ask AI: “fees”" });
    fireEvent.keyDown(field, { key: "ArrowDown" });
    expect(document.activeElement).toBe(ask);
    fireEvent.keyDown(ask, { key: "ArrowDown" });
    expect(document.activeElement).toBe(page);
    fireEvent.keyDown(page, { key: "ArrowUp" });
    fireEvent.keyDown(ask, { key: "ArrowUp" });
    expect(document.activeElement).toBe(field);
  });

  it("asks AI on Enter in the field", () => {
    const asked = vi.fn();
    const onAsk = (event: Event) => asked((event as CustomEvent).detail);
    window.addEventListener(DOCS_ASK_OPEN_EVENT, onAsk);
    render(withIntl(<AskSearch />));
    act(() => openDocsSearch("rent"));
    act(() => {
      fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(asked).toHaveBeenCalledWith({ question: "rent" });
    window.removeEventListener(DOCS_ASK_OPEN_EVENT, onAsk);
  });
});

describe("AskSearch analytics", () => {
  it("sends Bri's search events: opened, searched, result clicked, Ask AI", async () => {
    const events: unknown[] = [];
    const record = (event: Event) => events.push((event as CustomEvent).detail);
    window.addEventListener(ASK_SOLANA_ANALYTICS_EVENT, record);
    const stay = (event: Event) => event.preventDefault();
    document.addEventListener("click", stay);
    render(withIntl(<AskSearch />));
    act(() => openDocsSearch("fees"));
    const page = await screen.findByRole("link", { name: /Transaction fees/ });
    act(() => fireEvent.click(page));
    act(() => openDocsSearch("rent"));
    await screen.findByRole("link", { name: /Transaction fees/ });
    act(() =>
      fireEvent.click(screen.getByRole("button", { name: "Ask AI: “rent”" })),
    );
    expect(events).toEqual([
      { event: "docs_ai_chat_opened", properties: { view: "search" } },
      {
        event: "docs_ai_search",
        properties: { query: "fees", result_count: 2 },
      },
      {
        event: "docs_ai_search_result_clicked",
        properties: { query: "fees", url: "/docs/core/fees" },
      },
      { event: "docs_ai_chat_opened", properties: { view: "search" } },
      {
        event: "docs_ai_search",
        properties: { query: "rent", result_count: 2 },
      },
      { event: "docs_ai_view_switched", properties: { view: "chat" } },
    ]);
    document.removeEventListener("click", stay);
    window.removeEventListener(ASK_SOLANA_ANALYTICS_EVENT, record);
  });
});

describe("AskAi", () => {
  it("opens the panel from a code block's Ask button, not the search", () => {
    render(
      withIntl(
        <>
          <AskAi />
          <AskSearch />
        </>,
      ),
    );
    act(() => openAskAi("let x;"));
    expect(screen.getByRole("dialog", { name: "Ask AI" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Search" })).toBeNull();
  });
});
