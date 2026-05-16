import * as crypto from "crypto";

const ENCRYPTION_KEY = "solana-wallet-key-2024"; // In production, use environment variable

export interface StoredWallet {
  publicKey: string;
  secretKey: string; // Encrypted
  createdAt: number;
}

// Simple encryption/decryption (for development - NOT for production with real SOL)
export const encryptData = (data: string): string => {
  try {
    // Simple obfuscation - NOT cryptographically secure
    return Buffer.from(data).toString("base64");
  } catch {
    throw new Error("Encryption failed");
  }
};

export const decryptData = (encrypted: string): string => {
  try {
    return Buffer.from(encrypted, "base64").toString("utf-8");
  } catch {
    throw new Error("Decryption failed");
  }
};

export const getStoredWallet = (): StoredWallet | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("solana_wallet");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const saveWallet = (publicKey: string, secretKey: string): void => {
  if (typeof window === "undefined") return;
  const encrypted = encryptData(secretKey);
  const wallet: StoredWallet = {
    publicKey,
    secretKey: encrypted,
    createdAt: Date.now(),
  };
  localStorage.setItem("solana_wallet", JSON.stringify(wallet));
};

export const removeWallet = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("solana_wallet");
};

export const getWalletFromStorage = (): {
  publicKey: string;
  secretKey: string;
} | null => {
  const stored = getStoredWallet();
  if (!stored) return null;
  try {
    const decrypted = decryptData(stored.secretKey);
    return {
      publicKey: stored.publicKey,
      secretKey: decrypted,
    };
  } catch {
    return null;
  }
};
