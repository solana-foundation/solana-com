// #region mint
// npx tsx mint.ts <recipient> <amount>
import { address } from "@solana/kit";
import { createMintToTransaction } from "@solana/mosaic-sdk";
import { arg, env, loadSigner, rpc, sendMessage } from "./common";

// The fee payer holds the mint authority on this mint.
const payer = await loadSigner("tokenization-demo");
const mint = address(env("MINT"));
const recipient = address(arg(1, "the recipient wallet"));
const amount = Number(arg(2, "the amount"));

// Creates the recipient's token account, thaws it through the Token ACL gate
// and mints, all in one transaction.
await sendMessage(
  await createMintToTransaction(rpc, mint, recipient, amount, payer, payer),
);
// #endregion mint
