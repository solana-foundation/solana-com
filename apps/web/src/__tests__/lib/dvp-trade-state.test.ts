import { beforeEach, describe, expect, it, vi } from "vitest";
import { address, type Rpc, type SolanaRpcApi } from "@solana/kit";
import {
  readTradeState,
  wasTradeSettled,
  type TradeTerms,
} from "@/lib/delivery-vs-payment/solana/dvp";
import type { DvpAddresses } from "@/lib/delivery-vs-payment/solana/pdas";

const mocks = vi.hoisted(() => ({ fetchMaybeSwapDvp: vi.fn() }));
vi.mock("@/lib/delivery-vs-payment/dvp", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  fetchMaybeSwapDvp: mocks.fetchMaybeSwapDvp,
}));

const id = address("So11111111111111111111111111111111111111112");
const addresses: DvpAddresses = {
  swapDvp: id,
  nonceTombstone: id,
  escrowA: id,
  escrowB: id,
};
const terms: TradeTerms = {
  settlementAuthority: id,
  userA: id,
  userB: id,
  mintA: id,
  mintB: id,
  amountA: 100n,
  amountB: 200n,
  decimalsA: 2,
  decimalsB: 6,
  nonce: 1n,
  expiryTimestamp: 1_900_000_000n,
};

function rpcWithBalances(
  balances: bigint[],
  readError = false,
  accountPresent = true,
) {
  const getAccountInfo = vi.fn(() => ({
    send: async () => ({
      value: accountPresent ? { data: ["", "base64"] } : null,
    }),
  }));
  const getTokenAccountBalance = vi.fn(() => ({
    send: async () => {
      if (readError) throw new Error("RPC unavailable");
      return { value: { amount: String(balances.shift() ?? 0n) } };
    },
  }));
  return {
    rpc: {
      getAccountInfo,
      getTokenAccountBalance,
    } as unknown as Rpc<SolanaRpcApi>,
    getAccountInfo,
  };
}

describe("DvP onchain recovery reads", () => {
  beforeEach(() => mocks.fetchMaybeSwapDvp.mockResolvedValue({ exists: true }));

  it("propagates failed balance reads instead of trying to fund twice", async () => {
    const { rpc } = rpcWithBalances([], true);
    await expect(readTradeState(rpc, addresses)).rejects.toThrow(
      "RPC unavailable",
    );
  });

  it("does not treat a missing escrow on an open trade as zero funds", async () => {
    const { rpc } = rpcWithBalances([], false, false);
    await expect(readTradeState(rpc, addresses)).rejects.toThrow(
      "Trade escrow accounts are not available yet",
    );
  });

  it("checks both unique destination balances before identifying settlement", async () => {
    const settled = rpcWithBalances([200n, 100n]);
    await expect(wasTradeSettled(settled.rpc, terms)).resolves.toBe(true);
    const cancelled = rpcWithBalances([0n, 0n]);
    await expect(wasTradeSettled(cancelled.rpc, terms)).resolves.toBe(false);
  });
});
