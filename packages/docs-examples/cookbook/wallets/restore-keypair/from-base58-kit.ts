// #region from-base58
import {
  createKeyPairFromBytes,
  createSignerFromKeyPair,
  getBase58Encoder,
} from "@solana/kit";

const keypairBase58 =
  "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG";

const keypair = await createKeyPairFromBytes(
  getBase58Encoder().encode(keypairBase58),
);
const signer = await createSignerFromKeyPair(keypair);

console.log(signer.address);
// #endregion from-base58
