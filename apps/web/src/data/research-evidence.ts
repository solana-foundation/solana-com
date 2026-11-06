// Reports each research section links to.
export const RESEARCH_SOURCES = {
  networkHealth: {
    title: "Solana Network Health Report",
    date: "June 2025",
    href: "https://solana.com/news/network-health-report-june-2025",
  },
  energyImpact: {
    title: "Energy Impact Report",
    date: "September 2024",
    href: "https://solana.com/news/energy-use-report-september-2024",
  },
  climateDashboard: {
    title: "Solana Climate Dashboard",
    href: "https://climate.solana.com/",
  },
  slotTime: {
    title: "Slot Time Reduction Effects",
    date: "September 2026",
    href: "https://solana.com/news/slot-time-reduction-effects",
  },
} as const;

// Each figure is a registry key (src/data/metrics), which holds its value,
// date, and source. Report figures are dated snapshots; energy reads live
// from the Solana Climate Dashboard.
export const RESEARCH_METRICS = {
  validator: [
    { key: "research.consensus-validators-2025", label: "validators" },
    { key: "research.nakamoto-coefficient-2025", label: "nakamoto" },
    { key: "research.validator-countries-2025", label: "countries" },
    {
      key: "research.sol-percent-staked",
      label: "voteParticipation",
    },
  ],
  energy: [
    {
      key: "network.energy-per-transaction",
      label: "energyPerTransaction",
    },
    { key: "network.electricity-365d", label: "annualizedEnergy" },
  ],
  performance: [
    { key: "network.slot-time", label: "slotTarget" },
    { key: "network.uptime-since-feb-2024", label: "uptime" },
  ],
} as const;

export const RESEARCH_METRIC_KEYS = Object.values(RESEARCH_METRICS).flatMap(
  (metrics) => metrics.map(({ key }) => key),
);
