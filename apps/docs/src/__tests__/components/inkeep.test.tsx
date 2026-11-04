import { act, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../../../../packages/i18n/messages/web/en/common.json";
import { isAskAiPath, openAskAi } from "@/lib/docs/ask-ai";
import { resetAskStoreForTests } from "@/lib/docs/ask/store";
import { openDocsSearch } from "@/lib/docs/search-hand-off";

let pathname = "/developers/cookbook";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => pathname,
  useRouter: () => ({ prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
// Inkeep's modals are not under test: a stand-in that shows how each was
// opened (the docs' own, and the chat button's).
vi.mock("next/dynamic", () => ({
  default: () =>
    function InkeepModal(props: {
      defaultView: string;
      searchSettings: { defaultQuery?: string };
      modalSettings: { isOpen: boolean; shortcutKey?: string | null };
    }) {
      return (
        <div
          data-testid={
            props.modalSettings.shortcutKey === null ? "inkeep" : "inkeep-chat"
          }
        >
          {`${props.modalSettings.isOpen ? "open" : "closed"} ${props.defaultView} ${props.searchSettings.defaultQuery}`}
        </div>
      );
    },
}));

const { DocsInkeep } = await import("@/components/docs/inkeep.client");
const { DocsAssistant } =
  await import("@/components/docs/docs-assistant.client");
const { AskHeaderButton } =
  await import("@/components/docs/ask/ask-launcher.client");

function withIntl(element: ReactElement) {
  return (
    <NextIntlClientProvider locale="en" messages={en}>
      {element}
    </NextIntlClientProvider>
  );
}

beforeEach(() => {
  resetAskStoreForTests();
  sessionStorage.clear();
  localStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(null, { status: 404 })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  resetAskStoreForTests();
});

describe("isAskAiPath", () => {
  it("is the docs, in every locale, and nothing else", () => {
    for (const path of [
      "/developers/docs",
      "/developers/docs/core/accounts",
      "/ja/developers/docs/core/accounts",
      "/en/developers/docs",
    ])
      expect(isAskAiPath(path)).toBe(true);
    for (const path of [
      "/developers",
      "/developers/cookbook/transactions/send-sol",
      "/ja/developers/cookbook",
      "/developers/docsearch",
      "/docs/core/accounts",
      "",
      null,
    ])
      expect(isAskAiPath(path)).toBe(false);
  });
});

describe("DocsInkeep", () => {
  it("opens search with the query, and chat for a code block", () => {
    render(<DocsInkeep />);
    const modal = screen.getByTestId("inkeep");
    expect(modal.textContent).toBe("closed search ");
    act(() => openDocsSearch("fees"));
    expect(modal.textContent).toBe("open search fees");
    act(() => openAskAi({ code: "let x;", language: "ts" }));
    expect(modal.textContent).toBe("open chat fees");
  });

  it("opens search on arrival with ?q=", () => {
    history.replaceState(null, "", "/developers/cookbook?q=mint");
    render(<DocsInkeep />);
    expect(screen.getByTestId("inkeep").textContent).toBe("open search mint");
    expect(location.search).toBe("");
  });
});

describe("DocsAssistant", () => {
  it("is Ask AI on the docs", () => {
    pathname = "/ja/developers/docs/core/accounts";
    const { container } = render(withIntl(<DocsAssistant />));
    expect(container.querySelector("[data-ask-launcher]")).not.toBeNull();
    expect(screen.queryByTestId("inkeep")).toBeNull();
    // The docs search is the agent's, and the code blocks' Ask opens the panel.
    act(() => openAskAi("let x;"));
    expect(screen.getByRole("dialog", { name: "Ask AI" })).toBeInTheDocument();
  });

  it("is Inkeep's button and search on the landing and the cookbook", () => {
    for (const path of ["/developers", "/developers/cookbook/tokens"]) {
      pathname = path;
      const view = render(withIntl(<DocsAssistant />));
      expect(view.container.querySelector("[data-ask-launcher]")).toBeNull();
      expect(
        screen.getByRole("button", { name: "Ask AI" }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("inkeep-chat")).toBeInTheDocument();
      act(() => openDocsSearch("rent"));
      expect(screen.getByTestId("inkeep").textContent).toBe("open search rent");
      // No Ask AI panel answers the code blocks' Ask here.
      act(() => openAskAi("let x;"));
      expect(screen.queryByRole("dialog", { name: "Ask AI" })).toBeNull();
      expect(screen.getByTestId("inkeep").textContent).toBe("open chat rent");
      view.unmount();
    }
  });

  it("closes the docs search when the reader leaves the docs, so it doesn't open by itself on the next docs page", () => {
    pathname = "/developers/docs/tools";
    const view = render(withIntl(<DocsAssistant />));
    act(() => openDocsSearch("rent"));
    expect(screen.getByRole("dialog", { name: "Search" })).toBeInTheDocument();
    // Back to the cookbook with the search open, then on to a docs page.
    pathname = "/developers/cookbook/accounts/calculate-rent";
    view.rerender(withIntl(<DocsAssistant />));
    expect(screen.queryByRole("dialog", { name: "Search" })).toBeNull();
    pathname = "/developers/docs/from-evm";
    view.rerender(withIntl(<DocsAssistant />));
    expect(screen.queryByRole("dialog", { name: "Search" })).toBeNull();
    // It still opens when asked.
    act(() => openDocsSearch("fees"));
    expect(screen.getByRole("dialog", { name: "Search" })).toBeInTheDocument();
    view.unmount();
  });
});

describe("AskHeaderButton byPath (the prerendered 404's ✨)", () => {
  it("shows once hydrated on a docs URL, and not elsewhere", () => {
    const button = () => (
      <AskHeaderButton byPath label="Ask AI">
        ✨
      </AskHeaderButton>
    );
    pathname = "/developers/docs/does-not-exist";
    const docs = render(withIntl(button()));
    expect(
      docs.container.querySelector("[data-docs-ask-open]"),
    ).toHaveAttribute("aria-label", "Ask AI");
    docs.unmount();
    for (const path of ["/developers/cookbook/does-not-exist", "/nope"]) {
      pathname = path;
      const other = render(withIntl(button()));
      expect(other.container.querySelector("[data-docs-ask-open]")).toBeNull();
      other.unmount();
    }
  });
});
