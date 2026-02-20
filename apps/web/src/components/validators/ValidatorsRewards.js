import { useTranslations } from "next-intl";
import Button from "../shared/Button";

const ValidatorsRewards = () => {
  const t = useTranslations();

  return (
    <section className="mt-[4.5rem]">
      <div className="container">
        <h2 className="mb-4 md:mb-10">{t("validators.rewards.header")}</h2>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] mt-1 md:mt-3 min-[992px]:gap-6">
          <div className="p-4 bg-[#eb54bc] rounded-[12px] flex flex-col min-h-[300px] min-[567px]:py-5 min-[567px]:min-h-[350px]">
            <h3 className="text-black mb-2 md:mb-4">
              {t("validators.rewards.cards.protocol-header")}
            </h3>
            <p className="small text-black">
              {t("validators.rewards.cards.protocol-text")}
            </p>
          </div>

          <div className="p-4 bg-[#eb54bc] rounded-[12px] flex flex-col min-h-[300px] min-[567px]:py-5 min-[567px]:min-h-[350px] justify-between">
            <div>
              <h3 className="text-black mb-2 md:mb-4">
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

          <div className="p-4 bg-[#eb54bc] rounded-[12px] flex flex-col min-h-[300px] min-[567px]:py-5 min-[567px]:min-h-[350px] justify-between">
            <div>
              <h3 className="text-black mb-2 md:mb-4">
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
