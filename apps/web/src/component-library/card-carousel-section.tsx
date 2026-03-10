import Carousel, { CarouselControls } from "@/component-library/carousel";
import { useRef } from "react";
import { cn } from "@/app/components/utils";
import { Container } from "./container";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/app/components/ui/button";

export type CardCarouselSectionProps = {
  className?: string;
  wrapperClassName?: string;
  containerClassName?: string;
  cardWidthClassName?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  totalItems?: number;
  children: React.ReactNode | React.ReactNode[];
  desktopLastPageOffset?: number;
  desktop2xlLastPageOffset?: number;
  tabletLastPageOffset?: number;
  mobileLastPageOffset?: number;
  startIndex?: number;
  cta?: React.ReactNode;
  ctaHref?: string;
};

export const CardCarouselSection: React.FC<CardCarouselSectionProps> = ({
  className,
  wrapperClassName,
  containerClassName,
  cardWidthClassName = "w-full",
  title,
  subtitle,
  totalItems = 1,
  children,
  desktop2xlLastPageOffset = 1,
  desktopLastPageOffset = 1,
  tabletLastPageOffset = 1,
  mobileLastPageOffset = 1,
  startIndex,
  cta,
  ctaHref,
}) => {
  const carouselRef = useRef(null);
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isDesktop2xl = useMediaQuery("(min-width: 1440px)");
  const lastPageOffset = isDesktop2xl
    ? desktop2xlLastPageOffset
    : isDesktop
      ? desktopLastPageOffset
      : isTablet
        ? tabletLastPageOffset
        : mobileLastPageOffset;

  return (
    <section
      className={cn("relative overflow-hidden text-white text-left", className)}
    >
      <div className={cn("py-10", wrapperClassName)}>
        <Container className="mb-8 xl:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {(title || subtitle) && (
            // Title and subtitle
            <div className="max-w-xl">
              {title && <h2 className="nd-heading-l">{title}</h2>}
              {subtitle && (
                <p className="text-nd-mid-em-text nd-body-xl max-xl:mt-3 xl:mt-5">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {totalItems > 1 || cta ? (
            <div className="flex gap-3 items-center">
              {/** CTA */}
              {cta && ctaHref && (
                <Button
                  className="h-12 w-auto nd-body-m"
                  asChild
                  variant="secondary-outline"
                  size="lg"
                  rounded
                >
                  <a
                    className="text-inherit"
                    href={ctaHref}
                    rel="noopener noreferrer"
                  >
                    {cta}
                  </a>
                </Button>
              )}

              {/* Carousel controls */}
              {totalItems > 1 ? (
                <div className="hidden xl:inline-flex">
                  <CarouselControls carouselRef={carouselRef} />
                </div>
              ) : null}
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
                "!m-0 [&>div]:!overflow-visible [&>div]:!p-0",
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
            className={cn("flex flex-col gap-4 xl:gap-8", containerClassName)}
          >
            {children}
          </Container>
        )}
      </div>
    </section>
  );
};
