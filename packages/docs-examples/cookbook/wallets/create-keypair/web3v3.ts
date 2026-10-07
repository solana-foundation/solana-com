// #region create
import { Keypair } from "@solana/web3.js-v3";

const keypair = await Keypair.generate();
console.log("address:", keypair.publicKey.toBase58());
// #endregion create
