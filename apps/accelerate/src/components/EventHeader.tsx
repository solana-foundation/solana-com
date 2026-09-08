"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import { LanguageSelector } from "@solana-com/ui-chrome";
import { getImagePath } from "@/config";
import { LumaModal } from "./LumaModal";

const navLinkStyle =
  "font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80 text-button";
const activeNavLinkStyle =
  "font-semibold uppercase tracking-[0.05em] text-accelerate-green transition-colors hover:text-accelerate-green/80 text-button";

type EventHeaderProps = {
  variant: "hero" | "page";
  translationPrefix: string;
  homePath: string;
  agendaPath: string | null;
  logoImage: string;
  logoAlt: string;
  showSpeakersNav?: boolean;
  showCta?: boolean;
  ctaLabel?: string;
  lumaId?: string;
  activeNav?: "agenda";
};

type NavigationLink = {
  href: string;
  label: string;
  id?: "agenda";
};

export function EventCtaArrow({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 11 11"
      fill="none"
      className={className}
    >
      <path
        d="M2 9L9 2M9 2H4M9 2V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavigationItem({
  link,
  active,
  onClick,
}: {
  link: NavigationLink;
  active: boolean;
  onClick?: () => void;
}) {
  const className = active ? activeNavLinkStyle : navLinkStyle;

  if (link.href.startsWith("#")) {
    return (
      <a href={link.href} className={className} onClick={onClick}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className} onClick={onClick}>
      {link.label}
    </Link>
  );
}

export function EventHeader({
  variant,
  translationPrefix,
  homePath,
  agendaPath,
  logoImage,
  logoAlt,
  showSpeakersNav = true,
  showCta = true,
  ctaLabel,
  lumaId = "accelerate-miami",
  activeNav,
}: EventHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations(translationPrefix);
  const isHero = variant === "hero";
  const hashPath = (hash: "speakers" | "sponsors" | "faq") =>
    isHero ? `#${hash}` : `${homePath}#${hash}`;

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navigationLinks: NavigationLink[] = [
    ...(showSpeakersNav
      ? [{ href: hashPath("speakers"), label: t("nav.speakers") }]
      : []),
    ...(agendaPath
      ? [{ href: agendaPath, label: t("nav.agenda"), id: "agenda" as const }]
      : []),
    { href: hashPath("sponsors"), label: t("nav.sponsors") },
    { href: hashPath("faq"), label: t("nav.faq") },
  ];

  const ticketButton = (mobile = false) => (
    <LumaModal lumaId={lumaId}>
      <button
        type="button"
        className={`btn-outline-gradient ${mobile ? "mt-2 w-full" : ""} px-7 py-4 text-button`}
      >
        <span>{ctaLabel || t("nav.requestToJoin")}</span>
        <EventCtaArrow />
      </button>
    </LumaModal>
  );

  const logoHeight = isHero ? "lg:h-[100px]" : "lg:h-[80px]";
  const headerContent = (
    <>
      <Link href={homePath} className="flex items-center">
        <Image
          src={getImagePath(logoImage)}
          alt={logoAlt}
          width={197}
          height={100}
          className={`h-[60px] w-auto ${logoHeight}`}
          priority
        />
      </Link>

      <nav className="hidden items-center gap-[38px] md:flex">
        {navigationLinks.map((link) => (
          <NavigationItem
            key={link.href}
            link={link}
            active={link.id === activeNav}
          />
        ))}
        <LanguageSelector className="!text-white/60 hover:!text-white" />
        {showCta && ticketButton()}
      </nav>

      <button
        type="button"
        aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
        aria-expanded={mobileMenuOpen}
        className="flex h-10 w-10 items-center justify-center text-white md:hidden"
        onClick={() => setMobileMenuOpen(true)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );

  return (
    <>
      {isHero ? (
        <header className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-[240px] lg:py-5">
          {headerContent}
        </header>
      ) : (
        <header className="relative z-20">
          <div className="container-accelerate flex items-center justify-between py-5 lg:py-5">
            {headerContent}
          </div>
        </header>
      )}

      <AnimatePresence>
        {mobileMenuOpen && (
          <div key="mobile-menu" className="fixed inset-0 z-30 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute right-0 top-0 z-40 flex h-full w-full max-w-[320px] flex-col bg-accelerate-dark px-6 py-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/60">
                  {t("nav.menu")}
                </span>
                <button
                  type="button"
                  aria-label={t("nav.closeMenu")}
                  className="flex h-10 w-10 items-center justify-center text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-6">
                {navigationLinks.map((link) => (
                  <NavigationItem
                    key={link.href}
                    link={link}
                    active={link.id === activeNav}
                    onClick={() => setMobileMenuOpen(false)}
                  />
                ))}
                <div className="mt-2">
                  <LanguageSelector className="!text-white/60 hover:!text-white" />
                </div>
                {showCta && ticketButton(true)}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
