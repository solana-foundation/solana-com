"use client";

import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import { Card, CardHeader, CardContent } from "./Card";
import { getWalletFromStorage } from "@/utils/storage";
import { sendTransaction, isValidPublicKey } from "@/utils/solana";
import { Send } from "lucide-react";

const SendTransactionComponent: React.FC = () => {
  const { publicKey, network, refreshBalance } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!recipient.trim()) {
      setError("Please enter a recipient address");
      return;
    }

    if (!isValidPublicKey(recipient)) {
      setError("Invalid recipient address");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const wallet = getWalletFromStorage();
    if (!wallet) {
      setError("Wallet not found");
      return;
    }

    setIsLoading(true);
    try {
      const signature = await sendTransaction(
        wallet.secretKey,
        recipient,
        parseFloat(amount),
        network,
      );

      if (signature) {
        setSuccess(`Transaction sent! Signature: ${signature}`);
        setRecipient("");
        setAmount("");
        await refreshBalance();
      } else {
        setError("Failed to send transaction");
      }
    } catch {
      setError("An error occurred while sending the transaction");
    } finally {
      setIsLoading(false);
    }
  };

  if (!publicKey) return null;

  return (
    <Card>
      <CardHeader
        title="Send SOL"
        description="Transfer SOL to another wallet"
      />
      <CardContent>
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

        <form onSubmit={handleSend} className="space-y-4">
          <Input
            label="Recipient Address"
            placeholder="Enter recipient public key"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />

          <Input
            label="Amount (SOL)"
            placeholder="0.0"
            type="number"
            step="0.0001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Transaction
          </Button>

          {network !== "mainnet" && (
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Currently on {network} (test network)
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default SendTransactionComponent;
