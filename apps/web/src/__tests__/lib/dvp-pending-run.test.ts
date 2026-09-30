import { afterEach, describe, expect, it } from "vitest";
import { address } from "@solana/kit";
import {
  initialStages,
  type CompletedRun,
} from "@/app/[locale]/delivery-vs-payment/demo/demo-state";
import {
  clearPendingRun,
  loadPendingRun,
  savePendingRun,
} from "@/app/[locale]/delivery-vs-payment/demo/pending-run";

describe("interrupted DvP trade", () => {
  afterEach(() => clearPendingRun());

  it("retains trade terms and identities with bigint values across reloads", () => {
    const id = address("11111111111111111111111111111111");
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
        expiryTimestamp: 1_900_000_000n,
      },
      stages: {
        ...initialStages(),
        trade: { status: "complete", signatures: ["tx"] },
      },
    };
    savePendingRun(snapshot);
    expect(loadPendingRun()).toEqual(snapshot);
  });
});
