import { useRef } from "react";
import CountUp from "react-countup";

// export type PerformanceInfo = StructType<typeof PerformanceInfo>;
// type PerformanceState = { info: PerformanceInfo | undefined };
// // const PerformanceContext = createContext<PerformanceState | undefined>(
// //   undefined
// // );

const AnimatedTransactionCount = ({ info, perfUpdateSec }) => {
  const txCountRef = useRef(0);
  const countUpRef = useRef({ start: 0, period: 0, lastUpdate: 0 });
  const countUp = countUpRef.current;

  const { totalTransactionCount: txCount, avgTPS } = info;

  // Track last tx count to reset count up options
  if (txCount !== txCountRef.current) {
    if (countUp.lastUpdate > 0) {
      // Since we overshoot below, calculate the elapsed value
      // and start from there.
      const elapsed = Date.now() - countUp.lastUpdate;
      const elapsedPeriods = elapsed / (perfUpdateSec * 1000);
      countUp.start = countUp.start + elapsedPeriods * countUp.period;
      countUp.period = txCount - countUp.start;
    } else {
      // Since this is the first tx count value, estimate the previous
      // tx count in order to have a starting point for our animation
      countUp.period = perfUpdateSec * avgTPS;
      countUp.start = txCount - countUp.period;
    }
    countUp.lastUpdate = Date.now();
    txCountRef.current = txCount;
  }

  // Overshoot the target tx count in case the next update is delayed
  const COUNT_PERIODS = 5;
  const countUpEnd = countUp.start + countUp.period + COUNT_PERIODS;
  return (
    <CountUp
      start={countUp.start}
      end={countUpEnd}
      duration={perfUpdateSec + COUNT_PERIODS}
      delay={0}
      useEasing={false}
      preserveValue={true}
      separator=","
    />
  );
};

export default AnimatedTransactionCount;
