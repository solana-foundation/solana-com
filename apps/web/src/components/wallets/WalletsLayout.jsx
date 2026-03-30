import { useState } from "react";
import { Hero } from "@solana-foundation/solana-lib";
import onOffRampHeroImage from "../../../assets/onofframp/on-off-ramp-hero-img.png";
import { useTranslations } from "next-intl";
import WalletFilters from "./WalletFilters";
import { walletFiltersData } from "../../data/wallets/wallet-filters";

const WalletsLayout = ({ walletData }) => {
  const t = useTranslations();

  const [filters, setFilters] = useState({});
  const [category, setCategory] = useState("all");
  const [wallets, setWallets] = useState(walletData);

  const applyFilters = (activeFilters, activeCategory) => {
    let filtered = walletData;

    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter((w) => w.category === activeCategory);
    }

    // Apply feature filters
    if (Object.keys(activeFilters).length !== 0) {
      filtered = filtered.filter((obj) =>
        Object.keys(activeFilters).every(
          (key) => obj[key] === activeFilters[key],
        ),
      );
    }

    setWallets(filtered);
  };

  const updateWalletsBasedOnFilters = (activeFilters) => {
    applyFilters(activeFilters, category);
  };

  const updateCategory = (newCategory) => {
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
