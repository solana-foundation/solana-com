const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const SOLANA_ADDRESS_ERROR =
  "That doesn't look like a Solana address. Check it and try again.";

/** Validate a Solana public key: base58, decodes to exactly 32 bytes. */
export function isValidSolanaAddress(address: string): boolean {
  const value = address.trim();

  if (value.length < 32 || value.length > 44) return false;

  const decodedLength = decodedBase58ByteLength(value);

  return decodedLength === 32;
}

function decodedBase58ByteLength(value: string): number | null {
  const bytes: number[] = [0];

  for (const char of value) {
    const base58Value = BASE58_ALPHABET.indexOf(char);

    if (base58Value === -1) return null;

    let carry = base58Value;

    for (let i = 0; i < bytes.length; i++) {
      carry += bytes[i]! * 58;
      bytes[i] = carry & 0xff;
      carry >>= 8;
    }

    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  let leadingZeroBytes = 0;

  for (const char of value) {
    if (char !== "1") break;
    leadingZeroBytes += 1;
  }

  const significantBytes =
    bytes.length === 1 && bytes[0] === 0 ? 0 : bytes.length;

  return leadingZeroBytes + significantBytes;
}
