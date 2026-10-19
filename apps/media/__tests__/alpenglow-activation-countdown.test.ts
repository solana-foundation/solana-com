import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ unstable_cache: (load: unknown) => load }));

const now = new Date("2026-10-19T00:00:00Z");

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function mockRpc(epoch = 1063, failTiming = false, slotIndex = 431_000) {
  const fetchMock = vi.fn(async (_url: unknown, options: RequestInit) => {
    const { method } = JSON.parse(String(options.body)) as { method: string };
    if (method === "getAgGenesisCert") {
      return Response.json({
        error: { code: -32601, message: "Method not found" },
      });
    }
    if (failTiming) return new Response(null, { status: 503 });
    return Response.json({
      result:
        method === "getEpochInfo"
          ? { epoch, slotIndex, slotsInEpoch: 432_000 }
          : [
              { numSlots: 100, samplePeriodSecs: 60 },
              { numSlots: 200, samplePeriodSecs: 60 },
            ],
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("Mainnet activation countdown", () => {
  it("estimates the epoch boundary using weighted slot duration even without genesis RPC support", async () => {
    mockRpc();
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const data = await getAlpenglowActivationData("mainnet");
    expect(data.alpenglowRpcSupported).toBe(false);
    expect(data.activationEstimate).toEqual({
      currentEpoch: 1063,
      featureActivated: false,
      consensusActivated: false,
      estimatedFeatureActivationAt: new Date(
        now.getTime() + 400_000,
      ).toISOString(),
      estimatedConsensusActivationAt: new Date(
        now.getTime() + 2_400_000,
      ).toISOString(),
    });
  });

  it("shares timing lookups between polls and refreshes after a minute", async () => {
    const fetchMock = mockRpc();
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    await Promise.all([
      getAlpenglowActivationData("mainnet"),
      getAlpenglowActivationData("mainnet"),
    ]);
    await getAlpenglowActivationData("mainnet");
    const timingCalls = () =>
      fetchMock.mock.calls.filter(
        ([, options]) => !String(options.body).includes("getAgGenesisCert"),
      );
    expect(timingCalls()).toHaveLength(2);
    vi.advanceTimersByTime(60_000);
    await getAlpenglowActivationData("mainnet");
    expect(timingCalls()).toHaveLength(4);
  });

  it("keeps status available and caches timing failures", async () => {
    const fetchMock = mockRpc(1063, true);
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const data = await getAlpenglowActivationData("mainnet");
    expect(data.activationEstimate).toBeNull();
    expect(data.warnings[0]).toContain("Activation countdown is unavailable");
    await getAlpenglowActivationData("mainnet");
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("does not infer activation from reaching the scheduled epoch", async () => {
    mockRpc(1064, false, 0);
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const data = await getAlpenglowActivationData("mainnet");
    expect(data.activationEstimate).toEqual({
      currentEpoch: 1064,
      featureActivated: true,
      consensusActivated: false,
      estimatedFeatureActivationAt: null,
      estimatedConsensusActivationAt: new Date(
        now.getTime() + 2_000_000,
      ).toISOString(),
    });
    expect(data.alpenglowActive).toBeNull();
  });

  it("keeps Tower BFT active until the 5000-slot consensus delay has elapsed", async () => {
    mockRpc(1064, false, 4_999);
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const data = await getAlpenglowActivationData("mainnet");
    expect(data.activationEstimate?.featureActivated).toBe(true);
    expect(data.activationEstimate?.consensusActivated).toBe(false);
    expect(data.activationEstimate?.estimatedConsensusActivationAt).toBe(
      new Date(now.getTime() + 400).toISOString(),
    );
    expect(data.alpenglowActive).toBeNull();
  });

  it("switches to Alpenglow at slot 5000 even when the genesis certificate RPC is unsupported", async () => {
    mockRpc(1064, false, 5_000);
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const data = await getAlpenglowActivationData("mainnet");
    expect(data.activationEstimate?.featureActivated).toBe(true);
    expect(data.activationEstimate?.consensusActivated).toBe(true);
    expect(data.activationEstimate?.estimatedConsensusActivationAt).toBeNull();
    expect(data.alpenglowActive).toBe(true);
  });

  it("does not request timing for other networks", async () => {
    const fetchMock = mockRpc();
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    expect(
      (await getAlpenglowActivationData("devnet")).activationEstimate,
    ).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
