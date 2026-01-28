export const META = {
  seoImage: "",
};

export const STAKING_OVERVIEW_ACCORDION_KEYS = Array.from(
  { length: 12 },
  (_, index) => ({
    titleKey: `sections.overview.items.${index}.title`,
    bodyKey: `sections.overview.items.${index}.body`,
  }),
);

export const STAKING_REWARDS_ACCORDION_KEYS = Array.from(
  { length: 4 },
  (_, index) => ({
    titleKey: `sections.rewards.items.${index}.title`,
    bodyKey: `sections.rewards.items.${index}.body`,
  }),
);

export const STAKING_ECONOMICS_ACCORDION_KEYS = Array.from(
  { length: 3 },
  (_, index) => ({
    titleKey: `sections.economics.items.${index}.title`,
    bodyKey: `sections.economics.items.${index}.body`,
  }),
);
