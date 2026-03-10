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
        {/* Subtle gradient overlay on photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />
      </div>

      {/* Bottom half - info */}
      <div className="flex flex-1 flex-col gap-4 p-[18px] md:gap-8 md:p-10">
        <div className="flex flex-col gap-3 md:gap-6">
          {/* City name */}
          <div
            className="font-diatype text-[25px] font-bold uppercase leading-[1.06] md:text-[50px] lg:text-[60px]"
            style={{ color: active ? "#ffffff" : "#8d8d8d" }}
          >
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
              style={{ color: active ? "#19fb9b" : "#8d8d8d" }}
            >
              {dateLocation}
            </p>
          </div>
        </div>

        {/* Learn More button */}
        <div
          className={`btn-outline-gradient flex w-[157px] items-center justify-between px-6 py-[13px] md:w-[186px] md:px-[28px] md:py-[16px] ${
            !active ? "!border-[#3d3d3d] !bg-none" : ""
          }`}
        >
          <span
            className="whitespace-nowrap text-[13.5px] font-semibold uppercase tracking-[0.67px] leading-none md:text-[16px] md:tracking-[0.8px]"
            style={{ color: active ? "#ffffff" : "#3d3d3d" }}
          >
            Learn More
          </span>
          <Image
            src={getImagePath("/images/homepage/header-arrow.svg")}
            alt=""
            width={8}
            height={8}
            className="h-[7px] w-[7px] flex-shrink-0 md:h-[8px] md:w-[8px]"
            style={{ opacity: active ? 1 : 0.3 }}
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
