// #region send-asset
import { readFileSync } from "node:fs";
import {
  address,
  generateKeyPairSigner,
  writeKeyPairSigner,
} from "@solana/kit";
import { client, tokenBalance } from "./client";

// The asset you created in create-asset.ts.
const mint = address(JSON.parse(readFileSync("asset.json", "utf8")).mint);

// A new holder: a second wallet, saved in holder.json so step 5 can sign
// for it. In a real app, the holder keeps their own key.
const holder = await generateKeyPairSigner(true);
await writeKeyPairSigner(holder, "holder.json");

// Opens the holder's EXF token account, then moves 100 EXF
// (10,000 base units: EXF has 2 decimals) with TransferChecked.
const { context } = await client.token2022.instructions
  .transferToATA({
    mint,
    authority: client.identity,
    recipient: holder.address,
    amount: 10_000n,
    decimals: 2,
  })
  .sendTransaction();

console.log("Sent 100 EXF to", holder.address);
console.log("Signature:", context.signature);
console.log(
  `Explorer: https://explorer.solana.com/tx/${context.signature}?cluster=devnet`,
);
console.log("Holder balance:", await tokenBalance(holder.address, mint), "EXF");
// #endregion send-asset
