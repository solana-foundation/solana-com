import { act, cleanup, render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PlateStage } from "@/components/solana-1-0/PlateStage";

const { setAmbient, setRunning, createPlateRenderer } = vi.hoisted(() => {
  const setAmbient = vi.fn();
  const setRunning = vi.fn();
  return {
    setAmbient,
    setRunning,
    createPlateRenderer: vi.fn(() => ({
      setAmbient,
      setGains: vi.fn(),
      setFinality: vi.fn(),
      setSlotMs: vi.fn(),
      setRunning,
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
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.mocked(window.matchMedia).mockReturnValue({
    matches: false,
  } as MediaQueryList);
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
});

function renderStage() {
  const infoPanelRef = createRef<HTMLDivElement>();
  return render(
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
      <div data-s10-opaque-content />
    </div>,
  );
}

it("initializes late graphics with the current scroll progress", async () => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: -window.innerHeight,
  } as DOMRect);
  renderStage();
  await waitFor(() => expect(createPlateRenderer).toHaveBeenCalled());
  expect(setAmbient).toHaveBeenCalledWith(1);
});

it("skips the graphics renderer when reduced motion is requested", async () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: true,
  } as MediaQueryList);
  vi.useFakeTimers();
  renderStage();
  await act(() => vi.advanceTimersByTimeAsync(50));
  expect(createPlateRenderer).not.toHaveBeenCalled();
  vi.useRealTimers();
});

it("pauses graphics behind opaque content and resumes on return", async () => {
  const rect = vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: HTMLElement) {
      return {
        top: this.hasAttribute("data-s10-opaque-content") ? 2000 : 0,
      } as DOMRect;
    });
  renderStage();
  await waitFor(() => expect(setRunning).toHaveBeenLastCalledWith(true));
  rect.mockReturnValue({ top: 0 } as DOMRect);
  act(() => window.dispatchEvent(new Event("scroll")));
  await waitFor(() => expect(setRunning).toHaveBeenLastCalledWith(false));
  rect.mockImplementation(function (this: HTMLElement) {
    return {
      top: this.hasAttribute("data-s10-opaque-content") ? 2000 : 0,
    } as DOMRect;
  });
  act(() => window.dispatchEvent(new Event("scroll")));
  await waitFor(() => expect(setRunning).toHaveBeenLastCalledWith(true));
});
