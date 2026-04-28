"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Link, usePathname } from "@workspace/i18n/routing";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import EmailSubscribeDialog from "@/components/EmailSubscribeDialog";
import GlitchOverlay from "@/components/GlitchOverlay";
import { isRelativeHref } from "@/lib/links";

const STICKY_OFFSET_PX = 12;
const SCROLL_THRESHOLD_PX = 24;
const GLITCH_MS = 520;
const CTA_SIZE_CLASSES =
  "gap-2 px-3 font-mono !text-[14px] !font-bold uppercase !leading-[0.9] !tracking-[0.08em]";

const NAV_ITEMS = [
  { label: "Travel", href: "/travel" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Speakers", href: "/speakers" },
  { label: "Schedule", href: "/agenda" },
  { label: "FAQ", href: "/faq" },
] as const;

type NavigationProps = {
  ctaAlwaysVisible?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  showMenuButton?: boolean;
};

function MenuGlyph() {
  return (
    <span aria-hidden="true" className="relative block size-3">
      <span className="absolute left-0 top-[2px] h-[2px] w-3 bg-white" />
      <span className="absolute left-0 top-[8px] h-[2px] w-3 bg-white" />
    </span>
  );
}

function CloseGlyph() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-3 items-center justify-center"
    >
      <svg
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
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
}

function NavigationLink({
  href,
  isCurrent,
  label,
  onNavigate,
}: {
  href: string;
  isCurrent: boolean;
  label: string;
  onNavigate: () => void;
}) {
  const className =
    "group/link inline-flex h-[26px] w-full items-center gap-3 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white transition-[color,gap] hover:gap-4 hover:text-purple focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white";
  const inner = (
    <>
      <span>{label}</span>
      <span aria-hidden="true">{"\u2192"}</span>
    </>
  );

  if (isRelativeHref(href)) {
    return (
      <Link
        href={href}
        aria-current={isCurrent ? "page" : undefined}
        className={className}
        onClick={onNavigate}
      >
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={className}
      onClick={onNavigate}
    >
      {inner}
    </a>
  );
}

export default function Navigation({
  ctaAlwaysVisible = false,
  ctaHref,
  ctaLabel,
  showMenuButton = true,
}: NavigationProps = {}) {
  const t = useTranslations("breakpoint");
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const previousPathnameRef = useRef(pathname);
  const glitchTimeoutRef = useRef<number | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const clearGlitchTimeout = useCallback(() => {
    if (glitchTimeoutRef.current != null) {
      window.clearTimeout(glitchTimeoutRef.current);
      glitchTimeoutRef.current = null;
    }
  }, []);

  const triggerCtaGlitch = useCallback(() => {
    setIsGlitching(true);
    clearGlitchTimeout();
    glitchTimeoutRef.current = window.setTimeout(() => {
      setIsGlitching(false);
      glitchTimeoutRef.current = null;
    }, GLITCH_MS);
  }, [clearGlitchTimeout]);

  useEffect(() => {
    return () => {
      clearGlitchTimeout();
    };
  }, [clearGlitchTimeout]);

  useEffect(() => {
    let ticking = false;

    const updateStickyState = () => {
      ticking = false;
      setIsSticky(window.scrollY > SCROLL_THRESHOLD_PX);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateStickyState);
    };

    updateStickyState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!isSticky) {
      clearGlitchTimeout();
      setIsGlitching(false);
      return;
    }

    triggerCtaGlitch();
  }, [clearGlitchTimeout, isSticky, triggerCtaGlitch]);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      setMenuOpen(false);
      previousPathnameRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (
        navRef.current &&
        event.target instanceof Node &&
        !navRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const resolvedCtaLabel = ctaLabel ?? t("hero.cta");
  const showCta = ctaAlwaysVisible || isSticky || menuOpen;
  const hasMenu = showMenuButton;

  const ctaInner = (
    <>
      <span className="whitespace-nowrap">{resolvedCtaLabel}</span>
      <span
        aria-hidden="true"
        className="inline-flex size-3 items-center justify-center"
      >
        <ArrowUpRightIcon variant="filled" />
      </span>
    </>
  );

  const ctaClasses = `inline-flex h-8 shrink-0 items-center justify-center overflow-hidden bg-white text-black transition-colors hover:bg-purple focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white ${CTA_SIZE_CLASSES} ${
    showCta ? "pointer-events-auto cursor-pointer" : "pointer-events-none"
  } ${isGlitching ? "bp-glitch-jitter" : ""}`;

  const ctaAriaProps = {
    "aria-hidden": !showCta,
    tabIndex: showCta ? 0 : -1,
  };

  const ctaElement = ctaHref ? (
    isRelativeHref(ctaHref) ? (
      <Link
        href={ctaHref}
        className={ctaClasses}
        onFocus={triggerCtaGlitch}
        onMouseEnter={triggerCtaGlitch}
        style={{ cursor: showCta ? "pointer" : undefined }}
        {...ctaAriaProps}
      >
        {ctaInner}
      </Link>
    ) : (
      <a
        href={ctaHref}
        className={ctaClasses}
        onFocus={triggerCtaGlitch}
        onMouseEnter={triggerCtaGlitch}
        style={{ cursor: showCta ? "pointer" : undefined }}
        {...ctaAriaProps}
      >
        {ctaInner}
      </a>
    )
  ) : (
    <button
      type="button"
      onClick={() => setSubscribeOpen(true)}
      onFocus={triggerCtaGlitch}
      onMouseEnter={triggerCtaGlitch}
      className={ctaClasses}
      style={{ cursor: showCta ? "pointer" : undefined }}
      {...ctaAriaProps}
    >
      {ctaInner}
    </button>
  );

  const closedWidthClass = hasMenu
    ? showCta
      ? "w-[calc(100vw-32px)] max-w-[343px] md:w-[466px] md:max-w-none"
      : "w-[calc(100vw-32px)] max-w-[343px] md:w-[310px] md:max-w-none"
    : showCta
      ? "w-[calc(100vw-32px)] max-w-[343px] md:w-[426px] md:max-w-none"
      : "w-auto";
  const navWidthClass = menuOpen
    ? "w-[calc(100vw-32px)] max-w-[343px] md:w-[466px] md:max-w-none"
    : closedWidthClass;
  const navPositionClass =
    isSticky || ctaAlwaysVisible || menuOpen ? "fixed" : "absolute";
  const headerLayoutClass = hasMenu
    ? "justify-between pl-3 pr-2 md:pl-4"
    : showCta
      ? "justify-between px-3 md:gap-[120px] md:justify-start md:px-4"
      : "px-3 md:px-4";
  const logoSizeClasses = "h-4 gap-[5.705px] md:h-5 md:gap-[7.132px]";
  const solanaLogoClasses =
    "h-[15.64px] w-[18.15px] md:h-[19.55px] md:w-[22.68px]";
  const bpLogoClasses = "h-4 w-[83.56px] md:h-5 md:w-[104.45px]";

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Primary"
        className={`left-1/2 z-40 flex -translate-x-1/2 flex-col items-start overflow-visible transition-[width,transform,opacity] duration-300 ease-out ${navPositionClass} ${navWidthClass}`}
        style={{ top: `${STICKY_OFFSET_PX}px` }}
      >
        <div
          className={`flex h-12 w-full items-center bg-black py-2 ${headerLayoutClass}`}
        >
          <Link
            href="/"
            className={`flex shrink-0 items-center ${logoSizeClasses}`}
            aria-label="Breakpoint 2026"
            onClick={closeMenu}
          >
            <img
              src="/assets/nav-solana.svg"
              alt=""
              aria-hidden="true"
              width={23}
              height={20}
              className={`block ${solanaLogoClasses}`}
            />
            <img
              src="/assets/nav-bp26.svg"
              alt=""
              aria-hidden="true"
              width={104}
              height={20}
              className={`block ${bpLogoClasses}`}
            />
          </Link>

          {(showCta || hasMenu) && (
            <div className="flex shrink-0 items-center gap-2">
              <div className={showCta ? "relative inline-flex" : "hidden"}>
                {ctaElement}

                <GlitchOverlay active={showCta && isGlitching} size="sm">
                  <span
                    className={`inline-flex h-8 w-full items-center justify-center overflow-hidden bg-white text-black ${CTA_SIZE_CLASSES}`}
                  >
                    {ctaInner}
                  </span>
                </GlitchOverlay>
              </div>

              {hasMenu && (
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-controls="breakpoint-navigation-menu"
                  aria-expanded={menuOpen}
                  className={`relative flex size-8 shrink-0 cursor-pointer items-center justify-center overflow-visible text-white transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white ${
                    menuOpen
                      ? "bg-purple text-black hover:bg-purple"
                      : "bg-neutral-800 hover:bg-neutral-600"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  {menuOpen ? <CloseGlyph /> : <MenuGlyph />}
                </button>
              )}
            </div>
          )}
        </div>

        {hasMenu && menuOpen && (
          <div
            id="breakpoint-navigation-menu"
            className="flex w-full flex-col items-start gap-4 bg-black p-4 shadow-[inset_0_1px_0_0_var(--color-stroke-primary)] md:px-6 md:py-5"
          >
            {NAV_ITEMS.map((item, index) => {
              const isCurrent = pathname === item.href;
              return (
                <div key={item.href} className="contents">
                  <NavigationLink
                    href={item.href}
                    isCurrent={isCurrent}
                    label={item.label}
                    onNavigate={closeMenu}
                  />
                  {index < NAV_ITEMS.length - 1 && (
                    <div className="relative h-0 w-full before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-neutral-700" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>

      <EmailSubscribeDialog
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />
    </>
  );
}
