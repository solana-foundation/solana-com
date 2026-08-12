"use client";

import { useTranslations } from "@workspace/i18n/client";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import Button from "@/components/Button";
import Marquee from "@/components/Marquee";
import PageShell from "@/components/PageShell";
import SectionHeadline from "@/components/SectionHeadline";
import SubpageHero from "@/components/SubpageHero";
import Footer from "@/components/sections/Footer";
import { publicAssetPath } from "@/config";
import {
  BREAKPOINT_EMAIL_HREF,
  BRITISH_AIRWAYS_HREF,
  DELTA_AIRLINES_HREF,
  GENERAL_ADMISSION_HREF,
  GATWICK_AIRPORT_HREF,
  HEATHROW_AIRPORT_HREF,
  IAS_HREF,
  LONDON_CITY_AIRPORT_HREF,
  LUFTHANSA_HREF,
  VISA_CHECK_HREF,
  VIRGIN_ATLANTIC_HREF,
} from "@/content/links";
import { getAnchorLinkProps } from "@/lib/links";
import TravelHotelsSection from "./TravelHotelsSection";
import TravelSubnav from "./TravelSubnav";

const TRAVEL_MARQUEE_HIGHLIGHTS = [
  "BP26",
  "LDN",
  "BUILD",
  "DEPLOY",
  "SHIP MORE",
];

const AIRPORTS = [
  {
    code: "LCY",
    href: LONDON_CITY_AIRPORT_HREF,
    id: "lcy",
  },
  {
    code: "LHR",
    href: HEATHROW_AIRPORT_HREF,
    id: "lhr",
  },
  {
    code: "LGW",
    href: GATWICK_AIRPORT_HREF,
    id: "lgw",
  },
] as const;

const AIRLINES = [
  {
    href: VIRGIN_ATLANTIC_HREF,
    id: "virginAtlantic",
    logo: "/img/travel/airline-virgin-atlantic.svg",
  },
  {
    href: DELTA_AIRLINES_HREF,
    id: "delta",
    logo: "/img/travel/airline-delta.svg",
  },
  {
    href: BRITISH_AIRWAYS_HREF,
    id: "britishAirways",
    logo: "/img/travel/airline-british-airways.svg",
  },
  {
    href: LUFTHANSA_HREF,
    id: "lufthansa",
    logo: "/img/travel/airline-lufthansa.svg",
  },
] as const;

function FlightsSection() {
  const t = useTranslations("breakpoint.travel.flights");

  return (
    <section id="flights" className="scroll-mt-16 bg-black md:scroll-mt-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-4 md:gap-16 md:px-8">
        <div className="flex h-[147px] shrink-0 items-center justify-center md:h-[180px]">
          <SectionHeadline
            alignment="center"
            eyebrow={t("eyebrow")}
            headline={t("headline")}
          />
        </div>
        <div className="grid gap-16 md:grid-cols-bp-desktop md:gap-x-s">
          <div className="flex flex-col md:col-span-6">
            {AIRPORTS.map((airport) => (
              <a
                key={airport.code}
                href={airport.href}
                className="group flex h-[140px] flex-col justify-center gap-3 border-b border-stroke-primary py-6 first:border-t md:h-[166px] md:px-8 md:py-8"
                {...getAnchorLinkProps({ href: airport.href })}
              >
                <p className="font-bp26 text-h6 uppercase text-white">
                  {airport.code}
                </p>
                <div className="flex flex-col gap-2">
                  <span className="type-h5 inline-flex items-center gap-2 text-white transition-colors group-hover:text-neutral-100">
                    {t(`airports.${airport.id}.name`)}
                    <ArrowUpRightIcon className="size-3 shrink-0" />
                  </span>
                  <span className="type-eyebrow text-blue">
                    {t(`airports.${airport.id}.distance`)}
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div className="-mr-4 overflow-x-auto md:col-span-9 md:col-start-8 md:mr-0 md:overflow-visible">
            <div className="grid w-max grid-flow-col auto-cols-[283.56px] gap-6 md:w-full md:auto-rows-[382px] md:grid-flow-row md:grid-cols-2 md:gap-8">
              {AIRLINES.map((airline) => (
                <article key={airline.id} className="w-full">
                  <div className="flex h-[189px] items-center justify-center border border-stroke-primary bg-transparent-white-05 p-9 md:h-[246px] md:p-11">
                    <img
                      src={publicAssetPath(airline.logo)}
                      alt={t("airlineLogo", {
                        name: t(`airlines.${airline.id}.name`),
                      })}
                      width={281}
                      height={68}
                      className="max-h-[68px] w-auto max-w-full"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-4 py-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="type-paragraph font-bold text-white">
                        {t(`airlines.${airline.id}.name`)}
                      </h3>
                      <p className="type-paragraph text-text-secondary">
                        {t(`airlines.${airline.id}.description`)}
                      </p>
                    </div>
                    <Button
                      arrow
                      href={airline.href}
                      label={t("viewFlights")}
                      variant="inline"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HotelsSection() {
  return <TravelHotelsSection />;
}

function VisaSection() {
  const t = useTranslations("breakpoint.travel.visas");

  return (
    <section
      id="visas"
      className="scroll-mt-16 bg-black pt-[80px] md:scroll-mt-20 md:pt-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-16 border-t border-stroke-primary pt-8 md:grid-cols-bp-desktop md:gap-x-s md:pt-12">
          <div className="flex flex-col items-start gap-8 md:col-span-6">
            <div className="flex flex-col gap-4">
              <h2 className="type-h3 text-white">{t("headline")}</h2>
              <p className="type-paragraph text-white">{t("summary")}</p>
            </div>
            <Button
              arrow
              href={VISA_CHECK_HREF}
              label={t("checkRequirements")}
              variant="secondary"
            />
          </div>
          <div className="type-paragraph flex flex-col gap-8 text-white md:col-span-8 md:col-start-9">
            <div className="flex flex-col gap-4">
              <h3 className="type-p-large text-white">{t("firstStep")}</h3>
              <p>
                <a
                  href={VISA_CHECK_HREF}
                  className="text-purple underline decoration-purple underline-offset-4 transition-opacity hover:opacity-80"
                  {...getAnchorLinkProps({ href: VISA_CHECK_HREF })}
                >
                  {t("officialRequirements")}
                </a>{" "}
                {t("entrySuffix")}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="type-p-large text-white">{t("secondStep")}</h3>
              <p>
                {t("supportPrefix")}{" "}
                <a
                  href={IAS_HREF}
                  className="text-purple underline decoration-purple underline-offset-4 transition-opacity hover:opacity-80"
                  {...getAnchorLinkProps({ href: IAS_HREF })}
                >
                  {t("supportLink")}
                </a>{" "}
                {t("supportSuffix")}
              </p>
              <p>{t("fees")}</p>
              <p>
                {t("invitationPrefix")}{" "}
                <a
                  href={BREAKPOINT_EMAIL_HREF}
                  className="text-purple underline decoration-purple underline-offset-4 transition-opacity hover:opacity-80"
                  {...getAnchorLinkProps({ href: BREAKPOINT_EMAIL_HREF })}
                >
                  {t("invitationLink")}
                </a>
                {t("invitationSuffix")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqBanner() {
  const t = useTranslations("breakpoint.travel.faq");

  return (
    <section className="bg-black pt-[80px] md:pt-[120px]">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <div className="flex h-[308px] flex-col items-center justify-end gap-10 bg-neutral-800 px-8 py-20 text-center md:h-auto md:min-h-[286px] md:p-[80px]">
          <h2 className="type-h4 text-white">{t("headline")}</h2>
          <Button arrow href="/faq" label={t("cta")} variant="primary" />
        </div>
      </div>
    </section>
  );
}

function TravelHero() {
  const t = useTranslations("breakpoint.travel");

  return (
    <SubpageHero
      title={t("title")}
      contentClassName="max-w-[1440px]"
      heroImage="travel"
    />
  );
}

export default function TravelPage() {
  const t = useTranslations("breakpoint.travel");

  return (
    <PageShell
      contentId="travel-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: GENERAL_ADMISSION_HREF,
        ctaLabel: t("cta"),
        showMenuButton: true,
      }}
    >
      <TravelHero />
      <TravelSubnav />
      <FlightsSection />
      <div className="hidden h-[82px] overflow-hidden md:block">
        <Marquee
          highlightClassName="text-green"
          highlights={TRAVEL_MARQUEE_HIGHLIGHTS}
        />
      </div>
      <HotelsSection />
      <VisaSection />
      <Marquee
        highlightClassName="text-blue"
        highlights={TRAVEL_MARQUEE_HIGHLIGHTS}
      />
      <FaqBanner />
      <Footer />
    </PageShell>
  );
}
