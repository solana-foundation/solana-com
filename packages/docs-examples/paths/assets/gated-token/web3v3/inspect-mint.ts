// #region inspect
// npx tsx inspect-mint.ts
import type { Option } from "@solana/kit";
import { PublicKey } from "@solana/web3.js-v3";
import { getMintDecoder } from "@solana-program/token-2022";
import { findMintConfigPda, getMintConfigDecoder } from "@solana/token-acl-sdk";
import { addressOf, connection, env } from "./common";

const mint = addressOf(env("MINT"));
const unwrap = <T>(option: Option<T>) =>
  option.__option === "Some" ? option.value : null;

// The mint account carries the extensions. The Token ACL config is a separate
// account, derived from the mint, that holds the gate program and the
// permissionless-thaw flag.
const mintAccount = await connection.getAccountInfo(new PublicKey(mint));
const data = getMintDecoder().decode(mintAccount!.data);
const [mintConfigAddress] = await findMintConfigPda({ mint });
const configAccount = await connection.getAccountInfo(
  new PublicKey(mintConfigAddress),
);
const mintConfig = configAccount
  ? getMintConfigDecoder().decode(configAccount.data)
  : null;
const extensions = unwrap(data.extensions) ?? [];

console.log({
  mint,
  supply: data.supply.toString(),
  decimals: data.decimals,
  mintAuthority: unwrap(data.mintAuthority),
  freezeAuthority: unwrap(data.freezeAuthority),
  tokenAcl:
    mintConfig !== null && unwrap(data.freezeAuthority) === mintConfigAddress,
  gatingProgram: mintConfig?.gatingProgram ?? null,
  permissionlessThaw: mintConfig?.enablePermissionlessThaw ?? false,
  extensions: extensions.map((ext) => ext.__kind),
});
// #endregion inspect
