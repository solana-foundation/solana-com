// #region pause
// npx tsx pause.ts
import { PublicKey } from "@solana/web3.js-v3";
import {
  getPauseInstruction,
  getMintDecoder,
} from "@solana-program/token-2022";
import { addressOf, connection, env, loadKeypair, send } from "./common";

const payer = await loadKeypair("tokenization-demo");
// The pause authority is its own key, from step 1 of create the mint.
const pauseAuthority = await loadKeypair("demo-authorities/pause");
const mint = addressOf(env("MINT"));

// Halts mint, burn, and transfer activity for every holder of the token.
await send(
  [payer, pauseAuthority],
  [getPauseInstruction({ mint, authority: pauseAuthority })],
);

// The pause flag lives in the mint's PausableConfig extension.
const mintAccount = await connection.getAccountInfo(new PublicKey(mint));
const { extensions } = getMintDecoder().decode(mintAccount!.data);
const pausable = (extensions.__option === "Some" ? extensions.value : []).find(
  (ext) => ext.__kind === "PausableConfig",
);
console.log(
  "Paused:",
  pausable?.__kind === "PausableConfig" && pausable.paused,
);
// #endregion pause
