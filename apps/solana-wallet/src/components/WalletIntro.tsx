"use client";

import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import { Card, CardHeader, CardContent } from "./Card";
import { Copy, Eye, EyeOff } from "lucide-react";
import { getWalletFromStorage } from "@/utils/storage";

const WalletIntro: React.FC = () => {
  const { publicKey, createNewWallet, importWallet } = useWallet();
  const [showImport, setShowImport] = useState(false);
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const handleCreateNew = () => {
    createNewWallet();
    setSuccess("New wallet created successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleImport = () => {
    if (!secretKeyInput.trim()) {
      setError("Please enter a secret key");
      return;
    }
    if (importWallet(secretKeyInput)) {
      setSuccess("Wallet imported successfully!");
      setSecretKeyInput("");
      setShowImport(false);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError("Invalid secret key format");
      setTimeout(() => setError(""), 3000);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const storedWallet = getWalletFromStorage();

  if (!publicKey) {
    return (
      <div className="space-y-6">
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

        <Card>
          <CardHeader
            title="Welcome to Solana Wallet"
            description="Import or create a new wallet to get started"
          />
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This is a development wallet for devnet and testnet testing only.{" "}
              <strong>DO NOT</strong> use with real SOL or mainnet.
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleCreateNew}
                className="flex-1"
              >
                Create New Wallet
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowImport(!showImport)}
                className="flex-1"
              >
                {showImport ? "Cancel" : "Import Wallet"}
              </Button>
            </div>

            {showImport && (
              <div className="space-y-3 pt-4 border-t border-border">
                <Input
                  label="Secret Key (Base58)"
                  placeholder="Paste your secret key here"
                  value={secretKeyInput}
                  onChange={(e) => setSecretKeyInput(e.target.value)}
                  type="password"
                />
                <Button
                  variant="primary"
                  onClick={handleImport}
                  className="w-full"
                >
                  Import
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Wallet Details"
        description="Your public and secret keys"
      />
      <CardContent className="space-y-4">
        <Alert
          type="warning"
          title="Security Warning"
          message="Never share your secret key with anyone. This wallet stores keys in browser localStorage - suitable only for development."
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Public Key
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={publicKey}
              readOnly
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => copyToClipboard(publicKey, "Public Key")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {copiedText === "Public Key" && (
            <p className="text-xs text-green-600 mt-1">Copied!</p>
          )}
        </div>

        {storedWallet && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Secret Key
            </label>
            <div className="flex gap-2">
              <input
                type={showSecret ? "text" : "password"}
                value={storedWallet.secretKey}
                readOnly
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono"
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  copyToClipboard(storedWallet.secretKey, "Secret Key")
                }
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copiedText === "Secret Key" && (
              <p className="text-xs text-green-600 mt-1">Copied!</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletIntro;
