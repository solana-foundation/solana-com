// #region force-burn
// npx tsx force-burn.ts <wallet> <amount>
import { address } from "@solana/kit";
import { createForceBurnTransaction } from "@solana/mosaic-sdk";
import { arg, env, loadSigner, rpc, sendMessage } from "./common";

const payer = await loadSigner("tokenization-demo");
const permanentDelegate = await loadSigner("demo-authorities/delegate");
const burnAuthority = await loadSigner("demo-authorities/burn");

// Burns without the holder. The permanent delegate signs, and the burn
// authority co-signs because the mint carries permissioned burn.
await sendMessage(
  await createForceBurnTransaction(
    rpc,
    address(env("MINT")),
    address(arg(1, "the wallet to burn from")),
    Number(arg(2, "the amount")),
    permanentDelegate,
    payer,
    burnAuthority,
  ),
);
// #endregion force-burn
