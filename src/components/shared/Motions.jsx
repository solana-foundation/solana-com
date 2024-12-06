import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { animations, easeFunctions, durations } from "@/constants/animations";

//
// Base motion wrapper component
//
export const MotionComponent = ({
  animateTrigger = "whenInView", // "variable"
  startAnimation = true,
  inViewProps = {},
  initial = {},
  animate = {},
  transition = {},
  delayIndex = 0, // automated way to delay by an X amount
  delayBase = 0.4,
  delayIncrease = 0.175,
  element = "div",
  children,
  ...props
}) => {
  //
  // Enables triggering animation when component is in view
  //
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
    ...inViewProps,
  });

  if (animateTrigger === "whenInView") {
    startAnimation = inView;
  }

  if (delayIndex) {
    transition = {
      ...transition,
      delay: delayBase + delayIncrease * delayIndex,
    };
  }

  const MotionComponentElement = motion[element];
  return (
    <MotionComponentElement
      ref={ref}
      initial={initial}
      transition={transition}
      animate={startAnimation ? animate : {}}
      {...props}
    >
      {children}
    </MotionComponentElement>
  );
};

//
// Animations
//

//
// SlideIn
//
const slideInTransition = {
  duration: durations.slower,
  ease: easeFunctions.easeInQuart,
};

const slideInAnimations = {
  bottom: {
    initial: animations.fadeScaleSlideOut,
    animate: animations.fadeScaleSlideIn,
  },
  right: {
    initial: animations.fadeScaleSlideOutFromRight,
    animate: animations.fadeScaleSlideInFromRight,
  },
  left: {
    initial: animations.fadeScaleSlideOutFromLeft,
    animate: animations.fadeScaleSlideInFromLeft,
  },
};

export const MotionSlideIn = ({
  transition = {},
  from = "bottom",
  children,
  ...props
}) => {
  const animations = slideInAnimations[from];

  return (
    <MotionComponent
      initial={animations.initial}
      animate={animations.animate}
      transition={{ ...slideInTransition, ...transition }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
