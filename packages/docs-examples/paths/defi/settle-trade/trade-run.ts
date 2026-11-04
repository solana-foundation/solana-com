// #region run
// trade-run.ts: price an LSF trade from Pyth, then settle it with DvP.
//   npx tsx trade-run.ts
// The issuer key is read from ISSUER_KEYPAIR, or from the Solana CLI default
// ~/.config/solana/id.json. It needs SOL for fees and 6 USDC for each run,
// which it sends to the buyer.
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  createKeyPairSignerFromBytes,
  generateKeyPairSigner,
  lamports,
  type TransactionSigner,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { approveHolder, openAccount } from "./approve-holder";
import { send } from "./config";
import { createAsset } from "./create-asset";
import { priceTrade } from "./price";
import {
  approveEscrow,
  createTrade,
  fundAssetLeg,
  fundCashLeg,
  settle,
  settleUnfunded,
  USDC_MINT,
} from "./trade";

export async function run(issuer: TransactionSigner) {
  const { mint: asset } = await createAsset(issuer);

  const seller = await generateKeyPairSigner();
  const buyer = await generateKeyPairSigner();
  const agent = await generateKeyPairSigner(); // the settlement authority
  const usdcAta = async (owner: TransactionSigner) =>
    (
      await findAssociatedTokenPda({
        owner: owner.address,
        mint: USDC_MINT,
        tokenProgram: TOKEN_PROGRAM_ADDRESS,
      })
    )[0];
  // SOL for each party's fees (the agent also pays the trade's rent, which
  // it gets back at settlement), and 6 USDC for the buyer to pay with.
  await send(issuer, [
    ...[seller, buyer, agent].map((to) =>
      getTransferSolInstruction({
        source: issuer,
        destination: to.address,
        amount: lamports(50_000_000n), // 0.05 SOL
      }),
    ),
    getCreateAssociatedTokenIdempotentInstruction({
      payer: issuer,
      ata: await usdcAta(buyer),
      owner: buyer.address,
      mint: USDC_MINT,
    }),
    getTransferCheckedInstruction({
      source: await usdcAta(issuer),
      mint: USDC_MINT,
      destination: await usdcAta(buyer),
      authority: issuer,
      amount: 6_000_000n,
      decimals: 6,
    }),
  ]);

  // Approve both investors; the seller holds 1000 LSF.
  for (const [owner, amount] of [
    [seller.address, 1_000_000_000n],
    [buyer.address, 0n],
  ] as const) {
    await openAccount(issuer, asset, owner);
    await approveHolder(issuer, asset, owner, amount);
  }

  // 4 LSF at $1.25 a share, paid in USDC at the live USDC/USD price.
  const quote = await priceTrade(4_000_000n, 1_250_000n);
  const { trade } = await createTrade(agent, {
    seller: seller.address,
    buyer: buyer.address,
    agent: agent.address,
    asset,
    assetAmount: quote.assetAmount,
    cashAmount: quote.cashAmount,
  });

  await approveEscrow(issuer, trade);
  await fundAssetLeg(seller, trade);
  const failed = await settleUnfunded(agent, trade);
  await fundCashLeg(buyer, trade);
  const settled = await settle(agent, trade);

  return { trade, failed, settled };
}

// Run when started directly (not when imported by the tests).
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const keyPath =
    process.env.ISSUER_KEYPAIR ??
    join(homedir(), ".config", "solana", "id.json");
  const bytes = new Uint8Array(JSON.parse(await readFile(keyPath, "utf8")));
  await run(await createKeyPairSignerFromBytes(bytes));
}
// #endregion run
