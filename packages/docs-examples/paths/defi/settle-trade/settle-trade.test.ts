import {
  generateKeyPairSigner,
  type Address,
  type KeyPairSigner,
} from "@solana/kit";
import { beforeAll, describe, expect, it } from "vitest";
import {
  fundSol,
  refetchFromMainnet,
  setTokenBalance,
} from "../../../test/fixtures/fund";
import { recordText, runExample } from "../../../test/record";
import { approveHolder, openAccount } from "./approve-holder";
import { failure } from "./blocked-transfer";
import { createAsset } from "./create-asset";
import { balance, demoPrice, demoSettle, demoUnfunded, holding } from "./demo";
import { USDC_USD_FEED } from "./price";
import { run } from "./trade-run";
import { USDC_MINT, type Trade } from "./trade";

const out = (name: string) => new URL(`./${name}.output.txt`, import.meta.url);
const json = (v: unknown) =>
  JSON.stringify(v, (_k, x) => (typeof x === "bigint" ? Number(x) : x));

describe("paths/defi/settle-trade (Pyth price + DvP settlement)", () => {
  let issuer: KeyPairSigner;
  let seller: KeyPairSigner;
  let buyer: KeyPairSigner;
  let agent: KeyPairSigner;
  let asset: Address;
  let trade: Trade;
  let unfundedText = "";

  beforeAll(async () => {
    [issuer, seller, buyer, agent] = (await Promise.all(
      [0, 1, 2, 3].map(() => generateKeyPairSigner()),
    )) as [KeyPairSigner, KeyPairSigner, KeyPairSigner, KeyPairSigner];
    await Promise.all([
      fundSol(issuer.address, 2),
      fundSol(seller.address),
      fundSol(buyer.address),
      fundSol(agent.address),
    ]);
    // The LSF asset from the Issue an asset tutorial, with an approved seller
    // holding 1000 LSF and an approved buyer holding 10 USDC.
    ({ mint: asset } = await createAsset(issuer));
    for (const [owner, amount] of [
      [seller.address, 1_000_000_000n],
      [buyer.address, 0n],
    ] as const) {
      await openAccount(issuer, asset, owner);
      await approveHolder(issuer, asset, owner, amount);
    }
    await setTokenBalance(buyer.address, 10_000_000n, USDC_MINT);
  });

  it("price: reads USDC/USD from Pyth and records the trade with CreateDvp", async () => {
    await refetchFromMainnet(USDC_USD_FEED);
    const r = await runExample(
      () => demoPrice(agent, seller.address, buyer.address, asset),
      { output: out("price") },
    );
    trade = r.value;
    // The price block shows price.ts alone: the two lines priceTrade printed.
    recordText(out("quote"), r.text.split("\n").slice(0, 2).join("\n"));
    expect(trade.assetAmount).toBe(4_000_000n);
    // $5.00 at a USDC/USD price within 0.5% of par.
    expect(trade.cashAmount).toBeGreaterThan(4_975_000n);
    expect(trade.cashAmount).toBeLessThan(5_025_000n);
  });

  it("unfunded: Settle fails with LegNotFunded (Custom 4) and nothing moves", async () => {
    const r = await runExample(
      () => demoUnfunded(issuer, seller, agent, trade),
      { output: out("settle-unfunded"), failedLabel: /Failed signature/ },
    );
    unfundedText = r.text;
    const { failed, after } = r.value;
    expect(r.failed).toEqual([failed.signature]);
    expect(failed.code).toBe(4);
    expect(json(failed.err)).toBe('{"InstructionError":[4,{"Custom":4}]}');
    expect(failed.fee).toBeGreaterThan(0n);
    expect(after).toEqual({
      escrowA: 4_000_000n,
      escrowB: 0n,
      buyerLsf: 0n,
      sellerUsdc: 0n,
    });
  });

  it("settle: both legs move in one transaction and the record closes", async () => {
    const r = await runExample(() => demoSettle(buyer, agent, trade), {
      output: out("settle"),
    });
    expect(r.value.after).toEqual({
      buyerLsf: 4_000_000n,
      buyerUsdc: 10_000_000n - trade.cashAmount,
      sellerLsf: 996_000_000n,
      sellerUsdc: trade.cashAmount,
      recordClosed: true,
    });
    expect(await balance(trade.escrowA)).toBe(0n);
    // The browser step shows both runs of trade.ts under its code.
    recordText(out("trade"), `${unfundedText}\n${r.text}`);
  });

  it("run: the page's trade-run.ts does the whole sequence on a fresh asset", async () => {
    const runner = await generateKeyPairSigner();
    await fundSol(runner.address, 2);
    await setTokenBalance(runner.address, 10_000_000n, USDC_MINT);
    await refetchFromMainnet(USDC_USD_FEED);
    const { value: r } = await runExample(() => run(runner), {
      output: out("trade-run"),
      failedLabel: /Failed signature/,
    });
    expect(json((await failure(r.failed.signature)).err)).toBe(
      '{"InstructionError":[4,{"Custom":4}]}',
    );
    expect((await failure(r.settled)).err).toBeNull();
    expect(await holding(r.trade.buyer, r.trade.asset)).toBe(4_000_000n);
    expect(await holding(r.trade.seller, USDC_MINT)).toBe(r.trade.cashAmount);
  });
});
