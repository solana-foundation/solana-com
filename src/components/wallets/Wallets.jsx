import { useTranslation } from "next-i18next";
import styles from "./Wallets.module.scss";
import Button from "../shared/Button";
import WalletCard from "./WalletCard";

const Wallets = ({ walletData, resetWalletsAndFilters }) => {
  const { t } = useTranslation();

  return (
    <>
      <section className={styles["wallets-section"]}>
        <h2 className={styles["wallets-title"]}>{t("wallets.grid.title")}</h2>
        <div className={styles["wallets-grid"]}>
          {walletData.length ? (
            walletData.map((wallet, key) => {
              return (
                <WalletCard
                  index={key}
                  name={wallet.name}
                  walletImage={wallet.icon.src}
                  body={wallet.body}
                  websiteUrl={wallet.website}
                  key={key}
                />
              );
            })
          ) : (
            <div className={styles["wallets-no-results-container"]}>
              <p className={styles["wallets-no-results-found"]}>
                {t("wallets.grid.no-results")}
              </p>
              <Button
                variant="outline"
                onClick={resetWalletsAndFilters}
                className="ms-2"
              >
                {t("wallets.grid.reset-filters")}
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Wallets;
