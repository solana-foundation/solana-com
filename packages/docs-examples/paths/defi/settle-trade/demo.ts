/**
 * The three demo steps of the tutorial. Every line they print comes from the
 * functions shown on the pages (price.ts and trade.ts), so a reader who runs
 * that code sees the same output.
 */
import type { Address, TransactionSigner } from "@solana/kit";
import { rpc } from "./config";
import { priceTrade } from "./price";
import {
  approveEscrow,
  createTrade,
  fundAssetLeg,
  fundCashLeg,
  holding,
  settle,
  settleUnfunded,
  USDC_MINT,
  type Trade,
} from "./trade";

export { balance, holding } from "./trade";

export async function demoPrice(
  agent: TransactionSigner,
  seller: Address,
  buyer: Address,
  asset: Address,
) {
  const quote = await priceTrade(4_000_000n, 1_250_000n);
  const { trade } = await createTrade(agent, {
    seller,
    buyer,
    agent: agent.address,
    asset,
    assetAmount: quote.assetAmount,
    cashAmount: quote.cashAmount,
  });
  return trade;
}

export async function demoUnfunded(
  issuer: TransactionSigner,
  seller: TransactionSigner,
  agent: TransactionSigner,
  trade: Trade,
) {
  await approveEscrow(issuer, trade);
  await fundAssetLeg(seller, trade);
  const failed = await settleUnfunded(agent, trade);
  return { failed, after: failed.after };
}

export async function demoSettle(
  buyer: TransactionSigner,
  agent: TransactionSigner,
  trade: Trade,
) {
  await fundCashLeg(buyer, trade);
  const settled = await settle(agent, trade);
  const after = {
    buyerLsf: await holding(trade.buyer, trade.asset),
    buyerUsdc: await holding(trade.buyer, USDC_MINT),
    sellerLsf: await holding(trade.seller, trade.asset),
    sellerUsdc: await holding(trade.seller, USDC_MINT),
    recordClosed: !(await rpc.getAccountInfo(trade.record).send()).value,
  };
  return { settled, after };
}
