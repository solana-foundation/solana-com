"use client";

import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import Button from "./Button";
import { LogOut, Wallet } from "lucide-react";

const Header: React.FC = () => {
  const { publicKey, disconnectWallet } = useWallet();

  return (
    <header className="bg-primary text-primary-foreground border-b border-primary/20">
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/20 p-2 rounded-lg">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Solana Wallet</h1>
            <p className="text-sm text-primary-foreground/80">
              Personal Wallet by Danish Ahmed KM
            </p>
          </div>
        </div>

        {publicKey && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-primary-foreground/70">
                Wallet Address
              </p>
              <p className="font-mono text-sm font-medium">
                {publicKey.substring(0, 8)}...
                {publicKey.substring(publicKey.length - 8)}
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={disconnectWallet}>
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
