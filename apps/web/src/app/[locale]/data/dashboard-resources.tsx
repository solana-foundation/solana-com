"use client";

import { ChevronLeft } from "@boxicons/react/ChevronLeft";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@solana-com/ui-chrome/link";
import {
  trackAnalyticsEvent,
  trackContentSelection,
} from "@solana-com/ui-chrome/analytics";
import { useTranslations } from "@workspace/i18n/client";
import { cn } from "@/app/components/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  resourceCards,
  resourceCardStepFallback,
  resourceCarouselAutoAdvanceMs,
} from "./dashboard-constants";

export function DataResourceCarousel() {
  const t = useTranslations("dataDashboard");
  const carouselRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const [isCarouselInView, setIsCarouselInView] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const updateScrollState = useCallback(() => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;
    const nextScrollState = {
      canScrollLeft: scrollElement.scrollLeft > 1,
      canScrollRight: scrollElement.scrollLeft < maxScrollLeft - 1,
    };

    setScrollState((currentScrollState) =>
      currentScrollState.canScrollLeft === nextScrollState.canScrollLeft &&
      currentScrollState.canScrollRight === nextScrollState.canScrollRight
        ? currentScrollState
        : nextScrollState,
    );
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    scrollElement?.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", updateScrollState);
      scrollElement?.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    const carouselElement = carouselRef.current;

    if (!carouselElement || typeof IntersectionObserver === "undefined") {
      setIsCarouselInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsCarouselInView(entry.isIntersecting),
      { threshold: 0.35 },
    );

    observer.observe(carouselElement);

    return () => observer.disconnect();
  }, []);

  const scrollCards = useCallback((direction: -1 | 1) => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const scrollStep = Math.max(
      resourceCardStepFallback,
      scrollElement.clientWidth,
    );

    scrollElement.scrollBy({
      behavior: "smooth",
      left: direction * scrollStep,
      top: 0,
    });
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    const isAutoAdvancePaused =
      prefersReducedMotion ||
      !isCarouselInView ||
      isFocusWithin ||
      isPointerDown ||
      isPointerInside;

    if (
      !scrollElement ||
      isAutoAdvancePaused ||
      scrollElement.scrollWidth <= scrollElement.clientWidth + 1
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const maxScrollLeft =
        scrollElement.scrollWidth - scrollElement.clientWidth;

      if (scrollElement.scrollLeft < maxScrollLeft - 1) {
        scrollCards(1);
        return;
      }

      scrollElement.scrollTo({ behavior: "smooth", left: 0, top: 0 });
    }, resourceCarouselAutoAdvanceMs);

    return () => window.clearInterval(intervalId);
  }, [
    isCarouselInView,
    isFocusWithin,
    isPointerDown,
    isPointerInside,
    prefersReducedMotion,
    scrollCards,
  ]);

  return (
    <section
      aria-labelledby="data-resource-carousel-title"
      aria-roledescription="carousel"
      className="mt-10 -mx-4 bg-black px-4 py-8 md:-mx-8 md:px-8 md:py-10 xl:-mx-10 xl:px-10 xl:py-11"
      data-node-id="2:1090"
      onBlurCapture={(event) => {
        const nextFocusedElement = event.relatedTarget;

        if (
          !(nextFocusedElement instanceof Node) ||
          !event.currentTarget.contains(nextFocusedElement)
        ) {
          setIsFocusWithin(false);
        }
      }}
      onFocusCapture={() => setIsFocusWithin(true)}
      onPointerCancel={() => setIsPointerDown(false)}
      onPointerDown={() => setIsPointerDown(true)}
      onPointerEnter={() => setIsPointerInside(true)}
      onPointerLeave={() => {
        setIsPointerDown(false);
        setIsPointerInside(false);
      }}
      onPointerUp={() => setIsPointerDown(false)}
      ref={carouselRef}
    >
      <div className="border border-nd-border-light bg-black">
        <div className="flex flex-col border-b border-nd-border-light sm:flex-row sm:items-stretch">
          <div className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-6 md:px-9 md:py-7">
            <h2
              className="text-[28px] leading-[1.25] font-medium tracking-normal text-nd-high-em-text md:text-[32px]"
              id="data-resource-carousel-title"
            >
              {t("buildSection.title")}
            </h2>
            <p className="nd-body-s max-w-[670px] text-nd-mid-em-text">
              {t("buildSection.description")}
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-nd-border-light bg-white/[0.04] px-5 py-4 sm:border-t-0 sm:border-l sm:px-6 sm:py-6 md:px-9">
            <DataResourceNavButton
              ariaLabel={t("buildSection.previous")}
              disabled={!scrollState.canScrollLeft}
              icon={<ChevronLeft aria-hidden="true" className="h-5 w-5" />}
              onClick={() => scrollCards(-1)}
            />
            <DataResourceNavButton
              ariaLabel={t("buildSection.next")}
              disabled={!scrollState.canScrollRight}
              icon={<ChevronRight aria-hidden="true" className="h-5 w-5" />}
              onClick={() => scrollCards(1)}
            />
          </div>
        </div>

        <div
          className="snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={scrollRef}
        >
          <div className="flex min-w-max xl:min-w-0">
            {resourceCards.map((card, index) => (
              <DataResourceCard card={card} index={index} key={card.titleKey} />
            ))}
          </div>
        </div>

        <DataResourceDecorGrid />
      </div>
    </section>
  );
}

function DataResourceNavButton({
  ariaLabel,
  disabled,
  icon,
  onClick,
}: {
  ariaLabel: string;
  disabled: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_0_24px_rgba(255,255,255,0.12)] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        disabled
          ? "cursor-not-allowed border-white/30 !bg-white/10 text-white/55 shadow-none hover:!bg-white/10"
          : "border-white !bg-white text-black hover:!bg-white/85",
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon}
    </button>
  );
}

function DataResourceCard({
  card,
  index,
}: {
  card: (typeof resourceCards)[number];
  index: number;
}) {
  const t = useTranslations("dataDashboard");
  const title = t(card.titleKey);
  const description = t(card.descriptionKey);
  const href = getResourceAnalyticsHref(card.href, card.analyticsId);
  const cardRef = useDataResourceImpression(card.analyticsId, title, href);

  return (
    <article
      aria-label={`${index + 1} / ${resourceCards.length}: ${title}`}
      aria-roledescription="slide"
      className={cn(
        "relative flex min-h-[186px] shrink-0 snap-start basis-[min(84vw,460px)] flex-col items-start gap-7 overflow-hidden px-5 py-6 md:basis-[460px] md:px-9 md:py-7 xl:basis-1/3",
        index > 0 ? "border-l border-nd-border-light" : "",
      )}
      data-node-id={card.nodeId}
      ref={cardRef}
      role="group"
    >
      <Image
        alt=""
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-70",
          card.backgroundClassName,
        )}
        fill
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 460px, 84vw"
        src={card.backgroundSrc}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/45"
      />

      <div className="relative flex min-w-0 flex-col gap-3">
        <h3 className="text-[20px] leading-[1.25] font-medium tracking-normal text-nd-high-em-text">
          {title}
        </h3>
        <p className="nd-body-s max-w-[390px] text-[#ABABBA]">{description}</p>
      </div>

      <Link
        className="relative inline-flex min-h-[31px] items-center justify-center border border-white/55 px-3 py-2 font-brand-mono text-[11px] leading-none font-bold uppercase text-nd-high-em-text transition-colors hover:border-white hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        href={href}
        onClick={() =>
          trackDataResourceEvent("click", {
            destinationUrl: href,
            resourceId: card.analyticsId,
            resourceTitle: title,
          })
        }
        rel="noopener noreferrer"
        target="_blank"
      >
        {t(card.ctaKey)}
      </Link>
    </article>
  );
}

function getResourceAnalyticsHref(href: string, resourceId: string) {
  if (!/^https?:\/\//i.test(href)) {
    return href;
  }

  const url = new URL(href);

  url.searchParams.set("utm_source", "solana.com");
  url.searchParams.set("utm_medium", "data_dashboard");
  url.searchParams.set("utm_campaign", "solana_data_resources");
  url.searchParams.set("utm_content", resourceId);

  return url.toString();
}

function useDataResourceImpression(
  resourceId: string,
  resourceTitle: string,
  destinationUrl: string,
) {
  const cardRef = useRef<HTMLElement>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    const card = cardRef.current;

    if (!card || hasTrackedRef.current) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      hasTrackedRef.current = true;
      trackDataResourceEvent("view", {
        destinationUrl,
        resourceId,
        resourceTitle,
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.5) {
          return;
        }

        hasTrackedRef.current = true;
        trackDataResourceEvent("view", {
          destinationUrl,
          resourceId,
          resourceTitle,
        });
        observer.disconnect();
      },
      { threshold: [0.5] },
    );

    observer.observe(card);

    return () => observer.disconnect();
  }, [destinationUrl, resourceId, resourceTitle]);

  return cardRef;
}

function trackDataResourceEvent(
  eventName: "click" | "view",
  {
    destinationUrl,
    resourceId,
    resourceTitle,
  }: {
    destinationUrl: string;
    resourceId: string;
    resourceTitle: string;
  },
) {
  if (eventName === "click") {
    trackContentSelection({
      appName: "web",
      contentType: "data_resource",
      contentId: resourceId,
      contentName: resourceTitle,
      placement: "solana_data_dashboard",
      linkUrl: destinationUrl,
    });
    return;
  }

  trackAnalyticsEvent("view_item", {
    app_name: "web",
    content_type: "data_resource",
    content_id: resourceId,
    content_name: resourceTitle,
    placement: "solana_data_dashboard",
  });
}

function DataResourceDecorGrid() {
  return (
    <div
      aria-hidden="true"
      className="hidden h-14 grid-rows-2 border-t border-nd-border-light md:grid"
    >
      {Array.from({ length: 2 }).map((_, rowIndex) => (
        <div
          className={cn(
            "grid grid-cols-[minmax(80px,180px)_1fr_minmax(80px,180px)]",
            rowIndex > 0 ? "border-t border-nd-border-light" : "",
          )}
          key={rowIndex}
        >
          {Array.from({ length: 3 }).map((__, columnIndex) => (
            <span
              className={cn(
                "border-nd-border-light",
                columnIndex < 2 ? "border-r" : "",
              )}
              key={columnIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
