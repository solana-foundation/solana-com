import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import { useTranslations } from "next-intl";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";

const Direction = {
  LEFT: -1,
  RIGHT: 1,
  NONE: 0,
};

/**
 * Calculates which Arrow(s) to display.
 */
const determineArrowPosition = (
  container: HTMLElement,
  content: HTMLElement,
) => {
  const contentWidth = content.scrollWidth;
  const contentMetrics = content.getBoundingClientRect();
  const contentUIWidth = Math.floor(contentMetrics.width);

  const scrollLeft = container.scrollLeft;
  const maxScroll = contentUIWidth + scrollLeft >= contentWidth;

  if (scrollLeft === 0) {
    return "right";
  }

  if (maxScroll) {
    return "left";
  }

  if (!maxScroll) {
    return "both";
  }

  return "none";
};

/**
 * Regional Tracks, Prizes & seed Funding.
 */
const CarouselCards = ({ children }: { children?: React.ReactNode }) => {
  const timerIdRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dataPos, setDataPos] = useState("none");
  const [scroll, setScroll] = useState(Direction.NONE);

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== "undefined" && wrapperRef.current) {
      const wrapper = wrapperRef.current;
      const onScroll = () => {
        window.requestAnimationFrame(() =>
          setDataPos(
            determineArrowPosition(wrapperRef.current!, contentRef.current!),
          ),
        );
      };

      wrapper.addEventListener("scroll", onScroll);
      return () => wrapper.removeEventListener("scroll", onScroll);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && wrapperRef.current) {
      setDataPos(
        determineArrowPosition(wrapperRef.current, contentRef.current!),
      );
    }
  }, []);

  const stopScroll = useCallback(() => {
    setScroll(Direction.NONE);
  }, []);

  const scrollToLeft = useCallback(() => {
    if (!wrapperRef.current) return;
    const currentPos = wrapperRef.current.scrollLeft;
    let nextPos = currentPos - 264;
    if (nextPos < 0) {
      nextPos = 0;
      stopScroll();
    }
    wrapperRef.current.scrollTo({ top: 0, left: nextPos, behavior: "smooth" });
  }, [stopScroll]);

  const scrollToRight = useCallback(() => {
    if (!wrapperRef.current) return;
    const maxScrollLeft =
      wrapperRef.current.scrollWidth - wrapperRef.current.clientWidth;
    const currentPos = wrapperRef.current.scrollLeft;
    let nextPos = currentPos + 264;
    if (nextPos > maxScrollLeft) {
      nextPos = maxScrollLeft;
      stopScroll();
    }
    wrapperRef.current.scrollTo({ top: 0, left: nextPos, behavior: "smooth" });
  }, [stopScroll]);

  const handleScroll = useCallback(
    (direction: number) => {
      if (direction === Direction.LEFT) scrollToLeft();
      if (direction === Direction.RIGHT) scrollToRight();
    },
    [scrollToLeft, scrollToRight],
  );

  useEffect(() => {
    if (scroll !== 0 && !timerIdRef?.current) {
      timerIdRef.current = setInterval(() => handleScroll(scroll), 80);
    } else {
      timerIdRef.current = undefined;
      clearTimeout(timerIdRef?.current);
    }
    return () => {
      clearTimeout(timerIdRef?.current);
    };
  }, [handleScroll, scroll]);

  const onLeftBtnMouseDown = useCallback(() => setScroll(Direction.LEFT), []);
  const onRightBtnMouseDown = useCallback(() => setScroll(Direction.RIGHT), []);

  const onTouchStartHandle = useCallback(
    (direction: number) => {
      handleScroll(direction);
    },
    [handleScroll],
  );

  const onLeftBtnTouchStart = useCallback(() => {
    onTouchStartHandle(Direction.LEFT);
    setScroll(Direction.LEFT);
  }, [onTouchStartHandle]);

  const onRightBtnTouchStart = useCallback(() => {
    onTouchStartHandle(Direction.RIGHT);
    setScroll(Direction.RIGHT);
  }, [onTouchStartHandle]);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      stopScroll();
    },
    [stopScroll],
  );

  const onLeftBtnClick = useCallback(() => scrollToLeft(), [scrollToLeft]);
  const onRightBtnClick = useCallback(() => scrollToRight(), [scrollToRight]);

  const showLeft = dataPos === "both" || dataPos === "left";
  const showRight = dataPos === "both" || dataPos === "right";

  const t = useTranslations();

  return (
    <div className="py-2 relative px-0 [&_.bg-track-card]:min-w-[255px] [&_.bg-track-card]:mr-5 [&_.bg-track-card:first-of-type]:ml-5 [&_.horizontal-bumper]:min-w-px">
      {/* Carousel inner */}
      <div
        ref={wrapperRef}
        className="carousel-cards overflow-auto scrollbar-hidden"
      >
        <div
          className="flex flex-nowrap gap-x-6 mx-0 [&>div]:max-w-[15rem] [&>div]:min-w-[15rem] sm:[&>div]:max-w-[20rem] sm:[&>div]:min-w-[20rem]"
          ref={contentRef}
        >
          {children}
        </div>
      </div>

      {/* Left overlay */}
      <button
        className={`absolute top-0 bottom-0 left-[-20px] z-[100] transition-opacity justify-center items-center btn btn-link text-white bg-gradient-to-l from-transparent to-black border-none ${showLeft ? "flex" : "!hidden"}`}
        aria-label={t("developers.nav.prev")}
        onMouseDown={onLeftBtnMouseDown}
        onMouseUp={stopScroll}
        onMouseLeave={stopScroll}
        onTouchStart={onLeftBtnTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onLeftBtnClick}
      >
        <ArrowLeft />
      </button>

      {/* Right overlay */}
      <button
        className={`absolute top-0 bottom-0 right-[-20px] z-[100] transition-opacity justify-center items-center btn btn-link text-white bg-gradient-to-r from-transparent to-black border-none ${showRight ? "flex" : "!hidden"}`}
        aria-label={t("developers.nav.next")}
        onMouseDown={onRightBtnMouseDown}
        onMouseUp={stopScroll}
        onMouseLeave={stopScroll}
        onTouchStart={onRightBtnTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onRightBtnClick}
      >
        <ArrowRight />
      </button>
    </div>
  );
};

export default CarouselCards;
