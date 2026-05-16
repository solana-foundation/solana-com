"use client";

import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardHeader, CardContent } from "./Card";
import Button from "./Button";
import { RefreshCw } from "lucide-react";

const BalanceDisplay: React.FC = () => {
  const { solBalance, isLoading, refreshBalance } = useWallet();

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardHeader
        title="SOL Balance"
        description={`Your current balance on the selected network`}
      />
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-primary">
          {isLoading ? (
            <div className="inline-block animate-pulse">Loading...</div>
          ) : (
            `${solBalance.toFixed(4)} SOL`
          )}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          ≈ ${(solBalance * 150).toFixed(2)} USD (estimated)
        </div>

        <Button
          variant="secondary"
          onClick={refreshBalance}
          isLoading={isLoading}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Balance
        </Button>
      </CardContent>
    </Card>
  );
};

export default BalanceDisplay;
