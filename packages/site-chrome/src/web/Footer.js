"use client";

import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
// Replace SCSS styles with Tailwind utilities on container markup
import LanguageSelector from "@@/src/components/LanguageSelector";
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
    <span className={styles["solFooter__copyright"]}>
      {t("footer.copyright", { currentYear: new Date().getFullYear() })}
    </span>
  );
};

const Footer = ({ className = "" }) => {
  const t = useTranslations();
  return (
    <div
      className={twMerge(
        "mt-20 py-20 text-white relative z-[1010] border border-[#141414] rounded-t-[12px]",
        "bg-[#000508]",
        // fallback gradient equivalent to the SCSS
        "[background-image:radial-gradient(farthest-corner_at_bottom_right,#3a233f,transparent_250px)]",
        "md:[background-image:radial-gradient(farthest-side_at_bottom_left,#271d3b,transparent_900px),radial-gradient(farthest-corner_at_bottom_right,#3a233f,transparent_1000px)]",
        className || "",
      )}
    >
      <div className="container">
        <div className="d-md-flex justify-content-md-between">
          <div className="d-flex flex-column align-items-center align-items-md-start">
            <p className="m-0 leading-[1] font-['DSemi']">{t("footer.foundation")}</p>
            <div className="mt-[10px] mb-[20px]">
              <Link to="/" aria-label="Solana Foundation">
                <SolanaFoundationLogo width={210} />
              </Link>
            </div>
            <div className="mb-5 [&_a]:inline-flex [&_a]:p-[5px] [&_a]:rounded-full [&_a]:bg-[#848895] [&_a:hover]:bg-white [&_a:not(:last-child)]:mr-[10px] [&_a_svg]:fill-[#111]">
              <InlineLink to="/youtube" aria-label="YouTube"><YoutubeIcon width="16" height="16" /></InlineLink>
              <InlineLink to="/twitter" aria-label="Twitter"><TwitterIcon width="16" height="16" /></InlineLink>
              <InlineLink to="/discord" aria-label="Discord"><DiscordIcon width="16" height="16" /></InlineLink>
              <InlineLink to="/reddit" aria-label="Reddit"><RedditIcon width="16" height="16" /></InlineLink>
              <InlineLink to="/github" aria-label="GitHub"><GithubIcon width="16" height="16" /></InlineLink>
              <InlineLink to="/telegram" aria-label="Telegram"><TelegramIcon width="16" height="16" /></InlineLink>
            </div>
            <div className="d-none d-lg-block">
              <CopyrightRow />
            </div>
          </div>
          <div>
            <div className="row my-6 my-md-0">
              <div className="col pe-lg-8">
                <div className="h6 smaller uppercase whitespace-nowrap">{t("footer.solana.heading")}</div>
                <ul className="list-unstyled m-0">
                  <li><InlineLink to="https://solana.org/grants">{t("footer.solana.grants")}</InlineLink></li>
                  <li><InlineLink to="https://break.solana.com/">{t("footer.solana.break")}</InlineLink></li>
                  <li><Link to="/branding">{t("footer.solana.media")}</Link></li>
                  <li><InlineLink to="https://jobs.solana.com/">{t("footer.solana.careers")}</InlineLink></li>
                  <li><Link to="/tos">{t("footer.solana.disclaimer")}</Link></li>
                  <li><Link to="/privacy-policy">{t("footer.solana.privacy-policy")}</Link></li>
                </ul>
              </div>
              <div className="col">
                <div className="row flex-md-nowrap h-100 flex-column flex-md-row">
                  <div className="col pe-lg-8">
                    <div className="h6 smaller uppercase whitespace-nowrap">{t("footer.get-connected.heading")}</div>
                    <ul className="list-unstyled m-0">
                      <li><Link to="/news">{t("footer.get-connected.blog")}</Link></li>
                      <li><Link to="/newsletter">{t("footer.get-connected.newsletter")}</Link></li>
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

export default Footer;
