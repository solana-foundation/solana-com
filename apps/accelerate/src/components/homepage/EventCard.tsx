"use client";

import Image from "next/image";
import { Link } from "@workspace/i18n/routing";
import { getImagePath } from "@/config";

interface EventCardProps {
  image: string;
  city: string;
  subtitle: string;
  dateLocation: string;
  href: string;
  external?: boolean;
  active?: boolean;
}

function CardContent({
  image,
  city,
  subtitle,
  dateLocation,
  active = true,
}: Omit<EventCardProps, "href" | "external">) {
  return (
    <div className="group flex h-[398px] w-full flex-col overflow-hidden rounded-[10px] bg-[#0c0c0c] md:h-[620px] md:rounded-[22px] lg:h-[736px]">
      {/* Photo top half with gradient overlay */}
      <div className="relative aspect-[242/191] w-full overflow-hidden rounded-t-[10px] md:aspect-[529/352] md:rounded-t-[22px]">
        <Image
          src={image}
          alt={city}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay on photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />

        {/* Upcoming badge */}
        {active && (
          <div
            className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border px-3 py-1.5 backdrop-blur-md md:left-5 md:top-5 md:gap-2 md:px-4 md:py-2"
            style={{
              borderColor: "rgba(153, 69, 255, 0.35)",
              background:
                "linear-gradient(135deg, rgba(153, 69, 255, 0.2) 0%, rgba(0, 212, 255, 0.1) 100%)",
              boxShadow:
                "0 4px 16px rgba(153, 69, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Pulsing dot */}
            <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9945FF] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9945FF] md:h-2.5 md:w-2.5" />
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-[1.5px] md:text-xs"
              style={{ color: "#c4a0ff" }}
            >
              Upcoming
            </span>
          </div>
        )}

        {/* Retrospective badge for past events */}
        {!active && (
          <div
            className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border px-3 py-1.5 backdrop-blur-md md:left-5 md:top-5 md:gap-2 md:px-4 md:py-2"
            style={{
              borderColor: "rgba(25, 251, 155, 0.3)",
              background:
                "linear-gradient(135deg, rgba(25, 251, 155, 0.15) 0%, rgba(153, 69, 255, 0.1) 100%)",
              boxShadow:
                "0 4px 16px rgba(25, 251, 155, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Play/recap icon */}
            <svg
              className="h-2.5 w-2.5 md:h-3 md:w-3"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2.5 1.5L10 6L2.5 10.5V1.5Z"
                fill="#19fb9b"
                stroke="#19fb9b"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-[10px] font-semibold uppercase tracking-[1.5px] md:text-xs"
              style={{ color: "#19fb9b" }}
            >
              Watch the Recap
            </span>
          </div>
        )}
      </div>

      {/* Bottom half - info */}
      <div className="flex flex-1 flex-col gap-4 p-[18px] md:gap-8 md:p-10">
        <div className="flex flex-col gap-3 md:gap-6">
          {/* City name */}
          <div className="font-diatype text-[25px] font-bold uppercase leading-[1.06] text-white md:text-[50px] lg:text-[60px]">
            {city}
          </div>

          <div className="flex flex-col gap-[2px]">
            {/* Subtitle */}
            <p className="text-[16px] font-normal leading-[1.1] text-accelerate-gray-100 md:text-[30px]">
              {subtitle}
            </p>
            {/* Date/location */}
            <p
              className="text-[14px] font-light leading-[1.2] md:text-[24px]"
              style={{ color: "#19fb9b" }}
            >
              {dateLocation}
            </p>
          </div>
        </div>

        {/* CTA button */}
        <div className="btn-outline-gradient flex w-[157px] items-center justify-between px-6 py-[13px] md:w-[186px] md:px-[28px] md:py-[16px]">
          <span className="whitespace-nowrap text-[13.5px] font-semibold uppercase tracking-[0.67px] leading-none text-white md:text-[16px] md:tracking-[0.8px]">
            {active ? "Learn More" : "Catch Up"}
          </span>
          <Image
            src={getImagePath("/images/homepage/header-arrow.svg")}
            alt=""
            width={8}
            height={8}
            className="h-[7px] w-[7px] flex-shrink-0 md:h-[8px] md:w-[8px]"
          />
        </div>
      </div>
    </div>
  );
}

export function EventCard({
  image,
  city,
  subtitle,
  dateLocation,
  href,
  external = false,
  active = true,
}: EventCardProps) {
  const cardProps = { image, city, subtitle, dateLocation, active };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
      >
        <CardContent {...cardProps} />
      </a>
    );
  }

  return (
    <Link href={href} className="block w-full">
      <CardContent {...cardProps} />
    </Link>
  );
}
