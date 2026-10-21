import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { cachedSnapshots } = vi.hoisted(() => ({
  cachedSnapshots: new Map<string, unknown>(),
}));
vi.mock("next/cache", () => ({
  unstable_cache:
    (load: (...args: unknown[]) => Promise<unknown>, keys: string[]) =>
    (...args: unknown[]) =>
      cachedSnapshots.has(keys.join(":"))
        ? Promise.resolve(cachedSnapshots.get(keys.join(":")))
        : load(...args),
}));

const now = new Date("2026-10-19T00:00:00Z");

beforeEach(() => {
  vi.resetModules();
  cachedSnapshots.clear();
  vi.useFakeTimers();
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const SLOTS_PER_EPOCH = 432_000;
const SCHEDULED_ACTIVATION_SLOT = 1064 * SLOTS_PER_EPOCH;

function featureAccount(activatedAt: number | null) {
  const data = Buffer.alloc(activatedAt === null ? 1 : 9);
  if (activatedAt !== null) {
    data[0] = 1;
    data.writeBigUInt64LE(BigInt(activatedAt), 1);
  }
  return {
    owner: "Feature111111111111111111111111111111111111",
    data: [data.toString("base64"), "base64"],
  };
}

function mockRpc(
  epoch = 1063,
  failTiming = false,
  slotIndex = 431_000,
  failSamples = false,
  {
    genesisCert,
    featureActivatedAt = SCHEDULED_ACTIVATION_SLOT,
  }: { genesisCert?: null; featureActivatedAt?: number | null } = {},
) {
  const fetchMock = vi.fn(async (_url: unknown, options: RequestInit) => {
    const { method } = JSON.parse(String(options.body)) as { method: string };
    if (method === "getAgGenesisCert") {
      return genesisCert === null
        ? Response.json({ result: null })
        : Response.json({
            error: { code: -32601, message: "Method not found" },
          });
    }
    if (failTiming || (failSamples && method === "getRecentPerformanceSamples"))
      return new Response(null, { status: 503 });
    if (method === "getAccountInfo")
      return Response.json({
        result: {
          context: { slot: 0 },
          value: featureAccount(featureActivatedAt),
        },
      });
    return Response.json({
      result:
        method === "getEpochInfo"
          ? {
              epoch,
              slotIndex,
              slotsInEpoch: SLOTS_PER_EPOCH,
              absoluteSlot: epoch * SLOTS_PER_EPOCH + slotIndex,
            }
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

  it("keeps Alpenglow inactive past the consensus delay when the genesis certificate RPC reports none", async () => {
    mockRpc(1064, false, 5_000, false, { genesisCert: null });
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const data = await getAlpenglowActivationData("mainnet");
    expect(data.activationEstimate?.consensusActivated).toBe(true);
    expect(data.alpenglowActive).toBe(false);
  });

  it("does not report activation when the feature gate was postponed past the scheduled epoch", async () => {
    mockRpc(1064, false, 5_000, false, { featureActivatedAt: null });
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const data = await getAlpenglowActivationData("mainnet");
    expect(data.activationEstimate).toEqual({
      currentEpoch: 1064,
      featureActivated: false,
      consensusActivated: false,
      estimatedFeatureActivationAt: null,
      estimatedConsensusActivationAt: null,
    });
    expect(data.alpenglowActive).toBeNull();
    expect(data.warnings[0]).toContain("is not active yet");
  });

  it("preserves feature activation when only performance samples fail", async () => {
    mockRpc(1064, false, 0, true);
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const data = await getAlpenglowActivationData("mainnet");
    expect(data.activationEstimate?.featureActivated).toBe(true);
    expect(data.activationEstimate?.consensusActivated).toBe(false);
    expect(data.activationEstimate?.estimatedConsensusActivationAt).toBeNull();
    expect(data.warnings[0]).toContain("Activation countdown is unavailable");
  });

  it("reports consensus activation when only performance samples fail", async () => {
    mockRpc(1064, false, 5_000, true);
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const data = await getAlpenglowActivationData("mainnet");
    expect(data.alpenglowActive).toBe(true);
    expect(data.activationEstimate?.consensusActivated).toBe(true);
  });

  it("refreshes stale shared-cache estimates after a quiet period", async () => {
    vi.stubEnv("NODE_ENV", "production");
    mockRpc();
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const initial = await getAlpenglowActivationData("mainnet");
    cachedSnapshots.set("alpenglow-activation-estimate-v3", {
      generatedAt: now.toISOString(),
      estimate: initial.activationEstimate,
      warnings: [],
    });
    vi.advanceTimersByTime(3_600_000);
    const refreshRpc = mockRpc(1064, false, 5_000);
    const refreshed = await getAlpenglowActivationData("mainnet");
    expect(refreshed.alpenglowActive).toBe(true);
    expect(refreshed.activationEstimate?.consensusActivated).toBe(true);
    expect(refreshRpc).toHaveBeenCalledTimes(4);
  });

  it("expires the local snapshot based on its original fetch time", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const fetchMock = mockRpc();
    const { getAlpenglowActivationData } =
      await import("@/lib/upgrades/alpenglow-metrics");
    const initial = await getAlpenglowActivationData("mainnet");
    cachedSnapshots.set("alpenglow-activation-estimate-v3", {
      generatedAt: new Date(now.getTime() + 50_000).toISOString(),
      estimate: initial.activationEstimate,
      warnings: [],
    });
    vi.advanceTimersByTime(100_000);
    await getAlpenglowActivationData("mainnet");
    expect(fetchMock).toHaveBeenCalledTimes(4);
    vi.advanceTimersByTime(11_000);
    await getAlpenglowActivationData("mainnet");
    expect(fetchMock).toHaveBeenCalledTimes(7);
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
