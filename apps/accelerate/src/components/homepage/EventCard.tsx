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
    <div className="group flex h-[520px] w-full flex-col overflow-hidden rounded-[22px] bg-[#0c0c0c] md:h-[620px] lg:h-[736px]">
      {/* Photo top half with gradient overlay */}
      <div className="relative aspect-[529/352] w-full overflow-hidden rounded-t-[22px]">
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
      <div className="flex flex-1 flex-col gap-6 p-6 md:gap-8 md:p-10">
        <div className="flex flex-col gap-6">
          {/* City name - ABC Diatype Bold 60px */}
          <div
            className="text-[40px] font-bold uppercase leading-[0.96] md:text-[50px] lg:text-[60px]"
            style={{
              fontFamily: "'ABC Diatype', sans-serif",
              color: active ? "#ffffff" : "#8d8d8d",
            }}
          >
            {city}
          </div>

          <div className="flex flex-col gap-1">
            {/* Subtitle - Space Grotesk Regular 30px */}
            <p
              className="text-[24px] font-normal leading-[1.1] text-[#b3b2bc] md:text-[30px]"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              }}
            >
              {subtitle}
            </p>
            {/* Date/location - Space Grotesk Light 24px */}
            <p
              className="text-[20px] font-light leading-[1.2] md:text-[24px]"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                color: active ? "#19fb9b" : "#8d8d8d",
              }}
            >
              {dateLocation}
            </p>
          </div>
        </div>

        {/* Learn More button - Space Grotesk SemiBold 16px */}
        <div
          className="inline-flex h-[48px] w-[186px] items-center justify-between rounded-[26px] border px-7 py-4"
          style={{
            borderColor: active ? "#9945ff" : "#3d3d3d",
          }}
        >
          <span
            className="text-[16px] font-semibold uppercase tracking-[0.8px]"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              lineHeight: 1,
              color: active ? "#ffffff" : "#3d3d3d",
            }}
          >
            Learn More
          </span>
          <Image
            src={getImagePath(
              active
                ? "/images/homepage/header-arrow.svg"
                : "/images/homepage/cta-arrow.svg",
            )}
            alt=""
            width={8}
            height={8}
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
