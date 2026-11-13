import { cleanup, render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { PlateStage } from "@/components/solana-1-0/PlateStage";

const { setAmbient, createPlateRenderer } = vi.hoisted(() => {
  const setAmbient = vi.fn();
  return {
    setAmbient,
    createPlateRenderer: vi.fn(() => ({
      setAmbient,
      setGains: vi.fn(),
      setFinality: vi.fn(),
      setSlotMs: vi.fn(),
      setRunning: vi.fn(),
      dispose: vi.fn(),
    })),
  };
});
vi.mock("three", () => ({}));
vi.mock("@/components/solana-1-0/plateRenderer", () => ({
  createPlateRenderer,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("initializes late graphics with the current scroll progress", async () => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: -window.innerHeight,
  } as DOMRect);
  const infoPanelRef = createRef<HTMLDivElement>();
  render(
    <div>
      <PlateStage
        infoPanelRef={infoPanelRef}
        gains={{ agave: 1, firedancer: 1, mithril: 0, sig: 0 }}
        source={{
          status: "live",
          finalityMs: 200,
          slotMs: 200,
          subscribe: () => () => {},
        }}
      />
      <div ref={infoPanelRef} />
    </div>,
  );
  await waitFor(() => expect(createPlateRenderer).toHaveBeenCalled());
  expect(setAmbient).toHaveBeenCalledWith(1);
});
