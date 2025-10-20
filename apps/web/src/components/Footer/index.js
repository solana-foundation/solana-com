"use client";

import React from "react";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import styles from "./Footer.module.scss";
import LanguageSelector from "../LanguageSelector";
import SolanaFoundationLogo from "../../../public/src/img/logos-solana/logotype-foundation.inline.svg";
import YoutubeIcon from "../../../public/src/img/footer/youtube.inline.svg";
import TwitterIcon from "../../../public/src/img/footer/twitter.inline.svg";
import DiscordIcon from "../../../public/src/img/footer/discord.inline.svg";
import RedditIcon from "../../../public/src/img/footer/reddit.inline.svg";
import GithubIcon from "../../../public/src/img/footer/github.inline.svg";
import TelegramIcon from "../../../public/src/img/footer/telegram.inline.svg";
import Link, { InlineLink } from "../../utils/Link";

const CopyrightRow = () => {
  const t = useTranslations();
  const text = t("footer.copyright", {
    currentYear: new Date().getFullYear(),
  });
  const textNodes = React.useMemo(
    () =>
      text.split(/(\.)/).map((part, idx) =>
        part === "." ? (
          <React.Fragment key={idx}>
            .<br />
          </React.Fragment>
        ) : (
          part
        ),
      ),
    [text],
  );

  return <span className={styles["solFooter__copyright"]}>{textNodes}</span>;
};

const Footer = ({ className = "" }) => {
  const t = useTranslations();

  return (
    <div className={classNames(styles["solFooter"], className)}>
      <div className="w-full max-w-[1440px] px-[20px] md:px-[32px] xl:px-[72px] pt-[56px] xl:pt-[88px] pb-[136px] md:pb-[164px] xl:pb-[320px] mx-auto bg-[url('/src/img/footer/solana-bg.svg')]  bg-[length:100%_auto] bg-bottom md:bg-[position:center_120%] xl:bg-bottom bg-no-repeat">
        <div className="relative grid grid-cols-2 xl:grid-cols-6 gap-[30px]">
          <div className="flex flex-col col-span-2 md:col-span-1 xl:col-span-3">
            <p className={styles["solFooter__foundation"]}>
              {t("footer.foundation")}
            </p>
            <div className={styles["solFooter__foundation-logo"]}>
              <Link to="/" aria-label="Solana Foundation">
                <SolanaFoundationLogo
                  width={234}
                  height={40}
                  viewBox="0 0 210px 35px"
                />
              </Link>
            </div>
            <div className={styles["solFooter__copy"]}>
              <CopyrightRow />
            </div>
            <div className={styles["solFooter__social"]}>
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
            <div className={styles["solFooter__heading"]}>
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
              <div className={styles["solFooter__heading"]}>
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

export default Footer;
