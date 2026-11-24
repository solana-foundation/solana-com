// #region pause
// npx tsx pause.ts
import { address } from "@solana/kit";
import { createPauseTransaction, getTokenPauseState } from "@solana/mosaic-sdk";
import { env, loadSigner, rpc, sendMessage } from "./common";

const payer = await loadSigner("tokenization-demo");
// The pause authority is its own key, from step 1 of create the mint.
const pauseAuthority = await loadSigner("demo-authorities/pause");
const mint = address(env("MINT"));

// Halts mint, burn, and transfer activity for every holder of the token.
const { transactionMessage } = await createPauseTransaction(rpc, {
  mint,
  pauseAuthority,
  feePayer: payer,
});
await sendMessage(transactionMessage);
console.log("Paused:", await getTokenPauseState(rpc, mint));
// #endregion pause
