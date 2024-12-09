import { useTranslation } from "next-i18next";

import { walletData } from "../../../data/wallets/wallet-data";

import WalletCard from "./WalletCard";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "./Wallets.module.scss";

const Wallets = ({ filteredWalletData }) => {
  const { t } = useTranslation();

  return (
    <>
      <section className={styles.Wallets}>
        <MotionSlideIn>
          <p className={styles.WalletsCount}>
            {t("solutions-wallets-explorer.showing")}{" "}
            <span className={styles.Count}>
              {filteredWalletData.length} / {walletData.length}
            </span>{" "}
            {t("solutions-wallets-explorer.wallets")}
          </p>
        </MotionSlideIn>

        <div className={styles["wallets-grid"]}>
          {filteredWalletData.length ? (
            filteredWalletData.map((wallet, key) => {
              const { ...walletDataContent } = wallet;

              return (
                <MotionSlideIn key={key}>
                  <WalletCard
                    index={key}
                    name={wallet.name}
                    walletImage={wallet.icon.src}
                    websiteUrl={wallet.website}
                    newToCrypto={wallet.new_to_crypto}
                    developer={wallet.developer}
                    content={walletDataContent}
                  />
                </MotionSlideIn>
              );
            })
          ) : (
            <div
              style={{ paddingTop: "24px" }}
              className={styles["wallets-no-results-container"]}
            >
              <p className={styles["wallets-no-results-found"]}>
                {t("solutions-wallets-explorer.no-results")}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Wallets;
