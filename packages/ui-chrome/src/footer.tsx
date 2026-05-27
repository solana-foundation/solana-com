"use client";

import classNames from "classnames";
import YoutubeIcon from "./assets/youtube.inline.svg";
import TwitterIcon from "./assets/twitter.inline.svg";
import DiscordIcon from "./assets/discord.inline.svg";
import RedditIcon from "./assets/reddit.inline.svg";
import GithubIcon from "./assets/github.inline.svg";
import SolanaFoundationLogo from "./assets/logotype-foundation.inline.svg";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "./language-selector";
import { Link, InlineLink } from "./link";
import SolanaBgSvg from "./assets/solana-bg.svg";
import dynamic from "next/dynamic";

const FooterMouseEffect = dynamic(
  () => import("./footer-mouse-effect").then((mod) => mod.FooterMouseEffect),
  {
    ssr: false,
  },
);

const SOCIAL_LINKS = [
  { name: "YouTube", url: "/youtube", Icon: YoutubeIcon, size: 20 },
  { name: "Twitter", url: "/twitter", Icon: TwitterIcon, size: 16 },
  { name: "Discord", url: "/discord", Icon: DiscordIcon, size: 20 },
  { name: "Reddit", url: "/reddit", Icon: RedditIcon, size: 20 },
  { name: "GitHub", url: "/github", Icon: GithubIcon, size: 20 },
];

const FOOTER_COLUMNS = [
  {
    headingKey: "footer.useSolana.heading",
    links: [
      { labelKey: "footer.useSolana.hub", href: "/use-solana" },
      { labelKey: "footer.useSolana.wallets", href: "/wallets" },
      { labelKey: "footer.useSolana.learn", href: "/learn" },
      { labelKey: "footer.useSolana.staking", href: "/staking" },
    ],
  },
  {
    headingKey: "footer.build.heading",
    links: [
      { labelKey: "footer.build.developers", href: "/developers" },
      { labelKey: "footer.build.docs", href: "/docs" },
      { labelKey: "footer.build.guides", href: "/developers/guides" },
      { labelKey: "footer.build.templates", href: "/developers/templates" },
    ],
  },
  {
    headingKey: "footer.enterprise.heading",
    links: [
      { labelKey: "footer.enterprise.hub", href: "/enterprise" },
      {
        labelKey: "footer.enterprise.payments",
        href: "/solutions/institutional-payments",
      },
      {
        labelKey: "footer.enterprise.tokenization",
        href: "/solutions/tokenization",
      },
      { labelKey: "footer.enterprise.reports", href: "/reports" },
    ],
  },
  {
    headingKey: "footer.products.heading",
    links: [
      { labelKey: "footer.products.hub", href: "/products" },
      { labelKey: "footer.products.sdp", href: "/solutions/sdp" },
      { labelKey: "footer.products.x402", href: "/x402" },
      { labelKey: "footer.products.agentRegistry", href: "/agent-registry" },
      { labelKey: "footer.products.skills", href: "/skills" },
    ],
  },
  {
    headingKey: "footer.ecosystem.heading",
    links: [
      { labelKey: "footer.ecosystem.hub", href: "/ecosystem" },
      { labelKey: "footer.ecosystem.network", href: "/network" },
      { labelKey: "footer.ecosystem.events", href: "/events" },
      { labelKey: "footer.ecosystem.community", href: "/community" },
      { labelKey: "footer.ecosystem.news", href: "/news" },
      { labelKey: "footer.ecosystem.newsletter", href: "/newsletter" },
    ],
  },
  {
    headingKey: "footer.solana.heading",
    links: [
      { labelKey: "footer.solana.grants", href: "https://solana.org/grants" },
      { labelKey: "footer.solana.media", href: "/branding" },
      { labelKey: "footer.solana.careers", href: "https://jobs.solana.com/" },
      { labelKey: "footer.solana.disclaimer", href: "/tos" },
      { labelKey: "footer.solana.privacy-policy", href: "/privacy-policy" },
    ],
  },
];

const Copyright = () => {
  const t = useTranslations();
  return (
    <span className="text-white/45 text-xs leading-relaxed">
      {t("footer.copyright", { currentYear: new Date().getFullYear() })}
    </span>
  );
};

const FooterColumn = ({
  column,
}: {
  column: (typeof FOOTER_COLUMNS)[number];
}) => {
  const t = useTranslations();

  return (
    <div className="col-span-1">
      <div className="mb-5 md:mb-6 font-brand-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
        {t(column.headingKey)}
      </div>
      <ul className="list-unstyled m-0">
        {column.links.map((link) => (
          <li key={`${column.headingKey}-${link.href}`}>
            <Link
              to={link.href}
              className="!no-underline !text-white/70 hover:!text-white transition-colors duration-200"
            >
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Footer = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        "relative bg-black text-base text-white",
        "[&_ul_a]:inline-block [&_ul_a]:text-sm [&_ul_a]:md:text-[15px] [&_ul_a]:font-normal [&_ul_a]:leading-[1.5]",
        "[&_ul_li+li]:mt-3",
        className,
      )}
    >
      <div
        className="w-full max-w-[1440px] px-5 md:px-8 xl:px-[72px] pt-16 md:pt-20 xl:pt-24 pb-[136px] md:pb-[164px] xl:pb-[320px] mx-auto bg-[length:100%_auto] bg-bottom md:bg-[position:center_120%] xl:bg-bottom bg-no-repeat"
        style={{ backgroundImage: `url(${SolanaBgSvg})` }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-10 md:pb-14 xl:pb-16 border-b border-white/[0.08]">
          <Link
            to="/"
            aria-label="Solana Foundation"
            className="!no-underline !text-white hover:!text-white inline-flex"
          >
            <SolanaFoundationLogo
              className="max-w-full w-[180px] md:w-[220px] xl:w-[260px] h-auto"
              viewBox="0 0 210 35"
            />
          </Link>
          <LanguageSelector className="!text-white/55 hover:!text-white" />
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-12 md:gap-y-14 pt-10 md:pt-14 xl:pt-16">
          {FOOTER_COLUMNS.map((column) => (
            <FooterColumn key={column.headingKey} column={column} />
          ))}
        </div>

        <div className="relative z-10 mt-14 md:mt-20 xl:mt-24 pt-6 border-t border-white/[0.08] flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-5">
          <Copyright />
          <div className="flex flex-wrap items-center -ml-2.5">
            {SOCIAL_LINKS.map(({ name, url, Icon, size }) => (
              <InlineLink
                key={name}
                to={url}
                aria-label={name}
                className="!no-underline !text-white/55 hover:!text-white transition-colors duration-200 inline-flex p-2.5 [&_svg]:m-auto"
              >
                <Icon width={size} height={size} />
              </InlineLink>
            ))}
          </div>
        </div>
      </div>
      <FooterMouseEffect className="absolute bottom-0 left-0 w-full h-[300px] hidden xl:block" />
    </div>
  );
};
