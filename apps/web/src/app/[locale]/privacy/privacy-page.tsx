"use client";

import { Divider } from "@/components/solutions/divider.v2";
import { SelectionColor } from "@/component-library/selection-color";
import { ECOSYSTEM_PROJECTS } from "@/data/solutions/privacy";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useTranslations } from "next-intl";
import { cn } from "@/app/components/utils";
import { Eye, EyeOff, Lock, UserX, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { CipherGrid, PrivacyDecor } from "./privacy-animations";

const PRIVACY_TYPE_COLORS: Record<string, string> = {
  pseudonymous: "bg-[#ABABBA]/20 text-[#ABABBA]",
  confidential: "bg-[#14F195]/15 text-[#14F195]",
  anonymous: "bg-[#9945FF]/20 text-[#9945FF]",
  fullyPrivate: "bg-[#F037A5]/15 text-[#F037A5]",
};

const PRIVACY_TYPE_LABELS: Record<string, string> = {
  pseudonymous: "Pseudonymous",
  confidential: "Confidential",
  anonymous: "Anonymous",
  fullyPrivate: "Fully Private",
};

const PRIVACY_TYPE_DOT_COLORS: Record<string, string> = {
  pseudonymous: "#ABABBA",
  confidential: "#14F195",
  anonymous: "#9945FF",
  fullyPrivate: "#F037A5",
};

const PROJECT_PRIVACY_TYPES: Record<string, string> = {
  contra: "fullyPrivate",
  encrypt: "fullyPrivate",
  privacyCash: "anonymous",
  silentSwap: "anonymous",
  encifher: "confidential",
  magicBlock: "fullyPrivate",
  lightProtocol: "anonymous",
  arcium: "fullyPrivate",
  inco: "fullyPrivate",
  zama: "fullyPrivate",
};

interface UseCaseItem {
  title: string;
  description: string;
  privacyType: string;
}

interface QuadrantData {
  title: string;
  description: string;
  items?: string[];
}

interface PrivacyPageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    heroSupportingText: string;
    spectrumTitle: string;
    spectrumDescription: string;
    pseudonymity: QuadrantData;
    anonymity: QuadrantData;
    confidentiality: QuadrantData;
    fullyPrivate: QuadrantData;
    principlesTitle: string;
    principle1Title: string;
    principle1Description: string;
    principle2Title: string;
    principle2Description: string;
    principle3Title: string;
    principle3Description: string;
    ecosystemTitle: string;
    useCasesTitle: string;
    useCasesDescription: string;
    useCasesList: UseCaseItem[];
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
    ctaButtonHref: string;
  };
}

function PrivacyBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide",
        PRIVACY_TYPE_COLORS[type],
      )}
    >
      {PRIVACY_TYPE_LABELS[type]}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   Hero — full-screen with cipher animation, no stats
   ────────────────────────────────────────────────────────── */

function PrivacyHero({
  translations,
}: {
  translations: PrivacyPageProps["translations"];
}) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-black text-white text-left"
    >
      {/* Animated cipher background */}
      <div className="absolute inset-0 z-0">
        <CipherGrid />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#9945FF]/20 blur-[120px] animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#14F195]/15 blur-[100px] animate-[drift_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full bg-[#F037A5]/12 blur-[80px] animate-[drift_18s_ease-in-out_infinite_2s]" />
        {/* Top/bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      <div className="min-h-[844px] md:min-h-[1080px] xl:min-h-[1200px] max-w-[1440px] mx-auto flex flex-col justify-center relative z-1">
        <div className="px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px] max-w-5xl">
          <h1 className="m-0 font-brand font-medium leading-[1.1] md:leading-none text-[40px] md:text-[56px] xl:text-[88px] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px]">
            {translations.heroTitle}
          </h1>
          <p className="text-[#ABABBA] text-lg md:text-2xl mt-[12px] xl:mt-[24px] mb-0 max-w-xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
            {translations.heroSubtitle}
          </p>
          <div className="mt-[32px] xl:mt-[64px]">
            <Button
              className="rounded-full text-base md:text-lg px-5 bg-white text-black hover:!bg-white/90 tracking-[-0.16px] md:tracking-[-0.18px]"
              size="lg"
              asChild
            >
              <a href="#spectrum">{translations.heroSupportingText}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   Privacy Matrix — enriched 2x2 grid
   ────────────────────────────────────────────────────────── */

function MatrixCell({
  quadrant,
  color,
  Icon,
  isIntersecting,
  delay,
  mobile,
}: {
  quadrant: QuadrantData;
  color: string;
  Icon: typeof Eye;
  isIntersecting: boolean;
  delay: number;
  mobile?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl hover:border-white/20 transition-colors",
        mobile
          ? "p-5 border border-white/10"
          : "p-6 xl:p-8 border border-white/10",
        { "animate-fade-in-up": isIntersecting },
      )}
      style={isIntersecting ? { animationDelay: `${delay}s` } : { opacity: 0 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon size={mobile ? 18 : 20} style={{ color }} />
        <h4
          className={cn(
            "font-medium m-0",
            mobile ? "text-base" : "text-lg xl:text-xl",
          )}
          style={{ color }}
        >
          {quadrant.title}
        </h4>
      </div>
      <p
        className={cn(
          "text-[#ABABBA] leading-relaxed m-0",
          mobile ? "text-sm" : "text-sm xl:text-base",
        )}
      >
        {quadrant.description}
      </p>
      {quadrant.items && quadrant.items.length > 0 && (
        <ul className="mt-3 space-y-1.5 list-none p-0 m-0">
          {quadrant.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start text-[#ABABBA] text-xs xl:text-sm"
            >
              <span style={{ color }} className="mr-2 shrink-0">
                &rarr;
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PrivacyMatrix({
  translations,
}: {
  translations: PrivacyPageProps["translations"];
}) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  const quadrants = [
    { data: translations.pseudonymity, color: "#ABABBA", Icon: Eye },
    { data: translations.anonymity, color: "#9945FF", Icon: UserX },
    { data: translations.confidentiality, color: "#14F195", Icon: EyeOff },
    { data: translations.fullyPrivate, color: "#F037A5", Icon: Lock },
  ];

  return (
    <div ref={ref} className="mt-[48px] xl:mt-[72px]">
      {/* Desktop matrix */}
      <div className="hidden md:grid grid-cols-[140px_1fr_1fr] gap-4 mb-4">
        <div />
        <div className="text-center text-sm font-medium text-[#ABABBA] uppercase tracking-widest">
          Identity Visible
        </div>
        <div className="text-center text-sm font-medium text-[#ABABBA] uppercase tracking-widest">
          Identity Hidden
        </div>
      </div>

      <div className="hidden md:grid grid-cols-[140px_1fr_1fr] gap-4 mb-4">
        <div className="flex items-center">
          <span className="text-sm font-medium text-[#ABABBA] uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
            Data Visible
          </span>
        </div>
        {quadrants.slice(0, 2).map((q, index) => (
          <MatrixCell
            key={q.data.title}
            quadrant={q.data}
            color={q.color}
            Icon={q.Icon}
            isIntersecting={isIntersecting}
            delay={0.1 + index * 0.1}
          />
        ))}
      </div>

      <div className="hidden md:grid grid-cols-[140px_1fr_1fr] gap-4">
        <div className="flex items-center">
          <span className="text-sm font-medium text-[#ABABBA] uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
            Data Hidden
          </span>
        </div>
        {quadrants.slice(2, 4).map((q, index) => (
          <MatrixCell
            key={q.data.title}
            quadrant={q.data}
            color={q.color}
            Icon={q.Icon}
            isIntersecting={isIntersecting}
            delay={0.3 + index * 0.1}
          />
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {quadrants.map((q, index) => (
          <MatrixCell
            key={q.data.title}
            quadrant={q.data}
            color={q.color}
            Icon={q.Icon}
            isIntersecting={isIntersecting}
            delay={0.1 + index * 0.1}
            mobile
          />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Design Principles — large numbered vertical layout
   ────────────────────────────────────────────────────────── */

function DesignPrinciples({
  translations,
}: {
  translations: PrivacyPageProps["translations"];
}) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  const principles = [
    {
      title: translations.principle1Title,
      description: translations.principle1Description,
    },
    {
      title: translations.principle2Title,
      description: translations.principle2Description,
    },
    {
      title: translations.principle3Title,
      description: translations.principle3Description,
    },
  ];

  return (
    <section className="relative text-white text-left overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
        <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] mb-[48px] xl:mb-[80px] tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
          {translations.principlesTitle}
        </h2>

        <div ref={ref} className="relative">
          {/* Vertical connecting line — desktop only */}
          <div className="hidden xl:block absolute left-[60px] top-0 bottom-0 w-px bg-gradient-to-b from-[#9945FF]/40 via-[#14F195]/40 to-[#F037A5]/40" />

          <div className="space-y-12 xl:space-y-20">
            {principles.map((p, index) => (
              <div
                key={p.title}
                className={cn(
                  "relative flex flex-col xl:flex-row xl:items-start gap-6 xl:gap-16",
                  { "animate-fade-in-up": isIntersecting },
                )}
                style={
                  isIntersecting
                    ? { animationDelay: `${0.15 + index * 0.2}s` }
                    : { opacity: 0 }
                }
              >
                {/* Large number */}
                <div className="shrink-0 relative">
                  <span className="font-brand text-[80px] xl:text-[120px] font-medium leading-none text-white/[0.04] select-none">
                    0{index + 1}
                  </span>
                  {/* Dot on the timeline */}
                  <div className="hidden xl:block absolute top-[50px] left-[56px] w-[9px] h-[9px] rounded-full bg-white ring-4 ring-black z-10" />
                </div>

                {/* Content */}
                <div className="xl:pt-6 max-w-2xl">
                  <h3 className="text-2xl md:text-3xl xl:text-4xl font-medium mb-4 m-0 tracking-[-0.48px] md:tracking-[-0.6px]">
                    {p.title}
                  </h3>
                  <p className="text-[#ABABBA] text-base md:text-lg xl:text-xl leading-relaxed m-0">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   Ecosystem Grid
   ────────────────────────────────────────────────────────── */

function EcosystemGrid({ title }: { title: string }) {
  const t = useTranslations();
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="relative text-white text-left">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
        <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] mb-[32px] xl:mb-[48px] tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
          {title}
        </h2>
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {ECOSYSTEM_PROJECTS.map(({ key, href }, index) => {
            const privacyType = PROJECT_PRIVACY_TYPES[key];
            const projectTitle = t(`privacy.ecosystem.${key}.title`);
            const projectDescription = t(
              `privacy.ecosystem.${key}.description`,
            );

            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group border border-white/10 rounded-xl p-5 hover:border-white/25 transition-colors text-inherit block",
                  { "animate-fade-in-up": isIntersecting },
                )}
                style={
                  isIntersecting
                    ? { animationDelay: `${0.05 + index * 0.05}s` }
                    : { opacity: 0 }
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base md:text-lg font-medium m-0 group-hover:text-[#9945FF] transition-colors">
                    {projectTitle}
                  </h3>
                  <PrivacyBadge type={privacyType} />
                </div>
                <p className="text-[#ABABBA] text-sm leading-relaxed m-0">
                  {projectDescription}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   Use Cases — with privacy type dots
   ────────────────────────────────────────────────────────── */

function UseCaseCards({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: UseCaseItem[];
}) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.15,
    triggerOnce: true,
  });

  return (
    <section className="relative text-white text-left">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
        <div className="xl:w-2/5 mb-[32px] xl:mb-[48px]">
          <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] mb-0 tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
            {title}
          </h2>
          <p className="text-[#ABABBA] text-lg md:text-2xl mt-4 xl:mt-5 mb-0 tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
            {description}
          </p>
        </div>
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {items.map((item, index) => {
            const dotColor =
              PRIVACY_TYPE_DOT_COLORS[item.privacyType] || "#ABABBA";
            const label =
              PRIVACY_TYPE_LABELS[item.privacyType] || "Pseudonymous";

            return (
              <div
                key={index}
                className={cn(
                  "border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors",
                  { "animate-fade-in-up": isIntersecting },
                )}
                style={
                  isIntersecting
                    ? { animationDelay: `${0.1 + index * 0.08}s` }
                    : { opacity: 0 }
                }
              >
                {/* Privacy type indicator */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: dotColor }}
                  >
                    {label}
                  </span>
                </div>
                <h3 className="text-white text-base md:text-lg font-medium m-0 mb-2">
                  {item.title}
                </h3>
                <p className="text-[#ABABBA] text-sm leading-relaxed m-0">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   CTA — privacy-specific with animated border
   ────────────────────────────────────────────────────────── */

function CtaSection({
  translations,
}: {
  translations: PrivacyPageProps["translations"];
}) {
  return (
    <section className="relative text-white text-left">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Animated gradient border */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#F037A5] p-px animate-[gradient-shift_6s_ease_infinite]"
            style={{ backgroundSize: "200% 200%" }}
          >
            <div className="w-full h-full rounded-2xl bg-black" />
          </div>

          <div className="relative p-8 md:p-12 xl:p-16">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/5 via-transparent to-[#14F195]/5 rounded-2xl" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <Lock size={20} className="text-[#14F195]" />
                <span className="text-[#14F195] text-sm font-medium uppercase tracking-widest">
                  Live on Mainnet
                </span>
              </div>
              <h2 className="font-brand font-medium text-[32px] md:text-[40px] xl:text-[56px] leading-[1.1] mb-4 tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.24px]">
                {translations.ctaTitle}
              </h2>
              <p className="text-[#ABABBA] text-lg md:text-xl max-w-2xl mb-8">
                {translations.ctaDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={
                    translations.ctaButtonHref ||
                    "/developers/guides/token-extensions/confidential-transfer"
                  }
                >
                  <Button
                    className="rounded-full text-base md:text-lg px-6 bg-[#14F195] text-black hover:!bg-[#14F195]/90 tracking-[-0.16px] md:tracking-[-0.18px]"
                    size="lg"
                  >
                    {translations.ctaButton}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/developers">
                  <Button
                    className="rounded-full text-base md:text-lg px-6 bg-transparent text-white border border-white/20 hover:!bg-white/5 tracking-[-0.16px] md:tracking-[-0.18px]"
                    size="lg"
                  >
                    Explore All Docs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   Main Page
   ────────────────────────────────────────────────────────── */

export function PrivacyPage({ translations }: PrivacyPageProps) {
  return (
    <>
      <SelectionColor selectionColor="#9945FF" selectionTextColor="#FFFFFF" />

      <div className="overflow-hidden bg-black">
        {/* 1. Hero with cipher animation */}
        <PrivacyHero translations={translations} />

        <Divider />

        {/* 2. Privacy Spectrum */}
        <div
          id="spectrum"
          className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]"
        >
          <section className="relative text-white text-left">
            <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px]">
              <div className="xl:w-3/5">
                <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] mb-0 tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
                  {translations.spectrumTitle}
                </h2>
                <p className="text-[#ABABBA] text-lg md:text-2xl mt-4 xl:mt-5 mb-0 tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
                  {translations.spectrumDescription}
                </p>
              </div>
              <PrivacyMatrix translations={translations} />
            </div>
          </section>
        </div>

        <Divider />

        {/* 3. Design Principles — vertical timeline */}
        <div className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]">
          <DesignPrinciples translations={translations} />
        </div>

        <Divider />

        {/* 4. Ecosystem */}
        <div className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]">
          <EcosystemGrid title={translations.ecosystemTitle} />
        </div>

        {/* Privacy-themed decorative divider */}
        <PrivacyDecor />

        {/* 5. What Privacy Unlocks */}
        <div className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]">
          <UseCaseCards
            title={translations.useCasesTitle}
            description={translations.useCasesDescription}
            items={translations.useCasesList}
          />
        </div>

        <Divider />

        {/* 6. CTA */}
        <div className="[&_section]:!py-[32px] md:[&_section]:!py-[56px] xl:[&_section]:!py-[80px]">
          <CtaSection translations={translations} />
        </div>
      </div>
    </>
  );
}
