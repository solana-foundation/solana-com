import RoundedDepthCard from "../shared/RoundedDepthCard";
import { FormattedNumber } from "../SolFormattedMessage";
import { useTranslations } from "next-intl";
import {
  PERF_UPDATE_SEC,
  SAMPLE_HISTORY_HOURS,
  useTransactionStats,
} from "../../hooks/useTransactionStats";
import { MetricSourceNote } from "@/component-library/metric-source-note";
import type { DisplayMetric } from "@/lib/metrics/present";

const RPC_SOURCE = {
  name: "Solana mainnet RPC",
  href: "https://solana.com/docs/rpc/http/getvoteaccounts",
};

export type ValidatorsCardsProps = {
  visible: boolean;
  /** Dated registry values shown until, or instead of, the live RPC read. */
  fallback: {
    validatorCount: DisplayMetric;
    nakamotoCoefficient: DisplayMetric;
  };
};

const ValidatorsCards = ({ visible, fallback }: ValidatorsCardsProps) => {
  const { validators, superminority } = useTransactionStats({
    visible,
    performanceUpdateSeconds: PERF_UPDATE_SEC,
    sampleHistoryHours: SAMPLE_HISTORY_HOURS,
  });
  const t = useTranslations();
  const liveLabel = t("metrics.period.live");
  const cards = [
    {
      live: validators > 0 ? validators : null,
      fallback: fallback.validatorCount,
      label: t("validators.cards.number-text"),
    },
    {
      live: superminority && superminority > 0 ? superminority : null,
      fallback: fallback.nakamotoCoefficient,
      label: t("validators.cards.nakamoto-text"),
    },
  ];

  return (
    <section className="cards mt-4">
      <div className="container">
        <div className="grid grid-cols-12 gap-5 md:gap-10 items-center">
          {cards.map((card, index) => (
            <div
              key={card.fallback.key}
              className={
                index === 0
                  ? "col-span-12 lg:col-span-6"
                  : "col-span-12 lg:col-span-6 mt-4 lg:mt-0"
              }
            >
              <RoundedDepthCard className="px-6 py-12" shadow="bottom">
                <div className="h1 text-black">
                  {card.live !== null ? (
                    <FormattedNumber value={card.live} />
                  ) : (
                    card.fallback.value
                  )}
                </div>
                <p className="text-black m-0">{card.label}</p>
                <MetricSourceNote
                  className="text-black"
                  {...(card.live !== null
                    ? { ...RPC_SOURCE, period: liveLabel, status: "live" }
                    : card.fallback.source)}
                />
              </RoundedDepthCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValidatorsCards;
