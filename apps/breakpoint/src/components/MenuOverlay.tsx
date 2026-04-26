"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@workspace/i18n/routing";
import { isRelativeHref } from "@/lib/links";
import GlitchOverlay from "@/components/GlitchOverlay";

type MenuItem = {
  label: string;
  href: string;
};

type SocialLink = {
  name: string;
  href: string;
  icon: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Speakers", href: "/speakers" },
  { label: "Agenda", href: "/agenda" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Travel", href: "/travel" },
  { label: "Register", href: "/registration" },
  { label: "FAQ", href: "/faq" },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@SolanaFndn",
    icon: "/assets/icon-youtube.svg",
  },
  { name: "X", href: "https://x.com/solana", icon: "/assets/icon-x.svg" },
  {
    name: "Discord",
    href: "https://solana.com/discord",
    icon: "/assets/icon-discord.svg",
  },
  {
    name: "Reddit",
    href: "https://www.reddit.com/r/solana/",
    icon: "/assets/icon-reddit.svg",
  },
  {
    name: "GitHub",
    href: "https://github.com/solana-foundation",
    icon: "/assets/icon-github.svg",
  },
  {
    name: "Telegram",
    href: "https://t.me/solana",
    icon: "/assets/icon-telegram.svg",
  },
];

const MENU_LABEL_CLASSES =
  "font-bp26 text-[30px] font-normal uppercase leading-[0.95] tracking-normal min-[360px]:text-[34px] min-[430px]:text-[40px] min-[560px]:text-[56px] min-[560px]:tracking-[0.02em] md:text-[72px] md-lg:text-[88px] lg:text-[104px]";

type Props = {
  open: boolean;
  onClose: () => void;
};

function MenuItemRow({
  item,
  index,
  isCurrent,
  onNavigate,
}: {
  item: MenuItem;
  index: number;
  isCurrent: boolean;
  onNavigate: () => void;
}) {
  const [hover, setHover] = useState(false);
  const number = String(index + 1).padStart(2, "0");

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="font-mono text-[12px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white/50 transition-colors group-hover:text-purple min-[430px]:text-[14px] md:text-[16px]"
      >
        [{number}]
      </span>
      <span className="relative inline-flex items-baseline">
        <span
          className={`${MENU_LABEL_CLASSES} transition-colors duration-150 ${
            isCurrent ? "text-purple" : "text-white"
          } group-hover:text-[#e7d2f9] ${hover ? "bp-glitch-jitter" : ""}`}
        >
          {item.label}
        </span>
        <GlitchOverlay active={hover} size="lg">
          <span className={MENU_LABEL_CLASSES}>{item.label}</span>
        </GlitchOverlay>
      </span>
      <span
        aria-hidden="true"
        className={`ml-auto hidden size-3 shrink-0 items-center justify-center transition-opacity min-[560px]:inline-flex ${
          hover || isCurrent ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 10L10 2M10 2H4M10 2V8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      </span>
    </>
  );

  const className =
    "group relative flex w-full items-center gap-2 border-b border-white/10 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-[430px]:gap-4 md:gap-6 md:py-5";

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
    onClick: onNavigate,
  };

  if (isRelativeHref(item.href)) {
    return (
      <Link
        href={item.href}
        className={className}
        aria-current={isCurrent ? "page" : undefined}
        {...handlers}
      >
        {inner}
      </Link>
    );
  }

  return (
    <a href={item.href} className={className} {...handlers}>
      {inner}
    </a>
  );
}

export default function MenuOverlay({ open, onClose }: Props) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const previousActive = document.activeElement;
    closeRef.current?.focus();

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !containerRef.current) return;
      const els = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (els.length === 0) return;
      const first = els[0]!;
      const last = els[els.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previousActive instanceof HTMLElement) previousActive.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      ref={containerRef}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-black text-white"
    >
      {/* Subtle pixel/grid texture background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Header — mirrors Navigation chrome so logo stays in place */}
      <div
        className="relative z-10 flex h-12 items-center justify-between pl-3 pr-2 py-2"
        style={{ marginTop: 12 }}
      >
        <Link
          href="/"
          onClick={onClose}
          className="flex h-4 shrink-0 items-center gap-[5.705px] md:h-5 md:gap-[7px]"
          aria-label="Breakpoint 2026"
        >
          <img
            src="/assets/nav-solana.svg"
            alt=""
            aria-hidden="true"
            width={23}
            height={20}
            className="block h-[15.64px] w-[18.15px] md:h-[19.55px] md:w-[22.68px]"
          />
          <img
            src="/assets/nav-bp26.svg"
            alt=""
            aria-hidden="true"
            width={104}
            height={20}
            className="block h-4 w-[83.56px] md:h-5 md:w-[104.45px]"
          />
        </Link>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="group inline-flex h-8 shrink-0 items-center gap-2 bg-neutral-800 px-2 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white hover:bg-purple hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:px-3"
        >
          <span aria-hidden="true">Close</span>
          <span aria-hidden="true" className="relative block size-3">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2L10 10M10 2L2 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Eyebrow / event meta */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-4 pb-3 pt-6 md:px-8 md:pt-10">
        <p className="font-mono text-[12px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white/50 md:text-[14px]">
          Menu
        </p>
        <p className="font-mono text-[12px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white/50 md:text-[14px]">
          Olympia London · Nov 15–17, 2026
        </p>
      </div>

      {/* Menu items */}
      <nav aria-label="Site" className="relative z-10 flex-1 px-4 md:px-8">
        <ul className="unstyled-list border-t border-white/10">
          {MENU_ITEMS.map((item, idx) => {
            const isCurrent =
              item.href === "/" ? pathname === "/" : pathname === item.href;
            return (
              <li key={item.href}>
                <MenuItemRow
                  item={item}
                  index={idx}
                  isCurrent={isCurrent}
                  onNavigate={onClose}
                />
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer — socials + secondary links */}
      <div className="relative z-10 mt-8 flex flex-col gap-6 border-t border-white/10 px-4 py-6 md:flex-row md:items-center md:justify-between md:gap-4 md:px-8 md:py-8">
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${social.name} (opens in a new tab)`}
              className="flex size-6 items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <img
                src={social.icon}
                alt=""
                aria-hidden="true"
                className="block h-auto max-h-6 w-6 invert"
              />
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="mailto:breakpoint@solana.org"
            className="font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Contact Us
          </a>
          <Link
            href="/code-of-conduct"
            onClick={onClose}
            className="font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Code of Conduct
          </Link>
          <p className="font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-white/50">
            © Solana Foundation 2026
          </p>
        </div>
      </div>
    </div>
  );
}
