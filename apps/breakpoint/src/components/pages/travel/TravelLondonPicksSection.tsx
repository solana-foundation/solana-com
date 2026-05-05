"use client";

import { useCallback, useRef } from "react";
import Button from "@/components/Button";
import CarouselControls from "@/components/CarouselControls";
import { getAnchorLinkProps } from "@/lib/links";

const LONDON_PICKS = [
  {
    title: "Science Museum",
    location: "South Kensington",
    href: "https://www.sciencemuseum.org.uk/home",
    imageSrc: "/img/travel/london-pick-01.jpg",
    description:
      "Exhibitions, engineering history, and space artifacts a short trip from the venue.",
  },
  {
    title: "Design Museum",
    location: "Kensington",
    href: "https://designmuseum.org/",
    imageSrc: "/img/travel/london-pick-02.jpg",
    description:
      "Contemporary design, product, graphics, and architecture near Holland Park.",
  },
  {
    title: "Tate Modern",
    location: "Bankside",
    href: "https://www.tate.org.uk/visit/tate-modern",
    imageSrc: "/img/travel/london-pick-03.jpg",
    description:
      "Modern and contemporary art in a landmark power station on the Thames.",
  },
  {
    title: "Victoria and Albert Museum",
    location: "South Kensington",
    href: "https://www.vam.ac.uk/",
    imageSrc: "/img/travel/london-pick-04.jpg",
    description:
      "Design, fashion, architecture, and decorative arts near Exhibition Road.",
  },
  {
    title: "Hyde Park",
    location: "Westminster",
    href: "https://www.royalparks.org.uk/visit/parks/hyde-park",
    imageSrc: "/img/travel/london-pick-05.jpg",
    description:
      "Open green space for a walk between sessions or a slower morning reset.",
  },
  {
    title: "Borough Market",
    location: "London Bridge",
    href: "https://boroughmarket.org.uk/",
    imageSrc: "/img/travel/london-pick-06.jpg",
    description:
      "Historic food market with stalls, restaurants, coffee, and quick bites.",
  },
  {
    title: "Royal Albert Hall",
    location: "South Kensington",
    href: "https://www.royalalberthall.com/",
    imageSrc: "/img/travel/london-pick-07.jpg",
    description:
      "A landmark performance venue close to museums and Kensington Gardens.",
  },
] satisfies LondonPick[];

type LondonPick = {
  description: string;
  href: string;
  imageSrc: string;
  location: string;
  title: string;
};

function LondonPickCard({ pick }: { pick: LondonPick }) {
  return (
    <article
      className="flex w-[283.56px] shrink-0 snap-start flex-col items-start md:w-[calc((100%_-_48px)/3)]"
      data-london-pick-card
    >
      <a
        href={pick.href}
        aria-label={`${pick.title} travel recommendation`}
        className="h-[212.67px] w-full overflow-hidden border border-neutral-700 bg-neutral-800 transition-colors hover:border-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-auto md:aspect-[400/300]"
        {...getAnchorLinkProps({ href: pick.href })}
      >
        <img
          src={pick.imageSrc}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </a>
      <div className="flex w-full flex-col items-start gap-4 py-5 pr-8 md:py-6 md:pr-10">
        <div className="flex flex-col gap-3">
          <h3 className="type-p-large-bold text-white">{pick.title}</h3>
          <p className="type-eyebrow text-blue">{pick.location}</p>
        </div>
        <p className="type-paragraph text-white">{pick.description}</p>
        <Button arrow href={pick.href} label="LEARN MORE" variant="inline" />
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
      className="scroll-mt-16 bg-black pt-2xl md:scroll-mt-20 md:pt-[120px]"
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
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scrollbar-hidden"
        >
          {LONDON_PICKS.map((pick) => (
            <LondonPickCard key={pick.title} pick={pick} />
          ))}
        </div>
      </div>
    </section>
  );
}
