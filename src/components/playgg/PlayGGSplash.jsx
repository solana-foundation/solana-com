import { useEffect, useRef } from "react";
import { Trans, useTranslation } from "next-i18next";
import styles from "./PlayGGSplash.module.scss";
import Link, { InlineLink } from "../shared/Link";
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
  const { t } = useTranslation("common");

  const heroVideoRef = useRef();
  const [prefersReducedMotion] = useReducedMotion();
  useEffect(() => {
    prefersReducedMotion && heroVideoRef.current.pause();
  }, [prefersReducedMotion]);

  return (
    <div className="container">
      <div className={styles["playgg-splash"]}>
        <div>
          <div className="d-flex mono">
            <div className="w-75 w-lg-50 d-flex">
              <div className="pe-md-10 w-50">
                <div className="text-uppercase text-nowrap">
                  [{t("playgg.info.title")}]
                </div>
                <div>&ndash;</div>
                <p>{t("playgg.info.description")}</p>
              </div>
              {/* <div className="ps-4 w-50">
                <div className="text-uppercase text-nowrap">
                  [{t("playgg.presentedby.title")}]
                </div>
                <div>&ndash;</div>
                <div className="d-flex align-items-center">
                  <Solana className="me-2 me-md-4" />
                  <p style={{ width: "1px" }} className="m-0">
                    {t("playgg.presentedby.description")}
                  </p>
                </div>
              </div> */}
            </div>
          </div>

          <div className={styles["playgg-splash__wrapper"]}>
            <div className={styles["playgg-splash__date"]}>
              <Jul /> <span className="d-block">18&ndash;19</span>
            </div>
            <Solana className={styles["playgg-splash__solana"]} />
            <div
              className={classNames(
                styles["playgg-splash__date"],
                styles["playgg-splash__date--difference"],
                "d-none d-lg-block",
              )}
            >
              <Jul /> <span className="d-block">18&ndash;19</span>
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

          <div className="d-flex align-items-center">
            <div className="w-50">
              <div className={styles["playgg-splash__sandiego"]}>
                <span>SAN</span>
                <Diego />
              </div>
            </div>
            <div className="w-50">
              {/* <div className={styles["playgg-splash__form"]}>
                <div className={styles["playgg-splash__form__title"]}>
                  {t("playgg.signup.title")}
                </div>
                <PlayGGSignUpForm />
              </div> */}

              <div
                className={classNames(styles["playgg-splash__cta"], "text-end")}
              >
                <div className="text-uppercase text-nowrap smaller">
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
                  <Trans
                    i18nKey="playgg.signup.cta"
                    components={{
                      ctaLink: <Link to="mailto:partnerships@solana.org" />,
                    }}
                  />
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
