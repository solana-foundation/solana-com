"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/accordion";
import {
  ClockIcon,
  LedgerIcon,
  MoneyIcon,
  UsersIcon,
} from "@solana-com/ui-chrome/icons";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";
import { SolutionHero, SolutionHeroStat } from "@/components/solutions/hero.v2";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { SolutionReport } from "@/components/solutions/report.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { Decor } from "@/components/solutions/decor.v2";
import { CardCarouselSection } from "@/component-library/card-carousel-section";
import { PlaceMediaCard } from "@/component-library/place-media-card";
import { TierCards } from "@/component-library/tier-cards";
import { Container } from "@/component-library/container";
import { SelectionColor } from "@/component-library/selection-color";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import {
  AMENITY_COUNT,
  FAQ_COUNT,
  LINKS,
  MEMBERSHIP_TIERS,
  PERK_COUNT,
  SPACES,
} from "@/data/skyline";

const ACCENT = "#CA9FF5";

const PlusGlyph = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden={true}
    className={className}
    style={{ color: ACCENT }}
  >
    <path d="M8 0V8H16V16H8V8H0V0H8Z" fill="currentColor" />
  </svg>
);

type SkylinePageProps = {
  events: CalendarEvent[];
};

export function SkylinePage({ events }: SkylinePageProps) {
  const t = useTranslations();

  const { ref: spacesRef, isIntersecting: spacesVisible } =
    useIntersectionObserver<HTMLUListElement>({
      threshold: 0.2,
      triggerOnce: true,
    });

  const stats: SolutionHeroStat[] = [
    {
      value: t("skyline.hero.stats.0.value"),
      label: t("skyline.hero.stats.0.label"),
      Icon: LedgerIcon,
    },
    {
      value: t("skyline.hero.stats.1.value"),
      label: t("skyline.hero.stats.1.label"),
      Icon: UsersIcon,
    },
    {
      value: t("skyline.hero.stats.2.value"),
      label: t("skyline.hero.stats.2.label"),
      Icon: ClockIcon,
    },
    {
      value: t("skyline.hero.stats.3.value"),
      label: t("skyline.hero.stats.3.label"),
      Icon: MoneyIcon,
    },
  ];

  const email = (chunks: ReactNode) => (
    <a href={LINKS.contactEmail} className="underline text-inherit">
      {chunks}
    </a>
  );

  const light = (chunks: ReactNode) => (
    <span className="font-light">{chunks}</span>
  );

  return (
    <>
      <SelectionColor selectionColor={ACCENT} selectionTextColor="#000000" />

      <div id="skyline-page" className="bg-black">
        <SolutionHero
          title={t("skyline.hero.title")}
          subtitle={t("skyline.hero.subtitle")}
          extraCta={t("skyline.hero.primaryCta")}
          extraCtaHref={LINKS.fridayCoworking}
          secondaryCta={t("skyline.hero.secondaryCta")}
          secondaryCtaHref={LINKS.eventsCalendar}
          stats={stats}
          showDownloadCard={false}
          bgJsonFilePath="/src/img/skyline/hero-bg.json"
        />

        <Divider />

        <WhatIsIt
          title={t.rich("skyline.whatIs.title", {
            light: (chunks) => (
              <span className="font-light">
                <br />
                {chunks}
              </span>
            ),
          })}
          description={t("skyline.whatIs.description")}
          highlightColor={ACCENT}
          imageSrc="/src/img/skyline/what-is.webp"
        />

        <Divider />

        {/* Coworking Section */}
        <section className="relative bg-black text-white text-left">
          <Container className="py-[64px] md:py-[112px] xl:py-[160px] flex flex-col xl:flex-row gap-8 xl:gap-16">
            <div className="w-full xl:w-1/2">
              <h2 className="nd-heading-l mb-0">
                {t.rich("skyline.coworking.title", { light })}
              </h2>
              <p className="nd-body-xl text-nd-mid-em-text mt-3 xl:mt-5 mb-0">
                {t("skyline.coworking.description")}
              </p>
              <ul className="p-0 mt-8 xl:mt-12 mb-0 list-none divide-y-[1px] divide-white/10">
                {Array.from({ length: AMENITY_COUNT }, (_, i) => (
                  <li key={i} className="flex items-center gap-4 py-4">
                    <PlusGlyph className="shrink-0" />
                    <span className="nd-body-l">
                      {t(`skyline.coworking.items.${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full xl:w-1/2">
              <Image
                src="/src/img/skyline/coworking.webp"
                alt=""
                width={1000}
                height={667}
                className="w-full h-full max-h-[640px] object-cover rounded-xl"
                loading="lazy"
              />
            </div>
          </Container>
        </section>

        <Divider />

        {/* Membership Section */}
        <section className="relative z-[1] bg-black text-white text-left">
          <Container className="py-[64px] md:py-[112px] xl:py-[160px]">
            <div className="max-w-xl mb-8 xl:mb-12">
              <h2 className="nd-heading-l mb-0">
                {t.rich("skyline.membership.title", { light })}
              </h2>
              <p className="nd-body-xl text-nd-mid-em-text mt-3 xl:mt-5 mb-0">
                {t("skyline.membership.description")}
              </p>
            </div>
            <TierCards
              tiers={MEMBERSHIP_TIERS.map((tier) => ({
                key: tier.key,
                name: t(`skyline.membership.tiers.${tier.key}.name`),
                price: t(`skyline.membership.tiers.${tier.key}.price`),
                period: t(`skyline.membership.tiers.${tier.key}.period`),
                description: t(
                  `skyline.membership.tiers.${tier.key}.description`,
                ),
                cta: t(`skyline.membership.tiers.${tier.key}.cta`),
                ctaHref: tier.href,
              }))}
            />
            <div className="mt-12 xl:mt-16 pt-8 xl:pt-12 border-t border-nd-border-light">
              <h3 className="nd-heading-s mb-6">
                {t("skyline.membership.perksTitle")}
              </h3>
              <ul className="p-0 m-0 list-none grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                {Array.from({ length: PERK_COUNT }, (_, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <PlusGlyph className="shrink-0 mt-[5px]" />
                    <span className="nd-body-m text-nd-mid-em-text">
                      {t(`skyline.membership.perks.${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <Decor imageSrc="/src/img/skyline/decor.webp" />

        {/* Spaces Section */}
        <section className="relative z-[1] bg-black text-white text-left">
          <Container className="py-[64px] md:py-[112px] xl:py-[160px]">
            <div className="max-w-xl mb-8 xl:mb-12">
              <h2 className="nd-heading-l mb-0">
                {t.rich("skyline.spaces.title", { light })}
              </h2>
              <p className="nd-body-xl text-nd-mid-em-text mt-3 xl:mt-5 mb-0">
                {t("skyline.spaces.description")}
              </p>
            </div>
            <ul
              ref={spacesRef}
              className="p-0 m-0 list-none grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
            >
              {SPACES.map(({ key, Icon }, index) => (
                <li
                  key={key}
                  className={
                    "flex flex-col rounded-xl border border-nd-border-light bg-white/[0.04] p-6 xl:p-8" +
                    (spacesVisible ? " animate-fade-in-up" : "")
                  }
                  style={
                    spacesVisible
                      ? { animationDelay: `${0.1 + index * 0.1}s` }
                      : { opacity: 0 }
                  }
                >
                  <Icon
                    aria-hidden={true}
                    className="size-6 mb-6"
                    style={{ color: ACCENT }}
                  />
                  <h3 className="nd-heading-s mb-2">
                    {t(`skyline.spaces.items.${key}.title`)}
                  </h3>
                  <p className="nd-body-m text-nd-mid-em-text mb-0">
                    {t(`skyline.spaces.items.${key}.description`)}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <Divider />

        {/* Host Your Event Section */}
        <section className="relative bg-black text-white text-left">
          <Container className="py-[64px] md:py-[112px] xl:py-[160px] flex flex-col xl:flex-row xl:items-center gap-8 xl:gap-16">
            <div className="w-full xl:w-2/5 max-xl:order-2">
              <Image
                src="/src/img/skyline/host-event.webp"
                alt=""
                width={1000}
                height={1356}
                className="w-full h-auto max-h-[560px] object-cover rounded-xl"
                loading="lazy"
              />
            </div>
            <div className="w-full xl:w-3/5 max-xl:order-1">
              <h2 className="nd-heading-l mb-0">
                {t.rich("skyline.host.title", { light })}
              </h2>
              <p className="nd-body-xl text-nd-mid-em-text mt-3 xl:mt-5 mb-0 max-w-2xl">
                {t("skyline.host.description")}
              </p>
              <div className="mt-8 xl:mt-12">
                <a
                  href={LINKS.contactEmail}
                  className="inline-flex items-center rounded-full bg-white text-black px-5 py-2.5 nd-body-m font-medium hover:bg-white/90 transition-colors"
                >
                  {t("skyline.host.cta")}
                </a>
              </div>
            </div>
          </Container>
        </section>

        <Divider />

        {/* Upcoming Events Section */}
        {events.length > 0 && (
          <>
            <CardCarouselSection
              wrapperClassName="py-[64px] md:py-[112px] xl:py-[160px]"
              title={t.rich("skyline.events.title", { light })}
              subtitle={t("skyline.events.subtitle")}
              totalItems={events.length}
              tabletLastPageOffset={2}
              desktopLastPageOffset={2}
              desktop2xlLastPageOffset={3}
              cardWidthClassName="w-full md:w-[356px] xl:w-[456px]"
              cta={t("skyline.events.cta")}
              ctaHref={LINKS.eventsCalendar}
            >
              {events.map((event) => (
                <PlaceMediaCard
                  key={event.key}
                  imageSrc={event.img.primary || "/src/img/skyline/decor.webp"}
                  title={event.title}
                  date={event.schedule.from ?? undefined}
                  location={
                    event.venue.city ?? event.venue.address ?? undefined
                  }
                  href={event.rsvp}
                  className="px-1"
                />
              ))}
            </CardCarouselSection>

            <Divider />
          </>
        )}

        {/* FAQ Section */}
        <section className="relative bg-black text-white text-left">
          <Container className="py-[64px] md:py-[112px] xl:py-[160px] flex flex-col xl:flex-row gap-8 xl:gap-16">
            <div className="xl:w-2/5">
              <h2 className="nd-heading-l mb-0">{t("skyline.faq.title")}</h2>
            </div>
            <div className="xl:w-3/5">
              <Accordion type="single" collapsible className="w-full">
                {Array.from({ length: FAQ_COUNT }, (_, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border-nd-border-light"
                  >
                    <AccordionTrigger className="nd-body-l font-medium py-6 hover:no-underline">
                      {t(`skyline.faq.items.${i}.question`)}
                    </AccordionTrigger>
                    <AccordionContent className="nd-body-m text-nd-mid-em-text pb-6">
                      {t.rich(`skyline.faq.items.${i}.answer`, { email })}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Container>
        </section>

        <Divider hideOnDesktop />

        {/* Closing CTA Section */}
        <SolutionReport
          eyebrow={t("skyline.cta.title")}
          description={t("skyline.cta.description")}
          emailCta={t("skyline.cta.button")}
          onEmailClick={() => {
            window.location.href = LINKS.contactEmail;
          }}
          CtaIcon={Mail}
          imgSrc="/src/img/skyline/logo.webp"
          linksTitle={t("skyline.cta.linksTitle")}
          links={[
            {
              title: t("skyline.cta.links.0.label"),
              href: LINKS.fridayCoworking,
            },
            {
              title: t("skyline.cta.links.1.label"),
              href: LINKS.membershipApplication,
            },
            {
              title: t("skyline.cta.links.2.label"),
              href: LINKS.eventsCalendar,
            },
          ]}
          bgJsonFilePath="/src/img/skyline/hero-bg.json"
        />
      </div>
    </>
  );
}
