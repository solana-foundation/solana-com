"use client";

import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import LanguageSelector from "./components/LanguageSelector";
import Divider from "@@/src/components/shared/Divider";
import SolanaFoundationLogo from "@@/public/src/img/logos-solana/logotype-foundation.inline.svg";
import YoutubeIcon from "@@/public/src/img/footer/youtube.inline.svg";
import TwitterIcon from "@@/public/src/img/footer/twitter.inline.svg";
import DiscordIcon from "@@/public/src/img/footer/discord.inline.svg";
import RedditIcon from "@@/public/src/img/footer/reddit.inline.svg";
import GithubIcon from "@@/public/src/img/footer/github.inline.svg";
import TelegramIcon from "@@/public/src/img/footer/telegram.inline.svg";
import Link, { InlineLink } from "@@/src/utils/Link";

const CopyrightRow = () => {
  const t = useTranslations();
  return (
    <span className="text-base">
      {t("footer.copyright", { currentYear: new Date().getFullYear() })}
    </span>
  );
};

const Footer = ({ className = "" }) => {
  const t = useTranslations();
  return (
    <div
      className={twMerge(
        "mt-20 py-20 text-white relative z-20 rounded-t-[12px]",
        "bg-[#000508]",
        "[background-image:radial-gradient(farthest-corner_at_bottom_right,#3a233f,transparent_250px)]",
        "md:[background-image:radial-gradient(farthest-side_at_bottom_left,#271d3b,transparent_900px),radial-gradient(farthest-corner_at_bottom_right,#3a233f,transparent_1000px)]",
        className || "",
      )}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="md:flex md:items-start md:justify-between">
          {/* Left column */}
          <div className="flex flex-col items-center md:items-start">
            <p className="m-0 text-white text-base">{t("footer.foundation")}</p>
            <div className="mt-[10px] mb-[20px]">
              <Link to="/" aria-label="Solana Foundation">
                <SolanaFoundationLogo width={210} />
              </Link>
            </div>

            {/* Social icons */}
            <div className="mb-5 [&_a]:inline-flex [&_a]:p-[5px] [&_a]:rounded-full [&_a]:bg-[#848895] [&_a:hover]:bg-white [&_a:not(:last-child)]:mr-[10px] [&_a_svg]:fill-[#111]">
              <InlineLink to="/youtube" aria-label="YouTube">
                <YoutubeIcon width="16" height="16" />
              </InlineLink>
              <InlineLink to="/twitter" aria-label="Twitter">
                <TwitterIcon width="16" height="16" />
              </InlineLink>
              <InlineLink to="/discord" aria-label="Discord">
                <DiscordIcon width="16" height="16" />
              </InlineLink>
              <InlineLink to="/reddit" aria-label="Reddit">
                <RedditIcon width="16" height="16" />
              </InlineLink>
              <InlineLink to="/github" aria-label="GitHub">
                <GithubIcon width="16" height="16" />
              </InlineLink>
              <InlineLink to="/telegram" aria-label="Telegram">
                <TelegramIcon width="16" height="16" />
              </InlineLink>
            </div>

            {/* Desktop copyright */}
            <div className="hidden lg:block">
              <CopyrightRow />
            </div>
          </div>

          {/* Right side: link groups + language */}
          <div className="w-full md:w-auto">
            <div className="flex flex-col md:flex-row md:items-start gap-10">
              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div>
                  <div className="uppercase tracking-wider text-sm whitespace-nowrap">
                    {t("footer.solana.heading")}
                  </div>
                  <ul className="m-0 px-0 text-base list-none mt-2 [&_a]:text-[#848895] [&_a:hover]:text-white [&_a]:inline-block [&_a]:py-1.5">
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

                <div>
                  <div className="uppercase tracking-wider text-sm whitespace-nowrap">
                    {t("footer.get-connected.heading")}
                  </div>
                  <ul className="m-0 px-0 text-base list-none mt-2 space-y-1.5 [&_a]:text-[#848895] [&_a:hover]:text-white [&_a]:inline-block [&_a]:py-1.5">
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

              {/* Language */}
              <div className="md:self-stretch flex md:justify-end">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile copyright */}
        <div className="text-center lg:hidden">
          <Divider theme="light" axis="x" alpha="0.1" className="my-6" />
          <CopyrightRow />
        </div>
      </div>
    </div>
  );
};

export default Footer;
