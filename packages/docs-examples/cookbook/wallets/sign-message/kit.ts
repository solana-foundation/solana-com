// #region sign
import {
  generateKeyPair,
  signBytes,
  verifySignature,
  getUtf8Encoder,
  getBase58Decoder,
} from "@solana/kit";

const keys = await generateKeyPair();
const message = getUtf8Encoder().encode("Hello, World!");
const signedBytes = await signBytes(keys.privateKey, message);

const decoded = getBase58Decoder().decode(signedBytes);
console.log("Signature:", decoded);

const verified = await verifySignature(keys.publicKey, signedBytes, message);
console.log("Verified:", verified);
// #endregion sign
