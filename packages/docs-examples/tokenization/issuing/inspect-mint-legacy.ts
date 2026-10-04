// #region inspect
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  getExtensionTypes,
  getMint,
  getPausableConfig,
} from "@solana/spl-token";

// The same keypair files and environment variables the CLI tab uses.
const keypairFile = (name: string) =>
  join(homedir(), ".config", "solana", name);

async function loadKeypair(path: string) {
  const bytes = JSON.parse(await readFile(path, "utf8")) as number[];
  return Keypair.fromSecretKey(Uint8Array.from(bytes));
}

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`export ${name} before running this example`);
  return value;
}

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const mint = new PublicKey(env("MINT"));
const TOKEN_ACL = new PublicKey("TACLkU6CiCdkQN2MjoyDkVg2yAH9zkxiHDsiztQ52TP");

// The mint account carries the extensions. The Token ACL config is a separate
// account, derived from the mint, that holds the gate program and the
// permissionless-thaw flag: discriminator (1), bump (1), thaw flag (1),
// freeze flag (1), mint (32), freeze authority (32), gate program (32).
const mintInfo = await getMint(
  connection,
  mint,
  "confirmed",
  TOKEN_2022_PROGRAM_ID,
);
const [mintConfigAddress] = PublicKey.findProgramAddressSync(
  [Buffer.from("MINT_CONFIG"), mint.toBuffer()],
  TOKEN_ACL,
);
const mintConfig = await connection.getAccountInfo(mintConfigAddress);

console.log({
  mint: mint.toBase58(),
  supply: mintInfo.supply.toString(),
  decimals: mintInfo.decimals,
  mintAuthority: mintInfo.mintAuthority?.toBase58() ?? null,
  freezeAuthority: mintInfo.freezeAuthority?.toBase58() ?? null,
  tokenAcl:
    mintConfig !== null &&
    mintInfo.freezeAuthority?.equals(mintConfigAddress) === true,
  gatingProgram: mintConfig
    ? new PublicKey(mintConfig.data.subarray(68, 100)).toBase58()
    : null,
  permissionlessThaw: mintConfig ? mintConfig.data[2] === 1 : false,
  extensions: getExtensionTypes(mintInfo.tlvData).map(
    (type) => ExtensionType[type],
  ),
  paused: getPausableConfig(mintInfo)?.paused ?? null,
});
// #endregion
