"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { config } from "@/config";

function LogoMark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 16" fill="none">
      <g clipPath="url(#clip0_breakpoint_local)">
        <mask
          id="mask0_breakpoint_local"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="20"
          height="17"
        >
          <path d="M0 0H108.364V16.1033H0V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_breakpoint_local)">
          <path
            d="M18.2087 12.6968L15.2363 15.8837C15.1719 15.9528 15.094 16.0079 15.0074 16.0457C14.9209 16.0835 14.8275 16.1031 14.733 16.1033H0.642129C0.57507 16.103 0.509559 16.0832 0.453556 16.0463C0.397554 16.0094 0.353471 15.957 0.326665 15.8955C0.299859 15.8341 0.291483 15.7661 0.302556 15.7C0.313629 15.6339 0.343673 15.5724 0.389038 15.523L3.35777 12.3361C3.42219 12.267 3.50008 12.2119 3.58665 12.1741C3.67321 12.1363 3.76659 12.1167 3.86104 12.1164H17.9519C18.0197 12.1151 18.0864 12.1338 18.1436 12.1702C18.2008 12.2067 18.246 12.2592 18.2734 12.3212C18.3008 12.3832 18.3093 12.452 18.2978 12.5188C18.2863 12.5856 18.2553 12.6475 18.2087 12.6968ZM15.2363 6.27716C15.1716 6.20844 15.0937 6.15354 15.0072 6.11579C14.9207 6.07804 14.8274 6.05822 14.733 6.05753H0.642129C0.574929 6.05757 0.509199 6.07721 0.452991 6.11404C0.396783 6.15087 0.352538 6.20329 0.325675 6.26489C0.298813 6.32649 0.2905 6.39459 0.301754 6.46084C0.313009 6.52709 0.343342 6.58862 0.389038 6.63789L3.35777 9.82698C3.42245 9.89571 3.5004 9.9506 3.5869 9.98835C3.6734 10.0261 3.76666 10.0459 3.86104 10.0466H17.9519C18.0189 10.046 18.0842 10.0259 18.14 9.98895C18.1958 9.95195 18.2396 9.89958 18.2663 9.83816C18.2929 9.77675 18.3011 9.70893 18.29 9.64293C18.2789 9.57692 18.2489 9.51555 18.2036 9.46626L15.2363 6.27716ZM0.642129 3.98771H14.733C14.8275 3.98744 14.9209 3.96781 15.0074 3.93004C15.094 3.89226 15.1719 3.83714 15.2363 3.76807L18.2087 0.580436C18.2433 0.543467 18.2693 0.499351 18.2849 0.451209C18.3006 0.403067 18.3054 0.352076 18.2992 0.301843C18.2929 0.25161 18.2757 0.203363 18.2488 0.160516C18.2218 0.117669 18.1858 0.0812688 18.1432 0.0538909C18.0862 0.0174073 18.0196 -0.00132368 17.9519 7.27636e-05H3.86104C3.76659 0.000340677 3.67321 0.0199692 3.58665 0.0577459C3.50008 0.0955226 3.42219 0.150645 3.35777 0.219709L0.389038 3.40735C0.343342 3.45662 0.313009 3.51815 0.301754 3.5844C0.2905 3.65065 0.298813 3.71875 0.325675 3.78034C0.352538 3.84194 0.396783 3.89437 0.452991 3.9312C0.509199 3.96803 0.574929 3.98767 0.642129 3.98771Z"
            fill="#E7D2F9"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_breakpoint_local">
          <rect width="108.364" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <a
        className="block w-full nav-sm:w-auto whitespace-nowrap nav-sm:px-xs"
        href={href}
      >
        <div className="inset-shadow-[0px_-2px_0px_0px] inset-shadow-transparent hover:inset-shadow-transparent-wisp-40 py-xs">
          {children}
        </div>
      </a>
    </li>
  );
}

function CTAButton({
  href,
  children,
  className = "",
  onClick,
  type = "link",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "link" | "button";
}) {
  const classes =
    `gap-xs cta cursor-pointer uppercase flex gap-xs items-center justify-center cta-transition [&>svg]:transition-all [&>svg]:duration-300 outline-offset-[8px] outline-transparent focus:outline focus:outline-transparent-wisp-40 px-[var(--spacing-xs)] h-[3rem] w-full hover:text-invert hover:[&>svg]:fill-primary-null active:bg-transparent-wisp-80 bg-byte text-invert [&>svg]:fill-primary-null ${className}`.trim();

  const arrow = (
    <svg
      width="10"
      height="10"
      viewBox="0 0 9 10"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.35938 8.65625L5.10156 6.97656L6.6875 5.57812V5.53125L4.77344 5.625H0V4.21094H4.78906L6.6875 4.3125V4.26562L5.10156 2.86719L3.35938 1.1875L4.32812 0.171875L9 4.92188L4.32812 9.66406L3.35938 8.65625Z"
        fill="currentColor"
      />
    </svg>
  );

  if (type === "button") {
    return (
      <button className={classes} onClick={onClick}>
        {children}
        {arrow}
      </button>
    );
  }

  return (
    <a className={classes} target="_blank" rel="noreferrer" href={href}>
      {children}
      {arrow}
    </a>
  );
}

function PlayIcon() {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0L14 8L0 16V0Z" />
    </svg>
  );
}

function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="video-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Breakpoint 2025 video"
    >
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-xl right-0 text-primary hover:text-byte cta-transition cursor-pointer"
          aria-label="Close video"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="aspect-video overflow-hidden">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/394wb968J68?autoplay=1"
            title="Solana Breakpoint 2025 - The Movie"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

function SubscribeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="video-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Subscribe for Breakpoint updates"
    >
      <div
        className="video-modal-content max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-xl right-0 text-primary hover:text-byte cta-transition cursor-pointer"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="bg-null border-1 border-wisp-10 p-s md:p-l">
          <p className="text-eyebrow text-byte">Breakpoint 2026</p>
          <h3 className="mt-s text-primary">Get notified</h3>
          <p className="text-p1 text-secondary mt-xs">
            Sign up for updates and early registration details.
          </p>
          <form
            action="https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=94b90b1b-b29a-4ad7-9b3b-87331601d030"
            method="get"
            target="_blank"
            className="flex flex-col gap-xs mt-l md:flex-row"
          >
            <input
              type="email"
              name="email"
              placeholder="email"
              required
              className="border-1 border-wisp-10 bg-transparent px-xs h-[3rem] w-full focus:outline-none focus:border-byte text-primary"
            />
            <button
              type="submit"
              className="gap-xs cta cursor-pointer uppercase flex gap-xs items-center justify-center cta-transition outline-offset-[8px] outline-transparent px-[var(--spacing-xs)] h-[3rem] bg-byte text-invert hover:bg-primary-wisp shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const assetPath = (path: string) => `${config.basePath}${path}`;
  const [videoOpen, setVideoOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Main"
        className="sticky top-0 flex-col w-full text-button z-20 overflow-hidden"
      >
        <div className="w-full mb-[-2.5px]">
          <ul className="bg-null w-full inline-flex unstyled-list inset-shadow-[0px_-1px_0px_0px] inset-shadow-transparent-wisp-30/100 justify-between">
            <li className="flex-start px-s py-xs">
              <a
                className="block w-[18.2px] h-xs"
                title="Solana"
                href="https://solana.com"
              >
                <LogoMark />
              </a>
            </li>
            <li className="flex-end hidden nav-sm:flex">
              <ul className="inline-flex unstyled-list transition-transform duration-300 transform-[translateX(0)] transform-[translateX(158px)]">
                <NavLink href="#overview">Overview</NavLink>
                <NavLink href="#why-london">Why London</NavLink>
                <NavLink href="#logistics">Logistics</NavLink>
                <li>
                  <CTAButton
                    type="button"
                    onClick={() => setSubscribeOpen(true)}
                    className="px-s focus:outline-none focus:underline focus:underline-offset-4 focus:decoration-null"
                  >
                    Get Notified
                  </CTAButton>
                </li>
              </ul>
            </li>
            <div className="nav-sm:hidden flex-end transition-transform duration-300 transform-[translateX(0)] transform-[translateX(158px)]">
              <li>
                <CTAButton type="button" onClick={() => setSubscribeOpen(true)}>
                  Get Notified
                </CTAButton>
              </li>
            </div>
          </ul>
        </div>
      </nav>

      <main id="top" className="container">
        {/* ── Hero ── */}
        <section className="[&&]:pb-2xl [&&]:md:pb-2xl px-s py-s flex flex-col justify-between relative">
          <img
            className="w-full hidden md:block"
            alt="Solana Breakpoint Logo"
            src={assetPath("/assets/bp-logo-full.svg")}
          />
          <img
            className="w-full block md:hidden"
            alt="Solana Breakpoint Logo"
            src={assetPath("/assets/bg-logo-mobile-full.svg")}
          />

          <div className="mt-m gap-l flex flex-col md:flex-row items-start">
            <div className="gap-s flex flex-col w-full md:w-2/3">
              <p className="text-eyebrow">Breakpoint 2026</p>
              <h3>
                The global Solana community comes to London, November 15-17
              </h3>
              <p className="text-p1 mt-xs text-secondary">
                Breakpoint 2026 brings together the leaders, builders,
                investors, institutions, and creators shaping the future of the
                Solana ecosystem.
              </p>
            </div>
            <div className="flex flex-col gap-xs w-full md:w-1/3 md:mt-l">
              <CTAButton
                type="button"
                onClick={() => setVideoOpen(true)}
                className="bg-transparent-wisp-10 text-primary border-1 border-wisp-10 hover:bg-byte hover:text-invert hover:border-byte"
              >
                <PlayIcon />
                Watch Breakpoint 2025
              </CTAButton>
              <CTAButton type="button" onClick={() => setSubscribeOpen(true)}>
                Get Notified
              </CTAButton>
            </div>
          </div>
        </section>

        {/* ── Overview ── */}
        <article
          id="overview"
          className="p-xs w-full md:px-s md:py-m text-invert bg-byte pt-2xl pb-2xl md:pt-3xl md:pb-3xl"
        >
          <div className="flex flex-col gap-2xl sm:gap-l">
            <p className="text-eyebrow">The Event</p>
            <h2>A high-signal gathering for the Solana ecosystem</h2>
          </div>
          <div className="grid gap-m md:grid-cols-2 mt-l">
            <p className="text-p1">
              Designed as a high-signal gathering, Breakpoint creates space for
              meaningful connections, new ideas, and the unveiling of products
              and technologies pushing the network forward.
            </p>
            <p className="text-p1">
              Attendees will experience a curated program of keynotes, lightning
              talks, debates, workshops, and networking designed to spark
              collaboration and accelerate the next phase of growth across the
              ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-xs mt-xl">
            {["Keynotes", "Lightning Talks", "Debates", "Workshops"].map(
              (item) => (
                <div
                  key={item}
                  className="border-1 border-primary-null/20 p-s flex items-center justify-center text-center"
                >
                  <p className="text-eyebrow">{item}</p>
                </div>
              ),
            )}
          </div>
        </article>

        {/* ── Why London ── */}
        <article
          id="why-london"
          className="p-xs w-full md:px-s md:py-m text-invert bg-lime pt-2xl pb-2xl md:pt-3xl md:pb-3xl"
        >
          <div className="flex flex-col gap-2xl sm:gap-l">
            <p className="text-eyebrow">Why London</p>
            <h2>At the intersection of global capital</h2>
          </div>
          <div className="grid gap-m md:grid-cols-2 mt-l">
            <div className="flex flex-col gap-m">
              <p className="text-p1">
                London sits at the intersection of global capital. It is where
                money is accumulated, structured, legitimized, and
                redeployed&mdash;home to family offices, sovereign wealth funds,
                hedge funds, commodity traders, private credit firms, insurers,
                and the legal and financial infrastructure that connects markets
                across continents.
              </p>
            </div>
            <div className="flex flex-col gap-m">
              <p className="text-p1">
                Winning London means gaining distribution across Europe, the
                Middle East, Africa, and beyond&mdash;making it the ideal stage
                for the next chapter of Solana&apos;s growth.
              </p>
              <p className="text-p1">
                Breakpoint 2026 brings the global Solana community to one of the
                world&apos;s most influential financial centers.
              </p>
            </div>
          </div>
        </article>

        {/* ── Logistics ── */}
        <article
          id="logistics"
          className="p-xs w-full md:px-s md:py-m text-primary bg-null pt-xl pb-xl md:pt-3xl md:pb-2xl"
        >
          <div className="flex flex-col gap-2xl sm:gap-l">
            <p className="text-eyebrow">Logistics</p>
            <h2>Venue &amp; Dates</h2>
          </div>
          <div className="grid gap-m md:grid-cols-3 mt-l">
            <div className="border-1 border-wisp-10 p-s bg-transparent-wisp-10">
              <p className="text-eyebrow">Dates</p>
              <h4 className="mt-s">November 15-17, 2026</h4>
            </div>
            <div className="border-1 border-wisp-10 p-s bg-transparent-wisp-10">
              <p className="text-eyebrow">Venue</p>
              <h4 className="mt-s">Olympia London</h4>
            </div>
            <div className="border-1 border-wisp-10 p-s bg-transparent-wisp-10">
              <p className="text-eyebrow">Format</p>
              <h4 className="mt-s">
                Keynotes, talks, demos, workshops, side events
              </h4>
            </div>
          </div>
        </article>

        {/* ── CTA ── */}
        <article className="p-xs w-full md:px-s md:py-m text-invert bg-mint pt-2xl pb-2xl md:pt-3xl md:pb-3xl">
          <div className="flex flex-col gap-2xl sm:gap-l [&&]:gap-m md:[&&]:gap-l">
            <p className="text-eyebrow">Be There</p>
            <h2>Breakpoint 2026 is coming</h2>
            <p className="text-p1">
              Sign up for updates and early registration details.
            </p>
          </div>
          <div className="flex flex-col gap-xs mt-m md:flex-row md:gap-s md:mt-l">
            <CTAButton
              type="button"
              onClick={() => setSubscribeOpen(true)}
              className="bg-null text-primary hover:bg-primary hover:text-invert"
            >
              Get Notified
            </CTAButton>
            <CTAButton
              href="https://solanafoundation.typeform.com/bp26sponsorform"
              className="bg-transparent border-1 border-primary-null/30 text-invert hover:bg-primary-null hover:text-primary"
            >
              Become a Sponsor
            </CTAButton>
          </div>
        </article>
      </main>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
      <SubscribeModal
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />
    </>
  );
}
