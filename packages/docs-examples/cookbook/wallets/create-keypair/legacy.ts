// #region create
import { Keypair } from "@solana/web3.js-legacy";

const keypair = Keypair.generate();
console.log("address:", keypair.publicKey.toBase58());
// #endregion create
