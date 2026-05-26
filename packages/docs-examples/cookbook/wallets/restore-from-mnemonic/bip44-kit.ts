// #region bip44
import { HDKey } from "micro-ed25519-hdkey";
import * as bip39 from "bip39";
import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit";

const mnemonic =
  "neither lonely flavor argue grass remind eye tag avocado spot unusual intact";
const seed = bip39.mnemonicToSeedSync(mnemonic);
const hd = HDKey.fromMasterSeed(seed.toString("hex"));

for (let i = 0; i < 10; i++) {
  const path = `m/44'/501'/${i}'/0'`;
  const child = hd.derive(path);

  const signer = await createKeyPairSignerFromPrivateKeyBytes(
    new Uint8Array(child.privateKey),
  );
  // The signer object has the address directly
  console.log(`${path} => ${signer.address}`);
}
// #endregion bip44
