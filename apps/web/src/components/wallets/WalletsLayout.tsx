import { useState } from "react";
import { Hero } from "@solana-foundation/solana-lib";
import onOffRampHeroImage from "../../../assets/onofframp/on-off-ramp-hero-img.png";
import { useTranslations } from "next-intl";
import WalletFilters, { WalletFiltersProps } from "./WalletFilters";
import { walletFiltersData } from "../../data/wallets/wallet-filters";
import type { walletData } from "../../data/wallets/wallet-data";

type WalletEntry = (typeof walletData)[number];

interface WalletsLayoutProps {
  walletData: WalletEntry[];
}

const WalletsLayout = ({ walletData }: WalletsLayoutProps) => {
  const t = useTranslations();

  const [filters, setFilters] = useState<Record<string, boolean>>({});
  const [category, setCategory] =
    useState<WalletFiltersProps["category"]>("all");
  const [wallets, setWallets] = useState(walletData);

  const applyFilters = (
    activeFilters: Record<string, boolean>,
    activeCategory: WalletFiltersProps["category"],
  ) => {
    let filtered = walletData;

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter((w) => w.category === activeCategory);
    }

    // Apply feature filters
    if (Object.keys(activeFilters).length !== 0) {
      filtered = filtered.filter((obj) =>
        Object.keys(activeFilters).every(
          (key) => (obj as Record<string, unknown>)[key] === activeFilters[key],
        ),
      );
    }

    setWallets(filtered);
  };

  const updateWalletsBasedOnFilters = (
    activeFilters: Record<string, boolean>,
  ) => {
    applyFilters(activeFilters, category);
  };

  const updateCategory = (newCategory: WalletFiltersProps["category"]) => {
    setCategory(newCategory);
    applyFilters(filters, newCategory);
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
        // @ts-expect-error Check if it exists in @solana-foundation/solana-lib after the upstream fix.
        newsletter={false}
      />
      <WalletFilters
        filterData={walletFiltersData}
        currentFilters={filters}
        setFilters={setFilters}
        updateWallets={updateWalletsBasedOnFilters}
        walletData={wallets}
        category={category}
        updateCategory={updateCategory}
      />
    </>
  );
};

export default WalletsLayout;
