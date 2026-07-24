"use client";

import type { ComponentType, SVGProps } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  CircleDollarSign,
  Club,
  Clock3,
  Diamond,
  Globe2,
  Heart,
  Play,
  Spade,
  WalletCards,
  Zap,
} from "lucide-react";
import { Link } from "@workspace/i18n/routing";
import type { LinkItem } from "@/types/media";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type WsopPageProps = {
  videos: LinkItem[];
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
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.08,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

const dealVariants: Variants = {
  hidden: { opacity: 0, y: 26, rotate: -2.5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.55, ease: EASE },
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

const heroTitleVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, rotate: -110, scale: 0.9 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 55, damping: 14 },
  },
};

const marqueeLines = [
  "Shuffle up & deal",
  "Buy in from anywhere",
  "Read the table",
  "Cash out in seconds",
  "Hold your nerve",
  "No wires. No waiting.",
  "Size your bets",
  "The fastest money in the room",
];

const benefits: Array<{
  title: string;
  body: string;
  Icon: Icon;
}> = [
  {
    title: "Zero fees",
    body: "No processing fee for the completed Vegas crypto buy-in pilot.",
    Icon: CircleDollarSign,
  },
  {
    title: "Instant confirmation",
    body: "From wallet to tournament ticket in seconds.",
    Icon: Zap,
  },
  {
    title: "Borderless",
    body: "A cleaner way for a global field to move money.",
    Icon: Globe2,
  },
  {
    title: "Straight from your wallet",
    body: "Pay in SOL, USDC, or USDT.",
    Icon: WalletCards,
  },
];

const eventDetails: Array<{
  label: string;
  value: string;
}> = [
  {
    label: "When",
    value: "August 4, 2026",
  },
  {
    label: "Where",
    value: "WSOP feature table, Horseshoe Las Vegas",
  },
  {
    label: "Watch",
    value: "@Solana on X",
  },
  {
    label: "Hosted by",
    value: "2006 Main Event champion Jamie Gold",
  },
];

const lineup: Array<{
  name: string;
  handle: string;
  href: string;
  image: string;
}> = [
  {
    name: "Ansem",
    handle: "blknoiz06",
    href: "https://x.com/blknoiz06",
    image: "/src/img/wsop/ansem.webp",
  },
  {
    name: "Banks",
    handle: "Banks",
    href: "https://x.com/Banks",
    image: "/src/img/wsop/banks.webp",
  },
  {
    name: "WendyO",
    handle: "CryptoWendyO",
    href: "https://x.com/CryptoWendyO",
    image: "/src/img/wsop/wendyo.webp",
  },
  {
    name: "Rasmr",
    handle: "rasmr_eth",
    href: "https://x.com/rasmr_eth",
    image: "/src/img/wsop/rasmr.webp",
  },
  {
    name: "MinhxDynasty",
    handle: "MINHxDYNASTY",
    href: "https://x.com/MINHxDYNASTY",
    image: "/src/img/wsop/minhxdynasty.webp",
  },
  {
    name: "AshleyDCan",
    handle: "AshleyDCan",
    href: "https://x.com/AshleyDCan",
    image: "/src/img/wsop/ashleydcan.webp",
  },
  {
    name: "Solomon",
    handle: "IOV_OWL",
    href: "https://x.com/IOV_OWL",
    image: "/src/img/wsop/solomon.webp",
  },
  {
    name: "Bangerz",
    handle: "bangerz",
    href: "https://x.com/bangerz",
    image: "/src/img/wsop/bangerz.webp",
  },
];

const ambassadors: Array<{
  name: string;
  initials: string;
  suit: Suit;
  title: string;
  biography: string;
}> = [
  {
    name: "Jamie Gold",
    initials: "JG",
    suit: "diamond",
    title: "2006 Main Event champion",
    biography:
      "Winner of the 2006 WSOP Main Event, the largest in history at the time, for a record $12 million. Gold is one of poker’s biggest personalities and a defining figure of the WSOP’s original ESPN era.",
  },
  {
    name: "Michael Mizrachi",
    initials: "MM",
    suit: "spade",
    title: "The Grinder",
    biography:
      "The 2025 WSOP Main Event champion took down the title for $10 million. His nine bracelets include a record four Poker Players Championship wins. Inducted into the Poker Hall of Fame in 2025, his career earnings exceed $30 million.",
  },
  {
    name: "Alex Foxen",
    initials: "AF",
    suit: "club",
    title: "Four-time bracelet winner",
    biography:
      "One of the modern era’s most dominant high-roller players. Foxen has more than $58 million in live earnings and is the only player to win back-to-back Global Poker Index Player of the Year awards.",
  },
  {
    name: "Kristen Foxen",
    initials: "KF",
    suit: "heart",
    title: "Six-time bracelet winner",
    biography:
      "The most decorated woman in WSOP history and number one on the women’s all-time money list, with close to $20 million in live earnings and five GPI Female Player of the Year awards.",
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
            ? undefined
            : {
                boxShadow: [
                  "0 0 0 3px rgba(217, 0, 41, 0.2)",
                  "0 0 0 8px rgba(217, 0, 41, 0)",
                  "0 0 0 3px rgba(217, 0, 41, 0.2)",
                ],
              }
        }
        transition={{
          duration: 2.2,
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
  return (
    <motion.a
      href={href}
      className={`wsop-button ${className}`}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" />
    </motion.a>
  );
}

function BrandMarquee() {
  const track = (hidden: boolean) => (
    <div className="wsop-marquee__track" aria-hidden={hidden || undefined}>
      {marqueeLines.map((line, index) => (
        <span className="wsop-marquee__item" key={line}>
          <span className="wsop-marquee__text">{line}</span>
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

function PrizeCounter() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      setValue(100);
      return;
    }

    const controls = animate(0, 100, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, reduceMotion]);

  return (
    <strong ref={ref} aria-label="$100K">
      <span aria-hidden="true">${value}K</span>
    </strong>
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

function getYoutubeId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") ?? parsed.pathname.split("/").pop();
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function getVideoThumbnail(video: LinkItem) {
  if (video.thumbnailImage?.startsWith("/uploads/")) {
    return `/media-assets${video.thumbnailImage}`;
  }

  if (video.thumbnailImage) {
    return video.thumbnailImage;
  }

  const id = getYoutubeId(video.url);
  return id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : undefined;
}

function VideoRail({ videos }: { videos: LinkItem[] }) {
  if (videos.length === 0) {
    return (
      <div className="wsop-video-empty">
        <Image
          src="/src/img/wsop/feature-table.webp"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="wsop-video-empty__image"
        />
        <div className="wsop-video-empty__wash" />
        <div className="wsop-video-empty__content">
          <LiveChip>First deal · Aug 4</LiveChip>
          <h3>Stories from the felt are coming.</h3>
          <p>
            Player reveals, table talk, and highlights will appear here as the
            campaign rolls out.
          </p>
          <ArrowLink href="https://x.com/solana">Follow the action</ArrowLink>
        </div>
      </div>
    );
  }

  const cards = videos.map((video) => {
    const thumbnail = getVideoThumbnail(video);

    return (
      <motion.a
        key={video.id}
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className="wsop-video-card"
        variants={staggerItemVariants}
        whileHover="hover"
      >
        <div className="wsop-video-card__media">
          {thumbnail ? (
            <motion.div
              className="wsop-video-card__image-motion"
              variants={{
                hover: {
                  scale: 1.02,
                  transition: { duration: 0.3, ease: EASE },
                },
              }}
            >
              <Image
                src={thumbnail}
                alt=""
                fill
                sizes="(max-width: 768px) 84vw, 450px"
                className="wsop-video-card__image"
              />
            </motion.div>
          ) : (
            <div className="wsop-video-card__fallback" />
          )}
          <span className="wsop-video-card__play" aria-hidden="true">
            <Play fill="currentColor" />
          </span>
        </div>
        <div className="wsop-video-card__copy">
          <span>{video.source || "Video"}</span>
          <h3>{video.title}</h3>
          <ArrowUpRight aria-hidden="true" />
        </div>
      </motion.a>
    );
  });

  return (
    <motion.div
      className="wsop-video-rail"
      aria-label="WSOP video highlights"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={staggerVariants}
    >
      {cards}
    </motion.div>
  );
}

export function WsopPage({ videos }: WsopPageProps) {
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
        Skip to main content
      </motion.a>

      <main id="wsop-main">
        <section
          className="wsop-hero"
          aria-labelledby="wsop-title"
          ref={heroRef}
        >
          <motion.div
            className="wsop-hero__image-motion"
            style={reduceMotion ? undefined : { y: heroParallax }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Image
              src="/src/img/wsop/feature-table.webp"
              alt="The World Series of Poker feature table, presented by Solana"
              fill
              priority
              sizes="100vw"
              className="wsop-hero__image"
            />
          </motion.div>
          <div className="wsop-hero__shade" />
          <div className="wsop-hero__grid" aria-hidden="true" />

          <motion.div
            className="wsop-hero__topline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            <p>Solana × World Series of Poker</p>
            <p>Official presenting sponsor · 2026</p>
          </motion.div>

          <motion.div
            className="wsop-hero__content"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            <motion.div variants={heroItemVariants}>
              <p className="wsop-eyebrow wsop-hero__eyebrow">
                <SuitRun />
                The main event
              </p>
            </motion.div>
            <div className="wsop-hero__title-mask">
              <motion.h1 id="wsop-title" variants={heroTitleVariants}>
                Solana is upping the ante on the World Series of Poker
              </motion.h1>
            </div>
          </motion.div>

          <motion.a
            className="wsop-hero__scroll"
            href="#partnership"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              y: -2,
              transition: { duration: 0.2, ease: EASE },
            }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
          >
            <span>Read the story</span>
            <motion.span
              className="wsop-scroll-cue"
              aria-hidden="true"
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <ArrowDown />
            </motion.span>
          </motion.a>
        </section>

        <BrandMarquee />

        <section
          className="wsop-section wsop-partnership"
          id="partnership"
          aria-labelledby="partnership-heading"
        >
          <Reveal>
            <SectionLabel suit="spade">The edge</SectionLabel>
            <div className="wsop-partnership__grid">
              <h2 id="partnership-heading">
                The same instincts. A faster way to move.
              </h2>
              <div className="wsop-prose wsop-partnership__copy">
                <p>
                  The skills that make a great poker player are the skills that
                  make a great trader. Reading the situation, sizing your bets,
                  holding your nerve under pressure. Solana already leads crypto
                  by giving traders the fastest, cheapest, most reliable way to
                  move money. Now that same edge comes to poker.
                </p>
                <p>
                  Poker tournament buy-ins started as cash at the cage. Then
                  came slow, expensive wire transfers and high-interest credit
                  card advances. The next step is free, borderless, instant:
                  digital buy-ins and payouts, powered by Solana.
                </p>
                <p>
                  No more customs declarations at the border. No more security
                  escort to your car after a big session. No more refreshing
                  your bank app for days waiting on a wire. At WSOP Paradise in
                  the Bahamas, Solana is the fastest, cleanest way to get money
                  in and out of play.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <section
          className="wsop-section wsop-buyins"
          aria-labelledby="buyins-heading"
        >
          <Reveal>
            <SectionLabel suit="diamond">
              Buy-ins powered by Solana + MoonPay
            </SectionLabel>

            <div className="wsop-section-heading wsop-buyins__heading">
              <h2 id="buyins-heading">Fast and frictionless crypto buy-ins</h2>
              <p>
                This summer in Las Vegas, WSOP players bought into tournaments
                with crypto for the first time - in seconds, through the WSOP
                LIVE app.
              </p>
            </div>

            <Stagger className="wsop-benefits">
              {benefits.map(({ title, body, Icon }, index) => (
                <motion.article
                  className="wsop-benefit"
                  key={title}
                  variants={staggerItemVariants}
                >
                  <div className="wsop-benefit__topline">
                    <span>0{index + 1}</span>
                    <Icon aria-hidden="true" />
                  </div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </motion.article>
              ))}
            </Stagger>

            <div className="wsop-buyins__next">
              <motion.div
                className="wsop-chip"
                aria-hidden="true"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                variants={chipVariants}
              >
                <div className="wsop-chip__face">
                  <span>Next stop</span>
                  <strong>Paradise</strong>
                  <small>
                    The Bahamas
                    <br />
                    December 2026
                  </small>
                </div>
              </motion.div>
              <div>
                <p className="wsop-eyebrow">What’s next</p>
                <h3>
                  Crypto buy-ins and payouts come to WSOP Paradise this
                  December.
                </h3>
                <p>
                  The Vegas pilot is complete and its buy-in window is closed.
                  Players will not be able to use the app links below to buy
                  into the finished Vegas tournament.
                </p>
                <div className="wsop-reference-links">
                  <span>Completed-pilot app references:</span>
                  <motion.a
                    href="https://apps.apple.com/us/app/wsop-live-wsop-official-app/id1660727059"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    App Store <ArrowUpRight aria-hidden="true" />
                  </motion.a>
                  <motion.a
                    href="https://play.google.com/store/apps/details?id=com.nsus.wsopplus&hl=en"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    Google Play <ArrowUpRight aria-hidden="true" />
                  </motion.a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section
          className="wsop-section wsop-event"
          aria-labelledby="event-heading"
        >
          <Reveal>
            <SectionLabel suit="heart">WSOP: Solana Edition</SectionLabel>

            <div className="wsop-section-heading wsop-event__intro">
              <div>
                <LiveChip>One night only</LiveChip>
                <h2 id="event-heading">Crypto hits poker’s biggest stage</h2>
              </div>
              <p>
                WSOP: Solana Edition is a live-streamed invitational bringing
                some of crypto’s biggest personalities to the bright lights of
                the WSOP feature table - the same felt where champions are
                crowned.
              </p>
            </div>

            <div className="wsop-event__layout">
              <motion.div
                className="wsop-ticket"
                whileHover={{ rotate: -0.75 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="wsop-ticket__topline">
                  <span>WSOP 2026</span>
                  <span>Ev# 0804</span>
                  <span>NLH</span>
                </div>

                <div className="wsop-ticket__place">
                  <div className="wsop-ticket__chip" aria-hidden="true">
                    <span>WSOP</span>
                    <SuitRun className="wsop-ticket__chip-suits" />
                  </div>
                  <p className="wsop-ticket__prize">
                    <PrizeCounter />
                    <span>Prize Pool</span>
                  </p>
                </div>

                <p className="wsop-ticket__bracelet">
                  + custom Solana WSOP bracelet
                </p>

                <div className="wsop-ticket__date">
                  <span>Tournament Date:</span>
                  <span className="wsop-ticket__pen" aria-hidden="true">
                    804-8
                  </span>
                  <time dateTime="2026-08-04">8/4/2026</time>
                </div>

                <div className="wsop-ticket__scan">
                  <span className="wsop-ticket__serial">0804-100</span>
                  <TicketBarcode value="08042026" />
                </div>

                <div className="wsop-ticket__bottomline">
                  <span>Solana Edition</span>
                  <span>Buy-in</span>
                  <span>Invite only</span>
                </div>
              </motion.div>

              <Stagger className="wsop-event__details">
                {eventDetails.map(({ label, value }) => (
                  <motion.div
                    className="wsop-detail"
                    key={label}
                    variants={staggerItemVariants}
                  >
                    <span>{label}</span>
                    <p>{value}</p>
                  </motion.div>
                ))}
              </Stagger>
            </div>

            <div className="wsop-lineup">
              <div>
                <p className="wsop-eyebrow">At the table</p>
                <h3>Eight seats. No easy hands.</h3>
              </div>
              <motion.ol
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                variants={staggerVariants}
              >
                {lineup.map((player, index) => (
                  <motion.li
                    key={player.handle}
                    variants={dealVariants}
                    style={{ transformOrigin: "0% 100%" }}
                  >
                    <a
                      className="wsop-lineup__player"
                      href={player.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Image
                        className="wsop-lineup__avatar"
                        src={player.image}
                        alt=""
                        width={48}
                        height={48}
                      />
                      <span className="wsop-lineup__identity">
                        <strong>{player.name}</strong>
                        <span>@{player.handle}</span>
                      </span>
                      <SuitIcon
                        className="wsop-lineup__suit"
                        suit={SUITS[index % SUITS.length]}
                      />
                    </a>
                  </motion.li>
                ))}
              </motion.ol>
            </div>

            <div className="wsop-event__cta">
              <p>
                Follow @Solana on X for the full lineup and to watch the stream
                live.
              </p>
              <ArrowLink href="https://x.com/solana">
                Watch on @Solana
              </ArrowLink>
            </div>
          </Reveal>
        </section>

        <section
          className="wsop-section wsop-ambassadors"
          aria-labelledby="ambassadors-heading"
        >
          <Reveal>
            <SectionLabel suit="club">The ambassadors</SectionLabel>

            <div className="wsop-section-heading wsop-ambassadors__heading">
              <h2 id="ambassadors-heading">
                Introducing Solana’s Poker Ambassadors
              </h2>
              <p>
                Some of poker’s biggest names will represent Solana at the WSOP
                and beyond.
              </p>
            </div>

            <Stagger className="wsop-ambassadors__grid">
              {ambassadors.map((ambassador, index) => (
                <motion.article
                  className="wsop-ambassador"
                  key={ambassador.name}
                  variants={staggerItemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  <div className="wsop-ambassador__portrait">
                    <SuitIcon
                      className="wsop-ambassador__watermark"
                      suit={ambassador.suit}
                    />
                    <strong aria-hidden="true">{ambassador.initials}</strong>
                    <span className="wsop-ambassador__portrait-note">
                      Official portrait incoming
                    </span>
                  </div>
                  <div className="wsop-ambassador__copy">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{ambassador.title}</p>
                    <h3>{ambassador.name}</h3>
                    <p>{ambassador.biography}</p>
                    <div className="wsop-ambassador__story">
                      Solana Story episode · Coming soon
                      <Clock3 aria-hidden="true" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </Stagger>
          </Reveal>
        </section>

        <section
          className="wsop-section wsop-videos"
          aria-labelledby="videos-heading"
        >
          <Reveal>
            <SectionLabel suit="spade">From the felt</SectionLabel>
            <div className="wsop-section-heading wsop-videos__heading">
              <h2 id="videos-heading">The hands. The people. The stories.</h2>
              <p>
                WSOP and poker video content, updated automatically as the
                campaign unfolds.
              </p>
            </div>
            <VideoRail videos={videos} />
          </Reveal>
        </section>

        <section className="wsop-start" aria-labelledby="get-started-heading">
          <Reveal className="wsop-start__inner">
            <SectionLabel suit="diamond">Your first hand</SectionLabel>
            <div className="wsop-start__content">
              <h2 id="get-started-heading">Get started with Solana</h2>
              <p>
                Set up a wallet, learn the basics, and be ready when the action
                moves onchain.
              </p>
              <div className="wsop-start__actions">
                <Link
                  className="wsop-button wsop-button--light"
                  href="/wallets"
                >
                  <span>Find a wallet</span>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
                <span className="wsop-coming-soon">
                  <span>A poker player’s guide to crypto</span>
                  <small>Coming soon</small>
                </span>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </MotionConfig>
  );
}
