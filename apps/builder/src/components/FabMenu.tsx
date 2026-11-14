"use client";

import { DEFAULT_MENU_DATA, SolanaFabMenu } from "@solana-foundation/fab-menu";

type Props = {
  /**
   * Show the menu data bundled with this build instead of requesting it from
   * solana.com. Set outside production, where the live endpoint still serves
   * the menu from the last production deploy.
   */
  bundled?: boolean;
};

export function FabMenu({ bundled = false }: Props) {
  return (
    <div className="builder-fab">
      <SolanaFabMenu
        position="bottom-right"
        logoVariant="color"
        zIndex={20}
        data={bundled ? DEFAULT_MENU_DATA : undefined}
      />
    </div>
  );
}
