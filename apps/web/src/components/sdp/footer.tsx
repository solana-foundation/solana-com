"use client";

import Link from "next/link";
import SolanaLogo from "@@/public/src/img/logos-solana/logotype.inline.svg";
import {
  YoutubeIcon,
  TwitterIcon,
  DiscordIcon,
  RedditIcon,
  GithubIcon,
  TelegramIcon,
} from "@solana-com/ui-chrome";

const PRODUCT_LINKS = [
  { label: "API documentation", href: "/docs/rpc" },
  { label: "Postman collection", href: "#" },
  { label: "AI skills", href: "#" },
];

const GET_CONNECTED_LINKS = [
  { label: "Blog", href: "/news" },
  { label: "Podcasts", href: "/podcasts" },
  { label: "Newsletter", href: "/newsletter" },
];

const LEGAL_LINKS = [
  { label: "Disclaimer", href: "/tos" },
  { label: "Privacy policy", href: "/privacy-policy" },
];

const SOCIAL_LINKS = [
  { name: "YouTube", url: "/youtube", Icon: YoutubeIcon },
  { name: "Twitter", url: "/twitter", Icon: TwitterIcon },
  { name: "Discord", url: "/discord", Icon: DiscordIcon },
  { name: "Reddit", url: "/reddit", Icon: RedditIcon },
  { name: "GitHub", url: "/github", Icon: GithubIcon },
  { name: "Telegram", url: "/telegram", Icon: TelegramIcon },
];

console.log(SOCIAL_LINKS);
console.log(typeof SOCIAL_LINKS);

const NavColumn = ({
  title,
  links,
  className,
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) => (
  <div
    className={`flex flex-col gap-4 px-5 md:px-8 xl:px-12 py-10 md:py-20 ${className ?? ""}`}
  >
    <p className="m-0 font-brand-mono font-medium text-white text-xs md:text-sm leading-5 tracking-[1px] uppercase">
      {title}
    </p>
    <ul className="list-none p-0 m-0 flex flex-col gap-2">
      {links.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="text-white/[0.64] text-base leading-[1.375] tracking-[-0.01em] no-underline hover:text-white hover:no-underline transition-colors"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-b border-white/[0.08] flex flex-col items-center">
      <div className="w-full max-w-[1440px] xl:border-x border-white/[0.08] flex flex-col xl:flex-row">
        {/* Left block: logo + copyright + social icons */}
        <div className="xl:w-[480px] xl:shrink-0 xl:border-r border-white/[0.08] border-b xl:border-b-0 flex flex-col">
          {/* Logo + copyright */}
          <div className="flex flex-col gap-4 px-5 md:px-8 xl:px-12 py-10 md:py-20">
            <div className="flex items-center gap-4">
              <SolanaLogo
                width={134}
                height={20}
                aria-label="Solana"
                className="shrink-0"
              />
              <img
                src="/src/img/solutions/sdp/sdp-badge.svg"
                alt="SDP"
                className="h-auto shrink-0"
              />
            </div>
            <p className="m-0 text-white/[0.64] text-base leading-[1.375] tracking-[-0.01em]">
              © {year} Solana Foundation.
              <br />
              All rights reserved.
            </p>
          </div>

          {/* Social icons */}
          <div className="flex border-t border-white/[0.08]">
            {SOCIAL_LINKS.map(({ name, url, Icon }, i) => (
              <a
                key={name}
                href={url}
                aria-label={name}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  "flex flex-1 xl:w-20 xl:flex-none h-16 xl:h-20 items-center justify-center",
                  "hover:bg-white/[0.04] transition-colors",
                  "[&_svg]:fill-white/[0.64] hover:[&_svg]:fill-white [&_svg]:transition-colors",
                  i < SOCIAL_LINKS.length - 1
                    ? "border-r border-white/[0.08]"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Icon width={20} height={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns: Product, Get Connected, Legal */}
        <div className="flex-1 flex flex-wrap xl:flex-nowrap">
          <NavColumn
            title="Product"
            links={PRODUCT_LINKS}
            className="w-1/2 xl:w-auto xl:flex-1 border-r border-white/[0.08] border-b xl:border-b-0"
          />
          <NavColumn
            title="Get connected"
            links={GET_CONNECTED_LINKS}
            className="w-1/2 xl:w-auto xl:flex-1 xl:border-r border-white/[0.08] border-b xl:border-b-0"
          />
          <NavColumn
            title="Legal"
            links={LEGAL_LINKS}
            className="w-full xl:w-auto xl:flex-1"
          />
        </div>
      </div>
    </footer>
  );
};
