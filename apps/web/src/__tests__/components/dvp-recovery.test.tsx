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
  clearRecoveryReceipt,
  loadPendingRun,
  loadRecoveryReceipt,
  savePendingRun,
  saveRecoveryReceipt,
} from "@/app/[locale]/delivery-vs-payment/demo/pending-run";

const mocks = vi.hoisted(() => ({
  readTradeState: vi.fn(),
  cancel: vi.fn(),
  fundLeg: vi.fn(),
  settle: vi.fn(),
  setSponsor: vi.fn(),
  signersFromSeeds: vi.fn(),
  resetSeeds: vi.fn(),
}));

vi.mock("@/lib/delivery-vs-payment/solana/dvp", () => ({
  readTradeState: mocks.readTradeState,
  cancel: mocks.cancel,
  fundLeg: mocks.fundLeg,
  settle: mocks.settle,
  setSponsor: mocks.setSponsor,
}));
vi.mock("@/lib/delivery-vs-payment/solana/roles", () => ({
  loadOrCreateSeeds: () => ({}),
  signersFromSeeds: mocks.signersFromSeeds,
  resetSeeds: mocks.resetSeeds,
}));
vi.mock("@/lib/delivery-vs-payment/solana/rpc", () => ({
  makeRpc: () => ({}),
}));
vi.mock("@/app/[locale]/delivery-vs-payment/demo/dvp-dashboard", () => ({
  DvpDashboard: ({
    onRun,
    error,
    recoveryUnavailable,
    recoveryLinks,
  }: {
    onRun: () => void;
    error: string | null;
    recoveryUnavailable: boolean;
    recoveryLinks: { trade: string; refundSignature?: string } | null;
  }) => (
    <div>
      <button onClick={onRun}>
        {recoveryUnavailable
          ? "Start a new demo"
          : "Continue interrupted trade"}
      </button>
      {error && <p role="alert">{error}</p>}
      {recoveryLinks && (
        <span data-testid="recovery-links">
          {recoveryLinks.trade}:{recoveryLinks.refundSignature}
        </span>
      )}
    </div>
  ),
}));

const id = address("So11111111111111111111111111111111111111112");

function savedTrade(): CompletedRun {
  return {
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
}

function mockSavedSigners() {
  mocks.signersFromSeeds.mockResolvedValue({
    maker: { address: id },
    partyA: { address: id },
    partyB: { address: id },
    authority: { address: id },
  });
}

function mockConfig() {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ treasury: id }) }),
  );
}

afterEach(() => {
  clearPendingRun();
  clearRecoveryReceipt();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("DvP partial-run recovery", () => {
  it("uses saved signers and onchain balances to finish a funded trade", async () => {
    const snapshot = savedTrade();
    savePendingRun(snapshot);
    mockSavedSigners();
    mocks.readTradeState.mockResolvedValue({
      open: true,
      escrowABalance: snapshot.terms.amountA,
      escrowBBalance: 0n,
    });
    mocks.fundLeg.mockResolvedValue("funded-cash");
    mocks.settle.mockResolvedValue("settled");
    mockConfig();

    render(<DvpDemo />);
    fireEvent.click(
      screen.getByRole("button", { name: "Continue interrupted trade" }),
    );

    await waitFor(() => expect(mocks.settle).toHaveBeenCalledOnce());
    expect(mocks.fundLeg).toHaveBeenCalledOnce();
    expect(mocks.fundLeg.mock.calls[0][2].amount).toBe(10_000_000_000n);
    expect(loadPendingRun()).toBeNull();
  });

  it("does not report a closed, cancelled trade as settled", async () => {
    savePendingRun(savedTrade());
    mockSavedSigners();
    mockConfig();
    mocks.readTradeState.mockResolvedValue({
      open: false,
      escrowABalance: 0n,
      escrowBBalance: 0n,
    });

    render(<DvpDemo />);
    fireEvent.click(
      screen.getByRole("button", { name: "Continue interrupted trade" }),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toMatch(/cannot verify/),
    );
    expect(mocks.settle).not.toHaveBeenCalled();
    expect(loadPendingRun()).toBeNull();
    expect(screen.getByTestId("recovery-links").textContent).toContain(id);
  });

  it("keeps the refund signature visible after cancelling an expired trade", async () => {
    const snapshot = savedTrade();
    snapshot.terms.expiryTimestamp = BigInt(Math.floor(Date.now() / 1000) - 1);
    savePendingRun(snapshot);
    mockSavedSigners();
    mockConfig();
    mocks.readTradeState.mockResolvedValue({
      open: true,
      escrowABalance: snapshot.terms.amountA,
      escrowBBalance: snapshot.terms.amountB,
    });
    mocks.cancel.mockResolvedValue("refund-tx");

    render(<DvpDemo />);
    fireEvent.click(
      screen.getByRole("button", { name: "Continue interrupted trade" }),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toMatch(/cancelled/),
    );
    expect(screen.getByTestId("recovery-links").textContent).toContain(
      "refund-tx",
    );
    expect(loadRecoveryReceipt()?.refundSignature).toBe("refund-tx");
    expect(loadPendingRun()).toBeNull();
  });

  it("restores the closed trade and refund links after a reload", async () => {
    saveRecoveryReceipt({
      trade: id,
      refundSignature: "refund-tx",
      message: "Trade cancelled",
    });
    render(<DvpDemo />);
    expect((await screen.findByRole("alert")).textContent).toBe(
      "Trade cancelled",
    );
    expect(screen.getByTestId("recovery-links").textContent).toContain(
      "refund-tx",
    );
  });

  it("allows a new demo when saved role keys are unavailable", async () => {
    savePendingRun(savedTrade());
    mocks.signersFromSeeds.mockResolvedValue({
      maker: { address: "different" },
    });

    render(<DvpDemo />);
    fireEvent.click(
      screen.getByRole("button", { name: "Continue interrupted trade" }),
    );
    await screen.findByRole("button", { name: "Start a new demo" });
    expect(loadPendingRun()).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Start a new demo" }));
    await waitFor(() => expect(loadPendingRun()).toBeNull());
    expect(mocks.resetSeeds).toHaveBeenCalledOnce();
  });
});
