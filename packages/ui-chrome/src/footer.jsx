"use client";

import classNames from "classnames";
import YoutubeIcon from "./assets/youtube.inline.svg";
import TwitterIcon from "./assets/twitter.inline.svg";
import DiscordIcon from "./assets/discord.inline.svg";
import RedditIcon from "./assets/reddit.inline.svg";
import GithubIcon from "./assets/github.inline.svg";
import TelegramIcon from "./assets/telegram.inline.svg";
import SolanaFoundationLogo from "./assets/logotype-foundation.inline.svg";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "./language-selector";
import { Link, InlineLink } from "./link";
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import SolanaBgSvg from "./assets/solana-bg.svg";

const SOCIAL_LINKS = [
  { name: "YouTube", url: "/youtube", Icon: YoutubeIcon, size: 20 },
  { name: "Twitter", url: "/twitter", Icon: TwitterIcon, size: 16 },
  { name: "Discord", url: "/discord", Icon: DiscordIcon, size: 20 },
  { name: "Reddit", url: "/reddit", Icon: RedditIcon, size: 20 },
  { name: "GitHub", url: "/github", Icon: GithubIcon, size: 20 },
  { name: "Telegram", url: "/telegram", Icon: TelegramIcon, size: 20 },
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
    <span className="text-[#ababbc] text-sm md:text-base font-normal leading-[1.42] md:leading-[1.5]">
      {textNodes}
    </span>
  );
};

export const Footer = ({ className = "" }) => {
  const t = useTranslations();

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
          <div className="flex flex-col col-span-2 md:col-span-1 xl:col-span-3">
            <p className="text-base md:text-lg font-medium mb-0 leading-[1.33]">
              {t("footer.foundation")}
            </p>
            <div className="mt-6 mb-5">
              <Link
                to="/"
                aria-label="Solana Foundation"
                className="!no-underline !text-white hover:!text-white"
              >
                <SolanaFoundationLogo
                  width={234}
                  height={40}
                  viewBox="0 0 210 35"
                />
              </Link>
            </div>
            <div>
              <CopyrightRow />
            </div>
            <div className="mt-5 flex flex-wrap justify-stretch xl:mt-auto xl:block [&_a+a:before]:content-[''] [&_a+a:before]:absolute [&_a+a:before]:top-0 [&_a+a:before]:left-[-8px] [&_a+a:before]:bottom-0 [&_a+a:before]:my-auto [&_a+a:before]:w-px [&_a+a:before]:h-3 [&_a+a:before]:bg-[rgba(240,228,255,0.12)]">
              {SOCIAL_LINKS.map(({ name, url, Icon, size }) => (
                <InlineLink
                  key={name}
                  to={url}
                  aria-label={name}
                  className="relative !no-underline !text-[#ababbc] hover:!text-white transition-colors inline-flex p-2.5 rounded-full mr-4 flex-1 md:flex-none [&_svg]:m-auto"
                >
                  <Icon width={size} height={size} />
                </InlineLink>
              ))}
            </div>
          </div>
          <div className="col-span-1 absolute right-0 top-0 md:relative xl:order-4">
            <div className="relative flex justify-end xl:justify-start">
              <LanguageSelector className="!text-[#ababbc] hover:!text-white" />
            </div>
          </div>
          <div className="col-span-1">
            <div className="mb-4 md:mb-6 text-base md:text-lg font-medium leading-[1.33]">
              {t("footer.solana.heading")}
            </div>
            <ul className="list-unstyled m-0">
              <li>
                <InlineLink
                  to="https://solana.org/grants"
                  className="!no-underline !text-[#ababbc] hover:!text-white transition-colors"
                >
                  {t("footer.solana.grants")}
                </InlineLink>
              </li>
              <li>
                <Link
                  to="/branding"
                  className="!no-underline !text-[#ababbc] hover:!text-white transition-colors"
                >
                  {t("footer.solana.media")}
                </Link>
              </li>
              <li>
                <InlineLink
                  to="https://jobs.solana.com/"
                  className="!no-underline !text-[#ababbc] hover:!text-white transition-colors"
                >
                  {t("footer.solana.careers")}
                </InlineLink>
              </li>
              <li>
                <Link
                  to="/tos"
                  className="!no-underline !text-[#ababbc] hover:!text-white transition-colors"
                >
                  {t("footer.solana.disclaimer")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="!no-underline !text-[#ababbc] hover:!text-white transition-colors"
                >
                  {t("footer.solana.privacy-policy")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <div>
              <div className="mb-4 md:mb-6 text-base md:text-lg font-medium leading-[1.33]">
                {t("footer.get-connected.heading")}
              </div>
              <ul className="list-unstyled m-0">
                <li>
                  <Link
                    to="/news"
                    aria-label={t("footer.get-connected.blog")}
                    className="!no-underline !text-[#ababbc] hover:!text-white transition-colors"
                  >
                    {t("footer.get-connected.blog")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/newsletter"
                    className="!no-underline !text-[#ababbc] hover:!text-white transition-colors"
                  >
                    {t("footer.get-connected.newsletter")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
