import { useTranslations } from "next-intl";
import { clsx as classNames } from "clsx";
import Link from "../../utils/Link";
import Image from "next/image";
import GlowLines from "../../../public/src/img/index/glow-lines.jpg";

import { LoaderLines as Loader } from "@boxicons/react/LoaderLines";
import {
  PERF_UPDATE_SEC,
  SAMPLE_HISTORY_HOURS,
  useTransactionStats,
} from "../../hooks/useTransactionStats";
import { FormattedNumber } from "../SolFormattedMessage";
import AnimatedTransactionCountup from "../shared/AnimatedTransactionCountup";
import { MetricSourcesFootnote } from "@/component-library/metric-source-note";
import type { DisplayMetric } from "@/lib/metrics/present";

/** Small dot before live figures. */
const liveDotClass =
  "relative !leading-none pl-[10px] before:absolute before:left-0 before:top-0 before:h-[5px] before:w-[5px] before:rounded-full before:bg-[#1fcff1] before:content-['']";

type StatsCardProps = {
  title: string;
  description: React.ReactNode;
  value: React.ReactNode;
  valueName: string;
  border: string;
  /** Real-time counter: marked with the live dot. */
  live: boolean;
  className?: string;
};

const StatsCard = ({
  title,
  description,
  value,
  valueName,
  border,
  live,
  className,
}: StatsCardProps) => {
  return (
    <div className={`col-span-12 md:col-span-6 mb-2 ${className ?? ""}`}>
      <div className="rounded-[24px] border border-solid border-[#19161c] bg-black/40 p-8 backdrop-blur-[20px] md:border-0 md:bg-black/[0.28]">
        <h3
          className="h5 mb-4 border-0 border-l-2 border-solid pl-[15px]"
          style={{ borderColor: border }}
        >
          {title}
        </h3>
        <p className="small subdued">{description}</p>
        <div className="mt-8">
          <div
            className={classNames(
              "h5 font-normal",
              live ? liveDotClass : "leading-none",
            )}
          >
            {value}
          </div>
          <div className="smaller uppercase subdued font-brand-mono">
            {valueName}
          </div>
        </div>
      </div>
    </div>
  );
};

type PossibleStatsProps = {
  visible: boolean;
  /** Registry figure for the net carbon impact card. */
  carbonMetric: DisplayMetric;
};

const PossibleStats = ({ visible, carbonMetric }: PossibleStatsProps) => {
  const {
    avgTps,
    validators,
    totalTransactionCount,
    availableStats,
    unavailable,
  } = useTransactionStats({
    visible,
    performanceUpdateSeconds: PERF_UPDATE_SEC,
    sampleHistoryHours: SAMPLE_HISTORY_HOURS,
    getLiveTransactionCount: true,
  });

  const t = useTranslations();

  return (
    <div className="relative overflow-hidden py-[125px] after:absolute after:left-0 after:top-0 after:h-[125px] after:w-full after:bg-[linear-gradient(black,rgba(0,0,0,0)_80%)] after:content-['']">
      <div className="absolute -z-10 h-full w-full min-[1400px]:top-0">
        <Image src={GlowLines} alt="" fill className="object-cover" />
      </div>
      <div className="container">
        <div className="grid grid-cols-12 gap-5 md:gap-10 pt-16 mt-16">
          <div className="col-span-12 lg:col-span-4">
            <div className="mb-12 lg:mb-0">
              <h2 className="h4 mb-4 text-balance">
                {t("possible.stats.headline-secondary")}
              </h2>
              <div
                className={classNames(
                  "smaller uppercase subdued font-brand-mono",
                  liveDotClass,
                )}
              >
                {t("possible.stats.live")}
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-12 gap-5 md:gap-10">
              <StatsCard
                title={t("possible.stats.adoption.fast.title")}
                description={t("possible.stats.adoption.fast.description")}
                value={
                  availableStats ? (
                    <FormattedNumber value={avgTps} />
                  ) : unavailable ? (
                    <span>—</span>
                  ) : (
                    <Loader className="animate-spin" aria-hidden="true" />
                  )
                }
                valueName={t("possible.stats.transactions")}
                border="#1FCFF1"
                live
              />
              <StatsCard
                title={t("possible.stats.adoption.decentralized.title")}
                description={t(
                  "possible.stats.adoption.decentralized.description",
                )}
                value={
                  availableStats ? (
                    <FormattedNumber value={validators} />
                  ) : unavailable ? (
                    <span>—</span>
                  ) : (
                    <Loader className="animate-spin" aria-hidden="true" />
                  )
                }
                valueName={t("possible.stats.validators")}
                border="#FFD512"
                live
                className="lg:-mt-20"
              />
              <StatsCard
                title={t("possible.stats.adoption.scalable.title")}
                description={t("possible.stats.adoption.scalable.description")}
                value={
                  availableStats ? (
                    <AnimatedTransactionCountup
                      info={{ avgTPS: avgTps, totalTransactionCount }}
                      perfUpdateSec={PERF_UPDATE_SEC}
                    />
                  ) : unavailable ? (
                    <span>—</span>
                  ) : (
                    <Loader className="animate-spin" aria-hidden="true" />
                  )
                }
                valueName={t("possible.stats.totaltransactions")}
                border="#9945FF"
                live
              />
              <StatsCard
                title={t("possible.stats.adoption.energy.title")}
                description={t.rich(
                  "possible.stats.adoption.energy.description",
                  {
                    envLink: (chunks) => (
                      <Link to="/environment">{chunks}</Link>
                    ),
                  },
                )}
                value={carbonMetric.value}
                valueName={t("possible.stats.carbon")}
                border="#19FB9B"
                live={false}
                className="lg:-mt-12"
              />
            </div>
            <MetricSourcesFootnote
              className="mt-4"
              items={[
                {
                  label: t("possible.stats.carbon"),
                  source: carbonMetric.source,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PossibleStats;
