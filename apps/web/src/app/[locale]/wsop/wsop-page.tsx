"use client";

import { useRef } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Video } from "@/component-library/video";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowOutUpRightSquare } from "@boxicons/react/ArrowOutUpRightSquare";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Club } from "@boxicons/react/Club";
import { CalendarDownArrow } from "@boxicons/react/CalendarDownArrow";
import { Clock3 } from "@boxicons/react/Clock3";
import { CryptoCoin } from "@boxicons/react/CryptoCoin";
import { CursorClick } from "@boxicons/react/CursorClick";
import { Diamond } from "@boxicons/react/Diamond";
import { Heart } from "@boxicons/react/Heart";
import { Mobile } from "@boxicons/react/Mobile";
import { Spade } from "@boxicons/react/Spade";
import { Ticket } from "@boxicons/react/Ticket";
import { UserPlus } from "@boxicons/react/UserPlus";
import { Wallet } from "@boxicons/react/Wallet";
import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import { Link as CrossAppLink } from "@solana-com/ui-chrome/link";
import { Button } from "@/app/components/ui/button";

type Icon = typeof Spade;

const HOW_TO_STEPS: Array<{ step: number; icon: Icon }> = [
  { step: 1, icon: Mobile },
  { step: 2, icon: UserPlus },
  { step: 3, icon: CalendarDownArrow },
  { step: 4, icon: CursorClick },
  { step: 5, icon: Ticket },
  { step: 6, icon: CryptoCoin },
  { step: 7, icon: Wallet },
];

const ParadiseScene = dynamic(() => import("./paradise-scene"), { ssr: false });

// Swap src and poster when the final walkthrough is delivered.
const BUY_IN_VIDEO = {
  src: "/src/img/wsop/paradise/buy-in-walkthrough-placeholder.mp4",
  poster: "/src/img/wsop/paradise/buy-in-walkthrough-poster.webp",
};

const EASE = [0.22, 1, 0.36, 1] as const;

const SUITS = ["spade", "diamond", "heart", "club"] as const;
type Suit = (typeof SUITS)[number];

const SUIT_ICONS: Record<Suit, Icon> = {
  spade: Spade,
  diamond: Diamond,
  heart: Heart,
  club: Club,
};

const isRedSuit = (suit: Suit) => suit === "heart" || suit === "diamond";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.07,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const dealVariants: Variants = {
  hidden: { opacity: 0, y: 18, rotate: -1.5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const heroVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const heroTitleVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const MARQUEE_LINE_IDS = [
  "skipWire",
  "buyInSolana",
  "settles",
  "nothingToDeclare",
  "anyDay",
  "shuffleUp",
  "noCash",
  "paradise",
] as const;

const BENEFITS: Array<{ id: string; suit: Suit; rank: string }> = [
  { id: "speed", suit: "spade", rank: "A" },
  { id: "fees", suit: "diamond", rank: "K" },
  { id: "crossBorder", suit: "heart", rank: "Q" },
  { id: "availability", suit: "club", rank: "J" },
  { id: "customs", suit: "spade", rank: "10" },
  { id: "security", suit: "diamond", rank: "9" },
];
const SHOWDOWN_DETAILS = ["when", "where", "format"] as const;

const ambassadors: Array<{
  id: string;
  name: string;
  image: string;
  unoptimized?: boolean;
  releaseDate?: string;
  href?: string;
}> = [
  {
    id: "jamieGold",
    name: "Jamie Gold",
    image: "/src/img/wsop/jamie-gold.webp",
  },
  {
    id: "michaelMizrachi",
    name: "Michael Mizrachi",
    image: "/src/img/wsop/michael-mizrachi.webp",
    unoptimized: true,
    releaseDate: "Mon 23 Nov",
  },
  {
    id: "philHellmuth",
    name: "Phil Hellmuth",
    image: "/src/img/wsop/phil-hellmuth.webp",
    releaseDate: "Mon 30 Nov",
  },
];

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -8% 0px", amount: 0.12 }}
      variants={revealVariants}
    >
      {children}
    </motion.div>
  );
}

function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={staggerVariants}
    >
      {children}
    </motion.div>
  );
}

function SuitIcon({
  suit,
  className = "",
}: {
  suit: Suit;
  className?: string;
}) {
  const Icon = SUIT_ICONS[suit];

  return (
    <Icon
      className={`wsop-suit-icon ${className} ${
        isRedSuit(suit) ? "is-red" : ""
      }`}
      pack="filled"
      aria-hidden="true"
    />
  );
}

function SuitRun({ className = "" }: { className?: string }) {
  return (
    <span className={`wsop-suit-run ${className}`} aria-hidden="true">
      {SUITS.map((suit) => (
        <SuitIcon key={suit} suit={suit} />
      ))}
    </span>
  );
}

function LiveChip({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="wsop-live-chip">
      <motion.span
        aria-hidden="true"
        animate={
          reduceMotion
            ? { boxShadow: "0 0 0 3px rgba(217, 0, 41, 0.2)" }
            : {
                boxShadow: [
                  "0 0 0 3px rgba(217, 0, 41, 0.2)",
                  "0 0 0 8px rgba(217, 0, 41, 0)",
                  "0 0 0 3px rgba(217, 0, 41, 0.2)",
                ],
              }
        }
        transition={{
          duration: 2.6,
          ease: "easeOut",
          repeat: Infinity,
          times: [0, 0.55, 1],
        }}
      />
      {children}
    </span>
  );
}

function SectionLabel({
  suit,
  children,
}: {
  suit: Suit;
  children: React.ReactNode;
}) {
  return (
    <div className="wsop-section-label">
      <SuitIcon className="wsop-section-label__suit" suit={suit} />
      <p>{children}</p>
    </div>
  );
}

function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      className={`wsop-button ${className}`}
      target="_blank"
      rel="noreferrer"
      whileHover={reduceMotion ? { y: 0 } : { y: -2 }}
      whileTap={reduceMotion ? { scale: 1 } : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: EASE }}
    >
      <span>{children}</span>
      <ArrowOutUpRightSquare aria-hidden="true" />
    </motion.a>
  );
}

function BrandMarquee() {
  const t = useTranslations("wsop.marquee");
  const track = (hidden: boolean) => (
    <div className="wsop-marquee__track" aria-hidden={hidden || undefined}>
      {MARQUEE_LINE_IDS.map((id, index) => (
        <span className="wsop-marquee__item" key={id}>
          <span className="wsop-marquee__text">{t(id)}</span>
          <SuitIcon
            className="wsop-marquee__suit"
            suit={SUITS[index % SUITS.length]}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div className="wsop-marquee">
      {track(false)}
      {track(true)}
    </div>
  );
}

/** Code 39 character patterns (1 = bar module, 0 = space module, wide = 2 modules). */
const CODE39: Record<string, string> = {
  "0": "101001101101",
  "1": "110100101011",
  "2": "101100101011",
  "3": "110110010101",
  "4": "101001101011",
  "5": "110100110101",
  "6": "101100110101",
  "7": "101001011011",
  "8": "110100101101",
  "9": "101100101101",
  "*": "100101101101",
};

function TicketBarcode({ value }: { value: string }) {
  const binary = `*${value}*`
    .split("")
    .map((char) => CODE39[char] ?? CODE39["0"])
    .join("0");

  const bars: Array<{ x: number; width: number }> = [];
  let runStart = -1;

  for (let i = 0; i <= binary.length; i++) {
    if (binary[i] === "1") {
      if (runStart < 0) runStart = i;
    } else if (runStart >= 0) {
      bars.push({ x: runStart, width: i - runStart });
      runStart = -1;
    }
  }

  return (
    <svg
      className="wsop-ticket__barcode"
      viewBox={`0 0 ${binary.length} 60`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={0}
          width={bar.width}
          height={60}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

function AppDownloadButtons() {
  const t = useTranslations("wsop.howTo.download");
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <span className="w-full font-[var(--wsop-font-label)] text-xs uppercase tracking-[var(--wsop-label-tracking)] text-white/60">
        {t("label")}
      </span>
      {(
        [
          {
            href: "https://apps.apple.com/us/app/wsop-live-wsop-official-app/id1660727059",
            icon: "apple.svg",
            name: "appStore",
          },
          {
            href: "https://play.google.com/store/apps/details?id=com.nsus.wsopplus&hl=en",
            icon: "google-play.svg",
            name: "googlePlay",
          },
        ] as const
      ).map(({ href, icon, name }) => (
        <Button
          asChild
          size="lg"
          variant="secondary-outline"
          key={name}
          className="group h-auto min-h-[4.25rem] min-w-48 flex-1 justify-start gap-3 rounded-xl border-white/20 bg-white/[0.04] px-3 py-2.5 text-left text-white hover:bg-white/[0.08] hover:text-white"
        >
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={t(`${name}Aria`)}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-[0.625rem] bg-white">
              <Image
                src={`/src/img/wsop/${icon}`}
                alt=""
                width={20}
                height={20}
                className="size-5 invert"
                aria-hidden="true"
              />
            </span>
            <span className="grid min-w-0 gap-0.5">
              <small className="font-[var(--wsop-font-label)] text-[0.625rem] uppercase text-white/60">
                {t("viewOn")}
              </small>
              <strong className="text-base font-medium">{t(name)}</strong>
            </span>
            <ArrowOutUpRightSquare
              className="ml-auto !size-4 shrink-0 opacity-60"
              aria-hidden="true"
            />
          </a>
        </Button>
      ))}
    </div>
  );
}

export function WsopPage() {
  const t = useTranslations("wsop");
  const walletT = useTranslations("wallets.hero");
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallax = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  return (
    <MotionConfig reducedMotion="user">
      <motion.a
        className="wsop-skip-link"
        href="#wsop-main"
        initial={{ y: "-180%" }}
        whileFocus={{ y: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        {t("accessibility.skipToMain")}
      </motion.a>
      <main id="wsop-main">
        <section
          className="wsop-hero"
          aria-labelledby="wsop-title"
          ref={heroRef}
        >
          <motion.div
            className="wsop-hero__image-motion absolute inset-0 z-[-3]"
            style={reduceMotion ? undefined : { y: heroParallax }}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#a9def3_0%,#e6f7fd_40%,#bfeaf5_47%,#58c3d9_60%,#1f95b8_78%,#0b5f80_100%)]" />
            <ParadiseScene className="absolute inset-0 size-full" />
          </motion.div>
          <div className="absolute inset-0 z-[-2] bg-[linear-gradient(90deg,rgba(4,40,58,0.92),rgba(4,40,58,0.85)),linear-gradient(0deg,rgba(4,40,58,0.7),transparent_45%)] md:bg-[linear-gradient(90deg,rgba(4,40,58,0.82),rgba(4,40,58,0.35)_55%,transparent_80%),linear-gradient(0deg,rgba(4,40,58,0.7),transparent_45%)]" />
          <motion.div
            className="wsop-hero__topline !border-white/20 !bg-[rgba(4,40,58,0.35)] !text-white/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            <p>{t("hero.topline")}</p>
            <p>{t("hero.presentedBy")}</p>
          </motion.div>
          <motion.div
            className="wsop-hero__content"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            <motion.div variants={heroItemVariants} className="mb-8">
              <Image
                src="/src/img/wsop/paradise/paradise-lockup.webp"
                alt={t("hero.lockupAlt")}
                width={1611}
                height={361}
                priority
                className="h-auto w-[min(78vw,380px)]"
              />
            </motion.div>
            <motion.div variants={heroItemVariants}>
              <p className="wsop-eyebrow wsop-hero__eyebrow">
                <SuitRun />
                {t("hero.eyebrow")}
              </p>
            </motion.div>
            <div className="wsop-hero__title-mask">
              <motion.h1 id="wsop-title" variants={heroTitleVariants}>
                {t("hero.title")}
              </motion.h1>
            </div>
            <motion.p
              variants={heroItemVariants}
              className="mt-6 max-w-[34rem] text-lg text-white/85 md:text-xl"
            >
              {t("hero.description")}
            </motion.p>
            <motion.a
              variants={heroItemVariants}
              className="wsop-button mt-8 w-fit"
              href="#how-to-buy-in"
            >
              <span>{t("hero.cta")}</span>
              <motion.span
                animate={reduceMotion ? { y: 0 } : { y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowDown aria-hidden="true" />
              </motion.span>
            </motion.a>
          </motion.div>
        </section>
        <section
          className="wsop-section scroll-mt-24"
          id="how-to-buy-in"
          aria-labelledby="how-to-heading"
        >
          <Reveal>
            <SectionLabel suit="diamond">{t("howTo.label")}</SectionLabel>
            <div className="wsop-section-heading">
              <h2 id="how-to-heading">{t("howTo.title")}</h2>
              <p>{t("howTo.description")}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
            <div className="lg:sticky lg:top-24">
              <Video
                platform="local"
                id={BUY_IN_VIDEO.src}
                thumbnail={BUY_IN_VIDEO.poster}
                aspectRatio="1:1"
                autoplay={false}
                loop={false}
                title={t("howTo.videoTitle")}
                alt=""
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="rounded-2xl border border-[var(--wsop-border-prominent)] bg-[var(--wsop-card)]"
                bgColorClass="border border-white/30 bg-white/15 backdrop-blur-md"
                playButtonClassName="!h-20 !w-20"
              />
              <p className="mt-4 font-[var(--wsop-font-label)] text-xs text-white/55 uppercase tracking-[var(--wsop-label-tracking)]">
                {t("howTo.videoNote")}
              </p>
            </div>
            <div>
              <Stagger className="block">
                <ol className="m-0 list-none p-0">
                  {HOW_TO_STEPS.map(({ step, icon: StepIcon }) => (
                    <motion.li
                      key={step}
                      variants={staggerItemVariants}
                      className="flex border-t border-[var(--wsop-border)] py-5"
                    >
                      <span className="w-12 shrink-0 pt-0.5" aria-hidden="true">
                        <StepIcon
                          pack="filled"
                          className="size-6 fill-[var(--wsop-green)]"
                        />
                      </span>
                      <span className="text-lg leading-snug text-white/75">
                        {t.rich(`howTo.steps.${step}`, {
                          strong: (chunks: React.ReactNode) => (
                            <strong className="font-medium text-white">
                              {chunks}
                            </strong>
                          ),
                          link: (chunks: React.ReactNode) => (
                            <a
                              href="https://apps.apple.com/us/app/wsop-live-wsop-official-app/id1660727059"
                              target="_blank"
                              rel="noreferrer"
                              className="!underline decoration-white/30 underline-offset-4 hover:decoration-white"
                            >
                              {chunks}
                            </a>
                          ),
                        })}
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </Stagger>
              <AppDownloadButtons />
            </div>
          </div>
        </section>
        <section
          className="wsop-section wsop-buyins"
          aria-labelledby="why-heading"
        >
          <Reveal>
            <SectionLabel suit="spade">{t("whyOnchain.label")}</SectionLabel>
            <div className="wsop-section-heading wsop-buyins__heading">
              <h2 id="why-heading">{t("whyOnchain.title")}</h2>
              <p>{t("whyOnchain.description")}</p>
            </div>
            <Stagger className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map(({ id, suit, rank }) => (
                <motion.article
                  className="wsop-benefit"
                  key={id}
                  variants={dealVariants}
                >
                  <span
                    className={`wsop-benefit__index ${isRedSuit(suit) ? "is-red" : ""}`}
                    aria-hidden="true"
                  >
                    {rank}
                    <SuitIcon suit={suit} />
                  </span>
                  <SuitIcon className="wsop-benefit__pip" suit={suit} />
                  <h3>{t(`whyOnchain.cards.${id}.title`)}</h3>
                  <p>{t(`whyOnchain.cards.${id}.body`)}</p>
                  <span
                    className={`wsop-benefit__index wsop-benefit__index--mirror ${isRedSuit(suit) ? "is-red" : ""}`}
                    aria-hidden="true"
                  >
                    {rank}
                    <SuitIcon suit={suit} />
                  </span>
                </motion.article>
              ))}
            </Stagger>
          </Reveal>
        </section>
        <section
          className="wsop-section wsop-ambassadors"
          aria-labelledby="stories-heading"
        >
          <Reveal>
            <SectionLabel suit="club">{t("stories.label")}</SectionLabel>
            <div className="wsop-section-heading wsop-ambassadors__heading">
              <h2 id="stories-heading">{t("stories.title")}</h2>
              <p>{t("stories.description")}</p>
            </div>
            <Stagger className="wsop-ambassadors__grid">
              {ambassadors.map((ambassador, index) => (
                <motion.article
                  className="wsop-ambassador"
                  key={ambassador.name}
                  variants={staggerItemVariants}
                  whileHover={reduceMotion ? { y: 0 } : { y: -2 }}
                  transition={{ duration: 0.18, ease: EASE }}
                >
                  <div className="wsop-ambassador__portrait">
                    <Image
                      className="wsop-ambassador__portrait-image"
                      src={ambassador.image}
                      alt=""
                      fill
                      sizes="(min-width: 1100px) 20vw, (min-width: 640px) 36vw, 100vw"
                      unoptimized={ambassador.unoptimized}
                    />
                  </div>
                  <div className="wsop-ambassador__copy">
                    <span>{t("stories.episode", { number: index + 1 })}</span>
                    <p>{t(`stories.profiles.${ambassador.id}.title`)}</p>
                    <h3>{ambassador.name}</h3>
                    <p className="!mt-3 !text-sm !text-white/70">
                      <strong className="mr-2 font-[var(--wsop-font-label)] text-xs font-medium uppercase text-[var(--wsop-green)]">
                        {t(`stories.profiles.${ambassador.id}.theme`)}
                      </strong>
                      {t(`stories.profiles.${ambassador.id}.themeLine`)}
                    </p>
                    <p className="!mt-4 !text-base !text-[var(--wsop-muted)]">
                      {t(`stories.profiles.${ambassador.id}.biography`)}
                    </p>
                    {ambassador.href ? (
                      <a
                        className="wsop-ambassador__story"
                        href={ambassador.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("stories.watch")}
                        <ArrowOutUpRightSquare aria-hidden="true" />
                      </a>
                    ) : (
                      <div className="wsop-ambassador__story">
                        {ambassador.releaseDate
                          ? t("stories.goesLive", {
                              date: ambassador.releaseDate,
                            })
                          : t("stories.comingSoon")}
                        <Clock3 aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </Stagger>
          </Reveal>
        </section>
        <BrandMarquee />
        <section
          className="wsop-section wsop-event"
          id="showdown"
          aria-labelledby="showdown-heading"
        >
          <Reveal>
            <SectionLabel suit="heart">{t("showdown.label")}</SectionLabel>
            <div className="wsop-section-heading wsop-event__intro">
              <div>
                <Image
                  src="/src/img/wsop/paradise/showdown-lockup.webp"
                  alt={t("showdown.lockupAlt")}
                  width={842}
                  height={770}
                  className="mb-6 h-auto w-40 md:w-48"
                />
                <LiveChip>{t("showdown.chip")}</LiveChip>
                <h2 id="showdown-heading">{t("showdown.title")}</h2>
              </div>
              <p>{t("showdown.description")}</p>
            </div>
            <div className="wsop-event__layout">
              <motion.div
                className="wsop-ticket !bg-[linear-gradient(135deg,#f3fbfe,#cfeefa)]"
                whileHover={reduceMotion ? { rotate: 0 } : { rotate: -0.75 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="wsop-ticket__topline">
                  <span>{t("showdown.ticket.topline")}</span>
                  <span>{t("showdown.ticket.type")}</span>
                  <span>NLH</span>
                </div>
                <div className="wsop-ticket__place">
                  <div className="wsop-ticket__chip" aria-hidden="true">
                    <span>WSOP</span>
                    <SuitRun className="wsop-ticket__chip-suits" />
                  </div>
                  <p className="wsop-ticket__prize">
                    <strong>{t("showdown.ticket.name")}</strong>
                    <span>{t("showdown.ticket.subtitle")}</span>
                  </p>
                </div>
                <div className="wsop-ticket__date !flex-wrap">
                  <span>{t("showdown.ticket.dateLabel")}</span>
                  <span className="wsop-ticket__pen" aria-hidden="true">
                    12-12
                  </span>
                  <time dateTime="2026-12-12">
                    {t("showdown.ticket.dateValue")}
                  </time>
                </div>
                <div className="wsop-ticket__scan">
                  <span className="wsop-ticket__serial">1212-009</span>
                  <TicketBarcode value="12122026" />
                </div>
                <div className="wsop-ticket__bottomline">
                  <span>{t("showdown.ticket.venue")}</span>
                  <span>{t("showdown.ticket.streamed")}</span>
                  <span>{t("showdown.ticket.inviteOnly")}</span>
                </div>
              </motion.div>
              <Stagger className="wsop-event__details">
                {SHOWDOWN_DETAILS.map((id) => (
                  <motion.div
                    className="wsop-detail"
                    key={id}
                    variants={staggerItemVariants}
                  >
                    <span>{t(`showdown.details.${id}.label`)}</span>
                    <p>{t(`showdown.details.${id}.value`)}</p>
                  </motion.div>
                ))}
              </Stagger>
            </div>
            <div className="wsop-lineup">
              <div>
                <p className="wsop-eyebrow">{t("showdown.lineup.eyebrow")}</p>
                <h3>{t("showdown.lineup.title")}</h3>
              </div>
              <motion.ol
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                variants={staggerVariants}
              >
                {Array.from({ length: 9 }, (_, index) => (
                  <motion.li key={index} variants={dealVariants}>
                    <div className="wsop-lineup__player hover:!bg-transparent hover:!shadow-none">
                      <span className="relative grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
                        <svg
                          viewBox="0 0 48 48"
                          className="size-9 fill-white/25"
                          aria-hidden="true"
                        >
                          <circle cx="24" cy="17" r="8" />
                          <path d="M8 42c1-10 7-15 16-15s15 5 16 15Z" />
                        </svg>
                        <span className="absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full bg-black">
                          <Image
                            src="/src/img/logos-solana/logomark.inline.svg"
                            alt=""
                            width={12}
                            height={11}
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                      <span className="wsop-lineup__identity">
                        <strong>
                          {t("showdown.lineup.seat", { number: index + 1 })}
                        </strong>
                        <span>{t("showdown.lineup.unrevealed")}</span>
                      </span>
                      <SuitIcon
                        className="wsop-lineup__suit"
                        suit={SUITS[index % SUITS.length]}
                      />
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
            <div className="wsop-event__cta">
              <p>{t("showdown.cta.description")}</p>
              <ArrowLink href="https://x.com/solana">
                {t("showdown.cta.action")}
              </ArrowLink>
            </div>
          </Reveal>
        </section>
        <section className="wsop-start" aria-labelledby="get-started-heading">
          <Reveal className="wsop-start__inner">
            <SectionLabel suit="diamond">{t("start.label")}</SectionLabel>
            <div className="wsop-start__grid">
              <article className="wsop-start__card wsop-start__card--guide">
                <div className="wsop-start__content">
                  <div className="wsop-start__guide-copy">
                    <h3>{t("start.guide")}</h3>
                    <p>{t("start.guideDescription")}</p>
                  </div>
                  <div className="wsop-start__actions">
                    <CrossAppLink
                      className="wsop-button wsop-start__guide-action"
                      href="/poker-players-guide-to-crypto"
                    >
                      <span>{t("start.guideCta")}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </CrossAppLink>
                  </div>
                </div>
              </article>

              <article className="wsop-start__card wsop-start__card--onboarding">
                <div className="wsop-start__content">
                  <h2 id="get-started-heading">{t("start.title")}</h2>
                  <p>{t("start.description")}</p>
                  <div className="wsop-start__actions">
                    <Link
                      className="wsop-button wsop-button--light"
                      href="/wallets"
                    >
                      <span>{t("start.findWallet")}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                    <CrossAppLink
                      className="wsop-button"
                      href="/poker-players-guide-to-crypto"
                    >
                      <span>{walletT("learnBasics")}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </CrossAppLink>
                  </div>
                </div>
              </article>
            </div>
          </Reveal>
        </section>
      </main>
    </MotionConfig>
  );
}
