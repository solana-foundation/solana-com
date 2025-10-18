"use client";

import classNames from "classnames";
import YoutubeIcon from "./assets/youtube.inline.svg";
import TwitterIcon from "./assets/twitter.inline.svg";
import DiscordIcon from "./assets/discord.inline.svg";
import RedditIcon from "./assets/reddit.inline.svg";
import GithubIcon from "./assets/github.inline.svg";
import TelegramIcon from "./assets/telegram.inline.svg";
import SolanaFoundationLogo from "./assets/logotype-foundation.inline.svg";
import { Divider } from "./divider";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "./language-selector";
import { Link, InlineLink } from "./link";

const CopyrightRow = () => {
  const t = useTranslations();

  return (
    <span className="text-[#848895]">
      {t("footer.copyright", {
        currentYear: new Date().getFullYear(),
      })}
    </span>
  );
};

const Footer = ({ className = "" }) => {
  const t = useTranslations();

  return (
    <div
      className={classNames(
        "text-[1rem] mt-20 py-20 bg-[#000508] text-white !border border-[#141414] rounded-t-xl",
        "[background-image:radial-gradient(farthest-corner_at_bottom_right,#3a233f,transparent_250px)]",
        "md:[background-image:radial-gradient(farthest-side_at_bottom_left,#271d3b,transparent_900px),radial-gradient(farthest-corner_at_bottom_right,#3a233f,transparent_1000px)]",
        "[&_a:not(.dropdown-item):not(.social-icon)]:text-[#848895]",
        "[&_a:not(.dropdown-item):not(.social-icon):hover]:text-white",
        "[&_button]:text-[#848895]",
        "[&_button:hover]:text-white",
        "[&_ul_a]:py-1.5",
        "[&_ul_a]:inline-block",
        className,
      )}
    >
      <div className="container">
        <div className="d-md-flex justify-content-md-between">
          <div className="d-flex flex-column align-items-center align-items-md-start">
            <p className="font-['DSemi'] mb-0 leading-none">
              {t("footer.foundation")}
            </p>
            <div className="mt-[10px] mb-[20px]">
              <Link to="/" aria-label="Solana Foundation">
                <SolanaFoundationLogo width={210} />
              </Link>
            </div>
            <div className="mb-[20px]">
              <InlineLink
                to="/youtube"
                aria-label="YouTube"
                className="social-icon inline-flex bg-[#848895] hover:bg-white p-[5px] rounded-full mr-2.5 [&_svg]:fill-[#111]"
              >
                <YoutubeIcon width="16" height="16" />
              </InlineLink>
              <InlineLink
                to="/twitter"
                aria-label="Twitter"
                className="social-icon inline-flex bg-[#848895] hover:bg-white p-[5px] rounded-full mr-2.5 [&_svg]:fill-[#111]"
              >
                <TwitterIcon width="16" height="16" />
              </InlineLink>
              <InlineLink
                to="/discord"
                aria-label="Discord"
                className="social-icon inline-flex bg-[#848895] hover:bg-white p-[5px] rounded-full mr-2.5 [&_svg]:fill-[#111]"
              >
                <DiscordIcon width="16" height="16" />
              </InlineLink>
              <InlineLink
                to="/reddit"
                aria-label="Reddit"
                className="social-icon inline-flex bg-[#848895] hover:bg-white p-[5px] rounded-full mr-2.5 [&_svg]:fill-[#111]"
              >
                <RedditIcon width="16" height="16" />
              </InlineLink>
              <InlineLink
                to="/github"
                aria-label="GitHub"
                className="social-icon inline-flex bg-[#848895] hover:bg-white p-[5px] rounded-full mr-2.5 [&_svg]:fill-[#111]"
              >
                <GithubIcon width="16" height="16" />
              </InlineLink>
              <InlineLink
                to="/telegram"
                aria-label="Telegram"
                className="social-icon inline-flex bg-[#848895] hover:bg-white p-[5px] rounded-full [&_svg]:fill-[#111]"
              >
                <TelegramIcon width="16" height="16" />
              </InlineLink>
            </div>
            <div className="d-none d-lg-block">
              <CopyrightRow />
            </div>
          </div>
          <div>
            <div className="row my-6 my-md-0">
              <div className="col pe-lg-8">
                <div className="h6 smaller text-uppercase text-nowrap">
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
              <div className="col">
                <div className="row flex-md-nowrap h-100 flex-column flex-md-row">
                  <div className="col pe-lg-8">
                    <div className="h6 smaller text-uppercase text-nowrap">
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
                  <div className="col flex-grow-0">
                    <LanguageSelector />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center d-lg-none">
          <Divider theme="light" axis="x" alpha="0.1" className="my-6" />
          <CopyrightRow />
        </div>
      </div>
    </div>
  );
};

export { Footer };
