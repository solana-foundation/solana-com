// #region force-transfer
// npx tsx force-transfer.ts <from wallet> <to wallet> <amount>
import { address } from "@solana/kit";
import { createForceTransferTransaction } from "@solana/mosaic-sdk";
import { arg, env, loadSigner, rpc, sendMessage } from "./common";

const payer = await loadSigner("tokenization-demo");
const permanentDelegate = await loadSigner("demo-authorities/delegate");

// Moves a holder's balance without the holder's signature. The permanent
// delegate signs; the fee payer only pays.
await sendMessage(
  await createForceTransferTransaction(
    rpc,
    address(env("MINT")),
    address(arg(1, "the source wallet")),
    address(arg(2, "the destination wallet")),
    Number(arg(3, "the amount")),
    permanentDelegate,
    payer,
  ),
);
// #endregion force-transfer
