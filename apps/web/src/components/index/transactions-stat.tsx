import Loader from "@@/public/src/img/icons/Loader.inline.svg";
import {
  PERF_UPDATE_SEC,
  SAMPLE_HISTORY_HOURS,
  useTransactionStats,
} from "@/hooks/useTransactionStats";
import AnimatedTransactionCountup from "../shared/AnimatedTransactionCountup";
import { useInView } from "react-intersection-observer";
import { FormattedNumber } from "@/components/SolFormattedMessage";

interface TransactionsStatProps {
  variant?: "total" | "per-sec";
}

export const TransactionsStat: React.FC<TransactionsStatProps> = ({
  variant = "total",
}) => {
  const [statsRef, statsInView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const { avgTps, totalTransactionCount, availableStats } = useTransactionStats(
    {
      visible: statsInView,
      performanceUpdateSeconds: PERF_UPDATE_SEC,
      sampleHistoryHours: SAMPLE_HISTORY_HOURS,
      getLiveTransactionCount: true,
    },
  );

  if (variant === "per-sec") {
    return (
      <span className="tabular-nums" ref={statsRef}>
        {availableStats ? <FormattedNumber value={avgTps} /> : <Loader />}
      </span>
    );
  }

  return (
    <span className="tabular-nums" ref={statsRef}>
      {availableStats ? (
        <AnimatedTransactionCountup
          info={{ avgTPS: avgTps, totalTransactionCount }}
          perfUpdateSec={PERF_UPDATE_SEC}
        />
      ) : (
        <Loader />
      )}
    </span>
  );
};
