"use client";

import type { ComponentType, SVGProps } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Globe2,
  MapPin,
  Play,
  Trophy,
  WalletCards,
  Zap,
} from "lucide-react";
import { Link } from "@workspace/i18n/routing";
import type { LinkItem } from "@/types/media";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type WsopPageProps = {
  videos: LinkItem[];
};

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
  Icon: Icon;
}> = [
  {
    label: "When",
    value: "August 4, 2026",
    Icon: CalendarDays,
  },
  {
    label: "Where",
    value: "WSOP feature table, Horseshoe Las Vegas",
    Icon: MapPin,
  },
  {
    label: "Watch",
    value: "@Solana on X",
    Icon: Play,
  },
  {
    label: "Hosted by",
    value: "2006 Main Event champion Jamie Gold",
    Icon: Trophy,
  },
];

const lineup = [
  "Ansem",
  "Banks",
  "WendyO",
  "Rasmr",
  "MinhxDynasty",
  "AshleyDCan",
  "Solomon",
  "Bangerz",
];

const ambassadors = [
  {
    name: "Jamie Gold",
    initials: "JG",
    suit: "◆",
    title: "2006 Main Event champion",
    biography:
      "Winner of the 2006 WSOP Main Event, the largest in history at the time, for a record $12 million. Gold is one of poker’s biggest personalities and a defining figure of the WSOP’s original ESPN era.",
  },
  {
    name: "Michael Mizrachi",
    initials: "MM",
    suit: "♠",
    title: "The Grinder",
    biography:
      "The 2025 WSOP Main Event champion took down the title for $10 million. His nine bracelets include a record four Poker Players Championship wins. Inducted into the Poker Hall of Fame in 2025, his career earnings exceed $30 million.",
  },
  {
    name: "Alex Foxen",
    initials: "AF",
    suit: "♣",
    title: "Four-time bracelet winner",
    biography:
      "One of the modern era’s most dominant high-roller players. Foxen has more than $58 million in live earnings and is the only player to win back-to-back Global Poker Index Player of the Year awards.",
  },
  {
    name: "Kristen Foxen",
    initials: "KF",
    suit: "♥",
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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`wsop-reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="wsop-section-label">
      <span>{index}</span>
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
    <a
      href={href}
      className={`wsop-button ${className}`}
      target="_blank"
      rel="noreferrer"
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" />
    </a>
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
          <span className="wsop-live-chip">
            <span aria-hidden="true" />
            First deal · Aug 4
          </span>
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

  return (
    <div className="wsop-video-rail" aria-label="WSOP video highlights">
      {videos.map((video) => {
        const thumbnail = getVideoThumbnail(video);

        return (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noreferrer"
            className="wsop-video-card"
          >
            <div className="wsop-video-card__media">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 84vw, 450px"
                  className="wsop-video-card__image"
                />
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
          </a>
        );
      })}
    </div>
  );
}

export function WsopPage({ videos }: WsopPageProps) {
  return (
    <>
      <a className="wsop-skip-link" href="#wsop-main">
        Skip to main content
      </a>

      <main id="wsop-main">
        <section className="wsop-hero" aria-labelledby="wsop-title">
          <Image
            src="/src/img/wsop/feature-table.webp"
            alt="The World Series of Poker feature table, presented by Solana"
            fill
            priority
            sizes="100vw"
            className="wsop-hero__image"
          />
          <div className="wsop-hero__shade" />
          <div className="wsop-hero__grid" aria-hidden="true" />

          <div className="wsop-hero__topline">
            <p>Solana × World Series of Poker</p>
            <p>Official presenting sponsor · 2026</p>
          </div>

          <div className="wsop-hero__content">
            <div className="wsop-hero__marker" aria-hidden="true">
              <span>57</span>
              <small>Annual series</small>
            </div>
            <div>
              <p className="wsop-eyebrow">The partnership</p>
              <h1 id="wsop-title">
                Solana is upping the ante on the World Series of Poker
              </h1>
            </div>
          </div>

          <a className="wsop-hero__scroll" href="#partnership">
            <span>Read the story</span>
            <ArrowDown aria-hidden="true" />
          </a>
        </section>

        <section
          className="wsop-section wsop-partnership"
          id="partnership"
          aria-labelledby="partnership-heading"
        >
          <Reveal>
            <SectionLabel index="01">The edge</SectionLabel>
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
            <SectionLabel index="02">Solana buy-ins</SectionLabel>

            <div className="wsop-buyins__heading">
              <div>
                <p className="wsop-eyebrow">Powered by Solana + MoonPay</p>
                <h2 id="buyins-heading">
                  Fast and frictionless crypto buy-ins
                </h2>
              </div>
              <p>
                This summer in Las Vegas, WSOP players bought into tournaments
                with crypto for the first time—in seconds, through the WSOP LIVE
                app.
              </p>
            </div>

            <div className="wsop-benefits">
              {benefits.map(({ title, body, Icon }, index) => (
                <article className="wsop-benefit" key={title}>
                  <div className="wsop-benefit__topline">
                    <span>0{index + 1}</span>
                    <Icon aria-hidden="true" />
                  </div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>

            <div className="wsop-buyins__next">
              <div className="wsop-buyins__stamp" aria-hidden="true">
                <span>Next stop</span>
                <strong>PARADISE</strong>
                <small>The Bahamas · December 2026</small>
              </div>
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
                  <a
                    href="https://apps.apple.com/us/app/wsop-live-wsop-official-app/id1660727059"
                    target="_blank"
                    rel="noreferrer"
                  >
                    App Store <ArrowUpRight aria-hidden="true" />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.nsus.wsopplus&hl=en"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google Play <ArrowUpRight aria-hidden="true" />
                  </a>
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
            <SectionLabel index="03">WSOP: Solana Edition</SectionLabel>

            <div className="wsop-event__intro">
              <div>
                <span className="wsop-live-chip">
                  <span aria-hidden="true" />
                  One night only
                </span>
                <h2 id="event-heading">Crypto hits poker’s biggest stage</h2>
              </div>
              <p>
                WSOP: Solana Edition is a live-streamed invitational bringing
                some of crypto’s biggest personalities to the bright lights of
                the WSOP feature table—the same felt where champions are
                crowned.
              </p>
            </div>

            <div className="wsop-event__layout">
              <div className="wsop-ticket">
                <div className="wsop-ticket__header">
                  <span>Invitational No. 0804</span>
                  <span>Las Vegas</span>
                </div>
                <div className="wsop-ticket__prize">
                  <p>Prize pool</p>
                  <strong>$100K</strong>
                  <span>+ custom Solana WSOP bracelet</span>
                </div>
                <div className="wsop-ticket__barcode" aria-hidden="true" />
                <div className="wsop-ticket__footer">
                  <span>Feature table</span>
                  <span>Live on X</span>
                </div>
              </div>

              <div className="wsop-event__details">
                {eventDetails.map(({ label, value, Icon }) => (
                  <div className="wsop-detail" key={label}>
                    <Icon aria-hidden="true" />
                    <div>
                      <span>{label}</span>
                      <p>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="wsop-lineup">
              <div>
                <p className="wsop-eyebrow">At the table</p>
                <h3>Eight seats. No easy hands.</h3>
              </div>
              <ol>
                {lineup.map((player, index) => (
                  <li key={player}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {player}
                  </li>
                ))}
              </ol>
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
            <SectionLabel index="04">The ambassadors</SectionLabel>

            <div className="wsop-ambassadors__heading">
              <h2 id="ambassadors-heading">
                Introducing Solana’s Poker Ambassadors
              </h2>
              <p>
                Some of poker’s biggest names will represent Solana at the WSOP
                and beyond.
              </p>
            </div>

            <div className="wsop-ambassadors__grid">
              {ambassadors.map((ambassador, index) => (
                <article className="wsop-ambassador" key={ambassador.name}>
                  <div className="wsop-ambassador__portrait">
                    <span
                      className={`wsop-ambassador__suit ${
                        ambassador.suit === "♥" || ambassador.suit === "◆"
                          ? "is-red"
                          : ""
                      }`}
                      aria-hidden="true"
                    >
                      {ambassador.suit}
                    </span>
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
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section
          className="wsop-section wsop-videos"
          aria-labelledby="videos-heading"
        >
          <Reveal>
            <SectionLabel index="05">From the felt</SectionLabel>
            <div className="wsop-videos__heading">
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
            <SectionLabel index="06">Your first hand</SectionLabel>
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
    </>
  );
}
