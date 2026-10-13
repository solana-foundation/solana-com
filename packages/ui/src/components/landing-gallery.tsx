"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { cn } from "../lib/utils";
import {
  ActionButton,
  Section,
  type ActionButtonProps,
  type LandingImage,
} from "./landing-shared";

export type GalleryCardData = {
  image?: LandingImage;
  heading?: string;
  stat?: string;
  eyebrow?: string;
  body?: string;
  button?: ActionButtonProps;
  size?: "small" | "large" | "skinny";
};

function GalleryCard({
  card,
  square,
  hiddenCopy,
}: {
  card: GalleryCardData;
  square?: boolean;
  hiddenCopy?: boolean;
}) {
  const image = card.image;
  return image?.src ? (
    <figure
      aria-hidden={hiddenCopy}
      inert={hiddenCopy}
      className={cn(
        "group relative m-0 h-[263px] w-[361px] overflow-hidden rounded-lg",
        card.size === "large" && "row-span-2 h-[542px]",
        card.size === "skinny" && "row-span-2 h-[542px] w-[263px]",
        square && "aspect-square",
      )}
    >
      <Image
        src={image.src}
        alt={image.alt || ""}
        fill
        className="object-cover"
      />
      {(card.heading || card.body || card.button) && (
        <figcaption className="absolute inset-0 flex flex-col justify-end gap-2 bg-black/60 p-8 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          {card.heading && (
            <h3 className="text-2xl font-semibold">{card.heading}</h3>
          )}
          {card.body && <p>{card.body}</p>}
          {card.button && <ActionButton {...card.button} />}
        </figcaption>
      )}
    </figure>
  ) : (
    <div
      aria-hidden={hiddenCopy}
      inert={hiddenCopy}
      className={cn(
        "flex h-[263px] w-[361px] flex-col items-center justify-center gap-3 rounded-lg bg-[#111114] p-8 text-center",
        square && "aspect-square",
      )}
    >
      {card.eyebrow && (
        <span className="font-brand-mono text-xs uppercase text-[#ABABBA]">
          {card.eyebrow}
        </span>
      )}
      {card.stat && (
        <strong className="text-5xl text-[#CA9FF5]">{card.stat}</strong>
      )}
      {card.body && <p className="text-sm">{card.body}</p>}
      {card.button && (
        <ActionButton {...card.button} className="mx-auto mt-1" />
      )}
    </div>
  );
}

export function CommunityGallery({
  cards,
  square,
}: {
  cards?: GalleryCardData[];
  square?: boolean;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const element = rail.current;
    if (
      !element ||
      !cards?.length ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let frame = 0;
    let previous = 0;
    function step(timestamp: number) {
      if (element && !paused.current && previous) {
        element.scrollLeft += (timestamp - previous) * 0.05;
        if (element.scrollLeft >= element.scrollWidth / 2)
          element.scrollLeft = 0;
      }
      previous = timestamp;
      frame = window.requestAnimationFrame(step);
    }
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [cards]);

  if (!cards?.length) return null;
  return (
    <Section fullWidth noPadding="noPaddingX">
      <div
        ref={rail}
        role="region"
        aria-label="Community gallery"
        tabIndex={0}
        onMouseEnter={() => {
          paused.current = true;
        }}
        onMouseLeave={() => {
          paused.current = false;
        }}
        onFocus={() => {
          paused.current = true;
        }}
        onBlur={() => {
          paused.current = false;
        }}
        className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA9FF5]"
      >
        <div className="grid w-max auto-cols-max grid-flow-col grid-rows-2 gap-4 px-2">
          {[...cards, ...cards].map((card, index) => (
            <GalleryCard
              key={index}
              card={card}
              square={square}
              hiddenCopy={index >= cards.length}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
