import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { LiveFeed } from "@/components/docs/docs-live-feed.client";

function tip(slot: number) {
  return {
    tip: slot,
    blocks: [
      { slot: slot - 2, txs: 412 },
      { slot, txs: 386 },
    ],
    skipped: [slot - 1],
    serverTime: Date.now(),
  };
}

function serve(body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(body))),
  );
}

/** jsdom has no PointerEvent: a pointerdown that says it came from touch. */
function touch(el: Element) {
  fireEvent(
    el,
    Object.assign(new Event("pointerdown", { bubbles: true }), {
      pointerType: "touch",
    }),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("docs LiveFeed", () => {
  it("doesn't poll until the feed is near the viewport", async () => {
    serve(tip(460_172_365));
    let show = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          show = () =>
            cb(
              [{ isIntersecting: true } as IntersectionObserverEntry],
              this as unknown as IntersectionObserver,
            );
        }
        observe() {}
        disconnect() {}
      },
    );
    render(<LiveFeed />);
    await new Promise((r) => setTimeout(r, 50));
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByText("Loading live mainnet data…")).toBeTruthy();
    act(() => show());
    expect(await screen.findByText("386")).toBeTruthy();
  });

  it("shows each block as a tile, linked to Explorer, and no transaction list", async () => {
    serve(tip(460_172_365));
    render(<LiveFeed />);

    expect(
      await screen.findByText("460,172,365", { selector: "b" }),
    ).toBeTruthy();
    const tile = (await screen.findByText("386")).closest("a");
    expect(tile?.getAttribute("href")).toBe(
      "https://explorer.solana.com/block/460172365",
    );
    expect(screen.getByText("412")).toBeTruthy();
    expect(screen.getByText("skipped")).toBeTruthy();

    await new Promise((r) => setTimeout(r, 1_200));
    expect(document.querySelector('a[href*="/tx/"]')).toBeNull();
    expect(screen.queryByText(/Latest/)).toBeNull();
  });

  it("explains mainnet, slot, and blocks, with links to the concepts", async () => {
    serve(tip(460_172_365));
    render(<LiveFeed />);
    await screen.findByText("386");

    const hrefs = screen
      .getAllByRole("link", { name: "Learn more" })
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([
      "/developers/docs/references/clusters",
      "/developers/docs/references/terminology#slot",
      "/developers/docs/references/terminology#block",
    ]);
    for (const term of ["Mainnet", "slot", "Blocks"]) {
      expect(screen.getByText(term, { selector: ".tooltip" }).tabIndex).toBe(0);
    }
  });

  it("opens a tile's explanation on keyboard focus and closes it on Escape", async () => {
    serve(tip(460_172_365));
    render(<LiveFeed />);
    const tile = (await screen.findByText("386")).closest("a")!;

    fireEvent.focus(tile);
    const pop = await screen.findByRole("tooltip", {
      name: /Block 460,172,365/,
    });
    expect(tile.getAttribute("aria-describedby")).toBe(pop.id);
    expect(pop.textContent).toContain("386 transactions");
    expect(
      within(pop)
        .getByRole("link", { name: "Learn more about blocks" })
        .getAttribute("href"),
    ).toBe("/developers/docs/references/terminology#block");
    expect(
      within(pop)
        .getByRole("link", { name: "View in Explorer" })
        .getAttribute("href"),
    ).toBe("https://explorer.solana.com/block/460172365");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() =>
      expect(
        screen.queryByRole("tooltip", { name: /Block 460,172,365/ }),
      ).toBeNull(),
    );
  });

  it("explains a tile on the first tap and follows the link on the second", async () => {
    serve(tip(460_172_365));
    render(<LiveFeed />);
    const tile = (await screen.findByText("386")).closest("a")!;

    // Read what the feed decided, then stop jsdom from navigating.
    const prevented: boolean[] = [];
    const record = (e: Event) => {
      prevented.push(e.defaultPrevented);
      e.preventDefault();
    };
    document.addEventListener("click", record);

    // A tap focuses the tile before its click, as in a browser.
    touch(tile);
    fireEvent.focus(tile);
    fireEvent.click(tile);
    await screen.findByRole("tooltip", { name: /Block 460,172,365/ });
    touch(tile);
    fireEvent.click(tile);
    document.removeEventListener("click", record);
    expect(prevented).toEqual([true, false]);
  });

  it("says the data is unavailable when the route fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 502 })),
    );
    render(<LiveFeed />);
    await waitFor(() =>
      expect(screen.getByText("Live data unavailable.")).toBeTruthy(),
    );
  });
});
