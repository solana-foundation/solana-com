import { useState, useRef } from "react";
import { Trans, useTranslation } from "next-i18next";
import Image from "next/image";
import classNames from "classnames";
import styles from "./PossibleVisionaries.module.scss";
import VideoModal from "../shared/VideoModal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Dropdown from "react-bootstrap/Dropdown";
import { ChevronDown } from "react-feather";
import PossibleGlow from "./PossibleGlow";
import PlayButton from "assets/possible/visionaries/play-button.png";
import { PossibleVisionariesData } from "./PossibleVisionariesData";

const PossibleVisionaries = () => {
  const { t } = useTranslation("common");
  const sliderRef = useRef(null);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoId, setVideoId] = useState(0);

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
        `pt-10 pb-6 pt-md-10 pb-md-10 position-relative`,
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
      <div className="container-fluid container-xl position-relative mx-auto d-block px-lg-8">
        <div className={`row`}>
          <div className="col-12 col-md-5 d-flex flex-row d-md-block mb-8 mb-md-0 ps-lg-0 align-items-center">
            <h2 className="h2 pe-5 flex-grow-1 flex-shrink-1 mb-0">
              <Trans
                i18nKey="possible.visionaries.title"
                components={{
                  italic: <em className="fst-italic" />,
                }}
              />
            </h2>
          </div>
          <div className={`col-12 col-md-7 px-0 mb-6 mb-md-0`}>
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
          "container-fluid p-0 mb-6 mb-md-0 mx-auto d-block",
          styles["visionaries-videoContainer--possible"],
        )}
      >
        <div className={`row`}>
          <div className={`col`}>
            <Slider {...settings} ref={sliderRef}>
              {data.map((item, index) => (
                <div key={index} className={`container-fluid`}>
                  <div className={`row d-md-flex flex-md-row-reverse pb-8`}>
                    <div className={`col-12 col-md-6 px-0 mb-9 mb-md-0`}>
                      <VideoModalButton
                        setVideoId={setVideoId}
                        setShowVideoModal={setShowVideoModal}
                        poster={item.poster}
                        index={index}
                        title={item.title}
                        watchText={t("possible.visionaries.watch")}
                      />
                    </div>
                    <div className={`col-12 col-md-6 px-8 pe-lg-12`}>
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
                                "mb-5 me-1 mt-md-3 d-inline-block w-auto h-100",
                                styles[
                                  `visionaries-speakerThumbnail--possible`
                                ],
                              )}
                            />
                          );
                        })}
                      </div>
                      <h2 className="h6 fw-normal mb-6 mb-md-7">
                        {item.title}
                      </h2>
                      <p className="mb-5 copy text-white">{item.description}</p>
                      <button
                        onClick={() => {
                          setVideoId(index);
                          setShowVideoModal(true);
                        }}
                        className="copy text-white text-uppercase fw-normal d-flex align-items-center"
                      >
                        <Image
                          src={PlayButton.src}
                          alt={""}
                          width={30}
                          height={30}
                          className={`d-inline-block me-2`}
                        />
                        {t("possible.visionaries.watch")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
      <VideoModal
        type={"vimeo"}
        urlId={data[videoId].vimeoId}
        showVideoModal={showVideoModal}
        setShowVideoModal={setShowVideoModal}
        autoplay={true}
      />
    </section>
  );
};

const PossibleEpisodeSelection = ({
  sliderRef,
  episodeData,
  currentEpisode,
}) => {
  const { t } = useTranslation("common");
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
      <div className="row">
        <div className="col d-flex flex-column flex-md-row pe-lg-0">
          <div
            className={classNames(
              "w-100 d-flex flex-row flex-nowrap overflow-scroll me-2",
              styles[`visionaries-episodeSelectionContainer--possible`],
            )}
            ref={containerRef}
          >
            {episodeData.map((item, index) => (
              <button
                key={index}
                className={classNames(
                  "btn btn-lg text-uppercase flex-grow-0",
                  styles[`visionaries-episodeSelectionBtn--possible`],
                  currentEpisode === index && "active",
                )}
                onClick={() => selectEpisode(index)}
              >
                <Trans
                  i18nKey={item.name}
                  components={{
                    lowercase: <span className="text-lowercase" />,
                  }}
                />
              </button>
            ))}
          </div>
          <Dropdown>
            <Dropdown.Toggle
              variant="success"
              className={classNames(
                "btn btn-lg text-uppercase w-100 w-md-auto",
                styles[`visionaries-episodeSelectionBtn--possible`],
              )}
            >
              {t("possible.visionaries.seeAll")}
              <span className="d-inline-block position-relative me-n3 ms-1">
                <ChevronDown />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className={`pb-0`}>
              {episodeData.map((item, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => selectEpisode(index)}
                  className={classNames(
                    currentEpisode === index && "active",
                    styles[`visionaries-episodeDropdownBtn--possible`],
                  )}
                >
                  <Trans
                    i18nKey={item.name}
                    components={{
                      lowercase: <span className="text-lowercase" />,
                    }}
                  />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

const VideoModalButton = ({
  setVideoId,
  setShowVideoModal,
  poster,
  index,
  title,
  watchText,
}) => {
  return (
    <button
      onClick={() => {
        setVideoId(index);
        setShowVideoModal(true);
      }}
      className={`position-relative d-block mx-auto w-100 h-auto`}
    >
      <Image
        className={`video-thumbnail poster w-100 h-auto`}
        src={poster}
        alt={""}
        width={400}
        height={160}
      />
      <Image
        className={`position-absolute top-50 start-50 translate-middle play-button `}
        src={PlayButton.src}
        alt={`${watchText} ${title}`}
        width={74}
        height={74}
      />
    </button>
  );
};

export default PossibleVisionaries;
