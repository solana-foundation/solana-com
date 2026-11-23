import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useLiveSchedule } from "@/components/sections/live/use-live-schedule";
import { LIVE_SESSIONS_API } from "@/content/live/streams";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/");
});

it("refreshes a stale render clock on mount without waiting for the poll", async () => {
  const serverNow = Date.parse("2026-11-16T10:05:00Z");
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ items: [], now: serverNow }),
  });
  vi.stubGlobal("fetch", fetchMock);

  const { result } = renderHook(() => useLiveSchedule([], serverNow - 90_000));

  await waitFor(() =>
    expect(result.current.now).toBeGreaterThanOrEqual(serverNow),
  );
  expect(fetchMock).toHaveBeenCalledWith(LIVE_SESSIONS_API, {
    cache: "no-store",
  });
});

it("keeps the preview clock frozen without fetching live data on mount", () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  window.history.replaceState({}, "", "/?now=2026-11-16T10:05:00Z");

  const { result } = renderHook(() =>
    useLiveSchedule([], 0, { allowClockPreview: true }),
  );

  expect(result.current.now).toBe(Date.parse("2026-11-16T10:05:00Z"));
  expect(fetchMock).not.toHaveBeenCalled();
});
