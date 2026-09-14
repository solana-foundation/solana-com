/** Shared routing, branding, and translation settings for event-specific pages. */
export type AccelerateEvent = {
  homePath: string;
  agendaPath: string;
  logoImage: string;
  logoAlt: string;
  navigationTranslations: string;
  pageTranslations: string;
  agendaShowSpeakersNav: boolean;
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
} as const satisfies Record<string, AccelerateEvent>;
