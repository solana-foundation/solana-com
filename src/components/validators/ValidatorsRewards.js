import { useTranslation } from "next-i18next";
import Button from "../shared/Button";

const ValidatorsRewards = () => {
  const { t } = useTranslation();

  return (
    <section className="rewards">
      <div className="container">
        <h2 className="mb-4 mb-md-7">{t("validators.rewards.header")}</h2>
        <div className="rewards-cards mt-1 mt-md-3">
          <div className="rewards-card">
            <h3 className="text-black mb-2 mb-md-4">
              {t("validators.rewards.cards.protocol-header")}
            </h3>
            <p className="small text-black">
              {t("validators.rewards.cards.protocol-text")}
            </p>
          </div>

          <div className="rewards-card justify-content-between">
            <div>
              <h3 className="text-black mb-2 mb-md-4">
                {t("validators.rewards.cards.staking-header")}
              </h3>
              <p className="small text-black">
                {t("validators.rewards.cards.staking-text")}
              </p>
            </div>
            <Button
              to="/staking"
              variant="transparent"
              aria-label="Read about Stake Pools"
              arrow={true}
            >
              {t("commands.learn")}
            </Button>
          </div>

          <div className="rewards-card justify-content-between">
            <div>
              <h3 className="text-black mb-2 mb-md-4">
                {t("validators.rewards.cards.stake-pool-header")}
              </h3>
              <p className="small text-black">
                {t("validators.rewards.cards.stake-pool-text")}
              </p>
            </div>
            <Button
              to="https://spl.solana.com/stake-pool"
              variant="transparent"
              aria-label="Read about Stake Pools"
              newTab
              arrow={true}
            >
              {t("commands.learn")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidatorsRewards;
