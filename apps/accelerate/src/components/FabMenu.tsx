"use client";

import { SolanaFabMenu } from "@solana-foundation/fab-menu";

export function FabMenu() {
  return (
    <div className="accelerate-fab">
      <SolanaFabMenu position="bottom-right" logoVariant="color" zIndex={20} />
    </div>
  );
}
