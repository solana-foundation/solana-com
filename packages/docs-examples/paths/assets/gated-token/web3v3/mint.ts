// #region mint
// npx tsx mint.ts <recipient> <amount>
import { PublicKey } from "@solana/web3.js-v3";
import {
  getMintDecoder,
  getMintToInstruction,
} from "@solana-program/token-2022";
import {
  addressOf,
  arg,
  connection,
  env,
  loadKeypair,
  send,
  toBaseUnits,
} from "./common";
import { openThroughGate } from "./gate";

// The fee payer holds the mint authority on this mint.
const payer = await loadKeypair("tokenization-demo");
const mint = addressOf(env("MINT"));
const list = addressOf(env("LIST"));
const recipient = addressOf(arg(1, "the recipient wallet"));
const mintAccount = await connection.getAccountInfo(new PublicKey(mint));
const { decimals } = getMintDecoder().decode(mintAccount!.data);

// Create the account, thaw it through the gate, then mint: one transaction.
const { tokenAccount, instructions } = await openThroughGate(
  payer,
  mint,
  recipient,
  list,
);
await send(
  [payer],
  [
    ...instructions,
    getMintToInstruction({
      mint,
      token: tokenAccount,
      mintAuthority: payer,
      amount: toBaseUnits(arg(2, "the amount"), decimals),
    }),
  ],
);
// #endregion mint
