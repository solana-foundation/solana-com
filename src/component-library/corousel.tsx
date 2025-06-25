/**
 * Carousel component for cycling through children with optional inline or external controls.
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
  useRef,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  useLayoutEffect,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CarouselHandle = {
  next: () => void;
  prev: () => void;
  goTo: (idx: number) => void;
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
};

const NAV_BUTTON_BASE_CLASS =
  "rounded-full w-10 h-10 p-2 shadow transition flex items-center justify-center bg-[#292c35]/90 hover:bg-white/50";

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

const Carousel = forwardRef<CarouselHandle, CarouselProps>(
  ({ children, controlsInline = true, className, panels = 1 }, ref) => {
    const count = children.length;
    const panelsToShow = Math.max(1, Math.min(panels, count));
    const numPages = Math.ceil(count / panelsToShow);
    const lastPage = Math.max(0, numPages - 1);

    const [currentPage, setCurrentPage] = useState(0);

    const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 0));
    const handleNext = () => setCurrentPage((p) => Math.min(p + 1, lastPage));

    // Track is 100% * numPages wide
    const trackStyle = {
      width: `${numPages * 100}%`,
      display: "flex",
      transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
      transform: `translateX(-${currentPage * (100 / numPages)}%)`,
    };

    // Each slide is 100 / (numPages * panelsToShow)% of the track
    const slideWidth = `${100 / (numPages * panelsToShow)}%`;

    useImperativeHandle(
      ref,
      () => ({
        next: () => setCurrentPage((c) => Math.min(c + panelsToShow, lastPage)),
        prev: () => setCurrentPage((c) => Math.max(c - panelsToShow, 0)),
        goTo: (idx: number) =>
          setCurrentPage(Math.max(0, Math.min(idx, lastPage))),
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

    return (
      <div
        className={`relative w-full flex items-center justify-center ${className ?? ""}`}
      >
        {controlsInline && (
          <>
            <CarouselNavButton
              ariaLabel="Previous"
              onClick={handlePrev}
              icon={<ChevronLeft className="w-6 h-6" />}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20"
              disabled={currentPage === 0}
            />
            <CarouselNavButton
              ariaLabel="Next"
              onClick={handleNext}
              icon={<ChevronRight className="w-6 h-6" />}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20"
              disabled={currentPage === lastPage}
            />
          </>
        )}
        <div className="w-full overflow-hidden z-0 px-14">
          <div style={trackStyle}>
            {children.map((item, idx) => (
              <div
                key={idx}
                style={{
                  width: slideWidth,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "100%" }}>{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

Carousel.displayName = "Carousel";

export default Carousel;

// External controls for !controlsInline mode
type CarouselControlsProps = {
  carouselRef: React.RefObject<CarouselHandle>;
  className?: string;
};

export function CarouselControls({
  carouselRef,
  className,
}: CarouselControlsProps) {
  const current = carouselRef.current?.current ?? 0;
  const maxIndex = carouselRef.current?.maxIndex ?? 0;
  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      <CarouselNavButton
        ariaLabel="Previous"
        onClick={() => carouselRef.current?.prev()}
        icon={<ChevronLeft className="w-6 h-6" />}
        disabled={current === 0}
      />
      <CarouselNavButton
        ariaLabel="Next"
        onClick={() => carouselRef.current?.next()}
        icon={<ChevronRight className="w-6 h-6" />}
        disabled={current >= maxIndex}
      />
    </div>
  );
}
