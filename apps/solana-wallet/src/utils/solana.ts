import {
  Keypair,
  PublicKey,
  Connection,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";

export const NETWORKS = {
  devnet: "https://api.devnet.solana.com",
  testnet: "https://api.testnet.solana.com",
  mainnet: "https://api.mainnet-beta.solana.com",
};

export type NetworkType = keyof typeof NETWORKS;

export const getConnection = (network: NetworkType = "devnet"): Connection => {
  return new Connection(NETWORKS[network], "confirmed");
};

export const generateNewKeypair = (): {
  publicKey: string;
  secretKey: string;
} => {
  const keypair = Keypair.generate();
  return {
    publicKey: keypair.publicKey.toString(),
    secretKey: bs58.encode(keypair.secretKey),
  };
};

export const importKeypairFromSecret = (
  secretKey: string,
): { publicKey: string; secretKey: string } | null => {
  try {
    const decoded = bs58.decode(secretKey);
    const keypair = Keypair.fromSecretKey(decoded);
    return {
      publicKey: keypair.publicKey.toString(),
      secretKey,
    };
  } catch {
    return null;
  }
};

export const getSolBalance = async (
  publicKeyString: string,
  network: NetworkType = "devnet",
): Promise<number> => {
  try {
    const connection = getConnection(network);
    const publicKey = new PublicKey(publicKeyString);
    const lamports = await connection.getBalance(publicKey);
    return lamports / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
};

export const getTokenAccounts = async (
  publicKeyString: string,
  network: NetworkType = "devnet",
): Promise<any[]> => {
  try {
    const connection = getConnection(network);
    const publicKey = new PublicKey(publicKeyString);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        programId: new PublicKey(
          "TokenkegQfeZyiNwAJsyFbPVwwQQnq7C39c83Kfa2KjYu1d",
        ),
      },
    );
    return tokenAccounts.value;
  } catch {
    return [];
  }
};

export const requestAirdrop = async (
  publicKeyString: string,
  amount: number = 2,
  network: NetworkType = "devnet",
): Promise<string | null> => {
  try {
    const connection = getConnection(network);
    const publicKey = new PublicKey(publicKeyString);
    const lamports = amount * LAMPORTS_PER_SOL;
    const signature = await connection.requestAirdrop(publicKey, lamports);
    await connection.confirmTransaction(signature, "confirmed");
    return signature;
  } catch {
    return null;
  }
};

export const sendTransaction = async (
  fromSecretKey: string,
  toPublicKey: string,
  amount: number,
  network: NetworkType = "devnet",
): Promise<string | null> => {
  try {
    const decoded = bs58.decode(fromSecretKey);
    const keypair = Keypair.fromSecretKey(decoded);
    const connection = getConnection(network);
    const toKey = new PublicKey(toPublicKey);

    const lamports = amount * LAMPORTS_PER_SOL;
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: toKey,
        lamports,
      }),
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
    return signature;
  } catch {
    return null;
  }
};

export const formatSolAmount = (lamports: number): string => {
  const sol = lamports / LAMPORTS_PER_SOL;
  return sol.toFixed(4);
};

export const isValidPublicKey = (key: string): boolean => {
  try {
    new PublicKey(key);
    return true;
  } catch {
    return false;
  }
};
