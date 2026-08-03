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
} from "motion/react";
import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Check } from "@boxicons/react/Check";
import { CheckCircle as CheckCircle2 } from "@boxicons/react/CheckCircle";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import { Club } from "@boxicons/react/Club";
import { Clock3 } from "@boxicons/react/Clock3";
import { Diamond } from "@boxicons/react/Diamond";
import { Heart } from "@boxicons/react/Heart";
import { InfoCircle as Info } from "@boxicons/react/InfoCircle";
import { LoaderLines as LoaderCircle } from "@boxicons/react/LoaderLines";
import { Play } from "@boxicons/react/Play";
import { RotateCcw } from "@boxicons/react/RotateCcw";
import { Spade } from "@boxicons/react/Spade";
import { WalletCards } from "@boxicons/react/WalletCards";
import { Bolt as Zap } from "@boxicons/react/Bolt";
import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import { Button } from "@/app/components/ui/button";
import type { LinkItem } from "@/types/media";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type WsopPageProps = {
  stories: LinkItem[];
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

const chipVariants: Variants = {
  hidden: { opacity: 0, rotate: -18, scale: 0.94 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 16 },
  },
};

const MARQUEE_LINE_IDS = [
  "shuffleUp",
  "buyInAnywhere",
  "readTable",
  "cashOut",
  "holdNerve",
  "noWires",
  "sizeBets",
  "fastestMoney",
] as const;

const BENEFITS: Array<{ id: string; suit: Suit }> = [
  { id: "zeroFees", suit: "spade" },
  { id: "instantConfirmation", suit: "diamond" },
  { id: "borderless", suit: "heart" },
  { id: "fromWallet", suit: "club" },
];

const EVENT_DETAIL_IDS = ["when", "where", "watch", "host"] as const;

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
  {
    name: "Gabriel Haines",
    handle: "gabrielhaines",
    href: "https://x.com/gabrielhaines",
    image: "/src/img/wsop/gabriel-haines.webp",
  },
];

const ambassadors: Array<{
  id: string;
  name: string;
  initials: string;
  suit: Suit;
  image?: string;
  unoptimized?: boolean;
}> = [
  {
    id: "jamieGold",
    name: "Jamie Gold",
    initials: "JG",
    suit: "diamond",
    image: "/src/img/wsop/jamie-gold.webp",
  },
  {
    id: "michaelMizrachi",
    name: "Michael Mizrachi",
    initials: "MM",
    suit: "spade",
    image: "/src/img/wsop/michael-mizrachi.webp",
    unoptimized: true,
  },
  {
    id: "philHellmuth",
    name: "Phil Hellmuth",
    initials: "PH",
    suit: "club",
    image: "/src/img/wsop/phil-hellmuth.webp",
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
      <ArrowUpRight aria-hidden="true" />
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

function PrizeCounter() {
  const t = useTranslations("wsop.event.ticket");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setValue(100);
      return;
    }

    if (!inView) return;

    const controls = animate(0, 100, {
      duration: 1.2,
      ease: EASE,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, reduceMotion]);

  return (
    <strong ref={ref} aria-label={t("prizeAmountAria")}>
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

function getStoryThumbnail(story: LinkItem) {
  if (story.thumbnailImage?.startsWith("/uploads/")) {
    return `/media-assets${story.thumbnailImage}`;
  }

  if (story.thumbnailImage) {
    return story.thumbnailImage;
  }

  const id = getYoutubeId(story.url);
  return id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : undefined;
}

function StoryRail({ stories }: { stories: LinkItem[] }) {
  const t = useTranslations("wsop.stories");
  const reduceMotion = useReducedMotion();

  if (stories.length === 0) {
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
          <LiveChip>{t("empty.chip")}</LiveChip>
          <h3>{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
          <ArrowLink href="https://x.com/solana">{t("empty.action")}</ArrowLink>
        </div>
      </div>
    );
  }

  const cards = stories.map((story) => {
    const thumbnail = getStoryThumbnail(story);

    return (
      <motion.a
        key={story.id}
        href={story.url}
        target="_blank"
        rel="noreferrer"
        className="wsop-video-card"
        variants={staggerItemVariants}
        whileHover={reduceMotion ? {} : "hover"}
        whileTap={reduceMotion ? { scale: 1 } : { scale: 0.995 }}
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
            {story.linkType === "video" ? (
              <Play fill="currentColor" />
            ) : (
              <ArrowUpRight />
            )}
          </span>
        </div>
        <div className="wsop-video-card__copy">
          <span>{story.source || story.linkType || t("fallbackLabel")}</span>
          <h3>{story.title}</h3>
          <ArrowUpRight aria-hidden="true" />
        </div>
      </motion.a>
    );
  });

  return (
    <motion.div
      className="wsop-video-rail"
      aria-label={t("ariaLabel")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={staggerVariants}
    >
      {cards}
    </motion.div>
  );
}

const PAYMENT_STEP_IDS = ["chooseEntry", "review", "confirmed"] as const;
type PaymentStep = 0 | 1 | 2;

function SolanaLogo() {
  return (
    <Image
      className="wsop-payment-demo__solana-logo"
      src="/src/img/logos-solana/logomark.inline.svg"
      alt=""
      width={31}
      height={27}
      aria-hidden="true"
    />
  );
}

function PaymentSimulation() {
  const t = useTranslations("wsop.payment");
  const paymentSteps = PAYMENT_STEP_IDS.map((id) => ({
    id,
    label: t(`progress.steps.${id}`),
  }));
  const [step, setStep] = useState<PaymentStep>(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const confirmationTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(
    () => () => {
      if (confirmationTimer.current) {
        window.clearTimeout(confirmationTimer.current);
      }
    },
    [],
  );

  const confirmPayment = () => {
    if (isConfirming) return;

    setIsConfirming(true);
    confirmationTimer.current = window.setTimeout(
      () => {
        setIsConfirming(false);
        setStep(2);
        confirmationTimer.current = null;
      },
      reduceMotion ? 0 : 850,
    );
  };

  const reset = () => {
    if (confirmationTimer.current) {
      window.clearTimeout(confirmationTimer.current);
      confirmationTimer.current = null;
    }

    setIsConfirming(false);
    setStep(0);
  };

  return (
    <div
      className="wsop-payment-demo"
      role="region"
      aria-labelledby="payment-demo-heading"
    >
      <Reveal className="wsop-payment-demo__intro">
        <p className="wsop-eyebrow wsop-payment-demo__eyebrow">
          <SuitIcon className="wsop-payment-demo__eyebrow-suit" suit="club" />
          <span>{t("intro.eyebrow")}</span>
        </p>
        <h3 id="payment-demo-heading">{t("intro.title")}</h3>
        <p>{t("intro.description")}</p>
        <div className="wsop-payment-demo__trust">
          <span>
            <CheckCircle2 aria-hidden="true" />
            {t("intro.twoSteps")}
          </span>
          <span>
            <Zap aria-hidden="true" />
            {t("intro.fastConfirmation")}
          </span>
        </div>
      </Reveal>

      <div className="wsop-payment-demo__device">
        <div className="wsop-payment-demo__topbar">
          <span>{t("topbar.product")}</span>
          <span>
            <i aria-hidden="true" />
            {t("topbar.demoMode")}
          </span>
        </div>

        <ol
          className="wsop-payment-demo__progress"
          aria-label={t("progress.ariaLabel")}
        >
          {paymentSteps.map(({ id, label }, index) => {
            const isComplete =
              index < step ||
              (step === paymentSteps.length - 1 && index === step);
            const isCurrent = index === step;

            return (
              <li
                className={`${isComplete ? "is-complete" : ""} ${
                  isCurrent ? "is-current" : ""
                }`}
                key={id}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span aria-hidden="true">
                  {isComplete ? (
                    <Check />
                  ) : (
                    <span className="wsop-payment-demo__progress-number">
                      {index + 1}
                    </span>
                  )}
                </span>
                <small>{label}</small>
              </li>
            );
          })}
        </ol>

        <div className="wsop-payment-demo__notice" role="note">
          <Info aria-hidden="true" />
          <span>
            {t.rich("notice", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </span>
        </div>

        <div className="wsop-payment-demo__viewport" aria-live="polite">
          <motion.div
            className="wsop-payment-demo__screen"
            key={step}
            initial={reduceMotion ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {step === 0 && (
              <>
                <div className="wsop-payment-demo__screen-heading">
                  <span>{t("entry.eyebrow")}</span>
                  <h4>{t("entry.title")}</h4>
                  <p>{t("entry.description")}</p>
                </div>

                <div className="wsop-payment-demo__event-card">
                  <span>{t("entry.exampleLabel")}</span>
                  <h5>{t("entry.eventName")}</h5>
                  <dl>
                    <div>
                      <dt>{t("entry.startsLabel")}</dt>
                      <dd>{t("entry.startsValue")}</dd>
                    </div>
                    <div>
                      <dt>{t("entry.locationLabel")}</dt>
                      <dd>{t("entry.locationValue")}</dd>
                    </div>
                    <div>
                      <dt>{t("entry.buyInLabel")}</dt>
                      <dd>$500</dd>
                    </div>
                  </dl>
                </div>

                <div className="wsop-payment-demo__method">
                  <div>
                    <span className="wsop-payment-demo__method-icon">
                      <SolanaLogo />
                    </span>
                    <span>
                      <small>{t("entry.paymentMethodLabel")}</small>
                      <strong>{t("entry.paymentMethodValue")}</strong>
                    </span>
                  </div>
                  <span className="wsop-payment-demo__fee">
                    {t("entry.noFee")}
                  </span>
                </div>

                <button
                  className="wsop-payment-demo__primary"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  {t("entry.continue")}
                  <ChevronRight aria-hidden="true" />
                </button>
              </>
            )}

            {step === 1 && (
              <>
                <button
                  className="wsop-payment-demo__back"
                  type="button"
                  onClick={() => setStep(0)}
                  disabled={isConfirming}
                >
                  <ArrowLeft aria-hidden="true" />
                  {t("review.back")}
                </button>

                <div className="wsop-payment-demo__merchant">
                  <span>WSOP LLC</span>
                  <span>
                    <CheckCircle2 aria-hidden="true" />
                    {t("review.verified")}
                  </span>
                </div>

                <div className="wsop-payment-demo__amount">
                  <span>{t("review.amountDue")}</span>
                  <strong>
                    $500 <small>USDC</small>
                  </strong>
                  <div>
                    <SolanaLogo />
                    Solana
                    <span aria-hidden="true">·</span>
                    <WalletCards aria-hidden="true" />
                    {t("review.demoWallet")}
                  </div>
                </div>

                <dl className="wsop-payment-demo__summary">
                  <div>
                    <dt>{t("review.prizePool")}</dt>
                    <dd>$440.50</dd>
                  </div>
                  <div>
                    <dt>{t("review.tournamentFee")}</dt>
                    <dd>$59.50</dd>
                  </div>
                  <div>
                    <dt>{t("review.paymentFee")}</dt>
                    <dd>$0</dd>
                  </div>
                  <div>
                    <dt>{t("review.total")}</dt>
                    <dd>$500 USDC</dd>
                  </div>
                </dl>

                <button
                  className="wsop-payment-demo__primary"
                  type="button"
                  onClick={confirmPayment}
                  disabled={isConfirming}
                >
                  {isConfirming ? (
                    <>
                      {t("review.confirming")}
                      <LoaderCircle
                        className="wsop-payment-demo__spinner"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    <>
                      {t("review.confirm")}
                      <ChevronRight aria-hidden="true" />
                    </>
                  )}
                </button>
              </>
            )}

            {step === 2 && (
              <div className="wsop-payment-demo__success">
                <motion.span
                  className="wsop-payment-demo__success-icon"
                  initial={reduceMotion ? false : { scale: 0.72, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 18,
                  }}
                >
                  <Check aria-hidden="true" />
                </motion.span>
                <span>{t("success.confirmed")}</span>
                <h4>{t("success.title")}</h4>
                <p>{t("success.description")}</p>

                <dl className="wsop-payment-demo__receipt">
                  <div>
                    <dt>{t("success.ticketLabel")}</dt>
                    <dd>{t("entry.eventName")}</dd>
                  </div>
                  <div>
                    <dt>{t("success.networkLabel")}</dt>
                    <dd>Solana</dd>
                  </div>
                  <div>
                    <dt>{t("success.confirmationLabel")}</dt>
                    <dd>{t("success.confirmationValue")}</dd>
                  </div>
                </dl>

                <div className="wsop-payment-demo__success-actions">
                  <button
                    className="wsop-payment-demo__secondary"
                    type="button"
                    onClick={reset}
                  >
                    <RotateCcw aria-hidden="true" />
                    {t("success.runAgain")}
                  </button>
                  <Link
                    className="wsop-payment-demo__secondary wsop-payment-demo__secondary--wallet"
                    href="/wallets"
                  >
                    {t("success.findWallet")}
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function WsopPage({ stories }: WsopPageProps) {
  const t = useTranslations("wsop");
  const eventDetails = EVENT_DETAIL_IDS.map((id) => ({
    id,
    label: t(`event.details.${id}.label`),
    value: t(`event.details.${id}.value`),
  }));
  const benefits = BENEFITS.map(({ id, suit }) => ({
    id,
    suit,
    title: t(`buyIns.benefits.${id}.title`),
    body: t(`buyIns.benefits.${id}.body`),
  }));
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
            className="wsop-hero__image-motion"
            style={reduceMotion ? undefined : { y: heroParallax }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Image
              src="/src/img/wsop/feature-table.webp"
              alt={t("accessibility.heroImageAlt")}
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
            <p>{t("hero.brand")}</p>
            <p>{t("hero.sponsor")}</p>
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
                {t("hero.eyebrow")}
              </p>
            </motion.div>
            <div className="wsop-hero__title-mask">
              <motion.h1 id="wsop-title" variants={heroTitleVariants}>
                {t("hero.title")}
              </motion.h1>
            </div>
          </motion.div>

          <motion.a
            className="wsop-hero__scroll"
            href="#our-game"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={
              reduceMotion
                ? { y: 0 }
                : {
                    y: -2,
                    transition: { duration: 0.2, ease: EASE },
                  }
            }
            transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
          >
            <span>{t("hero.readStory")}</span>
            <motion.span
              className="wsop-scroll-cue"
              aria-hidden="true"
              animate={reduceMotion ? { y: 0 } : { y: [0, 4, 0] }}
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
          className="wsop-section wsop-event"
          id="our-game"
          aria-labelledby="event-heading"
        >
          <Reveal>
            <SectionLabel suit="heart">{t("event.label")}</SectionLabel>

            <div className="wsop-section-heading wsop-event__intro">
              <div>
                <LiveChip>{t("event.chip")}</LiveChip>
                <h2 id="event-heading">{t("event.title")}</h2>
              </div>
              <p>{t("event.description")}</p>
            </div>

            <div className="wsop-event__layout">
              <motion.div
                className="wsop-ticket"
                whileHover={reduceMotion ? { rotate: 0 } : { rotate: -0.75 }}
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
                    <span>{t("event.ticket.prizePool")}</span>
                  </p>
                </div>

                <p className="wsop-ticket__bracelet">
                  {t("event.ticket.bracelet")}
                </p>

                <div className="wsop-ticket__date">
                  <span>{t("event.ticket.dateLabel")}</span>
                  <span className="wsop-ticket__pen" aria-hidden="true">
                    804-8
                  </span>
                  <time dateTime="2026-08-04T12:00:00-08:00">
                    {t("event.ticket.dateValue")}
                  </time>
                </div>

                <div className="wsop-ticket__scan">
                  <span className="wsop-ticket__serial">0804-100</span>
                  <TicketBarcode value="08042026" />
                </div>

                <div className="wsop-ticket__bottomline">
                  <span>{t("event.ticket.name")}</span>
                  <span>{t("event.ticket.buyIn")}</span>
                  <span>{t("event.ticket.inviteOnly")}</span>
                </div>
              </motion.div>

              <Stagger className="wsop-event__details">
                {eventDetails.map(({ id, label, value }) => (
                  <motion.div
                    className="wsop-detail"
                    key={id}
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
                <p className="wsop-eyebrow">{t("lineup.eyebrow")}</p>
                <h3>{t("lineup.title")}</h3>
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
                    <motion.a
                      className="wsop-lineup__player"
                      href={player.href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={reduceMotion ? { x: 0 } : { x: 3 }}
                      whileTap={reduceMotion ? { scale: 1 } : { scale: 0.995 }}
                      transition={{ duration: 0.18, ease: EASE }}
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
                    </motion.a>
                  </motion.li>
                ))}
              </motion.ol>
            </div>

            <div className="wsop-event__cta">
              <p>{t("lineup.description")}</p>
              <ArrowLink href="https://x.com/solana">
                {t("lineup.action")}
              </ArrowLink>
            </div>
          </Reveal>
        </section>

        <section
          className="wsop-section wsop-ambassadors"
          aria-labelledby="ambassadors-heading"
        >
          <Reveal>
            <SectionLabel suit="club">{t("ambassadors.label")}</SectionLabel>

            <div className="wsop-section-heading wsop-ambassadors__heading">
              <h2 id="ambassadors-heading">{t("ambassadors.title")}</h2>
              <p>{t("ambassadors.description")}</p>
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
                    {ambassador.image ? (
                      <Image
                        className="wsop-ambassador__portrait-image"
                        src={ambassador.image}
                        alt=""
                        fill
                        sizes="(min-width: 1100px) 20vw, (min-width: 640px) 36vw, 100vw"
                        unoptimized={ambassador.unoptimized}
                      />
                    ) : (
                      <>
                        <SuitIcon
                          className="wsop-ambassador__watermark"
                          suit={ambassador.suit}
                        />
                        <strong aria-hidden="true">
                          {ambassador.initials}
                        </strong>
                        <span className="wsop-ambassador__portrait-note">
                          {t("ambassadors.portraitIncoming")}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="wsop-ambassador__copy">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{t(`ambassadors.profiles.${ambassador.id}.title`)}</p>
                    <h3>{ambassador.name}</h3>
                    <p>
                      {t(`ambassadors.profiles.${ambassador.id}.biography`)}
                    </p>
                    <div className="wsop-ambassador__story">
                      {t("ambassadors.episode")}
                      <Clock3 aria-hidden="true" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </Stagger>
          </Reveal>
        </section>

        <section
          className="wsop-section wsop-partnership"
          id="partnership"
          aria-labelledby="partnership-heading"
        >
          <Reveal>
            <SectionLabel suit="spade">{t("partnership.label")}</SectionLabel>
            <div className="wsop-partnership__grid">
              <h2 id="partnership-heading">{t("partnership.title")}</h2>
              <div className="wsop-prose wsop-partnership__copy">
                <p>{t("partnership.paragraphs.skills")}</p>
                <p>{t("partnership.paragraphs.history")}</p>
                <p>{t("partnership.paragraphs.experience")}</p>
              </div>
            </div>
          </Reveal>
        </section>

        <section
          className="wsop-section wsop-buyins"
          aria-labelledby="buyins-heading"
        >
          <Reveal>
            <SectionLabel suit="diamond">{t("buyIns.label")}</SectionLabel>

            <div className="wsop-section-heading wsop-buyins__heading">
              <h2 id="buyins-heading">{t("buyIns.title")}</h2>
              <p>{t("buyIns.description")}</p>
            </div>

            <Stagger className="wsop-benefits">
              {benefits.map(({ id, title, body, suit }) => (
                <motion.article
                  className="wsop-benefit"
                  key={id}
                  variants={dealVariants}
                >
                  <span
                    className={`wsop-benefit__index ${
                      isRedSuit(suit) ? "is-red" : ""
                    }`}
                    aria-hidden="true"
                  >
                    A
                    <SuitIcon suit={suit} />
                  </span>
                  <SuitIcon className="wsop-benefit__pip" suit={suit} />
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <span
                    className={`wsop-benefit__index wsop-benefit__index--mirror ${
                      isRedSuit(suit) ? "is-red" : ""
                    }`}
                    aria-hidden="true"
                  >
                    A
                    <SuitIcon suit={suit} />
                  </span>
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
                  <span>{t("next.chipLabel")}</span>
                  <strong>{t("next.chipTitle")}</strong>
                  <small>
                    {t("next.location")}
                    <br />
                    {t("next.date")}
                  </small>
                </div>
              </motion.div>
              <div>
                <p className="wsop-eyebrow">{t("next.eyebrow")}</p>
                <h3>{t("next.title")}</h3>
                <p>{t("next.description")}</p>
                <div className="wsop-reference-links mt-6 flex flex-wrap gap-3">
                  <span className="w-full font-[var(--wsop-font-label)] text-[length:var(--wsop-label-size)] leading-[1.33] font-medium tracking-[var(--wsop-label-tracking)] text-black/60 uppercase">
                    {t("next.download.label")}
                  </span>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary-outline"
                    className="group h-auto min-h-[4.25rem] min-w-48 basis-full justify-start gap-3 rounded-xl border-black/20 bg-white/25 px-3 py-2.5 text-left text-black shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-[border-color,background-color,box-shadow] hover:border-black/30 hover:bg-white/50 hover:text-black hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] focus-visible:ring-black md:flex-1 md:basis-48"
                  >
                    <motion.a
                      href="https://apps.apple.com/us/app/wsop-live-wsop-official-app/id1660727059"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t("next.download.appStoreAria")}
                      whileHover={reduceMotion ? { y: 0 } : { y: -2 }}
                      whileTap={reduceMotion ? { scale: 1 } : { scale: 0.98 }}
                      transition={{ duration: 0.2, ease: EASE }}
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-[0.625rem] bg-black text-white">
                        <Image
                          src="/src/img/wsop/apple.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="size-5"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="grid min-w-0 gap-0.5">
                        <small className="font-[var(--wsop-font-label)] text-[0.625rem] leading-none font-medium tracking-[0.06em] text-black/60 uppercase">
                          {t("next.download.viewOn")}
                        </small>
                        <strong className="font-[var(--wsop-font-sans)] text-base leading-[1.15] font-medium tracking-[-0.015em]">
                          {t("next.download.appStore")}
                        </strong>
                      </span>
                      <ArrowUpRight
                        className="ml-auto !size-4 shrink-0 opacity-60"
                        aria-hidden="true"
                      />
                    </motion.a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary-outline"
                    className="group h-auto min-h-[4.25rem] min-w-48 basis-full justify-start gap-3 rounded-xl border-black/20 bg-white/25 px-3 py-2.5 text-left text-black shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-[border-color,background-color,box-shadow] hover:border-black/30 hover:bg-white/50 hover:text-black hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] focus-visible:ring-black md:flex-1 md:basis-48"
                  >
                    <motion.a
                      href="https://play.google.com/store/apps/details?id=com.nsus.wsopplus&hl=en"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t("next.download.googlePlayAria")}
                      whileHover={reduceMotion ? { y: 0 } : { y: -2 }}
                      whileTap={reduceMotion ? { scale: 1 } : { scale: 0.98 }}
                      transition={{ duration: 0.2, ease: EASE }}
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-[0.625rem] bg-black text-white">
                        <Image
                          src="/src/img/wsop/google-play.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="size-5"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="grid min-w-0 gap-0.5">
                        <small className="font-[var(--wsop-font-label)] text-[0.625rem] leading-none font-medium tracking-[0.06em] text-black/60 uppercase">
                          {t("next.download.viewOn")}
                        </small>
                        <strong className="font-[var(--wsop-font-sans)] text-base leading-[1.15] font-medium tracking-[-0.015em]">
                          {t("next.download.googlePlay")}
                        </strong>
                      </span>
                      <ArrowUpRight
                        className="ml-auto !size-4 shrink-0 opacity-60"
                        aria-hidden="true"
                      />
                    </motion.a>
                  </Button>
                </div>
              </div>
            </div>

            <PaymentSimulation />
          </Reveal>
        </section>

        <section
          className="wsop-section wsop-videos"
          aria-labelledby="videos-heading"
        >
          <Reveal>
            <SectionLabel suit="spade">{t("videos.label")}</SectionLabel>
            <div className="wsop-section-heading wsop-videos__heading">
              <h2 id="videos-heading">{t("videos.title")}</h2>
              <p>{t("videos.description")}</p>
            </div>
            <StoryRail stories={stories} />
          </Reveal>
        </section>

        <section className="wsop-start" aria-labelledby="get-started-heading">
          <Reveal className="wsop-start__inner">
            <SectionLabel suit="diamond">{t("start.label")}</SectionLabel>
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
                <span className="wsop-coming-soon">
                  <span className="wsop-coming-soon__label">
                    {t("start.guide")}
                  </span>
                  <small>{t("start.comingSoon")}</small>
                </span>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </MotionConfig>
  );
}
