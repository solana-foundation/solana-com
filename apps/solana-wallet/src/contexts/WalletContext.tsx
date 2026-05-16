"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getStoredWallet,
  saveWallet,
  removeWallet,
  getWalletFromStorage,
} from "@/utils/storage";
import {
  generateNewKeypair,
  importKeypairFromSecret,
  getSolBalance,
  getTokenAccounts,
  NetworkType,
} from "@/utils/solana";

export interface TokenAccount {
  mint: string;
  amount: string;
  decimals: number;
}

export interface WalletContextType {
  publicKey: string | null;
  isLoading: boolean;
  network: NetworkType;
  solBalance: number;
  tokenAccounts: TokenAccount[];

  // Actions
  createNewWallet: () => void;
  importWallet: (secretKey: string) => boolean;
  disconnectWallet: () => void;
  switchNetwork: (network: NetworkType) => void;
  refreshBalance: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState<NetworkType>("devnet");
  const [solBalance, setSolBalance] = useState(0);
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);

  // Load wallet from storage on mount
  useEffect(() => {
    const stored = getStoredWallet();
    if (stored) {
      setPublicKey(stored.publicKey);
    }
  }, []);

  // Refresh balance and tokens when publicKey or network changes
  useEffect(() => {
    if (publicKey) {
      refreshBalance();
      refreshTokens();
    }
  }, [publicKey, network]);

  const createNewWallet = () => {
    const { publicKey: newPublic, secretKey } = generateNewKeypair();
    saveWallet(newPublic, secretKey);
    setPublicKey(newPublic);
  };

  const importWallet = (secretKey: string): boolean => {
    const imported = importKeypairFromSecret(secretKey);
    if (!imported) return false;
    saveWallet(imported.publicKey, secretKey);
    setPublicKey(imported.publicKey);
    return true;
  };

  const disconnectWallet = () => {
    removeWallet();
    setPublicKey(null);
    setSolBalance(0);
    setTokenAccounts([]);
  };

  const switchNetwork = (newNetwork: NetworkType) => {
    setNetwork(newNetwork);
  };

  const refreshBalance = async () => {
    if (!publicKey) return;
    setIsLoading(true);
    try {
      const balance = await getSolBalance(publicKey, network);
      setSolBalance(balance);
    } catch {
      console.error("Failed to fetch balance");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async () => {
    if (!publicKey) return;
    try {
      const tokens = await getTokenAccounts(publicKey, network);
      const formatted: TokenAccount[] = tokens.map((token: any) => ({
        mint: token.mint,
        amount: token.tokenAmount.amount,
        decimals: token.tokenAmount.decimals,
      }));
      setTokenAccounts(formatted);
    } catch {
      console.error("Failed to fetch tokens");
    }
  };

  const value: WalletContextType = {
    publicKey,
    isLoading,
    network,
    solBalance,
    tokenAccounts,
    createNewWallet,
    importWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
    refreshTokens,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
