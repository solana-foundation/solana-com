export type BreakpointMessages = {
  metadata: {
    title: string;
    description: string;
  };
  nav: Array<{ id: string; label: string }>;
  hero: {
    eyebrow: string;
    title: string;
    blurb: string;
    dates: string;
    venue: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Array<{ label: string; value: string }>;
  };
  overview: {
    title: string;
    body: string;
    highlights: string[];
  };
  audience: {
    title: string;
    cards: Array<{ title: string; body: string }>;
  };
  video: {
    title: string;
    body: string;
    caption: string;
  };
  logistics: {
    title: string;
    dateLabel: string;
    dateValue: string;
    venueLabel: string;
    venueValue: string;
    formatLabel: string;
    formatValue: string;
  };
  london: {
    title: string;
    body: string;
    reasons: string[];
  };
  cta: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
    placeholderHref: string;
  };
};

export type AppMessages = {
  breakpoint: BreakpointMessages;
};

export type BreakpointPageContent = {
  meta: BreakpointMessages["metadata"];
  nav: BreakpointMessages["nav"];
  hero: BreakpointMessages["hero"];
  overview: BreakpointMessages["overview"];
  audience: BreakpointMessages["audience"];
  video: BreakpointMessages["video"] & { youtubeId: string };
  logistics: BreakpointMessages["logistics"];
  london: BreakpointMessages["london"];
  cta: BreakpointMessages["cta"];
};

export const sectionIds = [
  "hero",
  "overview",
  "audience",
  "video",
  "logistics",
  "london",
  "cta",
] as const;

export function buildBreakpointPageContent(
  messages: BreakpointMessages,
): BreakpointPageContent {
  return {
    meta: messages.metadata,
    nav: messages.nav,
    hero: messages.hero,
    overview: messages.overview,
    audience: messages.audience,
    video: {
      ...messages.video,
      youtubeId: "394wb968J68",
    },
    logistics: messages.logistics,
    london: messages.london,
    cta: messages.cta,
  };
}
