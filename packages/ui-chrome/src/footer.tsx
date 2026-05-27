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
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
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

const CopyrightRow = () => {
  const t = useTranslations();
  const text = t("footer.copyright", {
    currentYear: new Date().getFullYear(),
  });
  const textNodes = useMemo(
    () =>
      text.split(/(\.)/).map((part, idx) =>
        part === "." ? (
          <Fragment key={idx}>
            .<br />
          </Fragment>
        ) : (
          part
        ),
      ),
    [text],
  );

  return (
    <span className="text-[#ababbc] text-xs font-normal leading-[1.42]">
      {textNodes}
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
      <div className="mb-4 md:mb-6 text-base md:text-lg font-medium leading-[1.33]">
        {t(column.headingKey)}
      </div>
      <ul className="list-unstyled m-0">
        {column.links.map((link) => (
          <li key={`${column.headingKey}-${link.href}`}>
            <Link
              to={link.href}
              className="!no-underline !text-[#ababbc] hover:!text-white transition-colors"
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
        "[&_ul_a]:inline-block [&_ul_a]:text-sm [&_ul_a]:md:text-base [&_ul_a]:font-normal [&_ul_a]:leading-[1.42] [&_ul_a]:md:leading-[1.5]",
        "[&_ul_li+li]:mt-3",
        className,
      )}
    >
      <div
        className="w-full max-w-[1440px] px-[20px] md:px-[32px] xl:px-[72px] pt-[56px] xl:pt-[88px] pb-[136px] md:pb-[164px] xl:pb-[320px] mx-auto bg-[length:100%_auto] bg-bottom md:bg-[position:center_120%] xl:bg-bottom bg-no-repeat"
        style={{ backgroundImage: `url(${SolanaBgSvg})` }}
      >
        <div className="relative grid grid-cols-2 xl:grid-cols-6 gap-[30px]">
          {FOOTER_COLUMNS.map((column) => (
            <FooterColumn key={column.headingKey} column={column} />
          ))}
        </div>
        <div className="relative z-10 mt-12 md:mt-16 xl:mt-20 flex justify-end">
          <LanguageSelector className="!text-[#ababbc] hover:!text-white" />
        </div>
        <div className="relative z-10 mt-6 pt-8 border-t border-[rgba(240,228,255,0.12)] flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              aria-label="Solana Foundation"
              className="!no-underline !text-white hover:!text-white"
            >
              <SolanaFoundationLogo
                className="max-w-full"
                width={140}
                height={24}
                viewBox="0 0 210 35"
              />
            </Link>
            <CopyrightRow />
          </div>
          <div className="flex flex-wrap items-center -mt-2.5 [&_a+a:before]:content-[''] [&_a+a:before]:absolute [&_a+a:before]:top-0 [&_a+a:before]:left-[-8px] [&_a+a:before]:bottom-0 [&_a+a:before]:my-auto [&_a+a:before]:w-px [&_a+a:before]:h-3 [&_a+a:before]:bg-[rgba(240,228,255,0.12)]">
            {SOCIAL_LINKS.map(({ name, url, Icon, size }) => (
              <InlineLink
                key={name}
                to={url}
                aria-label={name}
                className="relative !no-underline !text-[#ababbc] hover:!text-white transition-colors inline-flex p-2.5 rounded-full mr-4 [&_svg]:m-auto"
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
