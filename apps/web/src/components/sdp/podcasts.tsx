"use client";

import React from "react";
import Carousel, { CarouselControls } from "@/component-library/carousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRef } from "react";
import FormattedDate from "../shared/FormattedDate";

export interface PodcastItem {
  title: string;
  img: string;
  href: string;
  date?: string;
  duration?: string;
}

export interface PodcastsProps {
  title?: string;
  items?: PodcastItem[];
}

function splitIntoStacks<T>(array: T[], stackSize: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / stackSize) }, (_, i) =>
    array.slice(i * stackSize, (i + 1) * stackSize),
  );
}

const PlayIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M3.5 2.5L13 8L3.5 13.5V2.5Z" fill="white" />
  </svg>
);

const trackSdpPodcastClick = (title: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "podcast_episode_click", {
      episode_title: title,
      podcast_slug: "sdp",
      platform: "youtube",
    });
  }
};

const PodcastCard = ({ title, img, href, date, duration }: PodcastItem) => {
  return (
    <a
      href={href}
      className="group flex items-center xl:items-stretch border-t xl:border-t-0 xl:border-b [&:nth-child(3n)]:border-b-0 border-white/[0.08] hover:bg-[#101013] hover:border-white/[0.12] transition-colors max-xl:px-5 max-xl:py-4"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackSdpPodcastClick(title)}
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 size-10 xl:w-[104px] xl:h-auto xl:aspect-square xl:border-r xl:border-white/[0.08] overflow-hidden">
        <img
          src={img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 px-4 xl:p-6 overflow-hidden">
        <p className="nd-body-l text-white tracking-[-0.2px] truncate mb-1 xl:mb-2">
          {title}
        </p>
        {(date || duration) && (
          <div className="flex gap-3 items-center">
            {date && (
              <span className="nd-body-xs text-white/[0.64] whitespace-nowrap">
                <FormattedDate date={date} format="E, MMM d" />
              </span>
            )}
            {date && duration && (
              <span className="size-[2px] rounded-full bg-white/[0.64] shrink-0 inline-block" />
            )}
            {duration && (
              <span className="nd-body-xs text-white/[0.64] whitespace-nowrap">
                {duration}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Play button — desktop hover only */}
      <div className="hidden xl:flex items-center justify-center w-[104px] shrink-0 border-l border-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-white/[0.12] backdrop-blur-[6px] flex items-center justify-center">
          <PlayIcon />
        </div>
      </div>
    </a>
  );
};

export const Podcasts = ({
  title,
  items = [],
}: PodcastsProps): React.ReactElement => {
  const carouselRef = useRef(null);
  const stackedItems = splitIntoStacks(items, 3);
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return (
    <section className="flex flex-col items-center w-full bg-[#0C0C0E]">
      <div className="w-full max-w-[1440px] xl:border-x xl:border-white/[0.08]">
        {/* Header */}
        <div className="px-5 md:px-8 xl:px-12 py-10 md:py-20 flex flex-row justify-between items-end gap-5">
          <h2 className="nd-heading-l-a text-white">{title}</h2>

          <CarouselControls
            className="shrink-0 grow-0 border-dashed border-x border-y border-white/[0.08] p-2 rounded-full"
            carouselRef={carouselRef}
            prevButtonClassName={
              "!w-10 !h-10 border-transparent backdrop-blur-[6px] !bg-white/[0.08] hover:!bg-white/[0.12] [&>svg]:opacity-[0.64] disabled:pointer-events-none"
            }
            nextButtonClassName={
              "!w-10 !h-10 border-transparent backdrop-blur-[6px] !bg-white/[0.08] hover:!bg-white/[0.12] [&>svg]:opacity-[0.64] disabled:pointer-events-none"
            }
          />
        </div>

        {/* Content: video + playlist */}
        <div className="xl:border-t border-white/[0.08]">
          <Carousel
            ref={carouselRef}
            controlsInline={false}
            lastPageOffset={isDesktop ? 2 : 1}
            panels={isDesktop ? 2 : 1}
            panelsPerNav={1}
            enableSwipe={true}
            className="!m-0 [&>div]:!p-0"
          >
            {stackedItems.map((stack, i) => {
              return (
                <div
                  key={i}
                  className=" flex flex-col items-stretch overflow-hidden"
                >
                  {stack.map((item, j) => (
                    <PodcastCard key={j} {...item} />
                  ))}
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </section>
  );
};
