/**
 * Carousel component for cycling through children with optional inline or external controls.
 * Now includes touch/swipe support for mobile and drag support for desktop.
 *
 * @component
 * @template CarouselHandle
 *
 * @param {Object} props
 * @param {React.ReactNode[]} props.children - The slides to display in the carousel.
 * @param {boolean} [props.controlsInline=true] - Whether to show controls inside the carousel.
 * @param {string} [props.className] - Additional class names for the carousel container.
 * @param {React.Ref<CarouselHandle>} [ref] - Ref for imperative carousel controls.
 * @param {number} [props.panels=1] - Number of items to show at once.
 * @param {number} [props.autoPlay=0] - Autoplay interval in milliseconds.
 * @param {boolean} [props.enableSwipe=true] - Whether to enable swipe/drag functionality.
 * @param {number} [props.swipeThreshold=50] - Minimum distance in pixels to trigger a swipe.
 *
 * @example
 * // Inline controls (default)
 * <Carousel>
 *   {[<div>Slide 1</div>, <div>Slide 2</div>, <div>Slide 3</div>]}
 * </Carousel>
 *
 * @example
 * // External controls
 * const carouselRef = useRef<CarouselHandle>(null);
 * <div>
 *   <Carousel ref={carouselRef} controlsInline={false}>
 *     {[<div>Slide 1</div>, <div>Slide 2</div>, <div>Slide 3</div>]}
 *   </Carousel>
 *   <CarouselControls carouselRef={carouselRef} />
 * </div>
 */

import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  createContext,
  useCallback,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselHandle = {
  next: () => void;
  prev: () => void;
  goTo: (_idx: number) => void;
  current: number;
  maxIndex: number;
  panels: number;
  count: number;
};

type CarouselProps = {
  children: ReactNode[];
  controlsInline?: boolean;
  className?: string;
  panels?: number;
  autoPlay?: number;
  prevButtonClassName?: string;
  nextButtonClassName?: string;
  style?: React.CSSProperties;
  trackStyle?: React.CSSProperties;
  trackClassName?: string;
  enableSwipe?: boolean;
  swipeThreshold?: number;
  lastPageOffset?: number;
  startIndex?: number;
};

const NAV_BUTTON_BASE_CLASS =
  "rounded-full w-12 h-12 p-1 border-[1px] border-nd-border-prominent transition flex items-center justify-center not-hover:bg-black hover:bg-nd-border-prominent";

// Reusable CarouselNavButton component
type CarouselNavButtonProps = {
  onClick: () => void;
  ariaLabel: string;
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

function CarouselNavButton({
  onClick,
  ariaLabel,
  icon,
  className,
  disabled,
}: CarouselNavButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={`${NAV_BUTTON_BASE_CLASS} ${className ?? ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
    >
      {icon}
    </button>
  );
}

type CarouselContextType = {
  current: number;
  maxIndex: number;
  panels: number;
  goTo: (_idx: number) => void;
};

export const CarouselContext = createContext<CarouselContextType | null>(null);

const Carousel = forwardRef<CarouselHandle, CarouselProps>(
  (
    {
      children,
      controlsInline = true,
      className,
      panels = 1,
      autoPlay = 0,
      prevButtonClassName,
      nextButtonClassName,
      style,
      trackStyle: customTrackStyle,
      trackClassName,
      enableSwipe = false,
      swipeThreshold = 50,
      lastPageOffset = 1,
      startIndex,
    },
    ref,
  ) => {
    const count = children.length;
    const panelsToShow = Math.max(1, Math.min(panels, count));
    const numPages = Math.ceil(count / panelsToShow);
    const lastPage = Math.max(0, numPages - lastPageOffset);

    const [currentPage, setCurrentPage] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState(0);
    const [hasSwiped, setHasSwiped] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const swipeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handlePrev = useCallback(() => {
      setHasInteracted(true);
      setCurrentPage((p) => Math.max(p - 1, 0));
    }, []);

    const handleNext = useCallback(() => {
      setHasInteracted(true);
      setCurrentPage((p) => Math.min(p + 1, lastPage));
    }, [lastPage]);

    // Track is 100% * numPages wide
    const trackStyle = {
      width: `${numPages * 100}%`,
      display: "flex",
      transition: isDragging
        ? "none"
        : "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
      transform: `translateX(calc(-${currentPage * (100 / numPages)}% + ${dragOffset}px))`,
    };

    // Each slide is 100 / (numPages * panelsToShow)% of the track
    const slideWidth = `${100 / (numPages * panelsToShow)}%`;

    // Touch/Mouse event handlers
    const handleStart = useCallback(
      (clientX: number, clientY: number) => {
        if (!enableSwipe) return;

        // Clear any existing swipe timeout
        if (swipeTimeoutRef.current) {
          clearTimeout(swipeTimeoutRef.current);
          swipeTimeoutRef.current = null;
        }
        setHasSwiped(false);

        setIsDragging(true);
        setDragStart({ x: clientX, y: clientY });
        setDragOffset(0);
        setHasInteracted(true);
      },
      [enableSwipe],
    );

    const handleMove = useCallback(
      (clientX: number) => {
        if (!isDragging || !enableSwipe) return;

        const deltaX = clientX - dragStart.x;
        setDragOffset(deltaX);
      },
      [isDragging, enableSwipe, dragStart.x],
    );

    const handleEnd = useCallback(() => {
      if (!isDragging || !enableSwipe) return;

      const absOffset = Math.abs(dragOffset);
      const shouldSwipe = absOffset > swipeThreshold;

      if (shouldSwipe) {
        setHasSwiped(true);
        // Clear the swipe flag after a short delay to allow click prevention
        if (swipeTimeoutRef.current) {
          clearTimeout(swipeTimeoutRef.current);
        }
        swipeTimeoutRef.current = setTimeout(() => {
          setHasSwiped(false);
        }, 300);

        if (dragOffset > 0 && currentPage > 0) {
          // Swipe right - go to previous
          handlePrev();
        } else if (dragOffset < 0 && currentPage < lastPage) {
          // Swipe left - go to next
          handleNext();
        }
      } else {
        // If no swipe occurred, clear the flag immediately
        setHasSwiped(false);
      }

      setIsDragging(false);
      setDragOffset(0);
    }, [
      isDragging,
      enableSwipe,
      dragOffset,
      swipeThreshold,
      currentPage,
      lastPage,
      handlePrev,
      handleNext,
    ]);

    // Touch events
    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
      },
      [handleStart],
    );

    const handleTouchMove = useCallback(
      (e: React.TouchEvent) => {
        const touch = e.touches[0];
        handleMove(touch.clientX);
      },
      [handleMove],
    );

    const handleTouchEnd = useCallback(() => {
      handleEnd();
    }, [handleEnd]);

    // Mouse events
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
      },
      [handleStart],
    );

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        handleMove(e.clientX);
      },
      [handleMove],
    );

    const handleMouseUp = useCallback(() => {
      handleEnd();
    }, [handleEnd]);

    const handleMouseClick = useCallback(
      (e: React.MouseEvent) => {
        if (!enableSwipe) return;

        if (hasSwiped || isDragging) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      [enableSwipe, hasSwiped, isDragging],
    );

    // Cleanup swipe timeout on unmount
    useEffect(() => {
      return () => {
        if (swipeTimeoutRef.current) {
          clearTimeout(swipeTimeoutRef.current);
        }
      };
    }, []);

    // Set the current page to the start index if it is provided
    useEffect(() => {
      if (startIndex !== undefined) {
        setCurrentPage(Math.max(0, Math.min(startIndex, lastPage)));
      }
    }, [lastPage, startIndex]);

    // Mouse event listeners
    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    useImperativeHandle(
      ref,
      () => ({
        next: () => setCurrentPage((c) => Math.min(c + panelsToShow, lastPage)),
        prev: () => setCurrentPage((c) => Math.max(c - panelsToShow, 0)),
        goTo: (_idx: number) =>
          setCurrentPage(Math.max(0, Math.min(_idx, lastPage))),
        get current() {
          return currentPage;
        },
        get maxIndex() {
          return lastPage;
        },
        get panels() {
          return panelsToShow;
        },
        get count() {
          return count;
        },
      }),
      [currentPage, lastPage, panelsToShow, count],
    );

    // Intersection Observer to detect visibility
    useEffect(() => {
      const node = containerRef.current;
      if (!node) return;

      const observer = new window.IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 },
      );

      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    }, []);

    // autoPlay effect (now only when visible)
    useEffect(() => {
      if (
        autoPlay > 0 &&
        currentPage < lastPage &&
        !hasInteracted &&
        isVisible
      ) {
        const interval = setInterval(() => {
          setCurrentPage((p) => {
            if (p < lastPage) {
              return p + 1;
            }
            return p;
          });
        }, autoPlay);
        return () => clearInterval(interval);
      }
      return undefined;
    }, [autoPlay, currentPage, lastPage, hasInteracted, isVisible]);

    return (
      <CarouselContext.Provider
        value={{
          current: currentPage,
          maxIndex: lastPage,
          panels: panelsToShow,
          goTo: (_idx: number) =>
            setCurrentPage(Math.max(0, Math.min(_idx, lastPage))),
        }}
      >
        <div
          ref={containerRef}
          className={`relative w-full flex items-center justify-center ${className ?? ""}`}
          style={style}
        >
          {controlsInline && (
            <>
              <CarouselNavButton
                ariaLabel="Previous"
                onClick={handlePrev}
                icon={<ChevronLeft className="w-6 h-6" />}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 ${prevButtonClassName ?? ""}`}
                disabled={currentPage === 0}
              />
              <CarouselNavButton
                ariaLabel="Next"
                onClick={handleNext}
                icon={<ChevronRight className="w-6 h-6" />}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 ${nextButtonClassName ?? ""}`}
                disabled={currentPage === lastPage}
              />
            </>
          )}
          <div className="w-full overflow-hidden z-0 px-14">
            <div
              ref={trackRef}
              className={trackClassName}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onClickCapture={handleMouseClick}
              style={{
                ...trackStyle,
                ...customTrackStyle,
                cursor: enableSwipe
                  ? isDragging
                    ? "grabbing"
                    : "grab"
                  : "default",
                // userSelect: "none",
              }}
            >
              {children.map((item, _idx) => (
                <div
                  key={_idx}
                  style={{
                    width: slideWidth,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ width: "100%" }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CarouselContext.Provider>
    );
  },
);

Carousel.displayName = "Carousel";

export default Carousel;

// External controls for !controlsInline mode
type CarouselControlsProps = {
  carouselRef: React.RefObject<CarouselHandle>;
  className?: string;
  prevButtonClassName?: string;
  nextButtonClassName?: string;
};

export function CarouselControls({
  carouselRef,
  className,
  prevButtonClassName,
  nextButtonClassName,
}: CarouselControlsProps) {
  const [current, setCurrent] = React.useState(0);
  const [maxIndex, setMaxIndex] = React.useState(0);

  // Poll the ref for updates (since CarouselHandle is imperative)
  React.useEffect(() => {
    const update = () => {
      setCurrent(carouselRef.current?.current ?? 0);
      setMaxIndex(carouselRef.current?.maxIndex ?? 0);
    };
    update(); // initial
    const id = setInterval(update, 100); // poll every 100ms
    return () => clearInterval(id);
  }, [carouselRef]);

  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      <CarouselNavButton
        ariaLabel="Previous"
        onClick={() => carouselRef.current?.goTo(current - 1)}
        icon={<ChevronLeft className="w-6 h-6" />}
        disabled={current === 0}
        className={prevButtonClassName ?? ""}
      />
      <CarouselNavButton
        ariaLabel="Next"
        onClick={() => carouselRef.current?.goTo(current + 1)}
        icon={<ChevronRight className="w-6 h-6" />}
        disabled={current >= maxIndex}
        className={nextButtonClassName ?? ""}
      />
    </div>
  );
}
