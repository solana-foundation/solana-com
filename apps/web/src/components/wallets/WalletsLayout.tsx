import { useState } from "react";
import { Hero } from "@solana-foundation/solana-lib";
import onOffRampHeroImage from "../../../assets/onofframp/on-off-ramp-hero-img.png";
import { useTranslations } from "next-intl";
import WalletFilters from "./WalletFilters";
import { walletFiltersData } from "../../data/wallets/wallet-filters";
import type { walletData } from "../../data/wallets/wallet-data";

type WalletEntry = (typeof walletData)[number];

interface WalletsLayoutProps {
  walletData: WalletEntry[];
}

const WalletsLayout = ({ walletData }: WalletsLayoutProps) => {
  const t = useTranslations();

  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const [wallets, setWallets] = useState(walletData);

  const updateWalletsBasedOnFilters = (filters: Record<string, boolean>) => {
    if (Object.keys(filters).length !== 0) {
      // Only return wallets that match every key/value pair inside the filters object
      const updatedWallets = walletData.filter((obj) =>
        Object.keys(filters).every(
          (key) => (obj as Record<string, unknown>)[key] === filters[key],
        ),
      );

      setWallets(updatedWallets);
    } else {
      setWallets(walletData);
    }
  };

  return (
    <>
      <Hero
        eyebrow={t("wallets.hero.eyebrow")}
        headline={t("wallets.hero.headline")}
        headingAs="h1"
        body={`<p>${t("wallets.hero.body")}</p>`}
        image={onOffRampHeroImage}
        centered={false}
        // @ts-ignore Check if it exists in @solana-foundation/solana-lib after the upstream fix.
        newsletter={false}
      />
      <WalletFilters
        filterData={walletFiltersData}
        currentFilters={filters}
        setFilters={setFilters}
        updateWallets={updateWalletsBasedOnFilters}
        walletData={wallets}
      />
    </>
  );
};

export default WalletsLayout;
