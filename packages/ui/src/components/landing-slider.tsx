"use client";

import { useRef } from "react";
import Image from "next/image";

import { cn } from "../lib/utils";
import {
  Section,
  type ActionButtonProps,
  type LandingImage,
} from "./landing-shared";
import { HtmlParser } from "./landing-rich-text";

export interface SliderCardData {
  image?: LandingImage;
  title?: string;
  body?: string;
  button?: ActionButtonProps;
  url?: string;
}

function SliderCard({ card }: { card: SliderCardData }) {
  const content = (
    <article className="flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#111114] text-white transition-colors hover:border-white/30 lg:w-96">
      {card.image?.src && (
        <div className="relative h-48 lg:h-56">
          <Image
            src={card.image.src}
            alt={card.image.alt || ""}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="grid flex-1 gap-2 p-6">
        {card.title && (
          <h3 className="text-xl font-medium leading-tight">{card.title}</h3>
        )}
        {card.body && (
          <HtmlParser rawHtml={card.body} classes="text-base text-[#ABABBA]" />
        )}
        {card.button && (
          <span className="mt-8 w-fit rounded-full border border-white/50 px-4 py-2 font-brand-mono text-xs uppercase">
            {card.button.label || card.button.children}
          </span>
        )}
      </div>
    </article>
  );
  const href = card.url || card.button?.url;
  if (!href) return content;
  const classes =
    "block shrink-0 scroll-snap-align-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA9FF5]";
  return href.startsWith("/") ? (
    <a href={href} className={classes}>
      {content}
    </a>
  ) : (
    <a
      href={href}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  );
}

export function Slider({ cards }: { cards?: SliderCardData[] | null }) {
  const rail = useRef<HTMLDivElement>(null);
  if (!cards?.length) return null;
  return (
    <Section className="overflow-hidden" aria-label="Cards">
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous cards"
          onClick={() =>
            rail.current?.scrollBy({ left: -400, behavior: "smooth" })
          }
          className="rounded-full border border-white/30 px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA9FF5]"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next cards"
          onClick={() =>
            rail.current?.scrollBy({ left: 400, behavior: "smooth" })
          }
          className="rounded-full border border-white/30 px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA9FF5]"
        >
          →
        </button>
      </div>
      <div
        ref={rail}
        role="region"
        aria-roledescription="carousel"
        aria-label="Cards"
        tabIndex={0}
        className={cn(
          "flex gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA9FF5]",
        )}
      >
        {cards.map((card, index) => (
          <div key={index} className="snap-start">
            <SliderCard card={card} />
          </div>
        ))}
      </div>
    </Section>
  );
}
