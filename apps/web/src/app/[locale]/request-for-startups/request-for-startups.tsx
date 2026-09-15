"use client";

import Link from "next/link";
import { type CSSProperties, useCallback } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@workspace/ui";
import styles from "./request-for-startups.module.scss";

type Request = {
  slug: string;
  category: string;
  title: string;
  thesis: string;
  description: string;
  whyNow: string;
  whySolana: string;
  prompts: string[];
  accent: "violet" | "green" | "pink" | "blue" | "orange";
};

const REQUESTS: Request[] = [
  {
    slug: "exotic-rwas",
    category: "Tokenization",
    title: "Exotic RWAs",
    thesis: "Bring the world’s most interesting physical assets onchain.",
    description:
      "The model is simple: a physical vault, professional photography and authentication, a token representing ownership, and a redemption process when an owner wants the asset shipped. The token trades, but the asset is real and safely stored.",
    whyNow:
      "That model has proven itself in a few categories, but art, vintage cars, rare coins, antiques, watches, and many other collectible markets still trade the old way: illiquid, slow, expensive, and closed off.",
    whySolana:
      "Fast, low-cost markets can make these assets easier to access, deepen liquidity, and create more honest pricing for participants everywhere.",
    prompts: [
      "Build the vaulting and authentication layer.",
      "Create marketplaces and better price discovery.",
      "Make redemption and ownership feel effortless.",
    ],
    accent: "violet",
  },
  {
    slug: "inference-provider-marketplace",
    category: "AI",
    title: "Inference provider marketplace",
    thesis: "Make inference open, verifiable, and permissionless.",
    description:
      "Engineers want a unified interface for every model, but today’s inference rails cannot verify the response or the model that ran it. Build a marketplace of providers that makes those choices transparent.",
    whyNow:
      "Solana Payment Channels can support more than a million payments per second, while verifiable inference can now run with minimal performance loss.",
    whySolana:
      "A permissionless market can let providers onboard new models, build a reputation, and fund open-source model development directly through usage.",
    prompts: [
      "Unify access to many inference providers.",
      "Make model execution and responses verifiable.",
      "Pay providers in real time and reward useful models.",
    ],
    accent: "green",
  },
  {
    slug: "perps-for-real-estate",
    category: "Markets",
    title: "Perps for real estate",
    thesis: "Give global markets a way to express a view on real estate.",
    description:
      "Real estate is one of the world’s largest asset classes, yet most people have no simple way to trade a view on where markets, cities, or neighborhoods are heading.",
    whyNow:
      "Demand for more liquid real-world exposure is growing, while reliable market data and onchain financial primitives are becoming more accessible.",
    whySolana:
      "High-performance markets can support continuous price discovery and a product that feels familiar to active traders.",
    prompts: [
      "Start with transparent indices and high-quality data.",
      "Design for useful hedging, not only speculation.",
      "Make regional exposure understandable.",
    ],
    accent: "pink",
  },
  {
    slug: "agentic-security",
    category: "Security",
    title: "Agentic security",
    thesis: "Build security that can keep up with an always-on economy.",
    description:
      "As wallets, applications, and autonomous systems become more capable, users need defenses that can identify risk, explain it clearly, and act before a costly mistake is made.",
    whyNow:
      "The attack surface is growing faster than manual review can scale, creating room for useful, user-aligned security agents.",
    whySolana:
      "Rich onchain activity and fast execution make it possible to detect, simulate, and respond to threats in the moment.",
    prompts: [
      "Make safety recommendations legible and actionable.",
      "Put users in control of automated responses.",
      "Turn onchain signals into timely protection.",
    ],
    accent: "blue",
  },
  {
    slug: "gamified-trading",
    category: "Consumer",
    title: "Gamified trading",
    thesis: "Make learning and participating in markets more engaging.",
    description:
      "Trading products can feel intimidating and solitary. There is room for experiences that reward good habits, make market knowledge social, and let people build skill over time.",
    whyNow:
      "A new generation learns through interactive products and already gathers around fast-moving, always-on markets.",
    whySolana:
      "Low fees and rapid settlement enable frequent, small interactions without making the product feel burdened by the underlying rails.",
    prompts: [
      "Reward learning and risk awareness.",
      "Build social experiences that add real utility.",
      "Make the path from curious to capable feel natural.",
    ],
    accent: "orange",
  },
  {
    slug: "ai",
    category: "AI",
    title: "AI",
    thesis: "Find the next useful intersection of AI and onchain systems.",
    description:
      "AI is rapidly changing how people create, work, and coordinate. The opportunity is to build products where intelligent software and programmable ownership make each other more useful.",
    whyNow:
      "The capabilities are arriving quickly, but the interfaces, incentives, and business models around them are still wide open.",
    whySolana:
      "Fast, inexpensive transactions can give AI products a native way to pay, coordinate, and create durable user ownership.",
    prompts: [
      "Start with a problem people already have.",
      "Give users meaningful control.",
      "Make intelligence useful, not ornamental.",
    ],
    accent: "violet",
  },
  {
    slug: "distribution-platform",
    category: "Infrastructure",
    title: "Distribution platform",
    thesis: "Help great onchain products reach the people who need them.",
    description:
      "Building a great product is only half the work. Create the discovery, growth, and distribution layer that helps the next generation of Solana applications find an audience.",
    whyNow:
      "The ecosystem has more products and users than ever, making thoughtful discovery and distribution increasingly valuable.",
    whySolana:
      "Open activity and programmable incentives create new ways to measure contribution, reward referrals, and build portable audiences.",
    prompts: [
      "Make discovery feel personal.",
      "Reward durable contribution.",
      "Give builders better paths to their first users.",
    ],
    accent: "green",
  },
  {
    slug: "better-wallet",
    category: "Consumer",
    title: "Better wallet",
    thesis: "Make the wallet people want to use every day.",
    description:
      "The wallet is still the front door to onchain life. Reimagine it as a product that makes money, identity, safety, and discovery intuitive for everyone.",
    whyNow:
      "More people are arriving onchain, but key management and transaction flows still ask too much of newcomers.",
    whySolana:
      "A fast, low-cost network and a rich mobile ecosystem make everyday wallet experiences practical at global scale.",
    prompts: [
      "Design for people, not public keys.",
      "Make safety a default.",
      "Remove friction from the first useful action.",
    ],
    accent: "pink",
  },
  {
    slug: "perps",
    category: "Markets",
    title: "Perps",
    thesis: "Build the next generation of global, always-on markets.",
    description:
      "Perpetual markets have become one of crypto’s most compelling primitives. There is still room to make them faster, safer, more expressive, and useful to more kinds of participants.",
    whyNow:
      "Demand for liquid, global markets continues to grow while the underlying tools for risk management and market design keep improving.",
    whySolana:
      "High throughput and low latency create a foundation for trading experiences that can compete on speed, access, and cost.",
    prompts: [
      "Obsess over market quality.",
      "Make risk visible before it matters.",
      "Expand access without compromising usability.",
    ],
    accent: "blue",
  },
  {
    slug: "stable",
    category: "Payments",
    title: "Stable",
    thesis: "Make stablecoins the easiest money to use on the internet.",
    description:
      "Stablecoins can move value globally with the speed and simplicity people expect from modern software. Build the products that make that capability useful in everyday life.",
    whyNow:
      "More businesses and consumers are looking for faster, more accessible ways to move and hold money across borders.",
    whySolana:
      "Low fees, rapid settlement, and deep stablecoin liquidity make frequent payments and global commerce viable.",
    prompts: [
      "Hide the complexity.",
      "Start with a clear user need.",
      "Make moving money feel instant and reliable.",
    ],
    accent: "orange",
  },
  {
    slug: "stocks",
    category: "Markets",
    title: "Stocks",
    thesis: "Reimagine access to equity markets for an internet-native world.",
    description:
      "Equities remain a foundational way people participate in economic growth. Build products that make stock exposure, discovery, and participation more global, accessible, and programmable.",
    whyNow:
      "Investors expect markets to be available whenever they are, while new forms of access and settlement are reshaping what a brokerage can be.",
    whySolana:
      "Fast, inexpensive settlement and composable financial infrastructure can support new equity-market experiences.",
    prompts: [
      "Make market access understandable.",
      "Build with regulatory realities in mind.",
      "Focus on a better investor experience.",
    ],
    accent: "violet",
  },
];

const ACCENTS: Record<Request["accent"], string> = {
  violet: "#9945ff",
  green: "#14f195",
  pink: "#ff70d7",
  blue: "#80ecff",
  orange: "#ffb45c",
};

const EASE = [0.22, 1, 0.36, 1] as const;

const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0.72, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function PointField({ compact = false }: { compact?: boolean }) {
  const dotPatternId = compact ? "rfs-dots-compact" : "rfs-dots";
  const accentPatternId = compact
    ? "rfs-accent-dots-compact"
    : "rfs-accent-dots";
  const lineGradientId = compact ? "rfs-line-compact" : "rfs-line";

  return (
    <svg
      className={`${styles.pointField} ${compact ? styles.pointFieldCompact : ""}`}
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={dotPatternId}
          width="13"
          height="13"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.55" fill="#f4f3f6" />
        </pattern>
        <pattern
          id={accentPatternId}
          width="13"
          height="13"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.55" fill="#14f195" />
        </pattern>
        <linearGradient id={lineGradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9945ff" stopOpacity="0" />
          <stop offset="0.32" stopColor="#9945ff" />
          <stop offset="0.7" stopColor="#14f195" />
          <stop offset="1" stopColor="#14f195" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className={styles.pointCloudPrimary}>
        <path
          d="M-80 430C54 263 176 213 328 246c127 28 171 123 306 142 83 12 133-21 177-48-101 126-242 188-420 187-185-1-341-34-471-97Z"
          fill={`url(#${dotPatternId})`}
        />
        <path
          d="M1520 325c-123-82-246-101-354-54-97 43-135 128-250 163-80 25-153 4-219-30 108 128 264 194 449 164 160-27 281-105 374-243Z"
          fill={`url(#${dotPatternId})`}
        />
      </g>
      <g className={styles.pointCloudAccent}>
        <path
          d="M-36 501c159-58 275-52 383 7 101 55 179 57 292 16-103 98-225 130-373 96-113-26-214-66-302-119Z"
          fill={`url(#${accentPatternId})`}
        />
        <path
          d="M1476 426c-146-20-249 8-326 82-60 58-141 83-244 75 99 60 213 70 344 28 95-31 170-93 226-185Z"
          fill={`url(#${accentPatternId})`}
        />
      </g>
      <g className={styles.signalLines} stroke={`url(#${lineGradientId})`}>
        <path d="M-30 448C201 332 334 349 518 423s339 70 493-7 292-91 481-17" />
        <path d="M-20 478c216-92 354-74 520 4s341 88 509 9 302-102 483-53" />
        <path d="M-12 508c187-63 322-44 492 25s350 102 531 26 311-105 481-81" />
      </g>
    </svg>
  );
}

function SignalArtwork({ request }: { request: Request }) {
  return (
    <div className={styles.signalArtwork}>
      <div className={styles.signalArtworkTopline}>
        <span>Founder signal</span>
        <span>Interview / coming soon</span>
      </div>
      <svg viewBox="0 0 640 360" aria-hidden="true">
        <defs>
          <pattern
            id={`signal-${request.slug}`}
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.7" fill="var(--request-accent)" />
          </pattern>
        </defs>
        <g className={styles.signalArtworkDots}>
          <path
            d="M-35 232c75-103 154-132 243-86 73 38 103 107 191 96 76-9 114-76 176-79 42-2 76 18 101 60v106H-35Z"
            fill={`url(#signal-${request.slug})`}
          />
        </g>
        <g className={styles.signalMark}>
          <path d="m235 155 184-43" />
          <path d="m220 190 184-43" />
          <path d="m205 225 184-43" />
        </g>
        <path
          className={styles.signalOrbit}
          d="M43 255c102-101 194-118 276-52s175 67 278 0"
        />
      </svg>
      <div className={styles.signalArtworkCaption}>
        <span>Request / {request.category}</span>
        <span>Signal incoming</span>
      </div>
    </div>
  );
}

export function RequestForStartupsPage() {
  const reduceMotion = useReducedMotion();
  const handleRequestChange = useCallback((value: string) => {
    if (!value) return;

    window.requestAnimationFrame(() => {
      const request = document.getElementById(`request-item-${value}`);
      const headerHeight = document
        .querySelector("header")
        ?.getBoundingClientRect().height;

      if (!request) return;

      window.scrollTo({
        top: Math.max(
          0,
          request.getBoundingClientRect().top +
            window.scrollY -
            (headerHeight ?? 0) -
            24,
        ),
        behavior: "auto",
      });
    });
  }, []);

  const containerMotion = reduceMotion
    ? {}
    : {
        variants: heroContainer,
        initial: "hidden" as const,
        animate: "show" as const,
      };
  const itemMotion = reduceMotion ? {} : { variants: heroItem };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <PointField />
        <motion.div className={styles.heroInner} {...containerMotion}>
          <motion.div className={styles.heroMeta} {...itemMotion}>
            <span>Solana / Requests for startups</span>
            <span>Open call / {REQUESTS.length} requests</span>
          </motion.div>
          <div className={styles.heroCenter}>
            <motion.div {...itemMotion}>
              <p className={styles.kicker}>Worth building</p>
              <h1>
                <span>What would</span>
                <span>
                  you build <em>now?</em>
                </span>
              </h1>
            </motion.div>
            <motion.div className={styles.heroAside} {...itemMotion}>
              <p>
                The next great company could begin with a question. Here are the
                questions we want the next generation of Solana builders to
                answer.
              </p>
              <a href="#requests" className={styles.textLink}>
                Explore the requests <span aria-hidden="true">↓</span>
              </a>
            </motion.div>
          </div>
          <motion.div className={styles.manifesto} {...itemMotion}>
            <span>Questions become signals.</span>
            <span>Signals become companies.</span>
            <span className={styles.liveSignal}>
              <i /> Listening now
            </span>
          </motion.div>
        </motion.div>
      </section>

      <section className={styles.intro}>
        <div className={styles.introLabel}>
          <p className={styles.eyebrow}>The starting point</p>
        </div>
        <div className={styles.introCopy}>
          <p>
            We asked people shaping the ecosystem one question: what should
            exist that Solana makes possible now?
          </p>
          <p>
            These requests are points of view, not prescriptions. Take one,
            challenge it, and make something only you would make.
          </p>
          <div
            className={styles.signalLegend}
            aria-label="From idea to company"
          >
            <span>
              <i /> Question
            </span>
            <b aria-hidden="true" />
            <span>
              <i /> Point of view
            </span>
            <b aria-hidden="true" />
            <span>
              <i /> Company
            </span>
          </div>
        </div>
      </section>

      <section id="requests" className={styles.requestsSection}>
        <div className={styles.requestsHeading}>
          <p className={styles.eyebrow}>The requests</p>
          <h2>Ideas worth building</h2>
          <p>Eleven starting points. None of them are finished.</p>
        </div>
        <Accordion
          className={styles.requests}
          aria-label="Startup requests"
          type="single"
          defaultValue={REQUESTS[0].slug}
          collapsible
          onValueChange={handleRequestChange}
        >
          <div className={styles.indexHeader}>
            <span>Request</span>
            <span>Focus</span>
            <span>Status</span>
            <span aria-hidden="true" />
          </div>
          {REQUESTS.map((request) => (
            <AccordionItem
              className={styles.request}
              id={`request-item-${request.slug}`}
              key={request.slug}
              value={request.slug}
              style={
                { "--request-accent": ACCENTS[request.accent] } as CSSProperties
              }
            >
              <AccordionTrigger
                className={styles.requestTrigger}
                aria-controls={`request-${request.slug}`}
              >
                <span className={styles.requestTitle}>{request.title}</span>
                <span className={styles.category}>{request.category}</span>
                <span className={styles.interviewStatus}>
                  <i /> Open request
                </span>
                <span className={styles.toggle} aria-hidden="true">
                  +
                </span>
              </AccordionTrigger>
              <AccordionContent
                id={`request-${request.slug}`}
                className={styles.requestDetail}
              >
                <div className={styles.detailInner}>
                  <div className={styles.brief}>
                    <div className={styles.copy}>
                      <p className={styles.detailLabel}>The opportunity</p>
                      <p className={styles.thesis}>{request.thesis}</p>
                      <p>{request.description}</p>
                    </div>
                    <dl className={styles.context}>
                      <div>
                        <dt>Why now</dt>
                        <dd>{request.whyNow}</dd>
                      </div>
                      <div>
                        <dt>Why Solana</dt>
                        <dd>{request.whySolana}</dd>
                      </div>
                    </dl>
                    <div className={styles.startingPoints}>
                      <p className={styles.detailLabel}>Starting points</p>
                      <ul>
                        {request.prompts.map((prompt) => (
                          <li key={prompt}>{prompt}</li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className={styles.briefLink}
                    >
                      <Link href="/developers">
                        Build from this request{" "}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </Button>
                  </div>
                  <SignalArtwork request={request} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section id="build" className={styles.build}>
        <PointField compact />
        <div className={styles.buildInner}>
          <p className={styles.eyebrow}>Your signal starts here</p>
          <h2>
            Start where the <em>request ends.</em>
          </h2>
          <p>
            Bring an idea to life with the people, tools, and capital that can
            help it move. The build challenge is coming next.
          </p>
          <Button asChild className={styles.cta}>
            <Link href="/developers">
              Start building <span aria-hidden="true">↗</span>
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
