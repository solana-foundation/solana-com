import { useRef } from "react";
import { useCountUp } from "react-countup";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";

/**
 * Displays refurbished "continuous" transaction count.
 *
 * @param info
 * @param perfUpdateSec
 * @returns {JSX.Element}
 * @constructor
 */
const AnimatedTransactionCountup = ({ info, perfUpdateSec }) => {
  const countUpRef = useRef(null);
  const { totalTransactionCount, avgTPS } = info;
  const { update } = useCountUp({
    ref: countUpRef,
    start: totalTransactionCount,
    end: totalTransactionCount + avgTPS * perfUpdateSec,
    delay: 0,
    duration: perfUpdateSec + 2,
    startOnMount: true,
    preserveValue: true,
    separator: ",",
  });

  useIsomorphicLayoutEffect(() => {
    if (countUpRef.current) {
      update(totalTransactionCount + avgTPS * perfUpdateSec);
    }
  }, [countUpRef, totalTransactionCount]);
  return <span ref={countUpRef} />;
};
export default AnimatedTransactionCountup;
