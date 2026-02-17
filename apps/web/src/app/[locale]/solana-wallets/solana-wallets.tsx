"use client";

import WalletsLayout from "@/components/wallets/WalletsLayout";

interface SolanaWalletsPageProps {
  walletData: any[];
}

export function SolanaWalletsPage({ walletData }: SolanaWalletsPageProps) {
  return <WalletsLayout walletData={walletData} />;
}
