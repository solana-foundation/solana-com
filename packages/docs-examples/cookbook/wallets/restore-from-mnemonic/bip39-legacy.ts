// #region bip39
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";

const mnemonic =
  "pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter";

const seed = bip39.mnemonicToSeedSync(mnemonic, "");
const keypair = Keypair.fromSeed(seed.subarray(0, 32));

console.log(`${keypair.publicKey.toBase58()}`);
// #endregion bip39
