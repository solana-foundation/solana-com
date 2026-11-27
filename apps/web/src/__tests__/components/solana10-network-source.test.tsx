import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLiveSource } from "@/components/solana-1-0/useNetworkSource";

vi.mock("@/components/slot200/useSlotFeed", () => ({
  useSlotFeed: () => ({
    feed: { status: "live", avg1m: 200, avg10m: 200 },
    subscribe: () => () => {},
  }),
}));
vi.mock("@/components/slot200/useLeaderSchedule", () => ({
  useLeaderSchedule: () => ({ lookup: () => null }),
}));

const sample = (lag: number) => ({
  ok: true,
  json: async () => ({ processed: 100, finalized: 100 - lag }),
});

describe("Solana 1.0 finality freshness", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("expires failed readings and starts a fresh average on recovery", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(sample(1));
    fetch.mockRejectedValue(new Error("RPC unavailable"));
    vi.stubGlobal("fetch", fetch);
    const { result } = renderHook(() => useLiveSource());
    await act(async () => {});
    expect(result.current.finalityMs).toBe(200);

    await act(() => vi.advanceTimersByTimeAsync(14_999));
    expect(result.current.finalityMs).toBe(200);
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(result.current.finalityMs).toBeNull();

    fetch.mockResolvedValue(sample(2));
    await act(() => vi.advanceTimersByTimeAsync(5_000));
    expect(result.current.finalityMs).toBe(400);
  });

  it("expires the last reading even when later requests never settle", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(sample(1))
      .mockImplementation(() => new Promise(() => {}));
    vi.stubGlobal("fetch", fetch);
    const { result } = renderHook(() => useLiveSource());
    await act(async () => {});
    expect(result.current.finalityMs).toBe(200);
    await act(() => vi.advanceTimersByTimeAsync(15_000));
    expect(result.current.finalityMs).toBeNull();
  });
});
