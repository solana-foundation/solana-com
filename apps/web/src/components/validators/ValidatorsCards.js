import Loader from "../../../public/src/img/icons/Loader.inline.svg";
import RoundedDepthCard from "../shared/RoundedDepthCard";
import { FormattedNumber } from "../SolFormattedMessage";
import { useTranslations } from "next-intl";
import {
  PERF_UPDATE_SEC,
  SAMPLE_HISTORY_HOURS,
  useTransactionStats,
} from "../../hooks/useTransactionStats";

const ValidatorsCards = ({ visible }) => {
  const { validators, availableStats, superminority } = useTransactionStats({
    visible,
    performanceUpdateSeconds: PERF_UPDATE_SEC,
    sampleHistoryHours: SAMPLE_HISTORY_HOURS,
  });
  const t = useTranslations();

  return (
    <section className="cards mt-4">
      <div className="container">
        <div className="grid grid-cols-12 gap-5 md:gap-10 items-center">
          <div className="col-span-12 lg:col-span-6">
            <RoundedDepthCard className="px-6 py-12" shadow="bottom">
              <div className="h1 text-black">
                {availableStats ? (
                  <FormattedNumber value={validators} />
                ) : (
                  <Loader />
                )}
              </div>
              <p className="text-black m-0">
                {t("validators.cards.number-text")}
              </p>
            </RoundedDepthCard>
          </div>
          <div className="col-span-12 lg:col-span-6 mt-4 lg:mt-0">
            <RoundedDepthCard className="px-6 py-12" shadow="bottom">
              <div className="h1 text-black">
                {superminority !== null ? (
                  <FormattedNumber value={superminority} />
                ) : (
                  <Loader />
                )}
              </div>
              <p className="text-black m-0">
                {t("validators.cards.nakamoto-text")}
              </p>
            </RoundedDepthCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidatorsCards;
