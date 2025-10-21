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
        "[&_a:not(.dropdown-item)]:text-[#ababbc] [&_a:not(.dropdown-item)]:hover:text-white",
        "[&_button]:text-[#ababbc] [&_button]:hover:text-white",
        "[&_ul_a]:inline-block [&_ul_a]:text-sm [&_ul_a]:md:text-base [&_ul_a]:font-normal [&_ul_a]:leading-[1.42] [&_ul_a]:md:leading-[1.5]",
        "[&_ul_li+li]:mt-3",
        className
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
              <Link to="/" aria-label="Solana Foundation">
                <SolanaFoundationLogo
                  width={234}
                  height={40}
                  viewBox="0 0 210px 35px"
                />
              </Link>
            </div>
            <div>
              <CopyrightRow />
            </div>
            <div className="mt-5 flex flex-wrap justify-stretch xl:mt-auto xl:block [&_a+a:before]:content-[''] [&_a+a:before]:absolute [&_a+a:before]:top-0 [&_a+a:before]:left-[-8px] [&_a+a:before]:bottom-0 [&_a+a:before]:my-auto [&_a+a:before]:w-px [&_a+a:before]:h-3 [&_a+a:before]:bg-[rgba(240,228,255,0.12)] [&_a]:relative [&_a]:text-[#ababbc] [&_a]:inline-flex [&_a]:p-2.5 [&_a]:rounded-full [&_a]:mr-4 [&_a]:flex-1 md:[&_a]:flex-none [&_a]:hover:text-white [&_a_svg]:m-auto">
              <InlineLink to="/youtube" aria-label="YouTube">
                <YoutubeIcon width="20" height="20" />
              </InlineLink>
              <InlineLink to="/twitter" aria-label="Twitter">
                <TwitterIcon width="16" height="16" />
              </InlineLink>
              <InlineLink to="/discord" aria-label="Discord">
                <DiscordIcon width="20" height="20" />
              </InlineLink>
              <InlineLink to="/reddit" aria-label="Reddit">
                <RedditIcon width="20" height="20" />
              </InlineLink>
              <InlineLink to="/github" aria-label="GitHub">
                <GithubIcon width="20" height="20" />
              </InlineLink>
              <InlineLink to="/telegram" aria-label="Telegram">
                <TelegramIcon width="20" height="20" />
              </InlineLink>
            </div>
          </div>
          <div className="col-span-1 absolute right-0 top-0 md:relative xl:order-4">
            <div className="relative flex justify-end xl:justify-start">
              <LanguageSelector />
            </div>
          </div>
          <div className="col-span-1">
            <div className="mb-4 md:mb-6 text-base md:text-lg font-medium leading-[1.33]">
              {t("footer.solana.heading")}
            </div>
            <ul className="list-unstyled m-0">
              <li>
                <InlineLink to="https://solana.org/grants">
                  {t("footer.solana.grants")}
                </InlineLink>
              </li>
              <li>
                <InlineLink to="https://break.solana.com/">
                  {t("footer.solana.break")}
                </InlineLink>
              </li>
              <li>
                <Link to="/branding">{t("footer.solana.media")}</Link>
              </li>
              <li>
                <InlineLink to="https://jobs.solana.com/">
                  {t("footer.solana.careers")}
                </InlineLink>
              </li>
              <li>
                <Link to="/tos">{t("footer.solana.disclaimer")}</Link>
              </li>
              <li>
                <Link to="/privacy-policy">
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
                  <Link to="/news">{t("footer.get-connected.blog")}</Link>
                </li>
                <li>
                  <Link to="/newsletter">
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