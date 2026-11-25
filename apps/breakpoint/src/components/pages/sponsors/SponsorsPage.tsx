"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import SponsorArtwork from "@/components/SponsorArtwork";
import {
  getSponsorSocialLinks,
  getSponsorTags,
  type SponsorSocialLink,
} from "@/components/SponsorProfile";
import GlitchOverlay, {
  getGlitchIntensityStyle,
  type GlitchCssProperties,
} from "@/components/GlitchOverlay";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import WordReveal from "@/components/WordReveal";
import {
  sponsorTiers,
  type SponsorLogo,
  type SponsorTier,
} from "@/content/sponsors";
import { resolveSponsorLogo } from "@/lib/sponsors";

const SPONSOR_MODAL_GLITCH_MS = 650;
const SPONSOR_MODAL_GLITCH_INTENSITY = 0.76;

function getLogo(sponsor: SponsorLogo) {
  return resolveSponsorLogo(sponsor);
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
    >
      <path
        d="M1 1L7 7M7 1L1 7"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SponsorModalBody({
  decorative = false,
  description,
  descriptionId,
  logo,
  modalLogoStyle,
  name,
  socialLinks,
  tags,
  titleId,
}: {
  decorative?: boolean;
  description?: string;
  descriptionId?: string;
  logo: ReturnType<typeof getLogo>;
  modalLogoStyle: CSSProperties;
  name: string;
  socialLinks: SponsorSocialLink[];
  tags: string[];
  titleId?: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row md:items-start md:gap-l md:p-l">
      <div className="flex h-[246px] w-full shrink-0 items-center justify-center overflow-hidden bg-white/[0.05] p-[6px] md:size-[440px] md:p-[10px]">
        <span
          className="block w-[min(var(--modal-logo-width-mobile),62%)] max-w-[72%] md:w-[min(var(--modal-logo-width),68%)]"
          style={{
            ...modalLogoStyle,
            aspectRatio: "var(--modal-logo-ratio)",
          }}
        >
          <SponsorArtwork sponsor={logo} />
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-xs pb-xs pt-s md:mt-[42px] md:h-[356px] md:w-[430px] md:flex-none md:px-0 md:pb-0 md:pt-0">
        <div className="flex flex-col items-start gap-2xs">
          <h2
            id={decorative ? undefined : titleId}
            className="type-h5 text-white"
          >
            {name}
          </h2>

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-s">
              {socialLinks.map((link) =>
                decorative ? (
                  <span
                    key={link.label}
                    className="inline-flex size-5 items-center justify-center text-white"
                  >
                    {link.icon}
                  </span>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${name} ${link.label}`}
                    className="inline-flex size-5 items-center justify-center text-white transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {link.icon}
                  </a>
                ),
              )}
            </div>
          )}
        </div>

        {description && (
          <p
            id={decorative ? undefined : descriptionId}
            className="type-paragraph mt-s min-h-0 flex-1 overflow-y-auto text-white md:mt-m md:h-[182px] md:flex-none"
          >
            {description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-s flex flex-wrap items-start gap-3xs md:mt-m">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-stroke-primary px-3xs py-3xs font-mono text-button font-bold uppercase text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SponsorCard({
  sponsor,
  cellAspect,
  mobileLogoMaxWidth,
  mobileLogoMaxHeight,
  logoMaxWidth,
  logoMaxHeight,
  cellAspectRatio,
  onClick,
}: {
  sponsor: SponsorLogo;
  cellAspect: string;
  mobileLogoMaxWidth: number;
  mobileLogoMaxHeight: number;
  logoMaxWidth: number;
  logoMaxHeight: number;
  cellAspectRatio: number;
  onClick: () => void;
}) {
  const t = useTranslations("breakpoint.pages.sponsors");
  const logo = getLogo(sponsor);
  const logoAspectRatio = sponsor.width / sponsor.height;
  const getFittedLogoWidth = (maxWidth: number, maxHeight: number) =>
    `${Math.min(maxWidth, (maxHeight * logoAspectRatio) / cellAspectRatio) * 100}%`;
  const logoStyle = {
    "--logo-width": getFittedLogoWidth(logoMaxWidth, logoMaxHeight),
    "--logo-width-mobile": getFittedLogoWidth(
      mobileLogoMaxWidth,
      mobileLogoMaxHeight,
    ),
    "--logo-ratio": `${sponsor.width} / ${sponsor.height}`,
  } as CSSProperties;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("viewDetails", { name: logo.alt })}
      className={`group flex ${cellAspect} min-w-0 cursor-pointer items-center justify-center overflow-hidden border-0 bg-white/[0.05] p-[10px] transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
    >
      <span
        className="block w-[var(--logo-width-mobile)] transition-transform duration-200 group-hover:scale-[1.025] md:w-[var(--logo-width)]"
        style={{
          ...logoStyle,
          aspectRatio: "var(--logo-ratio)",
        }}
      >
        <SponsorArtwork sponsor={logo} />
      </span>
    </button>
  );
}

function SponsorTierSection({
  tier,
  first = false,
  onSponsorClick,
  title,
}: {
  tier: SponsorTier;
  first?: boolean;
  onSponsorClick: (_sponsor: SponsorLogo) => void;
  title: string;
}) {
  return (
    <section
      aria-labelledby={`${tier.id}-sponsors`}
      className={first ? "pt-xl md:pt-2xl" : "pt-xl md:pt-3xl"}
    >
      <div className="container">
        <h2 id={`${tier.id}-sponsors`} className="type-h3 text-white">
          {title}
        </h2>

        <div
          className={`mt-s grid ${tier.mobileColumns} gap-[8px] md:mt-m ${tier.columns}`}
        >
          {tier.sponsors.map((sponsor) => (
            <SponsorCard
              key={sponsor.companyId}
              sponsor={sponsor}
              cellAspect={tier.cellAspect}
              mobileLogoMaxWidth={tier.mobileLogoMaxWidth}
              mobileLogoMaxHeight={tier.mobileLogoMaxHeight}
              logoMaxWidth={tier.logoMaxWidth}
              logoMaxHeight={tier.logoMaxHeight}
              cellAspectRatio={tier.cellAspectRatio}
              onClick={() => onSponsorClick(sponsor)}
            />
          ))}
          {Array.from({ length: tier.emptyCells ?? 0 }).map((_, index) => (
            <div
              key={`empty-${index}`}
              aria-hidden="true"
              className={`${tier.cellAspect} hidden min-w-0 md:block`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SponsorModal({
  onClose,
  sponsor,
  t,
}: {
  onClose: () => void;
  sponsor: SponsorLogo | null;
  t: ReturnType<typeof useTranslations>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [showOpenGlitch, setShowOpenGlitch] = useState(false);

  useEffect(() => {
    if (!sponsor) return;

    const previousActiveElement = document.activeElement;
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    closeButtonRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0]!;
      const lastElement = focusableElements[focusableElements.length - 1]!;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [onClose, sponsor]);

  useEffect(() => {
    if (!sponsor) {
      setShowOpenGlitch(false);
      return;
    }

    setShowOpenGlitch(true);

    const glitchTimer = window.setTimeout(() => {
      setShowOpenGlitch(false);
    }, SPONSOR_MODAL_GLITCH_MS);

    return () => {
      window.clearTimeout(glitchTimer);
    };
  }, [sponsor]);

  if (!sponsor) return null;

  const logo = getLogo(sponsor);
  const company = logo.company;
  const description =
    company.profile?.summary ??
    company.profile?.description ??
    company.profile?.tagline;
  const socialLinks = getSponsorSocialLinks(company, t);
  const tags = getSponsorTags(company);
  const modalLogoStyle = {
    "--modal-logo-width": `${sponsor.width * 1.3}px`,
    "--modal-logo-width-mobile": `${sponsor.width * 0.64}px`,
    "--modal-logo-ratio": `${sponsor.width} / ${sponsor.height}`,
  } as CSSProperties;
  const modalGlitchStyle: GlitchCssProperties = {
    "--bp-glitch-duration": `${SPONSOR_MODAL_GLITCH_MS}ms`,
    ...getGlitchIntensityStyle(SPONSOR_MODAL_GLITCH_INTENSITY),
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-s py-l text-white backdrop-blur-[2px] md:px-l"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={`relative flex h-[calc(100dvh-48px)] max-h-[635px] w-full max-w-[328px] flex-col overflow-hidden border border-stroke-primary bg-black md:h-[536px] md:max-h-[calc(100dvh-48px)] md:max-w-[1014px] ${
          showOpenGlitch ? "bp-glitch-jitter" : ""
        }`}
        style={modalGlitchStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={t("closeDetails")}
          className="absolute right-[11px] top-[11px] z-10 inline-flex size-8 items-center justify-center bg-white text-black transition-colors hover:bg-purple focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white md:right-[15px] md:top-[15px]"
        >
          <CloseIcon />
        </button>

        <SponsorModalBody
          description={description}
          descriptionId={descriptionId}
          logo={logo}
          modalLogoStyle={modalLogoStyle}
          name={logo.name}
          socialLinks={socialLinks}
          tags={tags}
          titleId={titleId}
        />

        <GlitchOverlay
          active={showOpenGlitch}
          durationMs={SPONSOR_MODAL_GLITCH_MS}
          intensity={SPONSOR_MODAL_GLITCH_INTENSITY}
          size="lg"
        >
          <div className="relative flex h-full w-full flex-col overflow-hidden bg-black">
            <span className="absolute right-[11px] top-[11px] z-10 inline-flex size-8 items-center justify-center bg-purple text-black md:right-[15px] md:top-[15px]">
              <CloseIcon />
            </span>
            <SponsorModalBody
              decorative
              description={description}
              logo={logo}
              modalLogoStyle={modalLogoStyle}
              name={logo.name}
              socialLinks={socialLinks}
              tags={tags}
            />
          </div>
        </GlitchOverlay>
      </div>
    </div>
  );
}

function SponsorsIntro({ t }: { t: ReturnType<typeof useTranslations> }) {
  const introText = t.raw("intro") as string;

  return (
    <section className="bg-black pt-l md:pt-xl">
      <div className="container flex md:justify-end">
        <div className="w-full max-w-[851px]">
          <WordReveal
            as="p"
            className="type-h5 text-white"
            html
            stepMs={60}
            startDelayMs={250}
            text={introText}
          />
        </div>
      </div>
    </section>
  );
}

export default function SponsorsPage() {
  const t = useTranslations("breakpoint.pages.sponsors");
  const [activeSponsor, setActiveSponsor] = useState<SponsorLogo | null>(null);

  return (
    <PageShell contentId="breakpoint-sponsors-content">
      <SubpageHero title={t("title")} heroImage="sponsors" />
      <SponsorsIntro t={t} />
      <div className="pb-xl md:pb-2xl">
        {sponsorTiers.map((tier, index) => (
          <SponsorTierSection
            key={tier.title}
            tier={tier}
            first={index === 0}
            onSponsorClick={setActiveSponsor}
            title={t(`tiers.${tier.id}`)}
          />
        ))}
      </div>
      <Footer />
      <SponsorModal
        sponsor={activeSponsor}
        onClose={() => setActiveSponsor(null)}
        t={t}
      />
    </PageShell>
  );
}
