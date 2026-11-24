// #region wire-gate
// npx tsx wire-gate.ts
import {
  address,
  appendTransactionMessageInstructions,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";
import {
  getCreateConfigInstructions,
  getCreateListInstructions,
  getEnablePermissionlessThawInstructions,
  getSetExtraMetasInstructions,
} from "@solana/mosaic-sdk";
import { env, loadSigner, rpc, sendMessage } from "./common";

// The mint's current freeze authority: the fee payer in this tutorial.
const payer = await loadSigner("tokenization-demo");
const mint = address(env("MINT"));
const gatingProgram = address("GATEzzqxhJnsWF6vHRsgtixxSB8PaQdcqGEVTEHWiULz");

// What enableSrfc37 does at creation, in one transaction: create the Token
// ACL config (which takes over the freeze authority), create the allowlist,
// register it with the gate, and turn on permissionless thaw.
const config = await getCreateConfigInstructions({
  authority: payer,
  mint,
  gatingProgram,
});
const list = await getCreateListInstructions({ authority: payer, mint });
const instructions = [
  ...config.instructions,
  ...list.instructions,
  ...(await getSetExtraMetasInstructions({
    authority: payer,
    mint,
    addresses: [list.listConfig],
  })),
  ...(await getEnablePermissionlessThawInstructions({ authority: payer, mint })),
];

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
await sendMessage(
  pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(payer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) => appendTransactionMessageInstructions(instructions, m),
  ),
);
if (process.exitCode) process.exit();
console.log("Allowlist:", list.listConfig);
console.log("Freeze authority (Token ACL mint config):", config.mintConfig);
// #endregion wire-gate
