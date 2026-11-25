import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { FilmStage } from "@/components/solana-1-0/FilmStage";
import { SCENE_KEYS, buildShape } from "@/components/solana-1-0/filmShapes";

const { setScene, setRunning, setGains, createFilmRenderer } = vi.hoisted(
  () => {
    const setScene = vi.fn();
    const setRunning = vi.fn();
    const setGains = vi.fn();
    return {
      setScene,
      setRunning,
      setGains,
      createFilmRenderer: vi.fn(() => ({
        setScene,
        setGains,
        setRunning,
        pushBlock: vi.fn(),
        dispose: vi.fn(),
      })),
    };
  },
);
vi.mock("three", () => ({}));
vi.mock("@/components/solana-1-0/filmRenderer", () => ({
  createFilmRenderer,
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
  return render(
    <div>
      <FilmStage
        gains={{ agave: 1, firedancer: 1 }}
        source={{
          status: "live",
          finalityMs: 200,
          slotMs: 200,
          subscribe: () => () => {},
        }}
      />
      <div data-s10-scene />
      <div data-s10-scene />
    </div>,
  );
}

/** Chapter tops in viewport heights; the page itself sits at the top. */
function placeChapters(...tops: number[]) {
  let next = 0;
  return vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: HTMLElement) {
      if (!this.hasAttribute("data-s10-scene")) return { top: 0 } as DOMRect;
      const top = tops[next++ % tops.length] * window.innerHeight;
      return { top } as DOMRect;
    });
}

it("starts late graphics on the scene the page is already scrolled to", async () => {
  placeChapters(-1, 2);
  renderStage();
  await waitFor(() => expect(createFilmRenderer).toHaveBeenCalled());
  expect(setScene).toHaveBeenLastCalledWith(1);
  expect(setGains).toHaveBeenCalledWith(
    expect.objectContaining({ agave: 1, firedancer: 1 }),
  );
});

it("cuts to the next scene as its chapter scrolls in", async () => {
  const rect = placeChapters(2, 3);
  const { container } = renderStage();
  await waitFor(() => expect(setScene).toHaveBeenLastCalledWith(0));
  expect(container.textContent).toContain("AWAKE");
  rect.mockRestore();
  placeChapters(-1, 0.2);
  act(() => window.dispatchEvent(new Event("scroll")));
  await waitFor(() => expect(setScene).toHaveBeenLastCalledWith(2));
  expect(container.textContent).toContain("VALIDATOR.MESH");
});

it("skips the graphics renderer when reduced motion is requested", async () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: true,
  } as MediaQueryList);
  vi.useFakeTimers();
  renderStage();
  await act(() => vi.advanceTimersByTimeAsync(50));
  expect(createFilmRenderer).not.toHaveBeenCalled();
  vi.useRealTimers();
});

it("pauses graphics while the tab is hidden", async () => {
  renderStage();
  await waitFor(() => expect(setRunning).toHaveBeenLastCalledWith(true));
  vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  act(() => document.dispatchEvent(new Event("visibilitychange")));
  expect(setRunning).toHaveBeenLastCalledWith(false);
});

it("builds every scene as a full, finite cloud", () => {
  for (const key of SCENE_KEYS) {
    const shape = buildShape(key, 600);
    expect(shape).toHaveLength(1800);
    expect(shape.every(Number.isFinite)).toBe(true);
  }
});

it("gives each client its own side of a shape", () => {
  const count = 2000;
  const shape = buildShape("iris", count);
  const meanX = (start: number, end: number) => {
    let sum = 0;
    for (let i = start; i < end; i++) sum += shape[i * 3];
    return sum / (end - start);
  };
  // Agave's particles hold the right of the iris, Firedancer's the left.
  expect(meanX(0, count / 2)).toBeGreaterThan(0.2);
  expect(meanX(count / 2, count)).toBeLessThan(-0.2);
});
