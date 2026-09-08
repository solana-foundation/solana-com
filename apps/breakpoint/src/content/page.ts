type MessageRecord = {
  [key: string]: string | MessageRecord;
};

export type BreakpointMessages = {
  metadata: {
    title: string;
    titleTemplate: string;
    siteName: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    keywords: string;
    socialImageAlt: string;
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
    priceIncreaseCountdown: string;
    categories: Record<
      string,
      {
        label: string;
        description: string;
        originalPrice?: string;
        price: string;
        priceAfterIncrease?: string;
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
        ctaLabel?: string;
        label: string;
        href?: string;
      }
    >;
  };
  gallery: {
    eyebrow: string;
    headline: string;
    cta: string;
    videoTitle: string;
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
  events: {
    headline: string;
    communityCta: string;
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
    article: string;
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
  travel: {
    metadata: {
      title: string;
      description: string;
    };
    title: string;
    cta: string;
    subnav: {
      label: string;
      flights: string;
      hotels: string;
      visas: string;
    };
    flights: {
      eyebrow: string;
      headline: string;
      airports: Record<
        string,
        {
          name: string;
          distance: string;
        }
      >;
    };
    hotels: {
      headline: string;
      items: Record<
        string,
        {
          name: string;
          description: string;
          distance?: string;
          ctaLabel: string;
        }
      >;
    };
    londonPicks: MessageRecord;
    visas: {
      headline: string;
      summary: string;
      checkRequirements: string;
      checkVisaOrEta: string;
      officialRequirements: string;
      supportHeading: string;
      supportOptions: Record<
        string,
        {
          name: string;
          description: string;
          ctaLabel: string;
        }
      >;
      fees: string;
      invitationHeading: string;
      invitationPrefix: string;
      invitationLink: string;
      invitationSuffix: string;
    };
    faq: {
      headline: string;
      cta: string;
    };
  };
  pages: MessageRecord;
  accessibility: {
    close: string;
    opensInNewTab: string;
    externalLink: string;
    previous: string;
    next: string;
    previousItem: string;
    nextItem: string;
    skipToContent: string;
    youtubeVideoPlayer: string;
  };
  subscribe: {
    title: string;
    description: string;
    success: string;
    emailLabel: string;
    emailPlaceholder: string;
    error: string;
    submit: string;
    submitting: string;
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
