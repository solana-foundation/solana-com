/** Shared routing, branding, and translation settings for event-specific pages. */
export type AccelerateEvent = {
  homePath: string;
  agendaPath: string;
  logoImage: string;
  logoAlt: string;
  navigationTranslations: string;
  pageTranslations: string;
  agendaShowSpeakersNav: boolean;
  agendaShowSponsorsNav?: boolean;
  agendaShowFaqNav?: boolean;
  logoHomePath?: string;
  agendaDisplay?: {
    filterMode?: "type" | "format";
    exactFormatLabels?: boolean;
    rightColumnLabel?: string;
    timeZoneLabel?: string;
    searchPlaceholder?: string;
    filterByTypeLabel?: string;
  };
  lumaId?: string;
};

export const accelerateEvents = {
  hongKong: {
    homePath: "/accelerate/hong-kong",
    agendaPath: "/accelerate/hong-kong/agenda",
    logoImage: "/images/accelerate-logo.svg",
    logoAlt: "Accelerate APAC",
    navigationTranslations: "accelerate",
    pageTranslations: "accelerate.agendaPage",
    agendaShowSpeakersNav: false,
  },
  miami: {
    homePath: "/accelerate/miami",
    agendaPath: "/accelerate/miami/agenda",
    logoImage: "/images/accelerate-usa-logo.svg",
    logoAlt: "Accelerate USA",
    navigationTranslations: "accelerate.miami",
    pageTranslations: "accelerate.miami.agendaPage",
    agendaShowSpeakersNav: true,
  },
  shanghai: {
    homePath: "/accelerate/china",
    agendaPath: "/accelerate/china/agenda",
    logoImage: "/images/accelerate-logo.svg",
    logoAlt: "Solana Accelerate Shanghai",
    logoHomePath: "/accelerate/china",
    navigationTranslations: "accelerate",
    pageTranslations: "accelerate.agendaPage",
    agendaShowSpeakersNav: false,
    agendaShowSponsorsNav: false,
    agendaShowFaqNav: false,
    agendaDisplay: {
      filterMode: "format",
      exactFormatLabels: true,
      rightColumnLabel: "Track",
      timeZoneLabel: "All times China Standard Time (UTC+8).",
      searchPlaceholder: "Search sessions...",
      filterByTypeLabel: "Filter by format:",
    },
  },
} as const satisfies Record<string, AccelerateEvent>;
