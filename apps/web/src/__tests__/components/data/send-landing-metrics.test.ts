import { describe, expect, it } from "vitest";
import type {
  SendLandingBucket,
  SendLandingProviderStats,
} from "@/app/[locale]/data/send-landing-config";
import {
  formatLamportsAsSol,
  getDefaultSortDirection,
  getHeadToHeadMatrix,
  getSendLandingProviderItems,
  getSendLandingTrendSeries,
  sortSendLandingProviderItems,
} from "@/app/[locale]/data/send-landing-metrics";
import { formatStep } from "@/app/[locale]/data/sender-landing-performance";

const stats = (
  provider: string,
  overrides: Partial<SendLandingProviderStats> = {},
): SendLandingProviderStats => ({
  provider,
  rounds: 10,
  landed: 6,
  failed: 2,
  dropped: 2,
  scoredRounds: 8,
  firstOnChain: 2,
  indexP50: 150,
  indexP90: 420,
  laterSlot: 1,
  slotsToLandP50: 1,
  responseP50Ms: 1.2,
  costLamports: 80_000,
  ...overrides,
});

const hour = 3600;
const bucket = (
  provider: string,
  timestamp: number,
  firstOnChain: number,
  scoredRounds: number,
): SendLandingBucket => ({
  provider,
  timestamp,
  rounds: scoredRounds,
  landed: scoredRounds,
  scoredRounds,
  firstOnChain,
});

describe("send landing metrics", () => {
  it("turns counts into the table's shares and per-copy cost", () => {
    const [item] = getSendLandingProviderItems([stats("cascade")], [], hour);
    expect(item.values).toEqual({
      rounds: 10,
      // first on chain is out of scored rounds, not all rounds
      firstOnChain: 25,
      landed: 60,
      failed: 20,
      dropped: 20,
      indexP50: 150,
      indexP90: 420,
      // later slot is out of included copies (landed + failed)
      laterSlot: 12.5,
      slotsToLand: 1,
      response: 1.2,
      cost: 10_000,
    });
  });

  it("leaves shares empty when there is nothing to divide by", () => {
    const [item] = getSendLandingProviderItems(
      [
        stats("jito", {
          landed: 0,
          failed: 0,
          dropped: 10,
          scoredRounds: 0,
          firstOnChain: 0,
          laterSlot: 0,
          indexP50: null,
          indexP90: null,
          slotsToLandP50: null,
          costLamports: 0,
        }),
      ],
      [],
      hour,
    );
    expect(item.values.firstOnChain).toBeNull();
    expect(item.values.laterSlot).toBeNull();
    expect(item.values.cost).toBeNull();
    expect(item.values.dropped).toBe(100);
  });

  it("sorts in the requested direction with missing values last", () => {
    const items = getSendLandingProviderItems(
      [
        stats("a", { firstOnChain: 1 }),
        stats("b", { firstOnChain: 6 }),
        stats("c", { scoredRounds: 0, firstOnChain: 0 }),
        stats("d", { firstOnChain: 3 }),
      ],
      [],
      hour,
    );
    expect(
      sortSendLandingProviderItems(items, "firstOnChain", "descending").map(
        (item) => item.provider,
      ),
    ).toEqual(["b", "d", "a", "c"]);
    expect(
      sortSendLandingProviderItems(items, "firstOnChain", "ascending").map(
        (item) => item.provider,
      ),
    ).toEqual(["a", "d", "b", "c"]);
    expect(getDefaultSortDirection("firstOnChain")).toBe("descending");
    expect(getDefaultSortDirection("indexP50")).toBe("ascending");
    expect(getDefaultSortDirection("dropped")).toBe("ascending");
  });

  it("builds an ordered head-to-head matrix and fills missing pairs with zero", () => {
    const matrix = getHeadToHeadMatrix(
      [
        { provider: "a", otherProvider: "b", ahead: 30, rounds: 40 },
        { provider: "b", otherProvider: "a", ahead: 10, rounds: 40 },
      ],
      ["b", "a", "c"],
    );
    expect(matrix.map((row) => row.provider)).toEqual(["b", "a", "c"]);
    expect(matrix[1].cells).toEqual([
      { otherProvider: "b", ahead: 30, rounds: 40, share: 75 },
      { otherProvider: "c", ahead: 0, rounds: 0, share: null },
    ]);
    expect(matrix[0].cells[0]).toEqual({
      otherProvider: "a",
      ahead: 10,
      rounds: 40,
      share: 25,
    });
  });

  it("charts first-on-chain shares and breaks the line over empty buckets", () => {
    const start = 1_794_196_800;
    const series = getSendLandingTrendSeries(
      [
        bucket("a", start, 1, 2),
        bucket("a", start + hour, 2, 2),
        // two empty hours, then data again
        bucket("a", start + 4 * hour, 0, 2),
        bucket("b", start, 1, 2),
        // a bucket with no scored rounds has no share
        bucket("b", start + hour, 0, 0),
      ],
      "firstOnChain",
      new Set(["a", "b"]),
      hour,
    );
    expect(series.map((item) => item.id)).toEqual(["a", "b"]);
    expect(
      series[0].points.map((point) => [
        point.date.getTime() / 1000 - start,
        point.defined ? point.value : null,
      ]),
    ).toEqual([
      [0, 50],
      [hour, 100],
      [2 * hour, null],
      [4 * hour, 0],
    ]);
    expect(series[1].points.filter((point) => point.defined)).toHaveLength(1);
  });

  it("formats lamports as SOL and bucket lengths like the time frame labels", () => {
    expect(formatLamportsAsSol(105_000, "en")).toBe("0.000105");
    expect(formatStep(900)).toBe("15m");
    expect(formatStep(3600)).toBe("1h");
    expect(formatStep(43_200)).toBe("12h");
  });
});
