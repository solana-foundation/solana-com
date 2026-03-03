import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import useReducedMotion from "../../hooks/useReducedMotion";
import classNames from "classnames";
import Button from "../shared/Button";
import heroTitleImg from "../../../assets/possible/hero/possible-hero-headline_sm.jpg";
import styles from "./PossibleHero.module.scss";
import Image from "next/image";
import VideoPoster from "assets/possible/opos_hype_poster.jpg";
import { VideoTrigger } from "@/component-library/video-modal";

const PossibleHero = () => {
  const t = useTranslations();
  const heroVideoRef = useRef();
  const [prefersReducedMotion] = useReducedMotion();

  useEffect(() => {
    prefersReducedMotion && heroVideoRef.current.pause();
  }, [prefersReducedMotion]);

  return (
    <section className="relative">
      <div className="container-xl pt-12 pb-4 md:pb-20 !px-8 md:!px-12 mx-auto relative">
        <div className="flex flex-wrap items-end gap-10">
          <div className="flex-1">
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
                  "mr-auto mb-12",
                )}
              >
                <source
                  src="https://player.vimeo.com/progressive_redirect/playback/855601988/rendition/1080p/file.mp4?loc=external&signature=646518dcd77468f69a0d2a059843fb573ed4247d36868feb4126cda74b9645a2"
                  type="video/mp4"
                />
              </video>
              <span className="sr-only">{t("possible.hero.title")}</span>
            </h1>
            <p
              className={classNames(
                styles["hero__copy--possible"],
                "block md:hidden mb-8",
              )}
            >
              {t("possible.hero.description")}
            </p>
            <div className="text-center md:text-left">
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
          <div className="flex-1 hidden md:block pl-12 pr-6">
            <VideoModalButton title={t("possible.hero.title")} />
            <p className={classNames(styles["hero__copy--possible"], `mb-0`)}>
              {t("possible.hero.description")}
            </p>
          </div>
        </div>
      </div>
      <div className="block md:hidden">
        <VideoModalButton title={t("possible.hero.title")} />
      </div>
    </section>
  );
};

const VideoModalButton = ({ title }) => {
  return (
    <div
      className={classNames(
        styles["hero__poster--possible"],
        "relative mt-12 md:mt-0 mb-12 md:mb-16",
      )}
    >
      <Image
        className={`poster`}
        src={VideoPoster.src}
        alt={""}
        width={400}
        height={160}
      />
      <VideoTrigger
        platform="vimeo"
        id="859430874"
        title={title}
        bgColorClass="!bg-black/70"
        className={
          "max-md:w-10 max-md:h-10 md:w-12 md:h-12 xl:w-[72px] xl:h-[72px] border-2"
        }
        iconClassName="max-md:!w-4 max-md:!h-4 md:!w-5 md:!h-5 xl:!w-6 xl:!h-6"
        mode="icon-cover"
      />
    </div>
  );
};

export default PossibleHero;
