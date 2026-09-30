import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { address } from "@solana/kit";
import { DvpDemo } from "@/app/[locale]/delivery-vs-payment/demo/dvp-demo";
import {
  initialStages,
  type CompletedRun,
} from "@/app/[locale]/delivery-vs-payment/demo/demo-state";
import {
  clearPendingRun,
  loadPendingRun,
  savePendingRun,
} from "@/app/[locale]/delivery-vs-payment/demo/pending-run";

const mocks = vi.hoisted(() => ({
  readTradeState: vi.fn(),
  fundLeg: vi.fn(),
  settle: vi.fn(),
  setSponsor: vi.fn(),
  signersFromSeeds: vi.fn(),
}));

vi.mock("@/lib/delivery-vs-payment/solana/dvp", () => ({
  readTradeState: mocks.readTradeState,
  fundLeg: mocks.fundLeg,
  settle: mocks.settle,
  setSponsor: mocks.setSponsor,
}));
vi.mock("@/lib/delivery-vs-payment/solana/roles", () => ({
  loadOrCreateSeeds: () => ({}),
  signersFromSeeds: mocks.signersFromSeeds,
}));
vi.mock("@/lib/delivery-vs-payment/solana/rpc", () => ({
  makeRpc: () => ({}),
}));
vi.mock("@/app/[locale]/delivery-vs-payment/demo/dvp-dashboard", () => ({
  DvpDashboard: ({ onRun }: { onRun: () => void }) => (
    <button onClick={onRun}>Continue interrupted trade</button>
  ),
}));

const id = address("So11111111111111111111111111111111111111112");

afterEach(() => {
  clearPendingRun();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("DvP partial-run recovery", () => {
  it("uses saved signers and onchain balances to finish a funded trade", async () => {
    const snapshot: CompletedRun = {
      roles: { maker: id, partyA: id, partyB: id, authority: id },
      mints: { asset: id, cash: id },
      dvpAddresses: {
        swapDvp: id,
        nonceTombstone: id,
        escrowA: id,
        escrowB: id,
      },
      terms: {
        settlementAuthority: id,
        userA: id,
        userB: id,
        mintA: id,
        mintB: id,
        amountA: 10_000n,
        amountB: 10_000_000_000n,
        decimalsA: 2,
        decimalsB: 6,
        nonce: 42n,
        expiryTimestamp: BigInt(Math.floor(Date.now() / 1000) + 3_600),
      },
      stages: {
        ...initialStages(),
        trade: { status: "complete", signatures: ["created"] },
        asset: { status: "complete", signatures: ["funded-asset"] },
      },
    };
    savePendingRun(snapshot);
    mocks.signersFromSeeds.mockResolvedValue({
      maker: { address: id },
      partyA: { address: id },
      partyB: { address: id },
      authority: { address: id },
    });
    mocks.readTradeState.mockResolvedValue({
      open: true,
      escrowABalance: snapshot.terms.amountA,
      escrowBBalance: 0n,
    });
    mocks.fundLeg.mockResolvedValue("funded-cash");
    mocks.settle.mockResolvedValue("settled");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ ok: true, json: async () => ({ treasury: id }) }),
    );

    render(<DvpDemo />);
    fireEvent.click(
      screen.getByRole("button", { name: "Continue interrupted trade" }),
    );

    await waitFor(() => expect(mocks.settle).toHaveBeenCalledOnce());
    expect(mocks.fundLeg).toHaveBeenCalledOnce();
    expect(mocks.fundLeg.mock.calls[0][2].amount).toBe(10_000_000_000n);
    expect(loadPendingRun()).toBeNull();
  });
});
