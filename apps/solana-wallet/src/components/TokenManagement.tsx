"use client";

import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import Button from "./Button";
import { Card, CardHeader, CardContent } from "./Card";
import { RefreshCw } from "lucide-react";

const TokenManagement: React.FC = () => {
  const { publicKey, tokenAccounts, isLoading, refreshTokens } = useWallet();
  const [expanded, setExpanded] = useState(false);

  if (!publicKey) return null;

  return (
    <Card>
      <CardHeader
        title="Token Accounts"
        description="Your SPL tokens and associated accounts"
      />
      <CardContent className="space-y-4">
        <Button
          variant="secondary"
          onClick={refreshTokens}
          isLoading={isLoading}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Tokens
        </Button>

        {tokenAccounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No token accounts found</p>
            <p className="text-xs mt-2">
              Create or receive SPL tokens to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {tokenAccounts.map((token, idx) => (
              <div
                key={idx}
                className="p-3 rounded border border-border bg-background/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {token.mint.substring(0, 8)}...
                      {token.mint.substring(token.mint.length - 8)}
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {(
                        parseInt(token.amount) / Math.pow(10, token.decimals)
                      ).toFixed(token.decimals)}{" "}
                      tokens
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(token.mint);
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <details
          className="text-xs text-gray-500 cursor-pointer"
          open={expanded}
          onChange={() => setExpanded(!expanded)}
        >
          <summary className="font-medium">Manage Tokens</summary>
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            <p>To create or manage SPL tokens, use:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Solana CLI (spl-token)</li>
              <li>Phantom Wallet</li>
              <li>Magic Eden</li>
            </ul>
          </div>
        </details>
      </CardContent>
    </Card>
  );
};

export default TokenManagement;
