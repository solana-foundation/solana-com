"use client";

import { useCallback, useRef } from "react";
import Button from "@/components/Button";
import CarouselControls from "@/components/CarouselControls";

const LONDON_PICKS = [
  {
    title: "Science Museum",
    location: "South Kensington",
    href: "https://www.sciencemuseum.org.uk/home",
    description:
      "Exhibitions, engineering history, and space artifacts a short trip from the venue.",
  },
  {
    title: "Design Museum",
    location: "Kensington",
    href: "https://designmuseum.org/",
    description:
      "Contemporary design, product, graphics, and architecture near Holland Park.",
  },
  {
    title: "Tate Modern",
    location: "Bankside",
    href: "https://www.tate.org.uk/visit/tate-modern",
    description:
      "Modern and contemporary art in a landmark power station on the Thames.",
  },
] satisfies LondonPick[];

type LondonPick = {
  description: string;
  href: string;
  location: string;
  title: string;
};

function LondonPickCard({ pick }: { pick: LondonPick }) {
  return (
    <article
      className="flex w-[283.56px] shrink-0 snap-start flex-col items-start md:min-w-0 md:w-auto"
      data-london-pick-card
    >
      <div className="h-[212.67px] w-full border border-neutral-700 bg-neutral-800 md:h-auto md:aspect-[400/300]" />
      <div className="flex w-full flex-col items-start gap-4 py-5 pr-8 md:py-6 md:pr-10">
        <div className="flex flex-col gap-3">
          <h3 className="type-p-large-bold text-white">{pick.title}</h3>
          <p className="type-eyebrow text-blue">{pick.location}</p>
        </div>
        <p className="type-paragraph text-white">{pick.description}</p>
        <Button arrow href={pick.href} label="Lorem Ipsum" variant="inline" />
      </div>
    </article>
  );
}

export default function LondonPicksSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((direction: number) => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const firstCard = scroller.querySelector<HTMLElement>(
      "[data-london-pick-card]",
    );
    const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 320;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const nextScroll = scroller.scrollLeft + direction * scrollAmount;

    if (nextScroll < 0) {
      scroller.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    if (nextScroll > maxScroll) {
      scroller.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    scroller.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  }, []);

  return (
    <section
      id="london"
      aria-label="More to see while in London"
      aria-roledescription="carousel"
      className="bg-black pt-[120px]"
      role="region"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 md:px-8">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-[676px] flex-col gap-6">
            <p className="type-eyebrow text-white">More BP26 events</p>
            <h2 className="type-h3 max-w-[260px] text-white md:max-w-none">
              More to see while in London
            </h2>
          </div>
          <CarouselControls
            labelPrefix="London picks"
            onNext={() => scrollBy(1)}
            onPrev={() => scrollBy(-1)}
          />
        </div>

        <div
          ref={scrollRef}
          className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 scrollbar-hidden md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
        >
          {LONDON_PICKS.map((pick) => (
            <LondonPickCard key={pick.title} pick={pick} />
          ))}
        </div>
      </div>
    </section>
  );
}
