import RoundedDepthCard from "../shared/RoundedDepthCard";
import { useTranslations } from "next-intl";
import { MetricSourcesFootnote } from "@/component-library/metric-source-note";
import type { DisplayMetric } from "@/lib/metrics/present";

export type ValidatorsCardsProps = {
  /** Values from the shared server-side metrics stream. */
  metrics: {
    validatorCount: DisplayMetric;
    nakamotoCoefficient: DisplayMetric;
  };
};

const ValidatorsCards = ({ metrics }: ValidatorsCardsProps) => {
  const t = useTranslations();
  const cards = [
    {
      metric: metrics.validatorCount,
      label: t("validators.cards.number-text"),
    },
    {
      metric: metrics.nakamotoCoefficient,
      label: t("validators.cards.nakamoto-text"),
    },
  ];

  return (
    <section className="cards mt-4">
      <div className="container">
        <div className="grid grid-cols-12 gap-5 md:gap-10 items-center">
          {cards.map((card, index) => (
            <div
              key={card.metric.key}
              className={
                index === 0
                  ? "col-span-12 lg:col-span-6"
                  : "col-span-12 lg:col-span-6 mt-4 lg:mt-0"
              }
            >
              <RoundedDepthCard className="px-6 py-12" shadow="bottom">
                <div className="h1 text-black">{card.metric.value}</div>
                <p className="text-black m-0">{card.label}</p>
              </RoundedDepthCard>
            </div>
          ))}
        </div>
        <MetricSourcesFootnote
          className="relative z-[1] mt-10 text-white"
          items={cards.map((card) => ({
            label: card.label,
            source: card.metric.source,
          }))}
        />
      </div>
    </section>
  );
};

export default ValidatorsCards;
