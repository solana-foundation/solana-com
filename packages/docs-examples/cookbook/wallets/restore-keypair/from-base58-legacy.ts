// #region from-base58
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const keypairBase58 =
  "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG";
const keypairBytes = bs58.decode(keypairBase58);
const keypair = Keypair.fromSecretKey(keypairBytes);
console.log(keypair.publicKey.toBase58());
// #endregion from-base58
