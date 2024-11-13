"use client";

import { useRef, ReactNode, useEffect, useState } from "react";
import Lottie from "react-lottie";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Text from "@/components/shared/Text";
import CaretIcon from "@/components/icons/Caret";

import styles from "./LottieCarousel.module.scss";

interface LottieCarouselProps {
  itemsMobile: ReactNode[];
  itemsDesktop?: ReactNode[];
  itemsStateMobile?: any[];
  itemsStateDesktop?: any[];
  setItemsStateMobile?: (_state: any) => void;
  setItemsStateDesktop?: (_state: any) => void;
}

const LottieCarousel = ({
  itemsMobile,
  itemsDesktop,
  itemsStateMobile,
  itemsStateDesktop,
  setItemsStateMobile,
  setItemsStateDesktop,
}: LottieCarouselProps) => {
  const sliderMobileRef = useRef(null);
  const sliderDesktopRef = useRef(null);

  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    if (window.innerWidth < 992) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  const onBeforeChange = (current: number, next: number) => {
    if (isMobile) {
      let stateMobileCopy = new Array(itemsStateMobile.length).fill(true);
      stateMobileCopy[next] = false;
      setItemsStateMobile(stateMobileCopy);
    }
  };

  const onAfterChange = () => {
    if (!isMobile) {
      const slick = document.querySelector(
        `.${styles.LottieCarouselSection} .d-none.d-md-block .slick-list`,
      );
      const currentSlide =
        sliderDesktopRef.current.innerSlider.state.currentSlide;
      const stateDesktopCopy = new Array(itemsStateDesktop.length).fill(true);
      stateDesktopCopy[currentSlide === 2 ? 0 : currentSlide + 1] = false;
      setItemsStateDesktop(stateDesktopCopy);

      const slides = slick.querySelectorAll(".slick-slide");
      const slidesActive = slick.querySelectorAll(".slick-slide.slick-active");

      for (let i = 0; i < slides.length; i++) {
        const carouselItem = slides[i].querySelector(
          `.${styles.LottieCarouselItem}`,
        );
        carouselItem.classList.remove(`${styles.ActiveSlide}`);
      }

      for (let i = 0; i < slidesActive.length; i++) {
        const carouselItem = slidesActive[i].querySelector(
          `.${styles.LottieCarouselItem}`,
        );
        if (i === slidesActive.length - 1) {
          carouselItem.classList.add(`${styles.ActiveSlide}`);
        } else {
          carouselItem.classList.remove(`${styles.ActiveSlide}`);
        }
      }
    }
  };

  const handlePrev = () => {
    sliderMobileRef.current.slickPrev();
    sliderDesktopRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderMobileRef.current.slickNext();
    sliderDesktopRef.current.slickNext();
  };

  const settings = {
    // Show 3 slides at a time
    dots: false,
    autoplay: false,
    arrows: false,
    infinite: true,
    beforeChange: onBeforeChange,
    afterChange: onAfterChange,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    responsive: [
      {
        // On mobile, show 1 slide at a time
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  useEffect(() => {
    if (!isMobile) {
      const slick = document.querySelector(
        `.${styles.LottieCarouselSection} .d-none.d-md-block .slick-list`,
      );

      const slidesActive = slick.querySelectorAll(".slick-slide.slick-active");

      for (let i = 0; i < slidesActive.length; i++) {
        const carouselItem = slidesActive[i].querySelector(
          `.${styles.LottieCarouselItem}`,
        );
        if (i === slidesActive.length - 1) {
          carouselItem.classList.add(`${styles.ActiveSlide}`);
        } else {
          carouselItem.classList.remove(`${styles.ActiveSlide}`);
        }
      }
    }
  }, [isMobile]);

  return (
    <div className={styles.LottieCarouselSection}>
      <div className="d-md-none">
        <Slider {...settings} ref={sliderMobileRef}>
          {itemsMobile.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </Slider>
      </div>

      <div className="d-none d-md-block page-width">
        <Slider {...settings} ref={sliderDesktopRef}>
          {itemsDesktop.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </Slider>
      </div>

      <div className={styles.Arrows}>
        <button onClick={handlePrev}>
          <CaretIcon direction="left" />
        </button>
        <button onClick={handleNext}>
          <CaretIcon />
        </button>
      </div>
    </div>
  );
};

interface LottieCarouselItemProps {
  lottie: any;
  text: string | ReactNode;
  isLottiePaused: boolean;
}

export const LottieCarouselItem = ({
  lottie,
  text,
  isLottiePaused,
}: LottieCarouselItemProps) => {
  return (
    <div className={styles.LottieCarouselItem}>
      <div className={styles.LottieWrapper}>
        <Lottie
          options={{
            animationData: lottie,
            loop: true,
            rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
          }}
          isClickToPauseDisabled={true}
          isPaused={isLottiePaused}
        />
      </div>
      <Text element="p" as="paragraph">
        {text}
      </Text>
    </div>
  );
};

export default LottieCarousel;
