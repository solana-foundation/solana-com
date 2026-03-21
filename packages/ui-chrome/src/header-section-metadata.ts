import type { NavTopLevelSectionMetadata } from "./nav-types";

export const HEADER_SECTION_METADATA: Array<
  Omit<NavTopLevelSectionMetadata, "mobileIcon" | "Content">
> = [
  {
    id: "learn",
    titleKey: "nav.learn.title",
    matchRules: [
      { type: "includes", value: "/learn" },
      { type: "equals", value: "/environment" },
      { type: "includes", value: "/universities" },
    ],
    contentAlign: "left",
  },
  {
    id: "developers",
    titleKey: "nav.developers.title",
    matchRules: [
      { type: "includes", value: "/developers" },
      { type: "includes", value: "/docs" },
      { type: "equals", value: "/hackathon" },
    ],
    contentAlign: "left",
  },
  {
    id: "solutions",
    titleKey: "nav.solutions.title",
    matchRules: [
      { type: "includes", value: "/solutions" },
      { type: "includes", value: "/wallets" },
      { type: "includes", value: "/solana-wallets" },
      { type: "includes", value: "/ai" },
    ],
    contentAlign: "left",
    contentClassName: "xl:overflow-y-auto xl:max-h-[90vh]",
  },
  {
    id: "network",
    titleKey: "nav.network.title",
    matchRules: [
      { type: "equals", value: "/validators" },
      { type: "equals", value: "/rpc" },
      { type: "equals", value: "/solanaramp" },
    ],
    contentAlign: "left",
  },
  {
    id: "community",
    titleKey: "nav.community.title",
    matchRules: [
      { type: "equals", value: "/community" },
      { type: "includes", value: "/events" },
      { type: "equals", value: "/breakpoint" },
      { type: "equals", value: "/news" },
      { type: "includes", value: "/podcasts" },
    ],
    contentAlign: "center",
  },
];
