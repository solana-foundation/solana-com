"use client";

import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import Button from "./Button";
import Alert from "./Alert";
import { Card, CardHeader, CardContent } from "./Card";
import { requestAirdrop } from "@/utils/solana";
import { Gift } from "lucide-react";

const AirdropRequest: React.FC = () => {
  const { publicKey, network, refreshBalance } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAirdrop = async () => {
    if (!publicKey) return;

    if (network === "mainnet") {
      setError("Airdrops are not available on mainnet");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const signature = await requestAirdrop(publicKey, 2, network);
      if (signature) {
        setSuccess(`Airdrop requested! You should receive 2 SOL shortly.`);
        setTimeout(() => refreshBalance(), 2000);
      } else {
        setError("Airdrop request failed. Try again later.");
      }
    } catch {
      setError("An error occurred while requesting airdrop");
    } finally {
      setIsLoading(false);
    }
  };

  if (!publicKey) return null;

  return (
    <Card>
      <CardHeader
        title="Request Airdrop"
        description="Get free SOL for testing (devnet/testnet only)"
      />
      <CardContent className="space-y-4">
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        {network === "mainnet" ? (
          <Alert
            type="warning"
            title="Not Available on Mainnet"
            message="Airdrops are only available on devnet and testnet"
          />
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Request 2 SOL to test transactions on {network}.
            </p>
            <Button
              variant="primary"
              onClick={handleAirdrop}
              isLoading={isLoading}
              className="w-full"
            >
              <Gift className="h-4 w-4 mr-2" />
              Request 2 SOL Airdrop
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AirdropRequest;
