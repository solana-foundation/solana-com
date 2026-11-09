// #region pause
// npx tsx pause.ts
import { address } from "@solana/kit";
import { fetchMint, getPauseInstruction } from "@solana-program/token-2022";
import { env, loadSigner, rpc, send } from "./common";

const payer = await loadSigner("tokenization-demo");
// The pause authority is its own key, from step 1 of create the mint.
const pauseAuthority = await loadSigner("demo-authorities/pause");
const mint = address(env("MINT"));

// Halts mint, burn, and transfer activity for every holder of the token.
await send(payer, [getPauseInstruction({ mint, authority: pauseAuthority })]);

// The pause flag lives in the mint's PausableConfig extension.
const { data } = await fetchMint(rpc, mint);
const extensions =
  data.extensions.__option === "Some" ? data.extensions.value : [];
const pausable = extensions.find((ext) => ext.__kind === "PausableConfig");
console.log(
  "Paused:",
  pausable?.__kind === "PausableConfig" && pausable.paused,
);
// #endregion pause
