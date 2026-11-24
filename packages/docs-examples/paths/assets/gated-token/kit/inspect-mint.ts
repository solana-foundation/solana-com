// #region inspect
// npx tsx inspect-mint.ts
import { address, type Option } from "@solana/kit";
import { fetchMint } from "@solana-program/token-2022";
import { fetchMaybeMintConfig, findMintConfigPda } from "@solana/token-acl-sdk";
import { env, rpc } from "./common";

const mint = address(env("MINT"));
const unwrap = <T>(option: Option<T>) =>
  option.__option === "Some" ? option.value : null;

// The mint account carries the extensions. The Token ACL config is a separate
// account, derived from the mint, that holds the gate program and the
// permissionless-thaw flag.
const { data } = await fetchMint(rpc, mint, { commitment: "confirmed" });
const [mintConfigAddress] = await findMintConfigPda({ mint });
const mintConfig = await fetchMaybeMintConfig(rpc, mintConfigAddress);
const extensions = unwrap(data.extensions) ?? [];

console.log({
  mint,
  supply: data.supply.toString(),
  decimals: data.decimals,
  mintAuthority: unwrap(data.mintAuthority),
  freezeAuthority: unwrap(data.freezeAuthority),
  tokenAcl:
    mintConfig.exists && unwrap(data.freezeAuthority) === mintConfigAddress,
  gatingProgram: mintConfig.exists ? mintConfig.data.gatingProgram : null,
  permissionlessThaw: mintConfig.exists
    ? mintConfig.data.enablePermissionlessThaw
    : false,
  extensions: extensions.map((ext) => ext.__kind),
});
// #endregion inspect
