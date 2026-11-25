import { afterEach, describe, expect, it, vi } from "vitest";
import { getBlockFull, getEpochEndSlot, txProgramIds } from "@/lib/slot200/rpc";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getEpochEndSlot", () => {
  it("returns the first slot of the following epoch", () => {
    expect(
      getEpochEndSlot({
        epoch: 1023,
        absoluteSlot: 442_123_456,
        slotIndex: 123_456,
        slotsInEpoch: 432_000,
      }),
    ).toBe(442_432_000);
  });
});

describe("getBlockFull", () => {
  it("requests blocks containing transaction version 1", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ jsonrpc: "2.0", id: 1, result: null }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await getBlockFull(448_391_324);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body as string)).toEqual({
      jsonrpc: "2.0",
      id: 1,
      method: "getBlock",
      params: [
        448_391_324,
        {
          encoding: "json",
          transactionDetails: "full",
          rewards: false,
          commitment: "confirmed",
          maxSupportedTransactionVersion: 1,
        },
      ],
    });
  });
});

describe("txProgramIds", () => {
  it("resolves static and loaded program ids from versioned transactions", () => {
    expect(
      txProgramIds({
        transaction: {
          signatures: ["signature"],
          message: {
            accountKeys: ["payer", "static-program"],
            instructions: [{ programIdIndex: 1 }, { programIdIndex: 3 }],
          },
        },
        meta: {
          err: null,
          loadedAddresses: {
            writable: ["loaded-account"],
            readonly: ["loaded-program"],
          },
        },
      }),
    ).toEqual(["static-program", "loaded-program"]);
  });
});
