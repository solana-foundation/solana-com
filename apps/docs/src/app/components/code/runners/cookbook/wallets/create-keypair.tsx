import { getAddressFromPublicKey } from "@solana/addresses";
import { createKeyPairFromPrivateKeyBytes } from "@solana/keys";

import type { PageRunners } from "../../types";

/**
 * Every run of this example prints a different address, so the console generates
 * a real Ed25519 key pair per run rather than showing one frozen address.
 *
 * Needs Ed25519 in WebCrypto (Safari 17+, Firefox 129+, Chrome 137+). Where it
 * is missing, @solana/keys throws and the console shows the message below.
 */
const runners: PageRunners = {
  // `console.log("address: ", signer.address)` — two args, hence two spaces.
  Kit: async () => `address:  ${(await keyPair()).address}`,
  "Web3.js v3": async () => `address: ${(await keyPair()).address}`,
  "Web3.js (legacy)": async () => `address: ${(await keyPair()).address}`,
  Rust: async () => `address: ${(await keyPair()).address}`,
  Python: async () => `address: ${(await keyPair()).address}`,
  Go: async () => `address: ${(await keyPair()).address}`,
};

export default runners;

async function keyPair() {
  const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32));
  try {
    const { publicKey } =
      await createKeyPairFromPrivateKeyBytes(privateKeyBytes);
    return { address: await getAddressFromPublicKey(publicKey) };
  } catch {
    throw new Error(
      "This browser can't generate Ed25519 keys, so the output of this example can't be shown here.",
    );
  }
}

