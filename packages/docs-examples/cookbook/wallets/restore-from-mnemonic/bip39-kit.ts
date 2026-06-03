// #region bip39
import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit";
import * as bip39 from "bip39";

const mnemonic =
  "pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter";
const seed = bip39.mnemonicToSeedSync(mnemonic, "");

// Extract the first 32 bytes for the private key
const privateKeyBytes = seed.subarray(0, 32);

const signer = await createKeyPairSignerFromPrivateKeyBytes(
  new Uint8Array(privateKeyBytes),
);

console.log(signer.address);
// #endregion bip39
