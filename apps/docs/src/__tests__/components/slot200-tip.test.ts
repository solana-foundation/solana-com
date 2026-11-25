import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.hoisted(() => ({
  getConfirmedSlot: vi.fn(),
  getBlockSignatures: vi.fn(),
}));

vi.mock("@/lib/docs-live/rpc", () => ({
  ...rpc,
  RpcError: class RpcError extends Error {
    constructor(
      message: string,
      readonly code?: number,
    ) {
      super(message);
    }
  },
}));

describe("/api/slot-time/tip", () => {
  afterEach(() => vi.unstubAllEnvs());

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("SOLANA_RPC_URL", "https://rpc.test");
    rpc.getConfirmedSlot.mockReset();
    rpc.getBlockSignatures.mockReset();
  });

  it("returns every recent block once, marks skipped slots, and reads each block only once", async () => {
    const { RpcError } = await import("@/lib/docs-live/rpc");
    const Err = RpcError as unknown as new (m: string, c: number) => Error;
    rpc.getBlockSignatures.mockImplementation(async (slot: number) => {
      if (slot === 98) throw new Err("skipped", -32007);
      if (slot === 100) throw new Err("not yet", -32004);
      return {
        blockTime: null,
        signatures: [`s${slot}a`, `s${slot}b`, `s${slot}c`],
      };
    });
    const { GET } = await import("@/app/api/slot-time/tip/route");

    rpc.getConfirmedSlot.mockResolvedValue(100);
    const first = await (await GET()).json();
    expect(first.tip).toBe(100);
    expect(first.blocks.map((b: { slot: number }) => b.slot)).toEqual([
      95, 96, 97, 99,
    ]);
    // Every block sends its slot and count, and no signatures.
    expect(first.blocks[0]).toEqual({ slot: 95, txs: 3 });
    expect(first.blocks.at(-1)).toEqual({ slot: 99, txs: 3 });
    expect(JSON.stringify(first)).not.toContain("s99a");
    expect(first.skipped).toEqual([98]);
    expect(rpc.getBlockSignatures).toHaveBeenCalledTimes(6);

    // Next round: the newest unread slots first (101, then 100 again), then
    // older slots in the window it hasn't read; never one it has.
    rpc.getConfirmedSlot.mockResolvedValue(101);
    rpc.getBlockSignatures.mockClear();
    const second = await (await GET()).json();
    expect(rpc.getBlockSignatures.mock.calls.map((c) => c[0])).toEqual([
      101, 100, 94, 93, 92, 91,
    ]);
    expect(second.blocks.at(-1)).toEqual({ slot: 101, txs: 3 });
  });

  it("never sends the RPC error text, which can carry the RPC URL", async () => {
    rpc.getConfirmedSlot.mockRejectedValue(
      new Error("fetch failed: https://rpc.test/?api-key=secret"),
    );
    const { GET } = await import("@/app/api/slot-time/tip/route");
    const res = await GET();
    expect(await res.text()).not.toContain("secret");
  });

  it("reads one block a round on the public RPC, and keeps going when a read fails", async () => {
    vi.stubEnv("SOLANA_RPC_URL", undefined as unknown as string);
    rpc.getConfirmedSlot.mockResolvedValue(100);
    rpc.getBlockSignatures.mockImplementation(async (slot: number) => {
      if (slot === 100) throw new Error("RPC getBlock failed: 429");
      return { blockTime: null, signatures: ["x"] };
    });
    const { GET } = await import("@/app/api/slot-time/tip/route");
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(rpc.getBlockSignatures).toHaveBeenCalledTimes(1);
    expect(body).toMatchObject({ tip: 100, blocks: [] });

    // After a 429, no block reads for a while; the tip still advances.
    rpc.getBlockSignatures.mockClear();
    rpc.getConfirmedSlot.mockResolvedValue(105);
    expect((await (await GET()).json()).tip).toBe(105);
    expect(rpc.getBlockSignatures).not.toHaveBeenCalled();
  });

  it("answers 502 when the tip can't be read", async () => {
    rpc.getConfirmedSlot.mockRejectedValue(new Error("RPC unavailable"));
    const { GET } = await import("@/app/api/slot-time/tip/route");
    const res = await GET();
    expect(res.status).toBe(502);
  });
});
