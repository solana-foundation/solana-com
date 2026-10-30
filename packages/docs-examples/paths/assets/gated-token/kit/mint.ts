// #region mint
// npx tsx mint.ts <recipient> <amount>
import { address } from "@solana/kit";
import { fetchMint, getMintToInstruction } from "@solana-program/token-2022";
import { arg, env, loadSigner, rpc, send, toBaseUnits } from "./common";
import { openThroughGate } from "./gate";

// The fee payer holds the mint authority on this mint.
const payer = await loadSigner("tokenization-demo");
const mint = address(env("MINT"));
const list = address(env("LIST"));
const recipient = address(arg(1, "the recipient wallet"));
const { data } = await fetchMint(rpc, mint);

// Create the account, thaw it through the gate, then mint: one transaction.
const { tokenAccount, instructions } = await openThroughGate(
  payer,
  mint,
  recipient,
  list,
);
await send(payer, [
  ...instructions,
  getMintToInstruction({
    mint,
    token: tokenAccount,
    mintAuthority: payer,
    amount: toBaseUnits(arg(2, "the amount"), data.decimals),
  }),
]);
// #endregion mint
