"use client";

import { BedAlt } from "@boxicons/react/BedAlt";
import { Building } from "@boxicons/react/Building";
import { Bus } from "@boxicons/react/Bus";
import { Car } from "@boxicons/react/Car";
import { DoorOpen } from "@boxicons/react/DoorOpen";
import { LocationPin } from "@boxicons/react/LocationPin";
import { PlaneTakeOff } from "@boxicons/react/PlaneTakeOff";
import { Route } from "@boxicons/react/Route";
import { UniversalAccess } from "@boxicons/react/UniversalAccess";
import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { chinaTravelStops, type ChinaTravelStop } from "@/data/china-travel";

type TravelIcon = typeof Building;

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      viewBox="0 0 16 16"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M3 13 13 3M5 3h8v8" strokeLinecap="round" />
    </svg>
  );
}

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 border border-accelerate-green/25 bg-accelerate-green/[0.04] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-accelerate-green transition-colors hover:border-accelerate-green/60 hover:bg-accelerate-green/10 hover:text-white focus-visible:border-accelerate-green focus-visible:text-white"
    >
      {children}
      <ArrowUpRight />
    </a>
  );
}

function DetailBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: TravelIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="h-full border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-accelerate-green/30 md:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-accelerate-green/25 bg-accelerate-green/10 text-accelerate-green">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accelerate-green">
          {title}
        </h4>
      </div>
      <div className="mt-5 font-diatype text-[15px] font-light leading-[1.45] text-white/75 md:text-[16px]">
        {children}
      </div>
    </div>
  );
}

function CityGuideCard({ stop }: { stop: ChinaTravelStop }) {
  const t = useTranslations("accelerate.china.travel");

  return (
    <article className="relative overflow-hidden border border-white/10 bg-[#090909] p-5 md:p-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accelerate-purple via-accelerate-green to-transparent" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-white/10 pb-6">
        <h3 className="text-[34px] font-normal uppercase leading-none tracking-[-0.02em] text-white md:text-[42px]">
          {stop.city}
        </h3>
        <p className="font-diatype text-[15px] tracking-[0.04em] text-accelerate-green">
          {stop.date}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:gap-5">
        <DetailBlock icon={Building} title={t("venueAndHotel")}>
          <p className="font-medium text-white">{stop.hotel}</p>
          <p className="mt-1">{stop.address}</p>
          <p className="mt-3 text-white">{stop.venue}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ExternalLink href={stop.hotelWebsite}>
              {t("hotelWebsite")}
            </ExternalLink>
            <ExternalLink href={stop.directionsUrl}>
              {t("directions")}
            </ExternalLink>
          </div>
        </DetailBlock>

        <DetailBlock icon={PlaneTakeOff} title={t("arrivalsAndAccess")}>
          <p className="font-medium text-white">{stop.primaryAirport}</p>
          {stop.alternativeAirport && (
            <p className="mt-2">{stop.alternativeAirport}</p>
          )}
          {stop.arrivalNote && <p className="mt-2">{stop.arrivalNote}</p>}
        </DetailBlock>

        <DetailBlock icon={DoorOpen} title={t("venueEntry")}>
          {stop.entry}
        </DetailBlock>

        <DetailBlock icon={Route} title={t("groundTransportation")}>
          <ul className="space-y-3">
            {stop.groundTransport.map((transport) => (
              <li key={transport} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accelerate-purple"
                />
                <span>{transport}</span>
              </li>
            ))}
          </ul>
          {stop.ferryLink && (
            <div className="mt-5">
              <ExternalLink href={stop.ferryLink.href}>
                {stop.ferryLink.label}
              </ExternalLink>
            </div>
          )}
        </DetailBlock>

        <DetailBlock icon={LocationPin} title={t("localAssistance")}>
          <a
            href={`tel:${stop.hotelPhone.replace(/[^+\d]/g, "")}`}
            className="transition-colors hover:text-accelerate-green"
          >
            {t("hotel")}: {stop.hotelPhone}
          </a>
          <p className="mt-2">Charlotte Li: +86 181 9196 3908</p>
          <p>Claire Du: +86 157 1297 4001</p>
        </DetailBlock>

        <DetailBlock icon={Car} title={t("airportPickup")}>
          {t("airportPickupDescription")}
        </DetailBlock>

        <DetailBlock icon={UniversalAccess} title={t("accessibility")}>
          {stop.accessibility}
        </DetailBlock>
      </div>
    </article>
  );
}

function SharedTravelInformation() {
  const t = useTranslations("accelerate.china.travel");

  const bookingItems = [
    {
      icon: Car,
      title: t("executivePickupTitle"),
      text: t("executivePickupDescription"),
    },
    {
      icon: Bus,
      title: t("coachTitle"),
      text: t("coachDescription"),
    },
    {
      icon: BedAlt,
      title: t("hotelReservationsTitle"),
      text: t("hotelReservationsDescription"),
    },
  ];

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.7fr)]">
      <section className="border border-white/10 bg-[#0c0c0c] p-6 md:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accelerate-green">
          {t("bookingsEyebrow")}
        </p>
        <h3 className="mt-3 text-[32px] font-normal leading-none tracking-[-0.02em] text-white md:text-[42px]">
          {t("bookingsHeading")}
        </h3>
        <div className="mt-8 border-y border-white/10">
          {bookingItems.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 border-b border-white/10 py-6 last:border-b-0 md:gap-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-accelerate-green/25 bg-accelerate-green/10 text-accelerate-green">
                <item.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-[17px] font-medium leading-tight text-white">
                  {item.title}
                </h4>
                <p className="mt-3 font-diatype text-[15px] font-light leading-[1.45] text-white/65">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <a
          href="tel:+8618191963908"
          className="mt-7 inline-flex text-[15px] font-medium text-accelerate-green transition-colors hover:text-white"
        >
          Charlotte Li · +86 181 9196 3908
        </a>
      </section>

      <section className="relative overflow-hidden border border-white/10 bg-[#160725] p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accelerate-purple/25 blur-3xl" />
        <div className="relative">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accelerate-green">
            {t("visaEyebrow")}
          </p>
          <h3 className="mt-3 text-[32px] font-normal leading-none tracking-[-0.02em] text-white md:text-[42px]">
            {t("visaHeading")}
          </h3>
          <p className="mt-6 font-diatype text-[15px] font-light leading-[1.5] text-white/75">
            {t("visaDescription")}
          </p>
          <p className="mt-4 font-diatype text-[15px] font-light leading-[1.5] text-white/75">
            {t("visaReminder")}
          </p>
        </div>
      </section>
    </div>
  );
}

export function ChinaTravelPromo() {
  const t = useTranslations("accelerate.china.travel");

  return (
    <section className="relative overflow-hidden bg-black py-16 text-white md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-24 top-1/2 h-[440px] w-[440px] -translate-y-1/2 rounded-full bg-accelerate-purple/20 blur-3xl" />
        <div className="absolute -right-24 top-0 h-[420px] w-[420px] rounded-full bg-accelerate-green/10 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-[1480px] gap-10 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)] lg:items-end lg:gap-20">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accelerate-green">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-[44px] font-normal uppercase leading-[0.98] tracking-[-0.035em] text-accelerate-gray-light sm:text-[58px] md:text-[76px]">
            {t("heading")}
          </h2>
          <p className="mt-5 max-w-2xl font-diatype text-[17px] font-light leading-[1.5] text-white/65 md:text-[20px]">
            {t("description")}
          </p>
          <Link
            href="/accelerate/china/travel"
            className="btn-outline-gradient mt-8 inline-flex h-[52px] items-center gap-3 px-6 text-[13px] font-semibold uppercase tracking-[0.08em] md:h-[58px] md:px-7 md:text-[16px]"
          >
            {t("openGuide")}
            <ArrowUpRight />
          </Link>
        </div>

        <div className="border-y border-white/10 lg:border-t-0">
          {chinaTravelStops.map((stop) => (
            <div
              key={stop.city}
              className="flex items-center border-t border-white/10 py-4 first:border-t-0 lg:first:pt-0"
            >
              <p className="mr-auto text-[22px] font-normal uppercase leading-none text-white">
                {stop.city}
              </p>
              <p className="font-diatype text-[15px] text-accelerate-green">
                {stop.date.replace(" 2026", "")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ChinaTravelGuide({
  standalone = false,
}: {
  standalone?: boolean;
}) {
  const t = useTranslations("accelerate.china.travel");
  const [activeCity, setActiveCity] = useState(chinaTravelStops[0]?.city ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeStop =
    chinaTravelStops.find((stop) => stop.city === activeCity) ??
    chinaTravelStops[0];

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % chinaTravelStops.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex =
        (index - 1 + chinaTravelStops.length) % chinaTravelStops.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = chinaTravelStops.length - 1;
    }

    if (nextIndex === undefined) return;

    const nextStop = chinaTravelStops[nextIndex];
    if (!nextStop) return;

    event.preventDefault();
    setActiveCity(nextStop.city);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section
      id="travel-guide"
      className={`relative overflow-hidden bg-black text-white ${standalone ? "pb-16 pt-40 md:pb-28 md:pt-52" : "py-16 md:py-28"}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accelerate-purple to-transparent" />
      <div className="relative mx-auto max-w-[1480px] px-6 md:px-10">
        {standalone && (
          <Link
            href="/accelerate/china"
            className="mb-12 inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/65 transition-colors hover:text-accelerate-green focus-visible:text-accelerate-green"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M13 8H3M7 4 3 8l4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("backToChina")}
          </Link>
        )}

        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accelerate-green">
            {t("eyebrow")}
          </p>
          <h2
            id="travel-guide-heading"
            className="mt-4 text-[44px] font-normal uppercase leading-[0.98] tracking-[-0.035em] text-accelerate-gray-light sm:text-[58px] md:text-[76px]"
          >
            {t("heading")}
          </h2>
          <p className="mt-5 max-w-2xl font-diatype text-[17px] font-light leading-[1.5] text-white/65 md:text-[20px]">
            {t("description")}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={t("heading")}
          aria-labelledby="travel-guide-heading"
          className="mt-10 grid border-y border-white/10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {chinaTravelStops.map((stop, index) => {
            const isActive = stop.city === activeStop?.city;
            const tabId = `travel-tab-${stop.city.toLowerCase()}`;
            const panelId = `travel-panel-${stop.city.toLowerCase()}`;

            return (
              <button
                key={stop.city}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={tabId}
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveCity(stop.city)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`group relative flex w-full items-baseline justify-between gap-4 border-b border-white/10 bg-transparent py-4 text-left transition-colors hover:bg-white/[0.03] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accelerate-green sm:border-b-0 sm:px-5 sm:first:pl-0 lg:border-l lg:first:border-l-0 ${isActive ? "bg-white/[0.04]" : ""}`}
              >
                <span
                  className={`mr-auto text-[20px] font-normal uppercase leading-none ${isActive ? "text-accelerate-green" : "text-white"}`}
                >
                  {stop.city}
                </span>
                <span className="font-diatype text-[14px] text-accelerate-green">
                  {stop.date.replace(" 2026", "")}
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-[-1px] h-px bg-accelerate-green transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid gap-6">
          {chinaTravelStops.map((stop) => {
            const isActive = stop.city === activeStop?.city;
            const cityKey = stop.city.toLowerCase();

            return (
              <div
                key={stop.city}
                id={`travel-panel-${cityKey}`}
                role="tabpanel"
                aria-labelledby={`travel-tab-${cityKey}`}
                tabIndex={0}
                hidden={!isActive}
              >
                <CityGuideCard stop={stop} />
              </div>
            );
          })}
        </div>

        <SharedTravelInformation />

        <div className="mt-8 flex flex-col gap-6 border border-white/10 bg-black px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accelerate-green">
              {t("contactsEyebrow")}
            </p>
            <p className="mt-2 font-diatype text-[16px] text-white/75">
              Claire Du · +86 157 1297 4001 &nbsp; / &nbsp; Charlotte Li · +86
              181 9196 3908
            </p>
          </div>
          <p className="font-diatype text-[15px] text-white/60">
            {t("emergency")}
          </p>
        </div>
      </div>
    </section>
  );
}
