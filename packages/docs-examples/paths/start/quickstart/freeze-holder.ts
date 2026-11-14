// #region freeze
import { readFileSync } from "node:fs";
import { address, createKeyPairSignerFromBytes } from "@solana/kit";
import {
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { client, tokenBalance } from "./client";

const mint = address(JSON.parse(readFileSync("asset.json", "utf8")).mint);
const holder = await createKeyPairSignerFromBytes(
  new Uint8Array(JSON.parse(readFileSync("holder.json", "utf8"))),
);
const [account] = await findAssociatedTokenPda({
  mint,
  owner: holder.address,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
const { freezeAccount, thawAccount, transferToATA } =
  client.token2022.instructions;

// The holder sends 10 EXF back to you (you pay the fee).
const sendBack = () =>
  transferToATA({
    mint,
    authority: holder,
    recipient: client.identity.address,
    amount: 1_000n,
    decimals: 2,
  }).sendTransaction();

// 1. As the freeze authority, freeze the holder's EXF account.
await freezeAccount({
  account,
  mint,
  owner: client.identity,
}).sendTransaction();
console.log("Froze the holder's EXF account");

// 2. Nothing moves out of a frozen account: Token-2022 rejects the transfer
// (error 17, AccountFrozen) before it lands, so the holder keeps 100 EXF.
try {
  await sendBack();
} catch {
  console.log("Transfer blocked: account is frozen");
}

// 3. Thaw it, and the same transfer goes through.
await thawAccount({ account, mint, owner: client.identity }).sendTransaction();
const { context } = await sendBack();
console.log("Thawed. Transfer sent:", context.signature);
console.log("Holder balance:", await tokenBalance(holder.address, mint), "EXF");
// #endregion freeze
