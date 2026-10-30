// #region burn
// npx tsx burn.ts <amount>
import { address } from "@solana/kit";
import { createBurnTransaction } from "@solana/mosaic-sdk";
import { arg, env, loadSigner, rpc, sendMessage } from "./common";

// The holder burns its own balance, and the burn authority co-signs because
// the mint carries permissioned burn.
const holder = await loadSigner("demo-holder");
const burnAuthority = await loadSigner("demo-authorities/burn");

await sendMessage(
  await createBurnTransaction(
    rpc,
    address(env("MINT")),
    holder, // owner of the tokens
    Number(arg(1, "the amount")),
    holder, // fee payer
    burnAuthority,
  ),
);
// #endregion burn
