import { useEffect, useState, useRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { Trans } from "next-i18next";
import { useInView } from "react-intersection-observer";
import classNames from "classnames";

import CaretIcon from "@/components/icons/Caret";
import { AnimatedText } from "@/components/shared/Text";

import styles from "./CardsSlider.module.scss";

interface CarouselProps {
  items: Element[] | ReactNode[];
  titleKey?: string;
  initialScroll?: number;
  id?: string;
  className?: string;
  carouselClassName?: string;
  cardsClassName?: string;
  cardWrapperClassName?: string;
}

const CardsSlider = ({
  items,
  titleKey,
  initialScroll = 0,
  id = "",
  className = "",
  carouselClassName = "",
  cardsClassName = "",
  cardWrapperClassName = "",
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -304, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 304, behavior: "smooth" });
    }
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div ref={ref} id={id} className={className}>
      {titleKey && (
        <AnimatedText element="h2" as="heading" className={styles.Title}>
          <Trans i18nKey={titleKey} />
        </AnimatedText>
      )}

      <div className={styles.Carousel}>
        <div
          className={classNames(styles.CarouselContainer, carouselClassName)}
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className={classNames(styles.Cards, cardsClassName)}>
            {items.map((item: any, index: number) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={
                  inView
                    ? {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          delay: 0.2 * index,
                          ease: "easeOut",
                          once: true,
                        },
                      }
                    : {}
                }
                key={"card" + index}
                className={classNames(styles.CardWrapper, cardWrapperClassName)}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.Arrows}>
          <button onClick={scrollLeft} disabled={!canScrollLeft}>
            <CaretIcon direction="left" />
          </button>
          <button onClick={scrollRight} disabled={!canScrollRight}>
            <CaretIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardsSlider;
