import { useRef, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import useReducedMotion from "../../hooks/useReducedMotion";
import classNames from "classnames";
import Button from "../shared/Button";
import heroTitleImg from "../../../assets/possible/hero/possible-hero-headline_sm.jpg";
import styles from "./PossibleHero.module.scss";
import VideoModal from "../shared/VideoModal";
import Image from "next/image";
import VideoPoster from "assets/possible/opos_hype_poster.jpg";
import PlayButton from "assets/possible/play_btn.png";

const PossibleHero = () => {
  const { t } = useTranslation();
  const heroVideoRef = useRef();
  const [prefersReducedMotion] = useReducedMotion();
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    prefersReducedMotion && heroVideoRef.current.pause();
  }, [prefersReducedMotion]);

  return (
    <section className="position-relative">
      <div className="container-xl pt-8 pb-4 pb-md-10 px-6 px-md-8 mx-auto position-relative">
        <div className={`row d-flex align-items-end`}>
          <div className="col">
            <h1 className="mb-0">
              <video
                loop
                muted
                playsInline
                autoPlay
                poster={heroTitleImg.src}
                ref={heroVideoRef}
                className={classNames(
                  styles["hero__title-image--possible"],
                  `me-auto mb-8`,
                )}
              >
                <source
                  src="https://player.vimeo.com/progressive_redirect/playback/855601988/rendition/1080p/file.mp4?loc=external&signature=646518dcd77468f69a0d2a059843fb573ed4247d36868feb4126cda74b9645a2"
                  type="video/mp4"
                />
              </video>
              <span className="visually-hidden">
                {t("possible.hero.title")}
              </span>
            </h1>
            <p
              className={classNames(
                styles["hero__copy--possible"],
                `d-block d-md-none mb-6`,
              )}
            >
              {t("possible.hero.description")}
            </p>
            <div className={`text-center text-md-start`}>
              <Button
                to="/developers"
                variant="secondary"
                size={"large"}
                className="mt-4 mx-2"
              >
                {t("possible.hero.cta-primary")}
              </Button>
            </div>
          </div>
          <div className="col d-none d-md-block ps-8 pe-5">
            <VideoModalButton setShowVideoModal={setShowVideoModal} />
            <p className={classNames(styles["hero__copy--possible"], `mb-0`)}>
              {t("possible.hero.description")}
            </p>
          </div>
        </div>
      </div>
      <div className={`d-block d-md-none`}>
        <VideoModalButton setShowVideoModal={setShowVideoModal} />
      </div>
      <VideoModal
        type={"vimeo"}
        urlId="859430874"
        showVideoModal={showVideoModal}
        setShowVideoModal={setShowVideoModal}
        autoplay={true}
      />
    </section>
  );
};

const VideoModalButton = ({ setShowVideoModal }) => {
  return (
    <button
      onClick={() => setShowVideoModal(true)}
      className={classNames(
        styles["hero__poster--possible"],
        "position-relative mt-8 mt-md-0 mb-8 mb-md-9",
      )}
    >
      <Image
        className={`poster`}
        src={VideoPoster.src}
        alt={""}
        width={400}
        height={160}
      />
      <Image
        className={`position-absolute top-50 start-50 translate-middle play-button`}
        src={PlayButton.src}
        alt={""}
        width={74}
        height={74}
      />
    </button>
  );
};

export default PossibleHero;
