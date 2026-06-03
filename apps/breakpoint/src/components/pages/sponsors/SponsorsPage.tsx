"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { type CompanyRecord } from "@workspace/ecosystem-data";
import Button from "@/components/Button";
import GlitchOverlay, {
  getGlitchIntensityStyle,
  type GlitchCssProperties,
} from "@/components/GlitchOverlay";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import WordReveal from "@/components/WordReveal";
import { publicAssetPath } from "@/config";
import { SPONSOR_FORM_HREF } from "@/content/links";
import {
  sponsorTiers,
  type SponsorLogo,
  type SponsorTier,
} from "@/content/sponsors";
import { resolveSponsorLogo } from "@/lib/sponsors";

const SPONSOR_MODAL_GLITCH_MS = 650;
const SPONSOR_MODAL_GLITCH_INTENSITY = 0.76;

function getLogo(sponsor: SponsorLogo) {
  const resolved = resolveSponsorLogo(sponsor);

  return {
    company: resolved.company,
    alt: resolved.alt,
    src: resolved.src,
  };
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

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3C14.4 5.45 15.6 8.45 15.6 12C15.6 15.55 14.4 18.55 12 21C9.6 18.55 8.4 15.55 8.4 12C8.4 8.45 9.6 5.45 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path d="M13.93 10.62L21.47 2H19.68L13.14 9.49L7.91 2H1.88L9.79 13.34L1.88 22.39H3.67L10.58 14.47L16.1 22.39H22.13L13.93 10.62ZM11.48 13.42L10.68 12.3L4.3 3.33H7.05L12.19 10.56L12.99 11.69L19.68 21.12H16.93L11.48 13.42Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path d="M22.2 0H1.8C1.32261 0 0.864773 0.189642 0.527208 0.527208C0.189642 0.864773 0 1.32261 0 1.8V22.2C0 22.6774 0.189642 23.1352 0.527208 23.4728C0.864773 23.8104 1.32261 24 1.8 24H22.2C22.6774 24 23.1352 23.8104 23.4728 23.4728C23.8104 23.1352 24 22.6774 24 22.2V1.8C24 1.32261 23.8104 0.864773 23.4728 0.527208C23.1352 0.189642 22.6774 0 22.2 0ZM7.2 20.4H3.6V9.6H7.2V20.4ZM5.4 7.5C4.98742 7.48821 4.58746 7.35509 4.2501 7.11729C3.91274 6.87949 3.65294 6.54754 3.50315 6.16293C3.35337 5.77832 3.32025 5.35809 3.40793 4.95476C3.49561 4.55144 3.7002 4.18289 3.99614 3.89517C4.29207 3.60745 4.66624 3.41332 5.07188 3.33704C5.47752 3.26075 5.89664 3.30569 6.27688 3.46625C6.65712 3.62681 6.98162 3.89586 7.20983 4.23978C7.43804 4.5837 7.55983 4.98725 7.56 5.4C7.55052 5.96442 7.318 6.50214 6.91326 6.89564C6.50852 7.28914 5.96446 7.50642 5.4 7.5ZM20.4 20.4H16.8V14.712C16.8 13.008 16.08 12.396 15.144 12.396C14.8696 12.4143 14.6015 12.4866 14.3551 12.6088C14.1087 12.731 13.8888 12.9006 13.7082 13.108C13.5275 13.3154 13.3897 13.5565 13.3025 13.8173C13.2152 14.0782 13.1804 14.3537 13.2 14.628C13.194 14.6838 13.194 14.7402 13.2 14.796V20.4H9.6V9.6H13.08V11.16C13.431 10.626 13.9133 10.1911 14.4806 9.89692C15.0479 9.60276 15.6813 9.4592 16.32 9.48C18.18 9.48 20.352 10.512 20.352 13.872L20.4 20.4Z" />
    </svg>
  );
}

function AssetIcon({ src }: { src: string }) {
  return (
    <img
      src={publicAssetPath(src)}
      alt=""
      aria-hidden="true"
      className="block max-h-5 max-w-5 brightness-0 invert"
    />
  );
}

type SponsorSocialLink = {
  href: string;
  icon: ReactNode;
  label: string;
};

function getSponsorSocialLinks(company: CompanyRecord): SponsorSocialLink[] {
  const profile = company.profile;
  const socials = profile?.socials;
  const links: SponsorSocialLink[] = [];

  if (profile?.links?.website) {
    links.push({
      href: profile.links.website,
      icon: <GlobeIcon />,
      label: "Website",
    });
  }

  if (socials?.x) {
    links.push({
      href: socials.x,
      icon: <XIcon />,
      label: "X",
    });
  }

  if (socials?.linkedin) {
    links.push({
      href: socials.linkedin,
      icon: <LinkedInIcon />,
      label: "LinkedIn",
    });
  }

  if (socials?.github) {
    links.push({
      href: socials.github,
      icon: <AssetIcon src="/assets/icon-github.svg" />,
      label: "GitHub",
    });
  }

  if (socials?.discord) {
    links.push({
      href: socials.discord,
      icon: <AssetIcon src="/assets/icon-discord.svg" />,
      label: "Discord",
    });
  }

  if (socials?.telegram) {
    links.push({
      href: socials.telegram,
      icon: <AssetIcon src="/assets/icon-telegram.svg" />,
      label: "Telegram",
    });
  }

  if (socials?.youtube) {
    links.push({
      href: socials.youtube,
      icon: <AssetIcon src="/assets/icon-youtube.svg" />,
      label: "YouTube",
    });
  }

  return links;
}

function getSponsorTags(company: CompanyRecord) {
  const tags: string[] = [];

  if (company.profile?.sector) {
    tags.push(company.profile.sector);
  }

  if (company.profile?.type) {
    tags.push(company.profile.type);
  }

  return Array.from(new Set(tags));
}

function SponsorModalBody({
  company,
  decorative = false,
  description,
  descriptionId,
  logo,
  modalLogoStyle,
  socialLinks,
  tags,
  titleId,
}: {
  company: CompanyRecord;
  decorative?: boolean;
  description?: string;
  descriptionId?: string;
  logo: ReturnType<typeof getLogo>;
  modalLogoStyle: CSSProperties;
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
          <img
            src={publicAssetPath(logo.src)}
            alt=""
            aria-hidden="true"
            className="block h-full w-full object-contain brightness-0 invert"
          />
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-xs pb-xs pt-s md:mt-[42px] md:h-[356px] md:w-[430px] md:flex-none md:px-0 md:pb-0 md:pt-0">
        <div className="flex flex-col items-start gap-2xs">
          <h2
            id={decorative ? undefined : titleId}
            className="type-h5 text-white"
          >
            {company.name}
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
                    aria-label={`${company.name} ${link.label}`}
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
  mobileLogoScale,
  onClick,
}: {
  sponsor: SponsorLogo;
  cellAspect: string;
  mobileLogoScale: number;
  onClick: () => void;
}) {
  const logo = getLogo(sponsor);
  const logoStyle = {
    "--logo-width": `${sponsor.width}px`,
    "--logo-width-mobile": `${sponsor.width * mobileLogoScale}px`,
    "--logo-ratio": `${sponsor.width} / ${sponsor.height}`,
  } as CSSProperties;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${logo.alt} sponsor details`}
      className={`group flex ${cellAspect} min-w-0 cursor-pointer items-center justify-center overflow-hidden border-0 bg-white/[0.05] p-[10px] transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
    >
      <span
        className="block w-[min(var(--logo-width-mobile),78%)] max-w-[78%] transition-transform duration-200 group-hover:scale-[1.025] md:w-[min(var(--logo-width),78%)]"
        style={{
          ...logoStyle,
          aspectRatio: "var(--logo-ratio)",
        }}
      >
        <img
          src={publicAssetPath(logo.src)}
          alt=""
          aria-hidden="true"
          className="block h-full w-full object-contain brightness-0 invert"
        />
      </span>
    </button>
  );
}

function SponsorTierSection({
  tier,
  first = false,
  onSponsorClick,
}: {
  tier: SponsorTier;
  first?: boolean;
  onSponsorClick: (_sponsor: SponsorLogo) => void;
}) {
  return (
    <section
      aria-labelledby={`${tier.title.toLowerCase()}-sponsors`}
      className={first ? "pt-xl md:pt-2xl" : "pt-xl md:pt-3xl"}
    >
      <div className="container">
        <h2
          id={`${tier.title.toLowerCase()}-sponsors`}
          className="type-h3 text-white"
        >
          {tier.title}
        </h2>

        <div
          className={`mt-s grid ${tier.mobileColumns} gap-[8px] md:mt-m ${tier.columns}`}
        >
          {tier.sponsors.map((sponsor) => (
            <SponsorCard
              key={sponsor.companyId}
              sponsor={sponsor}
              cellAspect={tier.cellAspect}
              mobileLogoScale={tier.mobileLogoScale}
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
}: {
  onClose: () => void;
  sponsor: SponsorLogo | null;
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
  const socialLinks = getSponsorSocialLinks(company);
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
          aria-label="Close sponsor details"
          className="absolute right-[11px] top-[11px] z-10 inline-flex size-8 items-center justify-center bg-white text-black transition-colors hover:bg-purple focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white md:right-[15px] md:top-[15px]"
        >
          <CloseIcon />
        </button>

        <SponsorModalBody
          company={company}
          description={description}
          descriptionId={descriptionId}
          logo={logo}
          modalLogoStyle={modalLogoStyle}
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
              company={company}
              decorative
              description={description}
              logo={logo}
              modalLogoStyle={modalLogoStyle}
              socialLinks={socialLinks}
              tags={tags}
            />
          </div>
        </GlitchOverlay>
      </div>
    </div>
  );
}

function SponsorsIntro() {
  const introText = `<span class="text-purple">7,000+</span> high-intent <span class="text-purple">builders</span>, <span class="text-green">investors</span>, and <span class="text-blue">institutions</span> in one room. Direct access to Solana's decision-makers in London's financial hub. Your brand, their attention. ROI starts day one.`;

  return (
    <section className="bg-black pt-l md:pt-xl">
      <div className="container flex flex-col gap-m md:flex-row md:items-start md:justify-between">
        <WordReveal
          as="p"
          className="type-eyebrow text-white"
          stepMs={60}
          text="WHY SPONSOR BP'26"
        />

        <div className="w-full max-w-[851px]">
          <WordReveal
            as="p"
            className="type-h5 text-white"
            html
            stepMs={60}
            startDelayMs={250}
            text={introText}
          />

          <Button
            arrow
            className="mt-s"
            href={SPONSOR_FORM_HREF}
            label="Contact us"
            variant="primary"
          />
        </div>
      </div>
    </section>
  );
}

export default function SponsorsPage() {
  const [activeSponsor, setActiveSponsor] = useState<SponsorLogo | null>(null);

  return (
    <PageShell contentId="breakpoint-sponsors-content">
      <SubpageHero title="Sponsors" heroImage="sponsors" />
      <SponsorsIntro />
      {sponsorTiers.map((tier, index) => (
        <SponsorTierSection
          key={tier.title}
          tier={tier}
          first={index === 0}
          onSponsorClick={setActiveSponsor}
        />
      ))}
      <Footer />
      <SponsorModal
        sponsor={activeSponsor}
        onClose={() => setActiveSponsor(null)}
      />
    </PageShell>
  );
}
