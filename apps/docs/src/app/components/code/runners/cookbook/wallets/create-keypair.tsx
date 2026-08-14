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
  Legacy: async () => `address: ${(await keyPair()).address}`,
  Rust: async () => `address: ${(await keyPair()).address}`,
  Python: async () => {
    const { address, privateKeyBytes } = await keyPair();
    // solders prints the secret as a Python bytes literal, not base58.
    return `address: ${address}\nsecret: ${pythonBytes(privateKeyBytes)}`;
  },
};

export default runners;

async function keyPair() {
  const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32));
  try {
    const { publicKey } =
      await createKeyPairFromPrivateKeyBytes(privateKeyBytes);
    return {
      address: await getAddressFromPublicKey(publicKey),
      privateKeyBytes,
    };
  } catch {
    throw new Error(
      "This browser can't generate Ed25519 keys, so the output of this example can't be shown here.",
    );
  }
}

/** Renders bytes the way Python's `repr()` does, e.g. `b'G\xcd\xfd\x7e'`. */
function pythonBytes(bytes: Uint8Array): string {
  let out = "";
  for (const byte of bytes) {
    const char = String.fromCharCode(byte);
    if (char === "\\" || char === "'") out += `\\${char}`;
    else if (char === "\n") out += "\\n";
    else if (char === "\r") out += "\\r";
    else if (char === "\t") out += "\\t";
    else if (byte >= 0x20 && byte < 0x7f) out += char;
    else out += `\\x${byte.toString(16).padStart(2, "0")}`;
  }
  return `b'${out}'`;
}
