// #region resume
// npx tsx resume.ts
import { address } from "@solana/kit";
import {
  createResumeTransaction,
  getTokenPauseState,
} from "@solana/mosaic-sdk";
import { env, loadSigner, rpc, sendMessage } from "./common";

const payer = await loadSigner("tokenization-demo");
const pauseAuthority = await loadSigner("demo-authorities/pause");
const mint = address(env("MINT"));

const { transactionMessage } = await createResumeTransaction(rpc, {
  mint,
  pauseAuthority,
  feePayer: payer,
});
await sendMessage(transactionMessage);
console.log("Paused:", await getTokenPauseState(rpc, mint));
// #endregion resume
