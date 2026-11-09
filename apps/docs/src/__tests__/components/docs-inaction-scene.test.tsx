import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  FullscreenButton,
  InActionScene,
} from "@/components/docs/docs-inaction-scene.client";

const SIG =
  "4JZW7fB3h53qP6f66eat4cwDVDFvxwTtKWbV8tfJJHVo4eHzK9riSvetQSwPEtungFxfbWC968JoyDoqRo7XauLZ";

function reduceMotion(on: boolean) {
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: on && query.includes("reduce"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

function serve(body: unknown, status = 200) {
  const fetch = vi.fn(
    async () => new Response(JSON.stringify(body), { status }),
  );
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

const flush = (ms: number) => act(() => vi.advanceTimersByTimeAsync(ms));

/** An IntersectionObserver that reports every element in view at once. */
function inView() {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(private cb: IntersectionObserverCallback) {}
      observe() {
        this.cb(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      disconnect() {}
    },
  );
}

describe("InActionScene", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    reduceMotion(false);
  });

  it("checkout: Pay sends a devnet transfer, then shows the time, the shop's order, and Explorer", async () => {
    const fetch = serve({ signature: SIG, ms: 640 });
    render(<InActionScene kind="checkout" />);
    expect(screen.getByText("Order #1001 waiting")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Pay 1 USDC" }));
    expect(screen.getByRole("button", { name: /Paying/ })).toBeTruthy();
    await flush(1000);

    expect(fetch).toHaveBeenCalledWith(
      "/api/demo/checkout",
      expect.objectContaining({ method: "POST" }),
    );
    expect(screen.getByRole("button", { name: "Paid in 0.6 s" })).toBeTruthy();
    expect(screen.getByText("Order #1001 paid")).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "View on Explorer" })
        .getAttribute("href"),
    ).toBe(`https://explorer.solana.com/tx/${SIG}?cluster=devnet`);
    // One "Paid" state, no receipt.
    expect(screen.queryByText("Paid ✓")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Pay again" }));
    await flush(1000);
    expect(screen.getByText("Order #1002 paid")).toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("checkout: without the demo wallets, still pays and says the link is unavailable", async () => {
    serve({ error: "unconfigured" }, 503);
    render(<InActionScene kind="checkout" />);
    fireEvent.click(screen.getByRole("button", { name: "Pay 1 USDC" }));
    await flush(1000);
    expect(screen.getByRole("button", { name: "Paid" })).toBeTruthy();
    expect(screen.getByText("Explorer link unavailable")).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("token: Create token makes a devnet mint, then links the token and the transaction", async () => {
    const MINT = "So11111111111111111111111111111111111111112";
    const fetch = serve({ signature: SIG, ms: 412, mint: MINT });
    render(<InActionScene kind="token" />);
    expect(screen.getByText("No token yet")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Create token" }));
    await flush(1000);
    expect(fetch).toHaveBeenCalledWith(
      "/api/demo/create-token",
      expect.objectContaining({ method: "POST" }),
    );
    expect(
      screen.getByRole("button", { name: "Created in 0.4 s" }),
    ).toBeTruthy();
    expect(screen.getByText("Mint So11…1112")).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: "Token on Explorer" })
        .getAttribute("href"),
    ).toBe(`https://explorer.solana.com/address/${MINT}?cluster=devnet`);
    expect(
      screen.getByRole("link", { name: "Transaction" }).getAttribute("href"),
    ).toBe(`https://explorer.solana.com/tx/${SIG}?cluster=devnet`);

    fireEvent.click(screen.getByRole("button", { name: "Create another" }));
    await flush(1000);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("token: when the route fails, still finishes without a link", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    render(<InActionScene kind="token" />);
    fireEvent.click(screen.getByRole("button", { name: "Create token" }));
    await flush(1000);
    expect(screen.getByRole("button", { name: "Created" })).toBeTruthy();
    expect(screen.getByText("Explorer link unavailable")).toBeTruthy();
  });

  it("lights up sign, then send once the route streams sent, then final", async () => {
    let finish = () => {};
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        const enc = new TextEncoder();
        const body = new ReadableStream<Uint8Array>({
          start(c) {
            c.enqueue(enc.encode('{"step":"sent"}\n'));
            finish = () => {
              c.enqueue(
                enc.encode(JSON.stringify({ signature: SIG, ms: 300 })),
              );
              c.close();
            };
          },
        });
        return new Response(body);
      }),
    );
    const { container } = render(<InActionScene kind="checkout" />);
    const on = () =>
      container.querySelector(".sol-inaction-steps li[data-on]")
        ?.firstElementChild?.textContent;
    expect(on()).toBeUndefined();
    expect(screen.getByText("What Solana is doing")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Pay 1 USDC" }));
    expect(on()).toMatch(/^Sign/);
    await flush(500);
    expect(on()).toMatch(/^Send/);
    await flush(2000);
    // Still waiting on the confirmation.
    expect(on()).toMatch(/^Send/);
    finish();
    await flush(500);
    expect(on()).toMatch(/^Final/);
    expect(screen.getByRole("button", { name: "Paid in 0.3 s" })).toBeTruthy();
  });

  it("with reduced motion, skips the animation but still sends the transfer", async () => {
    reduceMotion(true);
    const fetch = serve({ signature: SIG, ms: 500 });
    render(<InActionScene kind="checkout" />);
    fireEvent.click(screen.getByRole("button", { name: "Pay 1 USDC" }));
    await flush(0);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Order #1001 paid")).toBeTruthy();
  });

  it("scrolling into view never sends: both scenes wait on a tap", async () => {
    const fetch = serve({ signature: SIG, ms: 500 });
    inView();
    const { container } = render(
      <>
        <InActionScene kind="checkout" />
        <InActionScene kind="token" />
      </>,
    );
    for (let i = 0; i < 30; i++) await flush(500);
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Pay 1 USDC" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create token" })).toBeTruthy();
    for (const kind of ["checkout", "token"]) {
      expect(
        container
          .querySelector(`[data-kind="${kind}"]`)!
          .hasAttribute("data-intro"),
      ).toBe(true);
    }
    expect(screen.queryByText(/Explorer/)).toBeNull();
  });

  it("never calls the scenes recorded, replayed, sampled, or simulated", async () => {
    serve({ error: "unconfigured" }, 503);
    const { container } = render(
      <>
        <InActionScene kind="checkout" />
        <InActionScene kind="token" />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pay 1 USDC" }));
    fireEvent.click(screen.getByRole("button", { name: "Create token" }));
    await flush(3000);
    expect(container.textContent).not.toMatch(/record|replay|sample|simulat/i);
  });
});

describe("<FullscreenButton>", () => {
  afterEach(() => document.getElementById("game")?.remove());

  function game(requestFullscreen?: () => Promise<void>) {
    const el = document.createElement("iframe");
    el.id = "game";
    if (requestFullscreen) el.requestFullscreen = requestFullscreen;
    else Object.defineProperty(el, "requestFullscreen", { value: undefined });
    document.body.append(el);
    return el;
  }

  it("opens its target in the browser's fullscreen", () => {
    const requestFullscreen = vi.fn(async () => {});
    game(requestFullscreen);
    render(<FullscreenButton target="game">Full screen</FullscreenButton>);
    fireEvent.click(screen.getByRole("button", { name: "Full screen" }));
    expect(requestFullscreen).toHaveBeenCalledOnce();
  });

  it("renders nothing where the browser has no fullscreen", () => {
    game();
    const { container } = render(
      <FullscreenButton target="game">Full screen</FullscreenButton>,
    );
    expect(container.innerHTML).toBe("");
  });
});
