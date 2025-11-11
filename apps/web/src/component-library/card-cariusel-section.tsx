import Carousel, { CarouselControls } from "@/component-library/carousel";
import { useRef } from "react";
import { cn } from "@/app/components/utils";
import { Container } from "./container";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type CardCariuselSectionProps = {
  className?: string;
  wrapperClassName?: string;
  containerClassName?: string;
  cardWidthClassName?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  totalItems?: number;
  children: React.ReactNode | React.ReactNode[];
  desktopLastPageOffset?: number;
  tabletLastPageOffset?: number;
  mobileLastPageOffset?: number;
  startIndex?: number;
};

export const CardCariuselSection: React.FC<CardCariuselSectionProps> = ({
  className,
  wrapperClassName,
  containerClassName,
  cardWidthClassName = "w-full",
  title,
  subtitle,
  totalItems = 1,
  children,
  desktopLastPageOffset = 1,
  tabletLastPageOffset = 1,
  mobileLastPageOffset = 1,
  startIndex,
}) => {
  const carouselRef = useRef(null);
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const lastPageOffset = isDesktop
    ? desktopLastPageOffset
    : isTablet
      ? tabletLastPageOffset
      : mobileLastPageOffset;

  return (
    <section
      className={cn("relative overflow-hidden text-white text-left", className)}
    >
      <div
        className={cn(
          "py-[64px] md:py-[108px] xl:py-[160px]",
          wrapperClassName,
        )}
      >
        <Container className="mb-twd-8 xl:mb-twd-12 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-twd-4">
          {(title || subtitle) && (
            // Title and subtitle
            <div className="max-w-xl">
              {title && <h2 className="nd-heading-l">{title}</h2>}
              {subtitle && (
                <p className="text-nd-mid-em-text nd-body-xl max-xl:mt-twd-3 xl:mt-twd-5">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {totalItems > 1 ? (
            // Carousel controls
            <div className="hidden xl:inline-flex">
              <CarouselControls carouselRef={carouselRef} />
            </div>
          ) : null}
        </Container>
        {totalItems > 1 ? (
          // Carousel
          <Container>
            <Carousel
              controlsInline={false}
              panels={1}
              enableSwipe={true}
              className={cn(
                "!m-twd-0 [&>div]:!overflow-visible [&>div]:!p-twd-0",
                cardWidthClassName,
                containerClassName,
              )}
              ref={carouselRef}
              lastPageOffset={lastPageOffset}
              startIndex={startIndex}
            >
              {Array.isArray(children) ? children : [children]}
            </Carousel>
          </Container>
        ) : (
          // Already stacks on mobile, no change needed
          <Container
            className={cn(
              "flex flex-col gap-twd-4 xl:gap-twd-8",
              containerClassName,
            )}
          >
            {children}
          </Container>
        )}
      </div>
    </section>
  );
};
