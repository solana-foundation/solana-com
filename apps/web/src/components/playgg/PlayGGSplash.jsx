import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import styles from "./PlayGGSplash.module.scss";
import Link, { InlineLink } from "@/utils/Link";
import useReducedMotion from "../../hooks/useReducedMotion";
import classNames from "classnames";
import Solana from "../../../assets/playgg/solana.inline.svg";
import MagicEdenLogo from "../../../assets/playgg/magiceden.inline.svg";
import Play from "../../../assets/playgg/play.inline.svg";
import GG from "../../../assets/playgg/gg.inline.svg";
import Jul from "../../../assets/playgg/jul.inline.svg";
import Diego from "../../../assets/playgg/diego.inline.svg";
import PlayGGPoster from "../../../assets/playgg/poster.jpg";
// import PlayGGSignUpForm from "./PlayGGSignUpForm";
import RSVP from "./RSVP";

const PlayGGSplash = () => {
  const t = useTranslations();

  const heroVideoRef = useRef();
  const [prefersReducedMotion] = useReducedMotion();
  useEffect(() => {
    prefersReducedMotion && heroVideoRef.current.pause();
  }, [prefersReducedMotion]);

  return (
    <div className="container">
      <div className={styles["playgg-splash"]}>
        <div>
          <div className="flex mono">
            <div className="w-3/4 lg:w-1/2 flex">
              <div className="md:pr-20 w-1/2">
                <div className="uppercase whitespace-nowrap">
                  [{t("playgg.info.title")}]
                </div>
                <div>&ndash;</div>
                <p>{t("playgg.info.description")}</p>
              </div>
            </div>
          </div>

          <div className={styles["playgg-splash__wrapper"]}>
            <div className={styles["playgg-splash__date"]}>
              <Jul /> <span className="block">18&ndash;19</span>
            </div>
            <Solana className={styles["playgg-splash__solana"]} />
            <div
              className={classNames(
                styles["playgg-splash__date"],
                styles["playgg-splash__date--difference"],
                "hidden lg:block",
              )}
            >
              <Jul /> <span className="block">18&ndash;19</span>
            </div>
            <div className={styles["playgg-splash__text"]}>
              <Play className={styles["playgg-splash__text__play"]} />
              <GG className={styles["playgg-splash__text__gg"]} />
            </div>
            <div
              className={classNames(
                styles["playgg-splash__text"],
                styles["playgg-splash__text--difference"],
              )}
            >
              <Play className={styles["playgg-splash__text__play"]} />
              <GG className={styles["playgg-splash__text__gg"]} />
            </div>
            <div className={styles["playgg-splash__mask"]}>
              <video
                loop
                muted
                playsInline
                autoPlay
                poster={PlayGGPoster.src}
                ref={heroVideoRef}
              >
                <source
                  src="https://player.vimeo.com/progressive_redirect/playback/808615327/rendition/720p/file.mp4?loc=external&signature=5fb7f89be6b1b054b61305946920cba8e37a206bd6c59310dc09da87e9aab832"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-1/2">
              <div className={styles["playgg-splash__sandiego"]}>
                <span>SAN</span>
                <Diego />
              </div>
            </div>
            <div className="w-1/2">
              {/* <div className={styles["playgg-splash__form"]}>
                <div className={styles["playgg-splash__form__title"]}>
                  {t("playgg.signup.title")}
                </div>
                <PlayGGSignUpForm />
              </div> */}

              <div
                className={classNames(styles["playgg-splash__cta"], "text-end")}
              >
                <div className="uppercase whitespace-nowrap smaller">
                  [{t("playgg.presentedby.title")}]
                </div>
                <div>&ndash;</div>
                <div className="my-2">
                  <InlineLink to="https://magiceden.io/">
                    <MagicEdenLogo />
                  </InlineLink>
                </div>
                <br />
                <RSVP />
                <div className="mono mt-2">
                  {t.rich("playgg.signup.cta", {
                    ctaLink: (chunks) => (
                      <Link to="mailto:partnerships@solana.org">{chunks}</Link>
                    ),
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayGGSplash;
