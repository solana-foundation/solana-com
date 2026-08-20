import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { AmbassadorApplicationForm } from "@/components/universities/ambassador/AmbassadorApplicationForm";
import { AmbassadorFaq } from "@/components/universities/ambassador/AmbassadorFaq";

import heroImg from "@@/assets/universities/ambassador-hero.webp";
import workshopsImg from "@@/assets/universities/ambassador-workshops.webp";
import buildNightsImg from "@@/assets/universities/ambassador-build-nights.webp";
import demoDayImg from "@@/assets/universities/ambassador-demo-day.webp";
import communityImg from "@@/assets/universities/ambassador-community.webp";

import { ArrowRight } from "@boxicons/react/ArrowRight";
import { BookOpen } from "@boxicons/react/BookOpen";
import { Check } from "@boxicons/react/Check";
import { DollarCircle } from "@boxicons/react/DollarCircle";
import { Gift } from "@boxicons/react/Gift";
import { Group } from "@boxicons/react/Group";
import { Package } from "@boxicons/react/Package";
import { PlaneTakeOff } from "@boxicons/react/PlaneTakeOff";

const CONTAINER = "mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10";
const SECTION_PADDING = "py-16 md:py-24 xl:py-28";

function Eyebrow({
  children,
  className = "text-solana-green",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-brand-mono text-[13px] uppercase leading-5 tracking-[0.52px] ${className}`}
    >
      {children}
    </p>
  );
}

function PillButton({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "light" | "dark";
}) {
  const isLight = variant === "light";
  return (
    <a
      href={href}
      className={`group inline-flex h-14 items-center gap-3 rounded-full pl-2 pr-[22px] text-[18px] no-underline transition-opacity hover:opacity-90 ${
        isLight ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <span
        className={`flex size-10 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5 ${
          isLight ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <ArrowRight width={24} height={24} fill="currentColor" />
      </span>
      {label}
    </a>
  );
}

export async function UniversityAmbassadorPage() {
  const t = await getTranslations("universities");

  const subnavLinks = [
    { href: "#program", label: t("subnav.program") },
    { href: "#perks", label: t("subnav.perks") },
    { href: "#faq", label: t("subnav.research") },
    { href: "#apply", label: t("subnav.apply"), highlight: true },
  ];

  const stats = ["leads", "hours", "duration"].map((key) => ({
    value: t(`why.stats.${key}.value`),
    label: t(`why.stats.${key}.label`),
  }));

  const formatCards = [
    {
      key: "workshops",
      img: workshopsImg,
      gradientTransform: "matrix(-4.1721 8.3301 -6.3633 -3.187 110 144)",
    },
    {
      key: "buildNights",
      img: buildNightsImg,
      gradientTransform: "matrix(10.318 14.139 -10.801 7.8816 91.6 117.76)",
    },
    {
      key: "demoDay",
      img: demoDayImg,
      gradientTransform: "matrix(-8.296 12.519 -9.5635 -6.3372 122.1 120.71)",
      solidGradient: true,
    },
    {
      key: "community",
      img: communityImg,
      gradientTransform: "matrix(-6.4256 15.413 -11.774 -4.9084 110 118.56)",
    },
  ].map((card) => ({
    ...card,
    badge: t(`formats.cards.${card.key}.badge`),
    title: t(`formats.cards.${card.key}.title`),
    description: t(`formats.cards.${card.key}.description`),
  }));

  const perkIcons = {
    stipend: DollarCircle,
    events: Gift,
    bundle: Package,
    training: BookOpen,
    network: Group,
    travel: PlaneTakeOff,
  } as const;
  const perks = (Object.keys(perkIcons) as Array<keyof typeof perkIcons>).map(
    (key) => ({
      Icon: perkIcons[key],
      title: t(`perks.items.${key}.title`),
      detail: t(`perks.items.${key}.detail`),
    }),
  );

  const circuitSteps = [
    {
      key: "workshop",
      dotColor: "border-[#9945ff]",
      connectorGradient: "from-[#9945ff] to-[#796ee5]",
    },
    {
      key: "buildNight",
      dotColor: "border-[#796ee5]",
      connectorGradient: "from-[#796ee5] to-[#3ebab6]",
    },
    {
      key: "demoDay",
      dotColor: "border-[#3ebab6]",
      connectorGradient: "from-[#3ebab6] to-[#14f195]",
    },
    { key: "next", dotColor: "border-[#14f195]" },
  ].map(({ key, dotColor, connectorGradient }) => ({
    dotColor,
    connectorGradient,
    label: t(`circuit.steps.${key}.label`),
    title: t(`circuit.steps.${key}.title`),
    description: t(`circuit.steps.${key}.description`),
  }));

  const eligibilityItems = t.raw("eligibility.items") as string[];

  const faqItems = [
    "time",
    "coLead",
    "stipend",
    "country",
    "gradStudents",
    "newToSolana",
  ].map((key) => ({
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  }));

  const formTranslations = {
    school: {
      label: t("application.form.school.label"),
      placeholder: t("application.form.school.placeholder"),
    },
    country: {
      label: t("application.form.country.label"),
      placeholder: t("application.form.country.placeholder"),
    },
    major: {
      label: t("application.form.major.label"),
      placeholder: t("application.form.major.placeholder"),
    },
    graduation: {
      label: t("application.form.graduation.label"),
      placeholder: t("application.form.graduation.placeholder"),
    },
    videoShipped: {
      label: t("application.form.videoShipped.label"),
      placeholder: t("application.form.videoShipped.placeholder"),
    },
    videoOrganized: {
      label: t("application.form.videoOrganized.label"),
      placeholder: t("application.form.videoOrganized.placeholder"),
    },
    buildIdea: {
      label: t("application.form.buildIdea.label"),
      placeholder: t("application.form.buildIdea.placeholder"),
    },
    coLead: {
      label: t("application.form.coLead.label"),
      namePlaceholder: t("application.form.coLead.namePlaceholder"),
      emailPlaceholder: t("application.form.coLead.emailPlaceholder"),
    },
    involvement: {
      label: t("application.form.involvement.label"),
      options: {
        none: t("application.form.involvement.options.none"),
        events: t("application.form.involvement.options.events"),
        hackathon: t("application.form.involvement.options.hackathon"),
        builder: t("application.form.involvement.options.builder"),
        superteam: t("application.form.involvement.options.superteam"),
        other: t("application.form.involvement.options.other"),
      },
    },
    education: {
      label: t("application.form.education.label"),
      placeholder: t("application.form.education.placeholder"),
    },
    validation: {
      required: t("application.form.validation.required"),
      maxLength: t("application.form.validation.maxLength"),
      country: t("application.form.validation.country"),
      graduation: t("application.form.validation.graduation"),
      url: t("application.form.validation.url"),
      buildIdea: t("application.form.validation.buildIdea"),
      email: t("application.form.validation.email"),
      coLeadPair: t("application.form.validation.coLeadPair"),
      option: t("application.form.validation.option"),
    },
    submit: t("application.form.submit"),
    submitting: t("application.form.submitting"),
    success: t("application.form.success"),
    error: t("application.form.error"),
  };

  return (
    <div className="scroll-smooth bg-black font-brand text-white">
      {/* Sticky in-page navigation */}
      <nav className="sticky top-14 z-40 border-b border-white/[0.14] bg-black/[0.82] backdrop-blur-xl">
        <div className={`${CONTAINER} flex h-12 items-center`}>
          <p className="font-bold text-[16px] text-white">
            {t("subnav.brand")}
          </p>
          <div className="ml-auto flex items-center gap-5 md:gap-[30px]">
            {subnavLinks.map(({ href, label, highlight }) => (
              <a
                key={href}
                href={href}
                className={`text-[15px] no-underline transition-colors ${
                  highlight
                    ? "text-solana-green hover:text-white"
                    : "text-[#ababba] hover:text-white"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[540px] overflow-hidden md:min-h-[620px] xl:h-[704px]">
        <Image
          src={heroImg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.72) 30.998%, rgba(0,0,0,0) 67.45%, rgba(0,0,0,0.36) 100%)",
          }}
        />
        <div className={`${CONTAINER} relative py-20 md:py-24 xl:py-28`}>
          <div className="max-w-[910px]">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
            <h1 className="mt-[30px] font-bold text-[48px] leading-[0.98] tracking-[-1.9px] md:text-[64px] md:tracking-[-2.5px] xl:text-[88px] xl:tracking-[-3.5px]">
              {t("hero.title")}
            </h1>
            <p className="mt-7 max-w-[730px] text-[19px] leading-[1.36] tracking-[-0.4px] text-[#c5c5cf] md:text-[24px] md:tracking-[-0.48px]">
              {t("hero.subtitle")}
            </p>
            <div className="mt-[42px] flex flex-wrap items-center gap-[22px]">
              <PillButton href="#apply" label={t("hero.cta")} variant="light" />
              <p className="font-brand-mono text-[14px] text-[#d4d4da]">
                {t("hero.note")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why this exists */}
      <section className="border-t border-white/[0.14] bg-[#08080a] xl:h-[520px]">
        <div className={`${CONTAINER} py-16 md:py-24 xl:pb-0 xl:pt-[73px]`}>
          <div className="relative xl:h-[447px]">
            <Eyebrow>{t("why.eyebrow")}</Eyebrow>
            <div className="mt-7 grid gap-10 xl:grid-cols-[807px_1fr] xl:gap-0">
              <h2 className="whitespace-pre-line font-bold text-[40px] leading-[1.03] tracking-[-1.4px] md:text-[52px] xl:text-[54px] xl:tracking-[-2.3px]">
                {t("why.title")}
              </h2>
              <p className="text-[19px] leading-[1.42] text-[#ababba] md:pt-[15px] md:text-[22px]">
                {t("why.description")}
              </p>
            </div>
            {/* Stat rail */}
            <div className="relative mt-16 xl:absolute xl:left-0 xl:right-0 xl:top-[317.5px] xl:mt-0 xl:h-[150.5px]">
              <div className="absolute inset-x-0 top-0 h-px bg-white/[0.14]" />
              <div className="absolute left-0 top-0 h-[2px] w-[132px] bg-gradient-to-r from-[rgba(153,69,255,0.9)] via-[rgba(79,125,255,0.85)] via-[55%] to-[rgba(20,242,148,0.9)]" />
              <div className="grid gap-8 pt-[18px] sm:grid-cols-3 sm:gap-7 xl:grid-rows-[94.5px]">
                {stats.map(({ value, label }, i) => (
                  <div
                    key={label}
                    className={
                      i > 0
                        ? "relative sm:before:absolute sm:before:-left-[14px] sm:before:top-[4px] sm:before:h-14 sm:before:w-px sm:before:bg-white/[0.2] sm:before:content-['']"
                        : ""
                    }
                  >
                    <p className="font-medium text-[32px] tracking-[-1.2px] text-white md:text-[40px]">
                      {value}
                    </p>
                    <p className="mt-[5px] text-[16px] text-[#848895]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A semester on campus */}
      <section
        id="program"
        className="scroll-mt-28 border-t border-white/[0.14]"
      >
        <div
          className={`${CONTAINER} pb-16 pt-16 md:py-24 xl:pb-[45px] xl:pt-[113px]`}
        >
          <Eyebrow>{t("formats.eyebrow")}</Eyebrow>
          <div className="mt-[26px] flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <h2 className="max-w-[539px] whitespace-pre-line font-bold text-[40px] leading-[1.03] tracking-[-1.4px] md:text-[52px] xl:text-[64px] xl:tracking-[-2.3px]">
              {t("formats.title")}
            </h2>
            <p className="max-w-[470px] text-[18px] leading-[1.4] text-[#ababba] md:text-[20px]">
              {t("formats.description")}
            </p>
          </div>
          <div className="mt-[54px] grid gap-5 lg:grid-cols-2">
            {formatCards.map(
              (
                {
                  img,
                  badge,
                  title,
                  description,
                  gradientTransform,
                  solidGradient,
                },
                index,
              ) => (
                <article
                  key={title}
                  className="flex flex-col overflow-hidden rounded-[14px] border border-white/[0.14] bg-[#111114] sm:h-[290px] sm:flex-row"
                >
                  <div className="relative h-[180px] w-full shrink-0 sm:h-auto sm:w-[220px]">
                    <Image
                      src={img}
                      alt={title}
                      fill
                      sizes="(min-width: 640px) 220px, 100vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[#9945ff] mix-blend-overlay"
                    />
                    <svg
                      aria-hidden
                      className="pointer-events-none absolute inset-0 size-full mix-blend-overlay"
                      focusable="false"
                      preserveAspectRatio="none"
                      viewBox="0 0 220 288"
                    >
                      <defs>
                        <radialGradient
                          id={`format-card-gradient-${index}`}
                          cx="0"
                          cy="0"
                          gradientTransform={gradientTransform}
                          gradientUnits="userSpaceOnUse"
                          r="10"
                        >
                          <stop offset="0" stopColor="#666" stopOpacity="0" />
                          {solidGradient ? (
                            <stop offset="1" stopColor="#000" />
                          ) : (
                            <>
                              <stop
                                offset="0.5"
                                stopColor="#333"
                                stopOpacity="0.5"
                              />
                              <stop
                                offset="0.75"
                                stopColor="#1a1a1a"
                                stopOpacity="0.75"
                              />
                              <stop
                                offset="0.875"
                                stopColor="#0d0d0d"
                                stopOpacity="0.875"
                              />
                              <stop
                                offset="0.9375"
                                stopColor="#060606"
                                stopOpacity="0.9375"
                              />
                              <stop offset="1" stopColor="#000" />
                            </>
                          )}
                        </radialGradient>
                      </defs>
                      <rect
                        fill={`url(#format-card-gradient-${index})`}
                        height="100%"
                        width="100%"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col items-start px-7 py-[26px]">
                    <span className="inline-flex h-[29px] items-center rounded-full border border-white/[0.14] px-[10px] font-brand-mono text-[11px] uppercase text-[#c9c9d1]">
                      {badge}
                    </span>
                    <h3 className="mt-[22px] font-medium text-[26px] tracking-[-0.8px] text-white md:text-[32px]">
                      {title}
                    </h3>
                    <p className="mt-3 text-[17px] leading-[1.42] text-[#ababba]">
                      {description}
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* What campus leads receive */}
      <section
        id="perks"
        className="scroll-mt-28 border-t border-white/[0.14] bg-[#08080a]"
      >
        <div className={`${CONTAINER} ${SECTION_PADDING}`}>
          <Eyebrow>{t("perks.eyebrow")}</Eyebrow>
          <div className="mt-[30px] grid gap-14 xl:grid-cols-[520px_1fr] xl:gap-[110px]">
            <div>
              <h2 className="font-bold text-[40px] leading-[1.03] tracking-[-1.4px] md:text-[52px] xl:text-[64px] xl:tracking-[-2.3px]">
                {t("perks.title")}
              </h2>
              <p className="mt-[26px] text-[18px] leading-[1.45] text-[#ababba] md:text-[20px]">
                {t("perks.description")}
              </p>
              <a
                href="#faq"
                className="mt-[34px] inline-flex items-center gap-2 text-[17px] text-solana-green no-underline transition-colors hover:text-white"
              >
                {t("perks.link")}
                <ArrowRight width={16} height={16} fill="currentColor" />
              </a>
            </div>
            <ul className="m-0 list-none border-t border-white/[0.14] p-0">
              {perks.map(({ Icon, title, detail }) => (
                <li
                  key={title}
                  className="flex min-h-[78px] flex-wrap items-center gap-y-1 border-b border-white/[0.14] py-4 sm:flex-nowrap sm:py-0"
                >
                  <span className="w-10 shrink-0 sm:w-16">
                    <Icon pack="filled" width={18} height={18} fill="#9a9aa3" />
                  </span>
                  <span className="flex-1 text-[18px] text-white md:text-[20px]">
                    {title}
                  </span>
                  <span className="w-full pl-10 text-[15px] text-[#ababba] sm:w-auto sm:pl-4 sm:text-right">
                    {detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The semester circuit */}
      <section className="border-t border-white/[0.14]">
        <div className={`${CONTAINER} ${SECTION_PADDING}`}>
          <div className="flex flex-col items-center text-center">
            <Eyebrow>{t("circuit.eyebrow")}</Eyebrow>
            <h2 className="mt-[25px] max-w-[830px] whitespace-pre-line font-medium text-[36px] leading-[1.03] tracking-[-1.3px] md:text-[48px] xl:text-[64px] xl:tracking-[-2.3px]">
              {t("circuit.title")}
            </h2>
          </div>
          <div className="relative mt-14 md:mt-[72px]">
            {/* Connecting line: horizontal on desktop, vertical on mobile */}
            <div className="absolute left-[11px] top-[26px] hidden h-[2px] w-[calc(75%+28px)] bg-gradient-to-r from-[#9945ff] to-[#14f195] md:block" />
            <div className="grid gap-12 md:grid-cols-4 md:gap-[38px]">
              {circuitSteps.map(
                ({
                  dotColor,
                  connectorGradient,
                  label,
                  title,
                  description,
                }) => (
                  <div
                    key={title}
                    className="relative pl-12 pt-0 md:pl-0 md:pt-[58px]"
                  >
                    {connectorGradient && (
                      <span
                        aria-hidden
                        className={`absolute left-[11px] top-[23px] -bottom-12 w-[2px] bg-gradient-to-b ${connectorGradient} md:hidden`}
                      />
                    )}
                    <span
                      className={`absolute left-0 top-0 z-10 size-[23px] rounded-full border-[5px] bg-black md:top-4 ${dotColor}`}
                    />
                    <p className="font-brand-mono text-[11px] text-[#8b8b94]">
                      {label}
                    </p>
                    <h3 className="mt-2 font-medium text-[25px] leading-[1.08] tracking-[-0.8px] text-white">
                      {title}
                    </h3>
                    <p className="mt-[10px] max-w-[312px] text-[15px] leading-[1.45] text-[#ababba]">
                      {description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility + Application */}
      <section className="border-t border-white/[0.14] bg-[#08080a]">
        <div
          className={`${CONTAINER} pb-20 pt-16 md:pt-24 xl:pb-[124px] xl:pt-28`}
        >
          <div className="grid gap-12 xl:grid-cols-2 xl:gap-[100px]">
            <div>
              <Eyebrow>{t("eligibility.eyebrow")}</Eyebrow>
              <h2 className="mt-[26px] font-medium text-[36px] leading-[1.03] tracking-[-1.3px] md:text-[48px] xl:text-[64px] xl:tracking-[-2.3px]">
                {t("eligibility.title")}
              </h2>
            </div>
            <ul className="m-0 list-none p-0 xl:pt-11">
              {eligibilityItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 border-b border-white/[0.14] pb-[17px] pt-4"
                >
                  <Check
                    width={15}
                    height={15}
                    fill="#14f195"
                    className="mt-1 shrink-0"
                  />
                  <span className="text-[17px] text-white md:text-[18px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            id="apply"
            className="mt-16 scroll-mt-32 rounded-2xl bg-white p-6 md:p-12 xl:mt-[78px]"
          >
            <div className="grid gap-10 xl:grid-cols-[360px_1fr] xl:gap-[72px]">
              <div className="flex flex-col gap-[10px]">
                <Eyebrow className="text-[#6b28b7]">
                  {t("application.eyebrow")}
                </Eyebrow>
                <h2 className="font-bold text-[32px] leading-[1.03] tracking-[-1.2px] text-black md:text-[40px] xl:text-[48px] xl:tracking-[-1.8px]">
                  {t("application.title")}
                </h2>
                <p className="mt-[10px] text-[17px] leading-[1.45] text-[#565662]">
                  {t("application.description")}
                </p>
                <p className="mt-6 font-brand-mono text-[12px] uppercase text-[#6d6d78]">
                  {t("application.meta")}
                </p>
              </div>
              <AmbassadorApplicationForm translations={formTranslations} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 border-t border-white/[0.14]">
        <div className={`${CONTAINER} ${SECTION_PADDING}`}>
          <div className="grid gap-12 xl:grid-cols-[420px_1fr] xl:gap-[120px]">
            <div>
              <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
              <h2 className="mt-7 font-medium text-[36px] leading-[1.03] tracking-[-1.3px] md:text-[48px] xl:text-[64px] xl:tracking-[-2.3px]">
                {t("faq.title")}
              </h2>
            </div>
            <AmbassadorFaq items={faqItems} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-solana-purple xl:h-[515px]">
        <div className={`${CONTAINER} pb-24 pt-16 md:pb-[160px] md:pt-24`}>
          <Eyebrow className="text-[#17002c]">{t("cta.eyebrow")}</Eyebrow>
          <h2 className="mt-[22px] max-w-[912px] whitespace-pre-line font-medium text-[40px] leading-[1.03] tracking-[-1.4px] text-black md:text-[56px] xl:text-[72px] xl:tracking-[-2.3px]">
            {t("cta.title")}
          </h2>
          <div className="mt-[34px]">
            <PillButton href="#apply" label={t("cta.button")} variant="dark" />
          </div>
        </div>
      </section>
    </div>
  );
}
