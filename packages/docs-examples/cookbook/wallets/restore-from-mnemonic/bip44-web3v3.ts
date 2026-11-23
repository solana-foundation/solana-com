// #region bip44
import { Keypair } from "@solana/web3.js-v3";
import { HDKey } from "micro-ed25519-hdkey";
import * as bip39 from "bip39";

const mnemonic =
  "neither lonely flavor argue grass remind eye tag avocado spot unusual intact";

// arguments: (mnemonic, password)
const seed = bip39.mnemonicToSeedSync(mnemonic, "");
const hd = HDKey.fromMasterSeed(seed.toString("hex"));

for (let i = 0; i < 10; i++) {
  const path = `m/44'/501'/${i}'/0'`;
  const keypair = await Keypair.fromSeed(hd.derive(path).privateKey);
  console.log(`${path} => ${keypair.publicKey.toBase58()}`);
}
// #endregion bip44
