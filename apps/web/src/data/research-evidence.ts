// Published snapshots, not live network readings. Keep the date and source with each figure.
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
    date: "7 October 2026",
    href: "https://climate.solana.com/",
  },
  slotTime: {
    title: "Slot Time Reduction Effects",
    date: "September 2026",
    href: "https://solana.com/news/slot-time-reduction-effects",
  },
  uptime: {
    title: "Solana: Building, Proving and Earning Trust in Public",
    date: "September 2026",
    href: "https://solana.com/news/solana-building-trust-in-public",
  },
} as const;

export const RESEARCH_METRICS = {
  validator: [
    { value: "1,295", label: "validators", source: "networkHealth" },
    { value: "20", label: "nakamoto", source: "networkHealth" },
    { value: "40", label: "countries", source: "networkHealth" },
    { value: "74.3%", label: "voteParticipation", source: "networkHealth" },
  ],
  energy: [
    {
      value: "0.00799 Wh",
      label: "energyPerTransaction",
      source: "climateDashboard",
    },
    {
      value: "7.03 GWh",
      label: "annualizedEnergy",
      source: "climateDashboard",
    },
  ],
  performance: [
    { value: "250 ms", label: "slotTarget", source: "slotTime" },
    { value: "100%", label: "uptime", source: "uptime" },
  ],
} as const;
