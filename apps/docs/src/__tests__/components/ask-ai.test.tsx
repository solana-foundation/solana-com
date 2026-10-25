import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { openAskAi } from "@/lib/docs/ask-ai";
import { openDocsSearch } from "@/lib/docs/search-hand-off";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));
// Inkeep's modal is not under test: a stand-in that shows how it was opened.
vi.mock("next/dynamic", () => ({
  default: () =>
    function InkeepModal(props: {
      defaultView: string;
      searchSettings: { defaultQuery?: string };
      modalSettings: { isOpen: boolean };
    }) {
      return (
        <div data-testid="inkeep">
          {`${props.modalSettings.isOpen ? "open" : "closed"} ${props.defaultView} ${props.searchSettings.defaultQuery}`}
        </div>
      );
    },
}));

const { DocsInkeep } = await import("@/components/docs/inkeep.client");

describe("DocsInkeep", () => {
  it("opens search with the query, and chat for a code block", () => {
    render(<DocsInkeep />);
    const modal = screen.getByTestId("inkeep");
    expect(modal.textContent).toBe("closed search ");
    act(() => openDocsSearch("fees"));
    expect(modal.textContent).toBe("open search fees");
    act(() => openAskAi("let x;"));
    expect(modal.textContent).toBe("open chat fees");
  });

  it("opens search on arrival with ?q=", () => {
    history.replaceState(null, "", "/developers/docs?q=mint");
    render(<DocsInkeep />);
    expect(screen.getByTestId("inkeep").textContent).toBe("open search mint");
    expect(location.search).toBe("");
  });
});
