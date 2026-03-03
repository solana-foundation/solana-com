import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import classNames from "classnames";
import styles from "./PossibleVisionaries.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "react-feather";
import PossibleGlow from "./PossibleGlow";
import PlayButton from "assets/possible/visionaries/play-button.png";
import { PossibleVisionariesData } from "./PossibleVisionariesData";
import { VideoTrigger } from "@/component-library/video-modal";

const PossibleVisionaries = () => {
  const t = useTranslations();
  const sliderRef = useRef(null);
  const [currentEpisode, setCurrentEpisode] = useState(0);

  const handleAfterChange = (current) => {
    setCurrentEpisode(current);
  };

  const settings = {
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    afterChange: handleAfterChange,
  };

  const data = PossibleVisionariesData();

  return (
    <section
      className={classNames(
        "pt-20 pb-8 md:pt-20 md:pb-20 relative",
        styles[`possible-visionaries`],
      )}
    >
      <PossibleGlow
        backgroundColor="#2e00e6"
        top="85%"
        left="65%"
        height="420px"
        width="850px"
        rotation="100deg"
      />
      <div className="container-fluid container-xl relative mx-auto block lg:px-12">
        <div className="grid grid-cols-12 gap-x-5 md:gap-x-10">
          <div className="col-span-12 md:col-span-5 flex flex-row md:block mb-12 md:mb-0 items-center">
            <h2 className="h2 pr-6 grow shrink mb-0">
              {t.rich("possible.visionaries.title", {
                italic: (chunks) => <em>{chunks}</em>,
              })}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 px-0 mb-8 md:mb-0 -mx-5 md:mx-0">
            <PossibleEpisodeSelection
              sliderRef={sliderRef}
              episodeData={data}
              currentEpisode={currentEpisode}
            />
          </div>
        </div>
      </div>
      <div
        className={classNames(
          "container-fluid p-0 mb-8 md:mb-0 mx-auto block",
          styles["visionaries-videoContainer--possible"],
        )}
      >
        <div className="grid grid-cols-12 gap-5 md:gap-10 -mx-5 md:mx-0">
          <div className="col-span-12">
            <Slider {...settings} ref={sliderRef}>
              {data.map((item, index) => (
                <div key={index}>
                  <div className="flex flex-wrap md:flex-nowrap md:flex-row-reverse pb-12">
                    <div className="w-full md:w-1/2 px-0 mb-16 md:mb-0">
                      <VideoModalButton
                        poster={item.poster}
                        index={index}
                        title={item.title}
                        watchText={t("possible.visionaries.watch")}
                      />
                    </div>
                    <div className="w-full md:w-1/2 px-12 lg:pr-32">
                      <div>
                        {item.speakers.map((speaker, index) => {
                          return (
                            <Image
                              key={index}
                              height={50}
                              width={50}
                              src={speaker.image}
                              alt={speaker.name}
                              className={classNames(
                                "mb-6 mr-1 md:mt-3 !inline-block w-auto h-full",
                                styles[
                                  `visionaries-speakerThumbnail--possible`
                                ],
                              )}
                            />
                          );
                        })}
                      </div>
                      <h2 className="h6 font-normal mb-8 md:mb-10">
                        {item.title}
                      </h2>
                      <p className="mb-6 copy text-white">{item.description}</p>
                      <VideoTrigger
                        platform="vimeo"
                        id={index}
                        title={item.title}
                        className="copy text-white uppercase font-normal flex items-center"
                        mode="button"
                      >
                        <Image
                          src={PlayButton.src}
                          alt={""}
                          width={30}
                          height={30}
                          className="inline-block mr-2"
                        />
                        {t("possible.visionaries.watch")}
                      </VideoTrigger>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

const PossibleEpisodeSelection = ({
  sliderRef,
  episodeData,
  currentEpisode,
}) => {
  const t = useTranslations();
  const containerRef = useRef(null);

  const selectEpisode = (index) => {
    sliderRef.current.slickGoTo(index);
    scrollToButton(index);
  };

  const scrollToButton = (index) => {
    const containerLeft = containerRef.current.offsetLeft;
    const buttonLeft = containerRef.current.children[index].offsetLeft;
    const scrollPosition = buttonLeft - containerLeft;

    containerRef.current.scroll({ left: scrollPosition, behavior: "smooth" });
  };

  return (
    <div className="container-fluid">
      <div className="flex flex-col md:flex-row md:-mr-5">
        <div
          className={classNames(
            "md:w-full flex flex-row flex-nowrap overflow-scroll -ml-5 -mr-5 md:mr-2 md:ml-0 px-5 md:px-0",
            styles[`visionaries-episodeSelectionContainer--possible`],
          )}
          ref={containerRef}
        >
          {episodeData.map((item, index) => (
            <button
              key={index}
              className={classNames(
                "uppercase grow-0",
                styles[`visionaries-episodeSelectionBtn--possible`],
                currentEpisode === index && "active",
              )}
              onClick={() => selectEpisode(index)}
            >
              {item.name === "DRiP" ? (
                <>
                  DR<span className="lowercase">I</span>P
                </>
              ) : (
                item.name
              )}
            </button>
          ))}
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={classNames(
                "uppercase whitespace-nowrap !mr-0",
                styles[`visionaries-episodeSelectionBtn--possible`],
              )}
            >
              {t("possible.visionaries.seeAll")}
              <span className="inline-block relative -mr-3 ml-1">
                <ChevronDown />
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="pb-0 z-10">
            {episodeData.map((item, index) => (
              <DropdownMenu.Item
                key={index}
                onSelect={() => selectEpisode(index)}
                className={classNames(
                  currentEpisode === index && "active",
                  styles[`visionaries-episodeDropdownBtn--possible`],
                )}
              >
                {item.name === "DRiP" ? (
                  <>
                    DR<span className="lowercase">I</span>P
                  </>
                ) : (
                  item.name
                )}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

const VideoModalButton = ({ poster, index, title }) => {
  return (
    <div className="relative block mx-auto w-full h-auto">
      <Image
        className="video-thumbnail poster w-full h-auto"
        src={poster}
        alt={""}
        width={400}
        height={160}
      />
      <VideoTrigger
        platform="vimeo"
        id={index}
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

export default PossibleVisionaries;
