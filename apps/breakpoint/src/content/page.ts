export type BreakpointMessages = {
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    headline: string;
    cta: string;
    date: string;
    venue: string;
    location: string;
  };
  marquee: {
    text: string;
    highlight: string;
    suffix: string;
  };
  narrative: {
    eyebrow: string;
    body1: string;
    body2: string;
  };
  tickets: {
    eyebrow: string;
    headline: string;
    categories: Record<
      string,
      {
        label: string;
        description: string;
        price: string;
      }
    >;
    cta: string;
  };
  participate: {
    eyebrow: string;
    headline: string;
  };
  gallery: {
    eyebrow: string;
    headline: string;
    cta: string;
  };
  stats: {
    headline: string;
    cta: string;
    items: Record<
      string,
      {
        value: string;
        suffix: string;
        label: string;
      }
    >;
  };
  highlights: {
    eyebrow: string;
    headline: string;
    quote: {
      text: string;
      author: string;
    };
  };
  announcements: {
    headline: string;
    items: Record<
      string,
      {
        eyebrow: string;
        title: string;
      }
    >;
  };
  faq: {
    headline: string;
    items: Record<
      string,
      {
        question: string;
        answer: string;
      }
    >;
  };
  footer: {
    countdown: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
  };
};

export type AppMessages = {
  breakpoint: BreakpointMessages;
};
