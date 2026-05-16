"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import WalletIntro from "@/components/WalletIntro";
import BalanceDisplay from "@/components/BalanceDisplay";
import SendTransaction from "@/components/SendTransaction";
import AirdropRequest from "@/components/AirdropRequest";
import TokenManagement from "@/components/TokenManagement";
import NetworkSwitcher from "@/components/NetworkSwitcher";
import { useWallet } from "@/contexts/WalletContext";
import Button from "@/components/Button";
import { HelpCircle } from "lucide-react";

export default function Home() {
  const { publicKey } = useWallet();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!publicKey ? (
          <div className="max-w-2xl mx-auto">
            <WalletIntro />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-secondary rounded-lg border border-border p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Welcome, Danish Ahmed KM
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Email: danishahmed012320@yahoo.in
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Manage your SOL and SPL tokens with ease. This wallet is
                    optimized for devnet and testnet development.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help
                </Button>
              </div>

              {showHelp && (
                <div className="mt-4 pt-4 border-t border-border space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <p className="font-semibold text-foreground">💡 Tips:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Use devnet or testnet for testing - never mainnet</li>
                      <li>Request airdrops to test transactions</li>
                      <li>Your keys are stored in browser localStorage</li>
                      <li>Never share your secret key with anyone</li>
                      <li>Refresh balance to see the latest SOL amount</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <BalanceDisplay />
                <SendTransaction />
                <TokenManagement />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <NetworkSwitcher />
                <AirdropRequest />

                {/* Quick Links */}
                <div className="bg-secondary rounded-lg border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Resources
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="https://docs.solana.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      → Solana Docs
                    </a>
                    <a
                      href="https://explorer.solana.com/?cluster=devnet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      → Solana Explorer (Devnet)
                    </a>
                    <a
                      href="https://faucet.solana.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      → Official Faucet
                    </a>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
                  <p className="text-xs text-blue-800 dark:text-blue-100">
                    <strong>ℹ️ Development Only:</strong> This wallet is
                    designed for devnet/testnet development. Do not use with
                    real SOL or on mainnet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6 px-4 text-center text-sm text-gray-500">
        <p>
          Solana Personal Wallet © 2024 • By Danish Ahmed KM • For Development
          Use Only
        </p>
      </footer>
    </main>
  );
}
