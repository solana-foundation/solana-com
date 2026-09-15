"use client";

import Link from "next/link";
import { useCallback } from "react";
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

function VideoPlaceholder({ request }: { request: Request }) {
  return (
    <div className={`${styles.video} ${styles[`video${request.accent}`]}`}>
      <div className={styles.videoTopline}>
        <span>YouTube premiere</span>
        <span>Coming soon</span>
      </div>
      <div className={styles.play} aria-hidden="true">
        <span />
      </div>
      <div className={styles.videoCaption}>
        <span>From the Solana ecosystem</span>
        <span>{request.category}</span>
      </div>
    </div>
  );
}

export function RequestForStartupsPage() {
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

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.signalField} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className={styles.heroMeta}>
          <span>Solana / Requests for startups</span>
          <span>For the curious and the committed</span>
        </div>
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.kicker}>Worth building</p>
            <h1>
              <span>What would</span>
              <span>
                you build <em>now?</em>
              </span>
            </h1>
          </div>
          <div className={styles.heroAside}>
            <p>
              The next great company could begin with a question. Here are the
              questions we want the next generation of Solana builders to
              answer.
            </p>
            <a href="#requests" className={styles.textLink}>
              Explore the requests <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className={styles.manifesto}>
          <span>Build what matters.</span>
          <span>Build on Solana.</span>
          <span className={styles.manifestoMark}>✦</span>
        </div>
      </section>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>The starting point</p>
        <div className={styles.introCopy}>
          <p>
            We asked people shaping the ecosystem one question: what should
            exist that Solana makes possible now?
          </p>
          <p>
            These requests are points of view, not prescriptions. Take one,
            challenge it, and make something only you would make.
          </p>
        </div>
      </section>

      <Accordion
        id="requests"
        className={styles.requests}
        aria-label="Startup requests"
        type="single"
        defaultValue={REQUESTS[0].slug}
        collapsible
        onValueChange={handleRequestChange}
      >
        <div className={styles.indexHeader}>
          <span>Ideas worth building</span>
          <span>Focus</span>
          <span>Interview</span>
        </div>
        {REQUESTS.map((request) => (
          <AccordionItem
            className={styles.request}
            id={`request-item-${request.slug}`}
            key={request.slug}
            value={request.slug}
          >
            <AccordionTrigger
              className={styles.requestTrigger}
              aria-controls={`request-${request.slug}`}
            >
              <span className={styles.requestTitle}>{request.title}</span>
              <span className={styles.category}>{request.category}</span>
              <span className={styles.interviewStatus}>Coming soon</span>
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
                      Build from this request <span aria-hidden="true">↗</span>
                    </Link>
                  </Button>
                </div>
                <VideoPlaceholder request={request} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <section id="build" className={styles.build}>
        <p className={styles.eyebrow}>Your turn</p>
        <div>
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
        <div className={styles.buildMark} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </section>
    </main>
  );
}
