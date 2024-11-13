export const animations = {
  fadeScaleSlideIn: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  fadeScaleSlideOut: {
    opacity: 0,
    y: 25,
    scale: 0.98,
  },
  fadeScaleSlideInFromRight: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  fadeScaleSlideOutFromRight: {
    opacity: 0,
    x: 25,
    scale: 0.98,
  },
  fadeScaleSlideInFromLeft: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  fadeScaleSlideOutFromLeft: {
    opacity: 0,
    x: -25,
    scale: 0.98,
  },
};

// https://easings.net/
export const easeFunctions = {
  easeInQuart: [0.25, 1, 0.5, 1],
  easeOutQuad: [0.5, 1, 0.89, 1],
  standard: [0.25, 1, 0.5, 1],
};

export const durations = {
  instant: 0.05,
  shortest: 0.15,
  shorter: 0.2,
  short: 0.25,
  standard: 0.4,
  slow: 0.5,
  slower: 0.75,
  slowest: 0.85,
};
