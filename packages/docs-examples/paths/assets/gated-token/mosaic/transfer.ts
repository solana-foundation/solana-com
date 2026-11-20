// #region transfer
// npx tsx transfer.ts <recipient> <amount>
import { address } from "@solana/kit";
import { createTransferTransaction } from "@solana/mosaic-sdk";
import { arg, env, loadSigner, rpc, sendMessage } from "./common";

// The holder signs and pays for its own transfer.
const holder = await loadSigner("demo-holder");
const mint = address(env("MINT"));

// Creates the recipient's token account if it is missing and thaws it
// through the gate before the transfer, so the gate decides whether the
// recipient may hold the token.
await sendMessage(
  await createTransferTransaction({
    rpc,
    mint,
    from: holder.address,
    to: address(arg(1, "the recipient wallet")),
    feePayer: holder,
    authority: holder,
    amount: arg(2, "the amount"),
  }),
);
// #endregion transfer
