"use client";

import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import { NetworkType } from "@/utils/solana";
import Button from "./Button";

const NetworkSwitcher: React.FC = () => {
  const { network, switchNetwork, publicKey } = useWallet();

  const networks: NetworkType[] = ["devnet", "testnet", "mainnet"];

  if (!publicKey) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Network</p>
      <div className="flex gap-2">
        {networks.map((net) => (
          <Button
            key={net}
            variant={network === net ? "primary" : "secondary"}
            size="sm"
            onClick={() => switchNetwork(net)}
            className="flex-1 capitalize"
          >
            {net}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSwitcher;
