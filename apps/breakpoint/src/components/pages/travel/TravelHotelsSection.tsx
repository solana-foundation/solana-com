"use client";

import { useState } from "react";
import Button from "@/components/Button";

const HOTELS = [
  {
    name: "The Ned London",
    href: "https://www.thened.com/london/",
    description: "City of London hotel in a landmark 1930s bank building.",
    distance: "40 minutes from Olympia Convention Centre",
    imageSrc: "/img/travel/hotel-london.webp",
    imagePosition: "center",
  },
  {
    name: "Vintry and Mercer",
    href: "https://www.vintryandmercer.com/us/",
    description: "Boutique hotel near Mansion House and the District line.",
    distance: "40 minutes from Olympia Convention Centre",
    imageSrc: "/img/travel/london-pick-02.jpg",
    imagePosition: "center",
  },
  {
    name: "The Westin London City",
    href: "https://www.marriott.com/en-us/hotels/lonwi-the-westin-london-city/overview/",
    description: "Riverside stay on Upper Thames Street with westbound routes.",
    distance: "35 minutes from Olympia Convention Centre",
    imageSrc: "/img/travel/london-pick-03.jpg",
    imagePosition: "center",
  },
  {
    name: "The Waldorf Hilton",
    href: "https://www.hilton.com/en/hotels/lonwahi-the-waldorf-hilton-london/",
    description: "Aldwych hotel near Covent Garden, theatres, and dining.",
    distance: "30 minutes from Olympia Convention Centre",
    imageSrc: "/img/travel/london-pick-04.jpg",
    imagePosition: "center",
  },
  {
    name: "The Clermont London, Charing Cross",
    href: "https://www.theclermont.co.uk/charing-cross",
    description: "Charing Cross hotel by Trafalgar Square and central rail.",
    distance: "35 minutes from Olympia Convention Centre",
    imageSrc: "/img/travel/london-pick-05.jpg",
    imagePosition: "center",
  },
] satisfies HotelInfo[];

type HotelInfo = {
  description: string;
  distance: string;
  href: string;
  imagePosition: string;
  imageSrc: string;
  name: string;
};

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mx-auto flex max-w-[920px] flex-col items-center gap-6 text-center">
      <h2 className="type-h3 text-white">{title}</h2>
    </div>
  );
}

export default function HotelsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeHotel = HOTELS[activeIndex] ?? HOTELS[0]!;

  return (
    <section
      id="hotels"
      className="scroll-mt-16 bg-black pt-[80px] md:scroll-mt-20 md:pt-[120px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 md:gap-12 md:px-8">
        <SectionHeading title="Hotels" />

        <div className="grid items-start gap-12 md:grid-cols-bp-desktop md:gap-x-s">
          <div
            className="relative aspect-square w-full overflow-hidden bg-neutral-800 md:col-span-7"
            style={{
              WebkitMaskImage: "url('/img/travel/hotel-mask.svg')",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
              maskImage: "url('/img/travel/hotel-mask.svg')",
              maskRepeat: "no-repeat",
              maskSize: "100% 100%",
            }}
          >
            <img
              key={activeHotel.name}
              src={activeHotel.imageSrc}
              alt=""
              aria-hidden="true"
              width={638}
              height={967}
              className="h-full w-full object-cover"
              style={{ objectPosition: activeHotel.imagePosition }}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-5 md:col-span-8 md:col-start-9">
            {HOTELS.map((hotel, index) => {
              const open = index === activeIndex;
              const panelId = `hotel-panel-${index}`;

              return (
                <div
                  key={hotel.name}
                  className={`border-t pb-3 pt-6 transition-colors ${
                    open ? "border-white" : "border-neutral-700"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setActiveIndex(index)}
                    className="group/hotel flex w-full cursor-pointer items-start text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <h3
                      className={`type-p-large-bold transition-[color,opacity] ${
                        open
                          ? "text-white opacity-100"
                          : "text-text-secondary opacity-60 group-hover/hotel:text-white group-hover/hotel:opacity-100 group-focus-visible/hotel:text-white group-focus-visible/hotel:opacity-100"
                      }`}
                    >
                      {hotel.name}
                    </h3>
                  </button>

                  {open && (
                    <div
                      id={panelId}
                      className="mt-4 flex flex-col items-start gap-4"
                    >
                      <p className="type-paragraph text-white">
                        {hotel.description}
                      </p>
                      <p className="type-eyebrow text-blue">{hotel.distance}</p>
                      <Button
                        arrow
                        href={hotel.href}
                        label="Learn more"
                        variant="inline"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
