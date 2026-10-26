"use client";

import { useRef } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Video } from "@/component-library/video";
import { LatestNews } from "@/components/solutions/latest-news.v2";
import type { NewsItem } from "@/components/solutions/latest-news.v2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
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

import { cn } from "@/app/components/utils";

const eyebrowClass =
  "font-[family-name:var(--wsop-font-label)] text-[length:var(--wsop-label-size)] font-medium tracking-[var(--wsop-label-tracking)] leading-[1.33] uppercase text-[var(--wsop-accent)]";
const sectionClass =
  "relative w-[min(100%,_1440px)] mx-auto py-[clamp(4rem,calc(10vw+2rem),10rem)] px-5 md:px-8 lg:py-[clamp(6rem,_7vw,_7.5rem)] xl:px-[2.5rem]";
const sectionHeadingClass =
  "grid gap-6 lg:grid-cols-[minmax(0,_1fr)_minmax(20rem,_0.55fr)] lg:items-end lg:gap-12 xl:grid-cols-[minmax(0,_1fr)_minmax(22rem,_0.55fr)] xl:gap-16";
const sectionTitleClass =
  "max-w-[14ch] text-[clamp(2rem,calc(4.6875vw+0.25rem),4rem)] tracking-[-0.04em] leading-[1.125] font-medium text-balance";
const sectionDescriptionClass =
  "max-w-[36rem] text-[var(--wsop-muted)] text-[clamp(1.125rem,3.125vw,1.5rem)] tracking-[-0.02em] leading-[1.45] md:leading-[1.33]";
const buttonClass =
  "inline-flex min-h-12 items-center justify-between gap-5 pt-2 pr-2 pb-2 pl-5 border-0 rounded-full bg-white text-black cursor-pointer text-[1rem] font-medium tracking-[-0.01em] leading-tight [&_svg]:w-8 [&_svg]:h-8 [&_svg]:p-2 [&_svg]:rounded-full [&_svg]:bg-black [&_svg]:text-white [&_svg]:stroke-[2.5] [&_svg]:transition-transform [&_svg]:duration-180 [&_svg]:ease-wsop [&:hover_svg]:translate-x-[1px] [&:hover_svg]:translate-y-[-1px] hover:bg-[rgba(255,_255,_255,_0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--wsop-accent)] focus-visible:outline-offset-[4px] md:text-[1.125rem] motion-reduce:[&_svg]:transition-none motion-reduce:[&:hover_svg]:transform-none";

type Icon = typeof Spade;

/** Solana logomark in a single fill so it sits alongside the filled Boxicons. */
const SolanaMark = ({ className }: { className?: string; pack?: "filled" }) => (
  <svg
    className={className}
    viewBox="0 0 31 27"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="m30.179 21.3-5.008 5.332a1.143 1.143 0 0 1-.848.368H.583a.59.59 0 0 1-.535-.348.568.568 0 0 1-.04-.328.593.593 0 0 1 .148-.298l5.002-5.332a1.141 1.141 0 0 1 .848-.368h23.74a.574.574 0 0 1 .43.971l.003.003ZM25.17 10.56a1.192 1.192 0 0 0-.848-.368H.583a.59.59 0 0 0-.535.349.569.569 0 0 0-.04.328c.02.112.071.213.148.297l5.002 5.335c.107.115.24.208.384.27.147.064.303.095.464.098h23.74a.574.574 0 0 0 .529-.348.569.569 0 0 0-.108-.623l-5-5.335.003-.003ZM.582 6.73h23.74a1.2 1.2 0 0 0 .464-.096c.147-.064.277-.154.384-.272L30.18 1.03a.579.579 0 0 0-.107-.881.571.571 0 0 0-.323-.09H6.006c-.158 0-.317.034-.464.095a1.126 1.126 0 0 0-.384.273L.156 5.759a.582.582 0 0 0-.108.625.59.59 0 0 0 .534.348V6.73Z" />
  </svg>
);

const HOW_TO_STEPS: Array<{ step: number; icon: Icon | typeof SolanaMark }> = [
  { step: 1, icon: Mobile },
  { step: 2, icon: UserPlus },
  { step: 3, icon: CalendarDownArrow },
  { step: 4, icon: CursorClick },
  { step: 5, icon: Ticket },
  { step: 6, icon: SolanaMark },
  { step: 7, icon: Wallet },
];

const ParadiseScene = dynamic(() => import("./paradise-scene"), { ssr: false });

// Swap src and poster when the final walkthrough is delivered.
const BUY_IN_VIDEO = {
  src: "/src/img/wsop/paradise/buy-in-walkthrough-placeholder.mp4",
  poster: "/src/img/wsop/paradise/buy-in-walkthrough-poster.webp",
};

const JAMIE_GOLD_WIDE_VIDEO =
  "https://xbjpr0reg4kgflon.public.blob.vercel-storage.com/wsop/2026-10-17_WSOP_JamieGold_LB_v4_WIDE.mp4";

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
  wideVideo?: string;
}> = [
  {
    id: "jamieGold",
    name: "Jamie Gold",
    image: "/src/img/wsop/jamie-gold.webp",
    wideVideo: JAMIE_GOLD_WIDE_VIDEO,
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
  className,
  redClassName = "text-[var(--wsop-red-bright)]",
}: {
  suit: Suit;
  className?: string;
  redClassName?: string;
}) {
  const Icon = SUIT_ICONS[suit];
  return (
    <Icon
      className={cn(
        "fill-current stroke-[1.75]",
        className,
        isRedSuit(suit) && redClassName,
      )}
      pack="filled"
      aria-hidden="true"
    />
  );
}

function SuitRun({
  className,
  iconClassName = "size-[0.85rem]",
  redClassName,
}: {
  className?: string;
  iconClassName?: string;
  redClassName?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-white/55", className)}
      aria-hidden="true"
    >
      {SUITS.map((suit) => (
        <SuitIcon
          key={suit}
          suit={suit}
          className={iconClassName}
          redClassName={redClassName}
        />
      ))}
    </span>
  );
}

function LiveChip({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <span
      className={
        "inline-flex min-h-8 items-center gap-[0.6rem] py-[0.35rem] px-3 rounded-full bg-[rgba(217,_0,_41,_0.16)] text-[var(--wsop-red-bright)] font-[family-name:var(--wsop-font-label)] text-[0.7rem] font-medium tracking-[0.08em] uppercase"
      }
    >
      <motion.span
        className="size-[0.45rem] rounded-full bg-[var(--wsop-red-bright)] shadow-[0_0_0_4px_rgba(217,0,41,0.16)]"
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
    <div className="mb-[clamp(2rem,4vw,3rem)] flex w-fit items-center gap-3 font-[family-name:var(--wsop-font-label)] text-[length:var(--wsop-label-size)] font-medium leading-[1.33] tracking-[var(--wsop-label-tracking)] text-[var(--wsop-accent)] uppercase">
      <SuitIcon suit={suit} className="size-4 shrink-0 text-white/40" />
      <p className="border-l border-[var(--wsop-border-prominent)] pl-3">
        {children}
      </p>
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
      className={`${buttonClass} ${className}`}
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
    <div
      className={`flex flex-[0_0_auto] min-w-max animate-wsop-marquee motion-reduce:animate-none ${hidden ? "motion-reduce:hidden" : ""}`}
      aria-hidden={hidden || undefined}
    >
      {MARQUEE_LINE_IDS.map((id, index) => (
        <span
          className={
            "inline-flex items-center gap-[2.25rem] pr-[2.25rem] whitespace-nowrap"
          }
          key={id}
        >
          <span
            className={
              "text-[rgba(255,_255,_255,_0.56)] font-[family-name:var(--wsop-font-label)] text-xs font-medium tracking-[0.08em] uppercase"
            }
          >
            {t(id)}
          </span>
          <SuitIcon
            className={"w-[0.8rem] h-[0.8rem] text-[rgba(255,_255,_255,_0.3)]"}
            suit={SUITS[index % SUITS.length]}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={
        "flex overflow-hidden py-[0.9rem] border-b border-b-[var(--wsop-border)]"
      }
    >
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
      className={
        "w-[min(100%,_16rem)] h-[3.4rem] text-[var(--ticket-ink)] justify-self-center xl:h-16"
      }
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
      <span className="w-full font-[family-name:var(--wsop-font-label)] text-xs uppercase tracking-[var(--wsop-label-tracking)] text-white/60">
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
              <small className="font-[family-name:var(--wsop-font-label)] text-[0.6875rem] uppercase text-white/60">
                {t("viewOn")}
              </small>
              <strong className="text-base font-medium">{t(name)}</strong>
            </span>
            <ArrowOutUpRightSquare
              className="ml-auto size-4 shrink-0 opacity-60"
              aria-hidden="true"
            />
          </a>
        </Button>
      ))}
    </div>
  );
}

export function WsopPage({ news }: { news: NewsItem[] }) {
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
        className={
          "fixed z-[100] top-4 left-4 py-3 px-4 rounded-full bg-white text-black font-[family-name:var(--wsop-font-label)] text-xs tracking-[var(--wsop-label-tracking)] uppercase"
        }
        href="#wsop-main"
        initial={{ y: "-180%" }}
        whileFocus={{ y: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        {t("accessibility.skipToMain")}
      </motion.a>
      <main id="wsop-main">
        <section
          className={
            "relative flex min-h-[max(620px,_calc(100svh_-_70px))] flex-col overflow-hidden border-b border-b-[var(--wsop-border)] isolate"
          }
          aria-labelledby="wsop-title"
          ref={heroRef}
        >
          <motion.div
            className=" absolute inset-0 z-[-3]"
            style={reduceMotion ? undefined : { y: heroParallax }}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#a9def3_0%,#e6f7fd_40%,#bfeaf5_47%,#58c3d9_60%,#1f95b8_78%,#0b5f80_100%)]" />
            <ParadiseScene className="absolute inset-0 size-full" />
          </motion.div>
          <div className="absolute inset-0 z-[-2] bg-[linear-gradient(180deg,rgba(4,40,58,0.9)_0%,rgba(4,40,58,0.85)_65%,rgba(4,40,58,0.12)_72%,rgba(4,40,58,0.18)_100%)] md:bg-[linear-gradient(90deg,rgba(4,40,58,0.82),rgba(4,40,58,0.35)_55%,transparent_80%),linear-gradient(0deg,rgba(4,40,58,0.7),transparent_45%)]" />
          <motion.div
            className={
              "flex justify-between gap-8 border-b border-white/20 bg-[rgba(4,40,58,0.82)] px-5 py-4 font-[family-name:var(--wsop-font-label)] text-[0.7rem] font-medium leading-[1.4] tracking-[0.08em] text-white/80 uppercase backdrop-blur-md md:px-8 xl:px-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))] max-[767px]:[&>p:last-child]:hidden"
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            <p className="font-[family-name:var(--wsop-font-label)]">
              {t("hero.topline")}
            </p>
            <p className="font-[family-name:var(--wsop-font-label)] text-[var(--wsop-accent)]">
              {t("hero.presentedBy")}
            </p>
          </motion.div>
          <motion.div
            className={
              "block w-[min(100%,_1440px)] mx-auto pt-[clamp(4rem,9vw,7.75rem)] pb-[clamp(8rem,11vw,10rem)] px-5 md:px-8 xl:px-[2.5rem]"
            }
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            <motion.div variants={heroItemVariants} className="mb-10">
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
              <p className={`${eyebrowClass} flex items-center gap-3`}>
                <SuitRun />
                {t("hero.eyebrow")}
              </p>
            </motion.div>
            <div className={"mt-3 overflow-hidden"}>
              <motion.h1
                id="wsop-title"
                variants={heroTitleVariants}
                className="max-w-[11ch] text-[clamp(2.5rem,calc(6.25vw+0.5rem),5.5rem)] tracking-[-0.03em] leading-none font-medium text-balance"
              >
                {t("hero.title")}
              </motion.h1>
            </div>
            <motion.p
              variants={heroItemVariants}
              className="mt-7 max-w-[32rem] text-balance text-lg leading-relaxed text-white/85 md:text-xl"
            >
              {t("hero.description")}
            </motion.p>
            <motion.a
              variants={heroItemVariants}
              className={`${buttonClass} mt-10 w-fit`}
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
          className={`${sectionClass} scroll-mt-24`}
          id="how-to-buy-in"
          aria-labelledby="how-to-heading"
        >
          <Reveal>
            <SectionLabel suit="diamond">{t("howTo.label")}</SectionLabel>
            <div className={`${sectionHeadingClass}`}>
              <h2 id="how-to-heading" className={sectionTitleClass}>
                {t("howTo.title")}
              </h2>
              <p className={sectionDescriptionClass}>
                {t("howTo.description")}
              </p>
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
                playButtonClassName="h-20 w-20"
              />
              <p className="mt-5 font-[family-name:var(--wsop-font-label)] text-xs leading-relaxed text-white/55 uppercase tracking-[var(--wsop-label-tracking)]">
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
                      className="flex border-t border-[var(--wsop-border)] py-6"
                    >
                      <span className="w-12 shrink-0 pt-0.5" aria-hidden="true">
                        <StepIcon
                          pack="filled"
                          className="size-6 fill-[var(--wsop-accent)]"
                        />
                      </span>
                      <span className="text-lg leading-relaxed text-white/75">
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
                              className="underline decoration-white/30 underline-offset-4 hover:decoration-white"
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
          className={`${sectionClass} border-t border-t-[var(--wsop-border)] border-b border-b-[var(--wsop-border)]`}
          aria-labelledby="why-heading"
        >
          <Reveal>
            <SectionLabel suit="spade">{t("whyOnchain.label")}</SectionLabel>
            <div className={`${sectionHeadingClass} `}>
              <h2 id="why-heading" className={sectionTitleClass}>
                {t("whyOnchain.title")}
              </h2>
              <p className={sectionDescriptionClass}>
                {t("whyOnchain.description")}
              </p>
            </div>
            <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map(({ id, suit, rank }) => (
                <motion.article
                  className={
                    "[--card-pad:1rem] relative flex flex-col p-[var(--card-pad)] border border-[rgba(0,_0,_0,_0.1)] rounded-xl bg-white text-[#16141c] shadow-[0_14px_32px_rgba(0,_0,_0,_0.2)] md:[--card-pad:1.25rem] md:max-[959px]:min-h-[clamp(30rem,_52vw,_31rem)] min-[960px]:min-h-0 min-[960px]:max-[1023px]:grid min-[960px]:max-[1023px]:grid-rows-[auto_minmax(3.25rem,_1fr)_auto_auto] max-[559px]:min-h-[clamp(19.5rem,_72vw,_22.75rem)] max-[374px]:min-h-0 max-[374px]:aspect-[5/7] [--card-pad:1.25rem] aspect-[5/7] md:max-[959px]:aspect-auto lg:aspect-[4/5] lg:[--card-pad:1.75rem]"
                  }
                  key={id}
                  variants={dealVariants}
                >
                  <span
                    className={cn(
                      "inline-flex w-fit flex-col items-center gap-[0.3rem] font-[family-name:var(--wsop-font-label)] text-[0.8rem] font-medium leading-none",
                      isRedSuit(suit)
                        ? "text-[var(--wsop-red)]"
                        : "text-[rgba(22,20,28,0.72)]",
                    )}
                    aria-hidden="true"
                  >
                    {rank}
                    <SuitIcon
                      suit={suit}
                      className="size-[0.6875rem]"
                      redClassName="text-[var(--wsop-red)]"
                    />
                  </span>
                  <SuitIcon
                    className={
                      "absolute top-1/2 left-1/2 w-[3.25rem] h-[3.25rem] text-[#16141c] translate-x-[-50%] translate-y-[-50%] min-[960px]:max-[1023px]:static min-[960px]:max-[1023px]:w-[clamp(2.5rem,_12vw,_3.25rem)] min-[960px]:max-[1023px]:h-[clamp(2.5rem,_12vw,_3.25rem)] min-[960px]:max-[1023px]:row-[2] min-[960px]:max-[1023px]:self-end min-[960px]:max-[1023px]:justify-self-center min-[960px]:max-[1023px]:transform-none max-[559px]:w-[clamp(2.5rem,_12vw,_3.25rem)] max-[559px]:h-[clamp(2.5rem,_12vw,_3.25rem)]"
                    }
                    suit={suit}
                    redClassName="text-[var(--wsop-red)]"
                  />
                  <h3 className="mt-auto max-w-[16ch] text-[clamp(1.125rem,2.1875vw,1.75rem)] font-medium tracking-[-0.02em] leading-[1.2] text-balance min-[960px]:max-[1023px]:mt-2">
                    {t(`whyOnchain.cards.${id}.title`)}
                  </h3>
                  <p className="mt-3 max-w-[21rem] pr-10 text-[0.9375rem] leading-relaxed text-[#16141ca3]">
                    {t(`whyOnchain.cards.${id}.body`)}
                  </p>
                  <span
                    className={cn(
                      "absolute right-[var(--card-pad)] bottom-[var(--card-pad)] inline-flex w-fit rotate-180 flex-col items-center gap-[0.3rem] font-[family-name:var(--wsop-font-label)] text-[0.8rem] font-medium leading-none opacity-[0.45]",
                      isRedSuit(suit)
                        ? "text-[var(--wsop-red)]"
                        : "text-[rgba(22,20,28,0.72)]",
                    )}
                    aria-hidden="true"
                  >
                    {rank}
                    <SuitIcon
                      suit={suit}
                      className="size-[0.6875rem]"
                      redClassName="text-[var(--wsop-red)]"
                    />
                  </span>
                </motion.article>
              ))}
            </Stagger>
          </Reveal>
        </section>
        <section
          className={`${sectionClass} border-t border-t-[var(--wsop-border)]`}
          aria-labelledby="stories-heading"
        >
          <Reveal>
            <SectionLabel suit="club">{t("stories.label")}</SectionLabel>
            <div className={`${sectionHeadingClass} `}>
              <h2 id="stories-heading" className={sectionTitleClass}>
                {t("stories.title")}
              </h2>
              <p className={sectionDescriptionClass}>
                {t("stories.description")}
              </p>
            </div>
            <Stagger
              className={
                "grid gap-4 mt-8 md:mt-12 min-[1100px]:grid-cols-[repeat(2,_minmax(0,_1fr))]"
              }
            >
              {ambassadors.map((ambassador, index) => (
                <motion.article
                  className={
                    "grid overflow-hidden border border-[var(--wsop-border)] rounded-2xl bg-[var(--wsop-card)] transition-[border-color,box-shadow] duration-180 ease-wsop-standard hover:border-[var(--wsop-border-prominent)] hover:shadow-[0_18px_44px_rgba(0,_0,_0,_0.24)] sm:grid-cols-[minmax(13rem,_0.8fr)_minmax(0,_1.2fr)] min-[1100px]:[&:last-child:nth-child(odd)]:w-[calc(50%_-_0.5rem)] min-[1100px]:[&:last-child:nth-child(odd)]:col-[1_/_-1] min-[1100px]:[&:last-child:nth-child(odd)]:justify-self-center motion-reduce:transition-none"
                  }
                  key={ambassador.name}
                  variants={staggerItemVariants}
                  whileHover={reduceMotion ? { y: 0 } : { y: -2 }}
                  transition={{ duration: 0.18, ease: EASE }}
                >
                  <div
                    className={
                      "relative flex min-h-72 flex-col items-center justify-center overflow-hidden border-b border-b-[var(--wsop-border)] bg-[#121116] bg-[radial-gradient(_circle_at_50%_64%,_rgba(85,_233,_171,_0.26),_transparent_38%),linear-gradient(145deg,_rgba(202,_159,_245,_0.2),_transparent_48%)] before:absolute before:z-[1] before:inset-3 before:border before:border-[var(--wsop-border)] before:rounded-xl before:content-[''] before:pointer-events-none sm:min-h-full sm:border-r sm:border-r-[var(--wsop-border)] sm:border-b-0"
                    }
                  >
                    <Image
                      className="object-cover object-center"
                      src={ambassador.image}
                      alt=""
                      fill
                      sizes="(min-width: 1100px) 20vw, (min-width: 640px) 36vw, 100vw"
                      unoptimized={ambassador.unoptimized}
                    />
                  </div>
                  <div
                    className={
                      "flex min-h-[23rem] flex-col p-5 [&>span]:text-[var(--wsop-accent)] [&>span]:font-[family-name:var(--wsop-font-label)] [&>span]:text-[0.7rem] [&>p:first-of-type]:mt-auto [&>p:first-of-type]:text-[var(--wsop-accent)] [&>p:first-of-type]:font-[family-name:var(--wsop-font-label)] [&>p:first-of-type]:text-[0.7rem] [&>p:first-of-type]:tracking-[0.06em] [&>p:first-of-type]:uppercase [&_h3]:mt-3 [&_h3]:text-[1.75rem] [&_h3]:font-medium [&_h3]:tracking-[-0.03em] [&_h3]:leading-[1.15] sm:min-h-[27rem] sm:p-6 xl:[&_h3]:text-[2.25rem]"
                    }
                  >
                    <span>{t("stories.episode", { number: index + 1 })}</span>
                    <p>{t(`stories.profiles.${ambassador.id}.title`)}</p>
                    <h3 className="font-medium text-balance">
                      {ambassador.name}
                    </h3>
                    <div className="mt-5 flex flex-col gap-1.5 border-l border-[var(--wsop-border-prominent)] pl-3">
                      <strong className="font-[family-name:var(--wsop-font-label)] text-xs font-medium tracking-[0.06em] text-[var(--wsop-accent)] uppercase">
                        {t(`stories.profiles.${ambassador.id}.theme`)}
                      </strong>
                      <span className="text-sm leading-snug text-white/75">
                        {t(`stories.profiles.${ambassador.id}.themeLine`)}
                      </span>
                    </div>
                    <p className="mt-5 text-base leading-relaxed text-[var(--wsop-muted)]">
                      {t(`stories.profiles.${ambassador.id}.biography`)}
                    </p>
                    {ambassador.wideVideo ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className={`${buttonClass} mt-6 w-fit`}
                          >
                            {t("stories.watch")}
                            <ArrowUpRight aria-hidden="true" />
                          </button>
                        </DialogTrigger>
                        <DialogContent
                          className="w-[min(calc(100vw_-_2rem),calc(177.78dvh_-_3.56rem),64rem)] max-w-none overflow-hidden border-0 bg-black p-0 shadow-xl"
                          closeClassName="z-10 bg-black/80 text-white hover:opacity-100"
                        >
                          <DialogTitle className="sr-only">
                            {`${t("stories.watch")}: ${ambassador.name}`}
                          </DialogTitle>
                          <DialogDescription className="sr-only">
                            {t("stories.watch")}
                          </DialogDescription>
                          <video
                            className="block aspect-video w-full"
                            src={ambassador.wideVideo}
                            title={ambassador.name}
                            controls
                            autoPlay
                            playsInline
                            preload="none"
                          />
                        </DialogContent>
                      </Dialog>
                    ) : ambassador.href ? (
                      <a
                        className={
                          "flex items-center justify-between gap-2 mt-6 pt-4 border-t border-t-[var(--wsop-border)] text-[var(--wsop-muted)] font-[family-name:var(--wsop-font-label)] text-[0.6875rem] tracking-[0.05em] uppercase [&_svg]:w-[0.9rem]"
                        }
                        href={ambassador.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("stories.watch")}
                        <ArrowOutUpRightSquare aria-hidden="true" />
                      </a>
                    ) : (
                      <div
                        className={
                          "flex items-center justify-between gap-2 mt-6 pt-4 border-t border-t-[var(--wsop-border)] text-[var(--wsop-muted)] font-[family-name:var(--wsop-font-label)] text-[0.6875rem] tracking-[0.05em] uppercase [&_svg]:w-[0.9rem]"
                        }
                      >
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
          className={`${sectionClass} `}
          id="showdown"
          aria-labelledby="showdown-heading"
        >
          <Reveal>
            <SectionLabel suit="heart">{t("showdown.label")}</SectionLabel>
            <div className={`${sectionHeadingClass}`}>
              <div>
                <Image
                  src="/src/img/wsop/paradise/showdown-lockup.webp"
                  alt={t("showdown.lockupAlt")}
                  width={842}
                  height={770}
                  className="mb-8 h-auto w-40 md:w-48"
                />
                <LiveChip>{t("showdown.chip")}</LiveChip>
                <h2
                  id="showdown-heading"
                  className={`${sectionTitleClass} mt-6`}
                >
                  {t("showdown.title")}
                </h2>
              </div>
              <p className={sectionDescriptionClass}>
                {t("showdown.description")}
              </p>
            </div>
            <div
              className={
                "grid gap-4 mt-8 md:mt-12 min-[1100px]:grid-cols-[minmax(0,_1.4fr)_minmax(21rem,_0.6fr)] min-[1100px]:items-center min-[1100px]:gap-6 xl:grid-cols-[minmax(0,_1.4fr)_minmax(24rem,_0.6fr)]"
              }
            >
              <motion.div
                className={`[--ticket-pad:1.4rem] [--ticket-paper:#f1eafd] [--ticket-ink:#16141c] relative flex flex-col gap-[1.1rem] py-[var(--ticket-pad)] px-[calc(var(--ticket-pad)+0.5rem)] rounded-xl shadow-[0_22px_44px_rgba(0,_0,_0,_0.5),_inset_0_1px_0_rgba(255,_255,_255,_0.7)] text-[var(--ticket-ink)] font-["Helvetica_Neue",_Arial,_"Liberation_Sans",_sans-serif] md:[--ticket-pad:2rem] md:gap-6 xl:[--ticket-pad:2.4rem] xl:gap-[1.75rem] max-[374px]:[--ticket-pad:1rem] max-[374px]:gap-[0.9rem] max-[374px]:px-5 bg-[linear-gradient(135deg,#f3fbfe,#cfeefa)]`}
                whileHover={reduceMotion ? { rotate: 0 } : { rotate: -0.75 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div
                  className={
                    "flex items-baseline justify-between gap-4 text-[clamp(0.85rem,_2.4vw,_1.15rem)] font-semibold whitespace-nowrap max-[374px]:gap-2 max-[374px]:text-[0.72rem]"
                  }
                >
                  <span>{t("showdown.ticket.topline")}</span>
                  <span>{t("showdown.ticket.type")}</span>
                  <span>NLH</span>
                </div>
                <div
                  className={
                    "grid grid-cols-[auto_minmax(0,_1fr)] items-center gap-4"
                  }
                >
                  <div
                    className={
                      "grid w-[clamp(3.25rem,_9vw,_4.5rem)] h-[clamp(3.25rem,_9vw,_4.5rem)] rounded-full bg-[radial-gradient(_circle,_var(--ticket-paper)_0_52%,_var(--ticket-ink)_52.5%_56%,_transparent_56.5%_),_repeating-conic-gradient(_var(--ticket-ink)_0deg_22.5deg,_var(--ticket-paper)_22.5deg_45deg_)] shadow-[inset_0_0_0_2px_var(--ticket-ink)] place-content-center justify-items-center gap-y-[0.15rem]"
                    }
                    aria-hidden="true"
                  >
                    <span className="text-[0.6875rem] font-extrabold tracking-[0.04em] leading-none">
                      WSOP
                    </span>
                    <SuitRun
                      className="gap-[0.12rem] text-[var(--ticket-ink)]"
                      iconClassName="size-[0.4rem] shrink-0"
                      redClassName="text-[var(--wsop-red)]"
                    />
                  </div>
                  <p
                    className={
                      "flex-wrap justify-center font-bold tracking-[-0.02em] leading-none text-center [&_strong]:font-bold [&>span]:whitespace-nowrap flex flex-col items-center gap-3 text-[clamp(1.75rem,6vw,3.25rem)] [&>span]:text-[max(0.6875rem,0.36em)] [&>span]:font-semibold [&>span]:tracking-[0.08em] [&>span]:uppercase [&>span]:opacity-60"
                    }
                  >
                    <strong>{t("showdown.ticket.name")}</strong>
                    <span>{t("showdown.ticket.subtitle")}</span>
                  </p>
                </div>
                <div
                  className={
                    "flex items-baseline justify-between gap-3 text-[clamp(0.95rem,_2.6vw,_1.3rem)] font-semibold whitespace-nowrap max-[374px]:gap-[0.4rem] max-[374px]:text-[0.78rem] flex-wrap"
                  }
                >
                  <span>{t("showdown.ticket.dateLabel")}</span>
                  <span
                    className={`inline-block text-[#6d3fd8] font-["Bradley_Hand",_"Segoe_Script",_"Comic_Sans_MS",_cursive] text-[1.35em] font-normal leading-[0.8] rotate-[-4deg] max-[374px]:text-[1.15em]`}
                    aria-hidden="true"
                  >
                    12-12
                  </span>
                  <time dateTime="2026-12-12">
                    {t("showdown.ticket.dateValue")}
                  </time>
                </div>
                <div
                  className={
                    "grid grid-cols-[auto_minmax(0,_1fr)] items-center gap-4 max-[374px]:gap-[0.6rem]"
                  }
                >
                  <span
                    className={
                      "text-[clamp(0.8rem,_2.2vw,_0.95rem)] tracking-[0.02em] whitespace-nowrap max-[374px]:text-[0.7rem]"
                    }
                  >
                    1212-009
                  </span>
                  <TicketBarcode value="12122026" />
                </div>
                <div
                  className={
                    "flex items-baseline justify-between gap-4 text-[clamp(0.85rem,_2.4vw,_1.1rem)] font-semibold whitespace-nowrap [&_span:first-child]:uppercase max-[374px]:gap-2 max-[374px]:text-[0.72rem] flex-wrap gap-x-4"
                  }
                >
                  <span>{t("showdown.ticket.venue")}</span>
                  <span>{t("showdown.ticket.streamed")}</span>
                  <span>{t("showdown.ticket.inviteOnly")}</span>
                </div>
              </motion.div>
              <Stagger
                className={
                  "grid content-center md:grid-cols-[repeat(2,_minmax(0,_1fr))] md:gap-x-12 min-[1100px]:grid-cols-[1fr]"
                }
              >
                {SHOWDOWN_DETAILS.map((id) => (
                  <motion.div
                    className={
                      "grid gap-2 py-6 border-b border-b-[var(--wsop-border)] first:pt-0 last:pb-0 last:border-b-0 [&_span]:text-[var(--wsop-accent)] [&_span]:font-[family-name:var(--wsop-font-label)] [&_span]:text-[0.6875rem] [&_span]:font-normal [&_span]:tracking-[0.14em] [&_span]:uppercase [&_p]:max-w-96 [&_p]:text-[1.2rem] [&_p]:font-normal [&_p]:tracking-[-0.01em] [&_p]:leading-[1.35] md:[&:nth-child(2)]:pt-0 md:[&:nth-last-child(-n+2)]:pb-0 md:[&:nth-last-child(-n+2)]:border-b-0 min-[1100px]:[&:nth-child(2)]:pt-6 min-[1100px]:[&:nth-last-child(2)]:pb-6 min-[1100px]:[&:nth-last-child(2)]:border-b min-[1100px]:[&:nth-last-child(2)]:border-b-[var(--wsop-border)] min-[1100px]:last:border-b-0"
                    }
                    key={id}
                    variants={staggerItemVariants}
                  >
                    <span>{t(`showdown.details.${id}.label`)}</span>
                    <p>{t(`showdown.details.${id}.value`)}</p>
                  </motion.div>
                ))}
              </Stagger>
            </div>
            <div
              className={
                "grid gap-8 mt-16 [&_h3]:max-w-[13ch] [&_h3]:mt-3 [&_h3]:text-[clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h3]:font-medium [&_h3]:tracking-[-0.04em] [&_h3]:leading-[1.125] [&_ol]:grid [&_ol]:m-0 [&_ol]:p-0 [&_ol]:overflow-hidden [&_ol]:border [&_ol]:border-[var(--wsop-border)] [&_ol]:rounded-2xl [&_ol]:bg-[rgba(255,_255,_255,_0.04)] [&_ol]:list-none [&_li]:min-w-0 [&_li]:min-h-[4.75rem] [&_li]:p-0 [&_li]:overflow-hidden [&_li]:border-b [&_li]:border-b-[var(--wsop-border)] [&_li:last-child]:border-b-0 md:[&_ol]:grid-cols-[repeat(2,_minmax(0,_1fr))] md:[&_li]:border-r md:[&_li]:border-r-[var(--wsop-border)] md:[&_li:nth-child(even)]:border-r-0 md:[&_li:nth-last-child(-n_+_2):nth-child(odd)]:border-b-0 md:[&_li:last-child]:border-b-0 md:[&_li:last-child:nth-child(odd)]:col-[1_/_-1] md:[&_li:last-child:nth-child(odd)]:border-r-0 min-[1100px]:grid-cols-[minmax(17rem,_0.55fr)_minmax(0,_1fr)] min-[1100px]:items-start min-[1100px]:gap-16 min-[1100px]:mt-[6rem] xl:grid-cols-[minmax(18rem,_0.55fr)_minmax(0,_1fr)]"
              }
            >
              <div>
                <p className={`${eyebrowClass}`}>
                  {t("showdown.lineup.eyebrow")}
                </p>
                <h3 className="font-medium text-balance">
                  {t.rich("showdown.lineup.title", { br: () => <br /> })}
                </h3>
              </div>
              <motion.ol
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                variants={staggerVariants}
              >
                {Array.from({ length: 9 }, (_, index) => (
                  <motion.li key={index} variants={dealVariants}>
                    <div
                      className={
                        "grid w-full min-h-[4.75rem] items-center grid-cols-[auto_minmax(0,_1fr)_auto] gap-4 py-3 px-4 text-[var(--wsop-text)] no-underline transition-[background-color,color,box-shadow] duration-180 ease-wsop-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--wsop-lavender)] focus-visible:outline-offset-[-3px] motion-reduce:transition-none "
                      }
                    >
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
                      <span
                        className={
                          "flex min-w-0 flex-col [&_strong]:overflow-hidden [&_strong]:text-[1rem] [&_strong]:font-medium [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&>span]:overflow-hidden [&>span]:text-[var(--wsop-muted)] [&>span]:font-[family-name:var(--wsop-font-label)] [&>span]:text-[0.7rem] [&>span]:text-ellipsis [&>span]:whitespace-nowrap [&>span]:transition-colors [&>span]:duration-180 [&>span]:ease-wsop-standard gap-1"
                        }
                      >
                        <strong className="leading-[inherit]">
                          {t("showdown.lineup.seat", { number: index + 1 })}
                        </strong>
                        <span>{t("showdown.lineup.unrevealed")}</span>
                      </span>
                      <SuitIcon
                        className={
                          "w-[0.85rem] h-[0.85rem] text-[rgba(255,_255,_255,_0.26)]"
                        }
                        suit={SUITS[index % SUITS.length]}
                        redClassName="text-[rgba(255,84,112,0.6)]"
                      />
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
            <div
              className={
                "flex items-start flex-col gap-6 mt-8 [&_p]:max-w-[31rem] [&_p]:text-[var(--wsop-muted)] [&_p]:text-base [&_p]:leading-normal md:items-center md:justify-end md:flex-row md:[&_p]:text-right"
              }
            >
              <p>{t("showdown.cta.description")}</p>
              <ArrowLink href="https://x.com/solana">
                {t("showdown.cta.action")}
              </ArrowLink>
            </div>
          </Reveal>
        </section>
        <section
          className={
            "[&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-[var(--wsop-accent)] [&_a:focus-visible]:outline-offset-[4px] [&_h2]:max-w-[14ch] [&_h2]:text-[clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h2]:tracking-[-0.04em] [&_h2]:leading-[1.125] py-[clamp(4rem,calc(10vw+2rem),10rem)] px-5 border-t border-t-[var(--wsop-border)] bg-black bg-[radial-gradient(_circle_at_82%_24%,_rgba(85,_233,_171,_0.16),_transparent_30%),radial-gradient(_circle_at_18%_85%,_rgba(202,_159,_245,_0.18),_transparent_34%)] md:px-8 lg:py-[clamp(6rem,_7vw,_7.5rem)] xl:px-[2.5rem]"
          }
          aria-labelledby="get-started-heading"
        >
          <Reveal
            className={
              "relative w-[min(100%,_1360px)] mx-auto text-[var(--wsop-text)] [&>*]:relative [&>*]:z-[1]"
            }
          >
            <SectionLabel suit="diamond">{t("start.label")}</SectionLabel>
            <div
              className={
                "grid gap-4 md:grid-cols-[minmax(0,_1.08fr)_minmax(18rem,_0.92fr)]"
              }
            >
              <article
                className={
                  "relative flex min-h-[23rem] flex-col overflow-hidden rounded-2xl [&_h2]:max-w-[11ch] [&_h2]:text-black [&_h2]:text-[clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h2]:tracking-[-0.04em] [&_h2]:leading-[1.125] [&_h3]:max-w-[11ch] [&_h3]:text-black [&_h3]:text-[clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h3]:tracking-[-0.04em] [&_h3]:leading-[1.125] p-[clamp(1.5rem,3vw,2.5rem)] border border-[rgba(85,_233,_171,_0.46)] bg-[var(--wsop-accent)] text-black transition-[border-color,background-color] duration-180 ease-wsop-standard after:absolute after:right-[-7rem] after:bottom-[-8rem] after:w-[19rem] after:aspect-[1] after:border after:border-[rgba(0,_0,_0,_0.17)] after:rounded-full after:shadow-[inset_0_0_0_1rem_var(--wsop-accent),_inset_0_0_0_calc(1rem_+_1px)_rgba(0,_0,_0,_0.1),_inset_0_0_0_2rem_var(--wsop-accent),_inset_0_0_0_calc(2rem_+_1px)_rgba(0,_0,_0,_0.08)] after:content-[''] after:pointer-events-none hover:border-[rgba(0,_0,_0,_0.42)] hover:bg-[#67efb5] [&:hover_svg]:translate-x-[1px] [&:hover_svg]:translate-y-[-1px] motion-reduce:[&:hover_svg]:transform-none"
                }
              >
                <div
                  className={
                    "relative z-[1] flex flex-1 flex-col max-w-[52rem] [&>p]:max-w-[34rem] [&>p]:mt-4 [&>p]:text-[rgba(0,_0,_0,_0.64)] [&>p]:text-lg [&>p]:leading-normal"
                  }
                >
                  <div
                    className={
                      "relative z-[1] [&>p]:max-w-[34rem] [&>p]:mt-4 [&>p]:text-[rgba(0,_0,_0,_0.64)] [&>p]:text-lg [&>p]:leading-normal"
                    }
                  >
                    <h3 className="font-medium text-balance">
                      {t("start.guide")}
                    </h3>
                    <p>{t("start.guideDescription")}</p>
                  </div>
                  <div
                    className={
                      "flex flex-wrap items-stretch gap-3 mt-auto pt-6 [&_*]:flex-[0_0_auto] max-[639px]:flex-col max-[639px]:[&>*]:w-full"
                    }
                  >
                    <CrossAppLink
                      className={`${buttonClass} relative z-[1] motion-reduce:[&_svg]:transition-none`}
                      href="/poker-players-guide-to-crypto"
                    >
                      <span>{t("start.guideCta")}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </CrossAppLink>
                  </div>
                </div>
              </article>

              <article
                className={
                  "relative flex min-h-[23rem] flex-col overflow-hidden rounded-2xl [&_h2]:max-w-[11ch] [&_h2]:text-black [&_h2]:text-[clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h2]:tracking-[-0.04em] [&_h2]:leading-[1.125] [&_h3]:max-w-[11ch] [&_h3]:text-black [&_h3]:text-[clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h3]:tracking-[-0.04em] [&_h3]:leading-[1.125] p-[clamp(1.5rem,3vw,2.5rem)] bg-[#dfcdf5] text-black"
                }
              >
                <div
                  className={
                    "relative z-[1] flex flex-1 flex-col max-w-[52rem] [&>p]:max-w-[34rem] [&>p]:mt-4 [&>p]:text-[rgba(0,_0,_0,_0.64)] [&>p]:text-lg [&>p]:leading-normal"
                  }
                >
                  <h2
                    id="get-started-heading"
                    className="font-medium text-balance"
                  >
                    {t("start.title")}
                  </h2>
                  <p>{t("start.description")}</p>
                  <div
                    className={
                      "flex flex-wrap items-stretch gap-3 mt-auto pt-6 [&_*]:flex-[0_0_auto] max-[639px]:flex-col max-[639px]:[&>*]:w-full"
                    }
                  >
                    <Link
                      className={`${buttonClass} [&[data-light]]:bg-black [&[data-light]]:text-white [&[data-light]_svg]:bg-white [&[data-light]_svg]:text-black [&[data-light]:hover]:bg-[rgba(0,0,0,0.86)]`}
                      data-light=""
                      href="/wallets"
                    >
                      <span>{t("start.findWallet")}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                    <CrossAppLink
                      className={`${buttonClass}`}
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
        <LatestNews title={t("news.title")} items={news} />
      </main>
    </MotionConfig>
  );
}
