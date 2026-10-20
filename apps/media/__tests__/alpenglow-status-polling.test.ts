import { afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { statusPollInterval } from "@/components/upgrades/alpenglow-dashboard/status-polling";
import type { AlpenglowDashboardActivationData } from "@/lib/upgrades/alpenglow-metrics-types";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ unstable_cache: (load: unknown) => load }));

afterEach(() => vi.unstubAllGlobals());

it("keeps inferred activation fresh and polls until certificate details arrive", async () => {
  let certificateAvailable = false;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: unknown, options: RequestInit) => {
      const { method } = JSON.parse(String(options.body)) as { method: string };
      if (method === "getAgGenesisCert") {
        return Response.json({
          result: certificateAvailable
            ? { block: { slot: 459_653_000 }, signature: { bitmap: [3] } }
            : null,
        });
      }
      return Response.json({
        result:
          method === "getEpochInfo"
            ? { epoch: 1064, slotIndex: 5_000, slotsInEpoch: 432_000 }
            : [],
      });
    }),
  );
  const { GET } =
    await import("@/app/api/upgrades/alpenglow/metrics/status/route");
  const request = new NextRequest(
    "https://solana.com/api/upgrades/alpenglow/metrics/status?network=mainnet",
  );
  const inferredResponse = await GET(request);
  const inferred =
    (await inferredResponse.json()) as AlpenglowDashboardActivationData;
  expect(inferred.alpenglowActive).toBe(true);
  expect(inferred.genesisSlot).toBeNull();
  expect(statusPollInterval(inferred)).toBe(2_000);
  expect(inferredResponse.headers.get("Cache-Control")).toContain(
    "s-maxage=2,",
  );

  certificateAvailable = true;
  const confirmedResponse = await GET(request);
  const confirmed =
    (await confirmedResponse.json()) as AlpenglowDashboardActivationData;
  expect(confirmed.genesisSlot).toBe(459_653_000);
  expect(confirmed.certificateValidatorCount).toBe(2);
  expect(statusPollInterval(confirmed)).toBeNull();
  expect(confirmedResponse.headers.get("Cache-Control")).toContain(
    "s-maxage=86400,",
  );
});
