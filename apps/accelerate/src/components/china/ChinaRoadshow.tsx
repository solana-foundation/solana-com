"use client";

import Image from "next/image";
import { Link } from "@workspace/i18n/routing";
import { getImagePath } from "@/config";
import { chinaStops, type ChinaStop } from "@/data/china-stops";
import { CarouselArrow } from "../homepage/CarouselArrow";
import { EventCard } from "../homepage/EventCard";
import { useHorizontalCarousel } from "../homepage/useHorizontalCarousel";

function Arrow() {
  return (
    <Image
      src={getImagePath("/images/china/arrow-small.svg")}
      alt=""
      width={8}
      height={8}
      aria-hidden="true"
    />
  );
}

function GradientButton({
  href,
  children,
  className = "",
  variant = "outline",
  large = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "outline" | "filled";
  large?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${variant === "filled" ? "btn-cta" : "btn-outline-gradient"} inline-flex items-center justify-between gap-8 px-6 text-[13px] font-semibold uppercase tracking-[0.8px] md:px-7 md:text-[16px] ${large ? "h-[58px] md:h-[66px]" : "h-[52px] md:h-[58px]"} ${className}`}
    >
      {children}
      <Arrow />
    </a>
  );
}

function ChinaHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 h-[88px] overflow-hidden bg-black/70 backdrop-blur-sm md:h-[138px]">
      <Image
        src={getImagePath("/images/china/header-bg.webp")}
        alt=""
        fill
        priority
        className="pointer-events-none object-cover opacity-55"
      />
      <div className="relative mx-auto flex h-full max-w-[1480px] items-center justify-between gap-6 px-6 md:px-10">
        <Link
          href="/accelerate"
          aria-label="Solana Accelerate home"
          className="shrink-0"
        >
          <Image
            src={getImagePath("/images/china/china-logo.svg")}
            alt="Solana Accelerate China"
            width={187}
            height={103}
            className="h-auto w-[136px] md:w-[220px]"
            priority
          />
        </Link>
        <nav
          className="flex items-center gap-4 md:gap-8"
          aria-label="Accelerate events"
        >
          <Link
            href="/accelerate/hong-kong"
            className="hidden text-[14px] font-semibold uppercase tracking-[0.8px] text-white transition-colors hover:text-accelerate-green lg:block"
          >
            Hong Kong
          </Link>
          <Link
            href="/accelerate/miami"
            className="hidden text-[14px] font-semibold uppercase tracking-[0.8px] text-white transition-colors hover:text-accelerate-green lg:block"
          >
            Miami
          </Link>
          <GradientButton
            href="https://luma.com/acc-shanghai-26"
            className="w-[164px] md:w-auto"
          >
            Get tickets
          </GradientButton>
        </nav>
      </div>
    </header>
  );
}

const heroLayers = [
  {
    src: "/images/china/hero-layer-10.svg",
    width: 133.289,
    height: 858.732,
    x: 1098,
    y: 138,
  },
  {
    src: "/images/china/hero-layer-8.svg",
    width: 493,
    height: 500.494,
    x: 1151,
    y: 495.392,
  },
  {
    src: "/images/china/hero-layer-4.svg",
    width: 234.439,
    height: 690.376,
    x: 552,
    y: 314.688,
  },
  {
    src: "/images/china/hero-union.svg",
    width: 88.113,
    height: 524.456,
    x: 798.703,
    y: 480.319,
  },
  {
    src: "/images/china/hero-group.svg",
    width: 111.456,
    height: 582.427,
    x: 927.532,
    y: 422.985,
  },
  {
    src: "/images/china/hero-layer-6.svg",
    width: 586.216,
    height: 260.782,
    x: -9,
    y: 739,
  },
  {
    src: "/images/china/hero-vector.svg",
    width: 1283,
    height: 507,
    x: 1353,
    y: 485,
  },
] as const;

function ChinaHero() {
  return (
    <section className="relative h-[clamp(1040px,calc(72.34vw+217px),1389px)] overflow-hidden bg-black pt-[88px] text-white md:pt-[138px]">
      <div className="pointer-events-none absolute left-1/2 top-0 aspect-[1920/1389] w-[clamp(1200px,calc(100vw+300px),1920px)] max-w-none -translate-x-1/2">
        <div className="absolute inset-0">
          {heroLayers.map((layer) => (
            <Image
              key={layer.src}
              src={getImagePath(layer.src)}
              alt=""
              width={layer.width}
              height={layer.height}
              className="absolute h-auto max-w-none origin-bottom scale-[0.8] sm:scale-[0.82] md:scale-[0.86] lg:scale-[0.88] xl:scale-90 2xl:scale-95 min-[1800px]:scale-100"
              style={{
                left: `${(layer.x / 1920) * 100}%`,
                top: `${(layer.y / 1389) * 100}%`,
                width: `${(layer.width / 1920) * 100}%`,
                maskImage:
                  layer.src === "/images/china/hero-layer-8.svg"
                    ? "none"
                    : "linear-gradient(to bottom, #000 0%, #000 80%, transparent 100%)",
                WebkitMaskImage:
                  layer.src === "/images/china/hero-layer-8.svg"
                    ? "none"
                    : "linear-gradient(to bottom, #000 0%, #000 80%, transparent 100%)",
              }}
            />
          ))}
        </div>

        <Image
          src={getImagePath("/images/china/hero-wave.svg")}
          alt=""
          width={2246}
          height={993}
          className="absolute z-10 max-w-none"
          style={{
            left: `${(-181 / 1920) * 100}%`,
            top: `${(656 / 1189) * 100}%`,
            width: `${(2219.425 / 1920) * 100}%`,
            height: `${(977.96 / 1389) * 100}%`,
          }}
        />
      </div>

      <div className="relative z-20 mx-auto max-w-[1560px] px-6 pt-24 md:px-10 md:pt-[124px]">
        <div className="max-w-[660px]">
          <h1 className="text-[54px] font-normal leading-[0.98] tracking-[-2px] text-accelerate-gray-light sm:text-[72px] md:text-[90px] md:tracking-[-4px]">
            Solana
            <br />
            Accelerate
            <br />
            <span className="text-accelerate-green">China</span>
          </h1>
          <p className="mt-10 text-[16px] font-normal uppercase tracking-[1.2px] text-white md:mt-14 md:text-[24px]">
            October 2026
          </p>
        </div>

        <div className="mt-16 ml-auto max-w-[500px] md:mt-[14px] 2xl:mr-14">
          <p className="mb-4 text-right text-[13px] font-medium uppercase tracking-[0.8px] text-white md:text-[16px]">
            Next event
          </p>
          <div className="flex flex-col gap-5 rounded-[12px] border border-accelerate-gray-dark bg-black/60 p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between md:px-5 md:py-[31px]">
            <div>
              <p className="text-[26px] font-light uppercase leading-none tracking-[1.4px] text-accelerate-gray-light md:text-[28px]">
                Shanghai
              </p>
              <p className="mt-1 font-diatype text-[20px] text-accelerate-green md:text-[24px]">
                Oct 16
              </p>
            </div>
            <GradientButton
              href="https://luma.com/acc-shanghai-26"
              className="w-full md:w-[240px]"
              variant="filled"
              large
            >
              Get tickets
            </GradientButton>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            <a
              href="#lineup"
              className="inline-flex items-center gap-3 text-[16px] font-normal uppercase tracking-[0.8px] leading-none text-white transition-colors hover:text-white/80"
            >
              Learn More
              <Image
                src={getImagePath("/images/homepage/circle-plus.svg")}
                alt=""
                width={24}
                height={24}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StopCard({ stop }: { stop: ChinaStop }) {
  return (
    <EventCard
      image={getImagePath(stop.image)}
      city={stop.city}
      subtitle="Solana Accelerate China"
      dateLocation={`${stop.date.replace(", 2026", "")} / ${stop.city}`}
      href={stop.registrationUrl}
      external
      active
    />
  );
}

function RoadshowLineup() {
  return <RoadshowCarousel />;
}

function RoadshowCarousel() {
  const { scrollRef, canScrollLeft, canScrollRight, scroll } =
    useHorizontalCarousel();

  return (
    <section
      id="lineup"
      className="relative overflow-hidden bg-black py-16 md:py-28"
    >
      <Image
        src={getImagePath("/images/china/pattern-bgr.svg")}
        alt=""
        fill
        className="pointer-events-none object-cover opacity-80"
      />
      <div className="relative mx-auto max-w-[1480px] px-6 md:px-10">
        <h2 className="mx-auto max-w-[980px] text-center text-[38px] font-light uppercase leading-[1.13] tracking-[2px] text-accelerate-gray-100 sm:text-[52px] md:text-[80px] md:tracking-[4px]">
          2026 Accelerate China
          <br />
          Lineup
        </h2>

        <div className="relative mt-12 md:mt-20">
          {/* Shared carousel controls */}
          <div className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 md:block lg:-left-4">
            <CarouselArrow
              direction="left"
              disabled={!canScrollLeft}
              onClick={() => scroll("left")}
              ariaControls="china-lineup-carousel"
            />
          </div>
          <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 md:block lg:-right-4">
            <CarouselArrow
              direction="right"
              disabled={!canScrollRight}
              onClick={() => scroll("right")}
              ariaControls="china-lineup-carousel"
            />
          </div>

          <div
            ref={scrollRef}
            id="china-lineup-carousel"
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 pt-2 scrollbar-hide md:gap-6"
          >
            {chinaStops.map((stop) => (
              <div
                key={stop.city}
                className="w-[242px] max-w-[529px] flex-shrink-0 snap-center md:w-[calc(100vw-48px)]"
              >
                <StopCard stop={stop} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChinaFooter() {
  return (
    <footer className="relative min-h-[460px] overflow-hidden bg-black px-6 pb-14 pt-36 md:px-10 md:pt-44">
      <Image
        src={getImagePath("/images/china/hero-bg.webp")}
        alt=""
        fill
        className="pointer-events-none -scale-y-100 object-cover opacity-45"
      />
      <div className="pointer-events-none absolute inset-x-1/2 bottom-0 h-[320px] w-[760px] -translate-x-1/2 overflow-hidden md:h-[359px] md:w-[1345px]">
        <Image
          src={getImagePath("/images/china/footer-planet.webp")}
          alt=""
          width={2000}
          height={2000}
          className="absolute left-1/2 top-[-32px] h-auto w-[760px] max-w-none -translate-x-1/2 opacity-90 md:top-[-58px] md:w-[1110px]"
        />
      </div>
      <div className="relative mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-10 md:flex-row md:items-start">
        <Image
          src={getImagePath("/images/china/solana-mark.svg")}
          alt="Solana"
          width={98}
          height={84}
          className="h-[54px] w-auto"
        />
        <div className="flex items-center">
          <a
            href="https://x.com/solana"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 border-r border-accelerate-gray-dark pr-4 text-accelerate-gray-200 transition-colors hover:text-white"
          >
            <Image
              src={getImagePath("/images/china/x-social.svg")}
              alt="X"
              width={24}
              height={24}
            />
            <span className="font-diatype text-[15px] tracking-[0.75px] md:text-[20px]">
              Solana
            </span>
          </a>
          <a
            href="https://x.com/SolanaConf"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 pl-4 text-accelerate-gray-200 transition-colors hover:text-white"
          >
            <Image
              src={getImagePath("/images/china/x-social.svg")}
              alt="X"
              width={24}
              height={24}
            />
            <span className="font-diatype text-[15px] tracking-[0.75px] md:text-[20px]">
              Solana Conf
            </span>
          </a>
        </div>
      </div>
      <p className="relative mt-44 text-center font-diatype text-[15px] text-accelerate-gray-100 md:mt-[176px] md:text-[20px]">
        © Solana Foundation 2026
      </p>
    </footer>
  );
}

export function ChinaRoadshow() {
  return (
    <main className="overflow-x-clip bg-black text-white">
      <ChinaHeader />
      <ChinaHero />
      <RoadshowLineup />
    </main>
  );
}

export { ChinaFooter };
