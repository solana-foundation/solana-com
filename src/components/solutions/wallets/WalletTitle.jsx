import classNames from "classnames";
import { Trans } from "next-i18next";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { animations, easeFunctions, durations } from "@/constants/animations";

const transition = {
  duration: durations.slower,
  ease: easeFunctions.easeInQuart,
};

const WalletTitle = ({ styleName, text }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  return (
    <motion.div
      ref={ref}
      className={classNames(styleName, "page-width")}
      initial={animations.fadeScaleSlideOut}
      animate={inView ? animations.fadeScaleSlideIn : {}}
      transition={{ ...transition, delay: 0.5 }}
    >
      <h2>
        <Trans i18nKey={text} />
      </h2>
    </motion.div>
  );
};

export default WalletTitle;
