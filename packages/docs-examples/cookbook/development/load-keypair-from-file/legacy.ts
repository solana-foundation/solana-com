// #region load
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { readFileSync } from "fs";
import { homedir } from "os";
import path from "path";

export async function loadKeypairFromFile(filePath: string): Promise<Keypair> {
  const resolvedPath = path.resolve(
    filePath.startsWith("~") ? filePath.replace("~", homedir()) : filePath,
  );
  const loadedKeyBytes = Uint8Array.from(
    JSON.parse(readFileSync(resolvedPath, "utf8")),
  );
  return Keypair.fromSecretKey(loadedKeyBytes);
}

const keypair = await loadKeypairFromFile("~/.config/solana/id.json");
console.log(keypair.publicKey.toBase58());

export async function loadDefaultKeypair(): Promise<Keypair> {
  return await loadKeypairFromFile("~/.config/solana/id.json");
}

const defaultKeypair = await loadDefaultKeypair();
console.log(defaultKeypair.publicKey.toBase58());

export async function loadDefaultKeypairWithAirdrop(
  rpcUrl: string,
): Promise<Keypair> {
  const keypair = await loadDefaultKeypair();
  const connection = new Connection(rpcUrl, "finalized");

  try {
    const balance = await connection.getBalance(keypair.publicKey);

    console.log(`Balance: ${balance} lamports`);
    if (balance < 0.05 * LAMPORTS_PER_SOL) {
      console.log(`Balance low requesting airdrop`);
      await connection.requestAirdrop(keypair.publicKey, 1_000_000_000);
    }
  } catch (err) {
    console.error("Error fetching balance:", err);
  }
  return keypair;
}

const airdropKeypair = await loadDefaultKeypairWithAirdrop(
  "http://localhost:8899",
);
console.log(airdropKeypair.publicKey.toBase58());
// #endregion load
