import { useState } from "react";
import { Hero } from "@solana-foundation/solana-lib";
import onOffRampHeroImage from "../../../assets/onofframp/on-off-ramp-hero-img.png";
import { useTranslation } from "next-i18next";
import WalletFilters from "./WalletFilters";
import { walletData } from "../../data/wallets/wallet-data";
import { walletFiltersData } from "../../data/wallets/wallet-filters";

const WalletsLayout = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({});
  const [wallets, setWallets] = useState(walletData);

  const updateWalletsBasedOnFilters = (filters) => {
    if (Object.keys(filters).length !== 0) {
      // Only return wallets that match every key/value pair inside the filters object
      const updatedWallets = walletData.filter((obj) =>
        Object.keys(filters).every((key) => obj[key] === filters[key]),
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
