// #region derive-ata
// npx tsx derive-ata.ts <wallet>
import { address } from "@solana/kit";
import {
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { arg, env } from "./common";

const owner = address(arg(1, "the custody wallet"));
// Deterministic: the address exists before the account does, so monitoring
// and reconciliation can be wired up ahead of the first transfer.
const [tokenAccount] = await findAssociatedTokenPda({
  mint: address(env("MINT")),
  owner,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
console.log("Wallet address:", owner);
console.log("Associated token address:", tokenAccount);
// #endregion derive-ata
