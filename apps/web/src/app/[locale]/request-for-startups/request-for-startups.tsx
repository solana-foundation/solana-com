"use client";

import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Terminal } from "@boxicons/react/Terminal";
import { User } from "@boxicons/react/User";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@workspace/ui";
import { scrollRequestIntoView, updateRequestHash } from "./request-scroll";
import styles from "./request-for-startups.module.scss";

type Request = {
  slug: string;
  accent: "violet" | "green" | "pink" | "blue" | "orange";
};

const REQUESTS: Request[] = [
  { slug: "exotic-rwas", accent: "violet" },
  { slug: "inference-provider-marketplace", accent: "green" },
  { slug: "perps-for-real-estate", accent: "pink" },
  { slug: "agentic-security", accent: "blue" },
  { slug: "gamified-trading", accent: "orange" },
  { slug: "ai", accent: "violet" },
  { slug: "distribution-platform", accent: "green" },
  { slug: "better-wallet", accent: "pink" },
  { slug: "perps", accent: "blue" },
  { slug: "stable", accent: "orange" },
  { slug: "stocks", accent: "violet" },
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

const sectionContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
};

const sectionItem: Variants = {
  hidden: { y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
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
          width="8.5"
          height="8.5"
          patternUnits="userSpaceOnUse"
        >
          <rect x="1" y="1" width="1.45" height="1.45" fill="#f4f3f6" />
        </pattern>
        <pattern
          id={accentPatternId}
          width="8.5"
          height="8.5"
          patternUnits="userSpaceOnUse"
        >
          <rect x="1" y="1" width="1.45" height="1.45" fill="#14f195" />
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

function SignalArtwork({
  request,
  category,
  t,
}: {
  request: Request;
  category: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className={styles.signalArtwork}>
      <div className={styles.signalArtworkTopline}>
        <span>{t("requests.founderSignal")}</span>
        <span>{t("requests.interview")}</span>
      </div>
      <svg viewBox="0 0 360 640" aria-hidden="true">
        <defs>
          <pattern
            id={`signal-${request.slug}`}
            width="7.5"
            height="7.5"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="1"
              y="1"
              width="1.35"
              height="1.35"
              fill="var(--request-accent)"
            />
          </pattern>
        </defs>
        <g className={styles.signalArtworkDots}>
          <path
            d="M-20 486c46-117 103-167 174-150 58 14 91 103 151 95 34-4 60-35 75-76v309H-20Z"
            fill={`url(#signal-${request.slug})`}
          />
        </g>
        <g className={styles.signalMark}>
          <path d="m94 250 174-41" />
          <path d="m81 287 174-41" />
          <path d="m68 324 174-41" />
        </g>
        <path
          className={styles.signalOrbit}
          d="M-16 489c79-89 143-106 193-51s113 58 199-10"
        />
      </svg>
      <div className={styles.signalArtworkCaption}>
        <span>
          {t("requests.requestPrefix")} / {category}
        </span>
        <span>{t("requests.signal")}</span>
      </div>
    </div>
  );
}

export function RequestForStartupsPage() {
  const t = useTranslations("request-for-startups");
  const reduceMotion = useReducedMotion();
  const [openRequest, setOpenRequest] = useState(REQUESTS[0].slug);
  const handleRequestChange = useCallback((value: string) => {
    setOpenRequest(value);
    updateRequestHash(value);
    scrollRequestIntoView(value);
  }, []);

  useEffect(() => {
    const syncRequestFromHash = () => {
      const requestSlug = window.location.hash.slice(1);

      if (!REQUESTS.some((request) => request.slug === requestSlug)) return;

      setOpenRequest(requestSlug);
      scrollRequestIntoView(requestSlug);
    };

    syncRequestFromHash();
    window.addEventListener("hashchange", syncRequestFromHash);

    return () => window.removeEventListener("hashchange", syncRequestFromHash);
  }, []);

  const containerMotion = reduceMotion
    ? {}
    : {
        variants: heroContainer,
        initial: "hidden" as const,
        animate: "show" as const,
      };
  const itemMotion = reduceMotion ? {} : { variants: heroItem };
  const sectionMotion = reduceMotion
    ? {}
    : {
        variants: sectionContainer,
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { amount: 0, once: true },
      };
  const sectionItemMotion = reduceMotion ? {} : { variants: sectionItem };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <PointField />
        <motion.div className={styles.heroInner} {...containerMotion}>
          <motion.div className={styles.heroMeta} {...itemMotion}>
            <span>{t("hero.meta")}</span>
            <span>{t("hero.openCall", { count: REQUESTS.length })}</span>
          </motion.div>
          <div className={styles.heroCenter}>
            <motion.div {...itemMotion}>
              <img
                className={styles.heroLockup}
                src="/src/img/request-for-startups/request-for-startups-lockup.svg"
                alt="Request for Startups"
              />
              <h1>
                <span>{t("hero.headlineFirst")}</span>
                <span>
                  {t("hero.headlineSecond")}{" "}
                  <em>{t("hero.headlineEmphasis")}</em>
                </span>
              </h1>
            </motion.div>
            <motion.p className={styles.heroStrapline} {...itemMotion}>
              {t("intro.first")}
            </motion.p>
            <motion.div className={styles.heroAside} {...itemMotion}>
              <div className={styles.heroActionGroup}>
                <Button asChild className={styles.heroAgentLink}>
                  <a href="/request-for-startups.md">
                    <Terminal pack="filled" aria-hidden="true" />
                    Agents: choose what to build{" "}
                    <ArrowUpRight pack="filled" aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild variant="outline" className={styles.textLink}>
                  <a href="#requests">
                    <User pack="filled" aria-hidden="true" />
                    Humans: {t("hero.explore").toLowerCase()}{" "}
                    <ArrowDown pack="filled" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <motion.section
        id="requests"
        className={styles.requestsSection}
        {...sectionMotion}
      >
        <motion.div className={styles.requestsHeading} {...sectionItemMotion}>
          <p className={styles.eyebrow}>{t("requests.eyebrow")}</p>
          <h2>{t("requests.heading")}</h2>
          <p>{t("requests.body")}</p>
        </motion.div>
        <motion.div {...sectionItemMotion}>
          <Accordion
            className={styles.requests}
            aria-label={t("requests.label")}
            type="single"
            value={openRequest}
            collapsible
            onValueChange={handleRequestChange}
          >
            <div className={styles.indexHeader}>
              <span>{t("requests.indexRequest")}</span>
              <span>{t("requests.indexFocus")}</span>
              <span>{t("requests.indexPointOfView")}</span>
              <span aria-hidden="true" />
            </div>
            {REQUESTS.map((request) => (
              <AccordionItem
                className={styles.request}
                id={request.slug}
                key={request.slug}
                value={request.slug}
                style={
                  {
                    "--request-accent": ACCENTS[request.accent],
                  } as CSSProperties
                }
              >
                <AccordionTrigger
                  className={styles.requestTrigger}
                  aria-controls={`request-${request.slug}`}
                >
                  <span className={styles.requestTitle}>
                    {t(`requests.items.${request.slug}.title`)}
                  </span>
                  <span className={styles.category}>
                    {t(`requests.items.${request.slug}.category`)}
                  </span>
                  <span className={styles.requestSummary}>
                    {t(`requests.items.${request.slug}.thesis`)}
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
                        <p className={styles.detailLabel}>
                          {t("requests.opportunity")}
                        </p>
                        <p className={styles.thesis}>
                          {t(`requests.items.${request.slug}.thesis`)}
                        </p>
                        <p>{t(`requests.items.${request.slug}.description`)}</p>
                      </div>
                      <dl className={styles.context}>
                        <div>
                          <dt>{t("requests.whyNow")}</dt>
                          <dd>{t(`requests.items.${request.slug}.whyNow`)}</dd>
                        </div>
                        <div>
                          <dt>{t("requests.whySolana")}</dt>
                          <dd>
                            {t(`requests.items.${request.slug}.whySolana`)}
                          </dd>
                        </div>
                      </dl>
                      <div className={styles.startingPoints}>
                        <p className={styles.detailLabel}>
                          {t("requests.startingPoints")}
                        </p>
                        <ul>
                          {(
                            t.raw(
                              `requests.items.${request.slug}.prompts`,
                            ) as string[]
                          ).map((prompt) => (
                            <li key={prompt}>{prompt}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.briefCtaGroup}>
                        <Button
                          asChild
                          variant="outline"
                          className={styles.briefLink}
                        >
                          <Link href="/docs/intro/quick-start">
                            <User pack="filled" aria-hidden="true" />
                            Humans: open the quickstart{" "}
                            <ArrowUpRight pack="filled" aria-hidden="true" />
                          </Link>
                        </Button>
                        <Button asChild className={styles.briefLinkAgent}>
                          <a href={`/request-for-startups.md#${request.slug}`}>
                            <Terminal pack="filled" aria-hidden="true" />
                            Agents: choose this request{" "}
                            <ArrowUpRight pack="filled" aria-hidden="true" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <SignalArtwork
                      request={request}
                      category={t(`requests.items.${request.slug}.category`)}
                      t={t}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </motion.section>

      <motion.section id="build" className={styles.build} {...sectionMotion}>
        <PointField compact />
        <motion.div className={styles.buildInner} {...sectionItemMotion}>
          <p className={styles.eyebrow}>Your signal starts here</p>
          <h2>
            Start where the <em>request ends.</em>
          </h2>
          <p>
            Bring an idea to life with the people, tools, and capital that can
            help it move. The build challenge is coming next.
          </p>
          <div className={styles.ctaGroup}>
            <Button asChild className={styles.cta}>
              <a href="https://solana.com/llms.txt">
                <Terminal pack="filled" aria-hidden="true" />
                Agents: read llms.txt{" "}
                <ArrowUpRight pack="filled" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline" className={styles.ctaSecondary}>
              <Link href="/docs/intro/quick-start">
                <User pack="filled" aria-hidden="true" />
                Humans: open the quickstart{" "}
                <ArrowUpRight pack="filled" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}
