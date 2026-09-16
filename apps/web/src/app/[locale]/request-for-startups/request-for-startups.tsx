"use client";

import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import { type CSSProperties, useCallback } from "react";
import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@workspace/ui";
import { scrollRequestIntoView } from "./request-scroll";
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
      <svg viewBox="0 0 640 360" aria-hidden="true">
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
  const handleRequestChange = useCallback(scrollRequestIntoView, []);

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
              <p className={styles.kicker}>{t("hero.kicker")}</p>
              <h1>
                <span>{t("hero.headlineFirst")}</span>
                <span>
                  {t("hero.headlineSecond")}{" "}
                  <em>{t("hero.headlineEmphasis")}</em>
                </span>
              </h1>
            </motion.div>
            <motion.div className={styles.heroAside} {...itemMotion}>
              <p>{t("hero.body")}</p>
              <Button asChild variant="outline" className={styles.textLink}>
                <a href="#requests">
                  {t("hero.explore")} <ArrowDown aria-hidden="true" />
                </a>
              </Button>
            </motion.div>
          </div>
          <motion.div className={styles.manifesto} {...itemMotion}>
            <span>{t("hero.manifestoQuestion")}</span>
            <span>{t("hero.manifestoSignal")}</span>
            <span className={styles.liveSignal}>
              <i /> {t("hero.listening")}
            </span>
          </motion.div>
        </motion.div>
      </section>

      <motion.section className={styles.intro} {...sectionMotion}>
        <motion.div className={styles.introLabel} {...sectionItemMotion}>
          <p className={styles.eyebrow}>{t("intro.eyebrow")}</p>
        </motion.div>
        <motion.div className={styles.introCopy} {...sectionItemMotion}>
          <p>{t("intro.first")}</p>
          <p>{t("intro.second")}</p>
          <div className={styles.signalLegend} aria-label={t("intro.legend")}>
            <span>
              <i /> {t("intro.question")}
            </span>
            <b aria-hidden="true" />
            <span>
              <i /> {t("intro.pointOfView")}
            </span>
            <b aria-hidden="true" />
            <span>
              <i /> {t("intro.company")}
            </span>
          </div>
        </motion.div>
      </motion.section>

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
            defaultValue={REQUESTS[0].slug}
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
                id={`request-item-${request.slug}`}
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
                      <Button
                        asChild
                        variant="outline"
                        className={styles.briefLink}
                      >
                        <Link href="/developers">
                          {t("requests.build")}{" "}
                          <ArrowUpRight aria-hidden="true" />
                        </Link>
                      </Button>
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
                Agents: read llms.txt <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline" className={styles.ctaSecondary}>
              <Link href="/docs/intro/quick-start">
                Humans: open the quickstart <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}
