"use client";

import { useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import ImageTreatment from "@/components/ImageTreatment";
import { publicAssetPath } from "@/config";
import { HOTEL_BOOKING_HREF, NOMADZ_HREF } from "@/content/links";

const HOTELS = [
  {
    id: "ares",
    href: HOTEL_BOOKING_HREF,
    imageSrc: "/img/travel/hotel-london.webp",
    imagePosition: "center",
  },
  {
    id: "nomadz",
    href: NOMADZ_HREF,
    imageSrc: "/img/travel/london-pick-02.jpg",
    imagePosition: "center",
  },
] satisfies HotelInfo[];

type HotelInfo = {
  href: string;
  id: string;
  imagePosition: string;
  imageSrc: string;
};

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mx-auto flex max-w-[920px] flex-col items-center gap-6 text-center">
      <h2 className="type-h3 text-white">{title}</h2>
    </div>
  );
}

export default function HotelsSection() {
  const t = useTranslations("breakpoint.travel.hotels");
  const [activeIndex, setActiveIndex] = useState(0);
  const activeHotel = HOTELS[activeIndex] ?? HOTELS[0]!;
  const hotelMaskImage = `url("${publicAssetPath("/img/travel/hotel-mask.svg")}")`;

  return (
    <section
      id="hotels"
      className="scroll-mt-16 bg-black pt-[80px] md:scroll-mt-20 md:pt-[120px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 md:gap-12 md:px-8">
        <SectionHeading title={t("headline")} />

        <div className="grid items-start gap-12 md:grid-cols-bp-desktop md:gap-x-s">
          <div
            className="relative aspect-square w-full overflow-hidden bg-neutral-800 md:col-span-7"
            style={{
              WebkitMaskImage: hotelMaskImage,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
              maskImage: hotelMaskImage,
              maskRepeat: "no-repeat",
              maskSize: "100% 100%",
            }}
          >
            <ImageTreatment
              key={activeHotel.id}
              src={activeHotel.imageSrc}
              alt=""
              aria-hidden="true"
              glitchPattern="p1"
              intensity={40}
              lighting="even"
              color="blue"
              motion
              flicker
              mouseReactive
              mouseRadius={120}
              objectFit="cover"
              className="absolute inset-0 h-full w-full opacity-90 transition-opacity duration-300"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-5 md:col-span-8 md:col-start-9">
            {HOTELS.map((hotel, index) => {
              const selected = index === activeIndex;

              return (
                <div
                  key={hotel.id}
                  className={`border-t pb-3 pt-6 transition-colors ${
                    selected ? "border-white" : "border-neutral-700"
                  }`}
                >
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveIndex(index)}
                    className="group/hotel flex w-full cursor-pointer items-start text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <h3 className="type-p-large-bold text-white">
                      {t(`items.${hotel.id}.name`)}
                    </h3>
                  </button>

                  <div className="mt-4 flex flex-col items-start gap-4">
                    <p className="type-paragraph text-white">
                      {t(`items.${hotel.id}.description`)}
                    </p>
                    {hotel.id !== "ares" && (
                      <p className="type-eyebrow text-blue">
                        {t(`items.${hotel.id}.distance`)}
                      </p>
                    )}
                    <Button
                      arrow
                      href={hotel.href}
                      label={t(`items.${hotel.id}.ctaLabel`)}
                      variant="inline"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
