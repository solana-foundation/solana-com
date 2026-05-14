import { useRef } from "react";
import { useCountUp } from "react-countup";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";

interface AnimatedTransactionCountupProps {
  info: {
    totalTransactionCount: number;
    avgTPS: number;
  };
  perfUpdateSec: number;
}

/**
 * Displays refurbished "continuous" transaction count.
 */
const AnimatedTransactionCountup: React.FC<AnimatedTransactionCountupProps> = ({
  info,
  perfUpdateSec,
}) => {
  const countUpRef = useRef<HTMLElement | null>(null);
  const { totalTransactionCount, avgTPS } = info;
  const { update } = useCountUp({
    ref: countUpRef as React.RefObject<HTMLElement>,
    start: totalTransactionCount,
    end: totalTransactionCount + avgTPS * perfUpdateSec,
    delay: 0,
    duration: perfUpdateSec + 2,
    startOnMount: true,
    separator: ",",
  });

  useIsomorphicLayoutEffect(() => {
    if (countUpRef.current) {
      update(totalTransactionCount + avgTPS * perfUpdateSec);
    }
  }, [totalTransactionCount, avgTPS, perfUpdateSec, update]);
  return <span ref={countUpRef} />;
};

export default AnimatedTransactionCountup;
