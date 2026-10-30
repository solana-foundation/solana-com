// #region inspect
// npx tsx inspect-mint.ts
import { address } from "@solana/kit";
import { inspectToken } from "@solana/mosaic-sdk";
import { env, rpc } from "./common";

const mint = address(env("MINT"));
const token = await inspectToken(rpc, mint, "confirmed");
console.log({
  mint: token.address,
  supply: token.supplyInfo.supply.toString(),
  decimals: token.supplyInfo.decimals,
  authorities: token.authorities,
  extensions: token.extensions.map((extension) => extension.name),
  aclMode: token.aclMode,
  tokenAcl: token.enableSrfc37,
  patterns: token.detectedPatterns,
});
// #endregion inspect
