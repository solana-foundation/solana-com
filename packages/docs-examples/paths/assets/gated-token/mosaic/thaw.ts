// #region thaw
// npx tsx thaw.ts <wallet>
import { address } from "@solana/kit";
import { getThawTransaction, resolveTokenAccount } from "@solana/mosaic-sdk";
import { arg, env, loadSigner, rpc, sendMessage } from "./common";

const payer = await loadSigner("tokenization-demo");

// Thaw takes the token account, so look up the wallet's account first.
const { tokenAccount } = await resolveTokenAccount(
  rpc,
  address(arg(1, "the wallet to thaw")),
  address(env("MINT")),
);
await sendMessage(
  await getThawTransaction({ rpc, payer, authority: payer, tokenAccount }),
);
// #endregion thaw
