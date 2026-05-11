// #region load
import {
  airdropFactory,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  generateKeyPair,
  getAddressFromPublicKey,
  type KeyPairSigner,
  lamports,
} from "@solana/kit";
import fs from "fs";
import path from "path";
import os from "os";

// The new library takes a brand-new approach to Solana key pairs and addresses,
// which will feel quite different from the classes PublicKey and Keypair from version 1.x.
// All key operations now use the native Ed25519 implementation in JavaScript's
// Web Crypto API.
async function createKeypair() {
  const newKeypair = await generateKeyPair();
  const publicAddress = await getAddressFromPublicKey(newKeypair.publicKey);

  console.log(`Public key: ${publicAddress}`);
}

await createKeypair();

export async function loadKeypairFromFile(
  filePath: string,
): Promise<KeyPairSigner<string>> {
  // This is here so you can also load the default keypair from the file system.
  const resolvedPath = path.resolve(
    filePath.startsWith("~") ? filePath.replace("~", os.homedir()) : filePath,
  );
  const loadedKeyBytes = Uint8Array.from(
    JSON.parse(fs.readFileSync(resolvedPath, "utf8")),
  );
  // Here you can also set the second parameter to true in case you need to extract your private key.
  const keypairSigner = await createKeyPairSignerFromBytes(loadedKeyBytes);
  return keypairSigner;
}

const keypairSigner = await loadKeypairFromFile("~/.config/solana/id.json");
console.log(keypairSigner.address);

export async function loadDefaultKeypair(): Promise<KeyPairSigner<string>> {
  return await loadKeypairFromFile("~/.config/solana/id.json");
}

const defaultSigner = await loadDefaultKeypair();
console.log(defaultSigner.address);

export async function loadDefaultKeypairWithAirdrop(
  rpcUrl: string,
  rpcSubscriptionsUrl: string,
): Promise<KeyPairSigner<string>> {
  const keypair = await loadDefaultKeypair();
  const rpc = createSolanaRpc(rpcUrl);
  const rpcSubscriptions = createSolanaRpcSubscriptions(rpcSubscriptionsUrl);
  try {
    const result = await rpc.getBalance(keypair.address).send();

    console.log(`Balance: ${result.value} lamports`);
    if (result.value < lamports(500_000n)) {
      console.log(`Balance low requesting airdrop`);
      const airdrop = airdropFactory({ rpc, rpcSubscriptions });
      await airdrop({
        commitment: "confirmed",
        lamports: lamports(1_000_000_000n),
        recipientAddress: keypair.address,
      });
    }
  } catch (err) {
    console.error("Error fetching balance:", err);
  }
  return keypair;
}

const airdropSigner = await loadDefaultKeypairWithAirdrop(
  "http://localhost:8899",
  "ws://localhost:8900",
);
console.log(airdropSigner.address);
// #endregion load
