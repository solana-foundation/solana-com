"use client";

import WalletsLayout from "@/components/wallets/WalletsLayout";

interface SolanaWalletsPageProps {
  walletData: React.ComponentProps<typeof WalletsLayout>["walletData"];
}

export function SolanaWalletsPage({ walletData }: SolanaWalletsPageProps) {
  return <WalletsLayout walletData={walletData} />;
}
