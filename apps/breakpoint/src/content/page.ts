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
        ctaLabel?: string;
        href?: string;
      }
    >;
    cta: string;
  };
  participate: {
    eyebrow: string;
    headline: string;
    actions: Record<
      string,
      {
        label: string;
        href?: string;
      }
    >;
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
        href?: string;
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
        answerHref?: string;
      }
    >;
  };
  footer: {
    copyright: string;
    contact: string;
    codeOfConduct: string;
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
