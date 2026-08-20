"use client";

import React, { useCallback, useId } from "react";
import { useScrollTextHighlight } from "../../hooks/useScrollTextHighlight";
import Image from "next/image";
import { useViewportVisibility } from "@/hooks/useViewportVisibility";
import { gsap } from "gsap";
import { cn } from "@/app/components/utils";

export type WhatIsItProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  highlightColor?: string;
  imageSrc?: string;
  ctaButton?: string;
  ctaButtonHref?: string;
};

/**
 * Displays a section with a title and description.
 *
 * @component
 * @param {WhatIsItProps} props - The props for the component.
 * @param {React.ReactNode} props.title - The title of the section.
 * @param {React.ReactNode} props.description - The description of the section.
 * @param {string} props.imageSrc - The source of the image.
 * @param {string} props.highlightColor - The color of the highlight.
 *
 * @example
 * <WhatIsIt
 *   title="What is it?"
 *   description="This is a description of the section."
 *   imageSrc="https://via.placeholder.com/150"
 * />
 */
export const WhatIsIt = ({
  title,
  description,
  highlightColor,
  imageSrc,
  ctaButton,
  ctaButtonHref,
}: WhatIsItProps) => {
  const id = useId();
  const { ref } = useScrollTextHighlight<HTMLParagraphElement>({
    highlightColor: highlightColor || "rgba(255, 255, 255, 0.3)",
  });

  const viewportHandler = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;

      const part1 = document.getElementById(`what-is-part-1-${id}`);
      const part2 = document.getElementById(`what-is-part-2-${id}`);
      const part3 = document.getElementById(`what-is-part-3-${id}`);

      if (!part1 || !part2 || !part3) return;

      // Parallax effect: different layers move at different speeds.
      // part1 (closest) moves most, part3 (farthest) moves least.
      const layers = [
        { el: part1, depth: 10 }, // 10% movement
        { el: part2, depth: 6 }, // 6% movement
        { el: part3, depth: 4 }, // 4% movement
      ];

      // The parallax is decorative and pointer-driven, so it is skipped
      // entirely under reduced motion and on devices that cannot hover. Touch
      // browsers emit one compatibility mousemove on tap and no reliable
      // mouseleave, which would otherwise leave the layers offset for good —
      // visible on touch devices wide enough to render them (the image column
      // is max-xl:hidden, so tablets in landscape and up). In both cases the
      // layers stay in their CSS-defined positions.
      //
      // Matched once per entry rather than through gsap.matchMedia() because
      // GSAP never removes the change listener it registers, and this handler
      // re-runs on every scroll-in — one leaked MediaQueryList per entry. The
      // IntersectionObserver already scopes the effect's lifetime, so a live
      // listener buys nothing: a preference change is picked up on the next
      // entry.
      if (
        !window.matchMedia(
          "(prefers-reduced-motion: no-preference) and (hover: hover)",
        ).matches
      ) {
        return;
      }

      // quickTo batches writes onto the GSAP ticker and eases toward the
      // latest pointer position, so the layers move at frame rate rather than
      // stepping at the ~10 updates/sec a debounced handler allowed.
      const setters = layers.map(({ el, depth }) => ({
        depth,
        x: gsap.quickTo(el, "xPercent", { duration: 0.6, ease: "power3" }),
        y: gsap.quickTo(el, "yPercent", { duration: 0.6, ease: "power3" }),
      }));

      const moveTo = (mouseX: number, mouseY: number) => {
        setters.forEach(({ depth, x, y }) => {
          x(mouseX * depth);
          y(mouseY * depth);
        });
      };

      const handleMouseMove = (event: MouseEvent) => {
        const bounds = node.getBoundingClientRect();

        // Normalized pointer position within the section (-1 to 1). Measured
        // against the section's own box so the offset stays correct as the
        // page scrolls.
        moveTo(
          ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
          ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
        );
      };

      const handleMouseLeave = () => moveTo(0, 0);

      node.addEventListener("mousemove", handleMouseMove);
      node.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        node.removeEventListener("mousemove", handleMouseMove);
        node.removeEventListener("mouseleave", handleMouseLeave);

        // Scrolling the section out of view runs this cleanup without any
        // mouseleave firing (the pointer never left the section), so the layers
        // would otherwise be frozen wherever the easing had reached. Stop the
        // tweens, then snap to rest — the set keeps GSAP's transform cache in
        // sync so the next entry eases from centre rather than from a stale
        // offset. The exit fires 100px outside the viewport, so it is never
        // visible.
        setters.forEach(({ x, y }) => {
          x.tween?.kill();
          y.tween?.kill();
        });
        gsap.set(
          layers.map(({ el }) => el),
          { xPercent: 0, yPercent: 0 },
        );
      };
    },
    [id],
  );

  const { ref: imageRef } = useViewportVisibility<HTMLImageElement>(
    viewportHandler,
    {
      topOffset: 100,
      bottomOffset: 100,
    },
  );

  return (
    <section className="relative bg-black text-white text-left" ref={imageRef}>
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] pt-[64px] md:pt-[112px] xl:pt-[160px] pb-5 md:pb-[32px] xl:pb-[40px]">
        <h2
          className={cn(
            "font-brand font-medium leading-[1.1] md:leading-none text-[40px] md:text-[48px] xl:text-[80px] max-w-2xl mb-[32px] xl:mb-[64px] tracking-[-1.6px] md:tracking-[-1.92px] xl:tracking-[-3.2px]",
            "[&>span]:tracking-[-1.28px] md:[&>span]:tracking-[-1.6px] xl:[&>span]:tracking-[-2.56px] [&>span]:text-[32px] md:[&>span]:text-[40px] xl:[&>span]:text-[64px] [&>span]:leading-[1.25] md:[&>span]:leading-[1.1] xl:[&>span]:leading-[1.125]",
          )}
        >
          {title}
        </h2>
        <div className="flex flex-col xl:items-center xl:flex-row gap-8 xl:gap-16">
          {imageSrc && (
            <div className="w-[35%] max-xl:hidden">
              <div className="relative overflow-hidden rounded-xl translate-z-0">
                <Image
                  id={`what-is-part-1-${id}`}
                  className="w-full h-auto object-cover absolute top-[20%] left-[40%] mix-blend-overlay z-1"
                  src={"/src/img/solutions/what-is-part.svg"}
                  alt=""
                  width={395}
                  height={80}
                  loading="lazy"
                />
                <Image
                  id={`what-is-part-2-${id}`}
                  className="w-full h-auto object-cover absolute top-[60%] left-[40%] mix-blend-overlay z-1"
                  src={"/src/img/solutions/what-is-part.svg"}
                  alt=""
                  width={395}
                  height={80}
                  loading="lazy"
                />
                <Image
                  id={`what-is-part-3-${id}`}
                  className="w-full h-auto object-cover absolute top-[40%] -left-[15%] mix-blend-overlay z-1"
                  src={"/src/img/solutions/what-is-part.svg"}
                  alt=""
                  width={395}
                  height={80}
                  loading="lazy"
                />
                <Image
                  className="w-full h-auto object-cover block"
                  src={imageSrc}
                  alt=""
                  width={600}
                  height={350}
                  loading="lazy"
                />
              </div>
            </div>
          )}
          <div
            className={cn(
              "relative w-full",
              imageSrc ? "xl:w-3/5 max-w-2xl" : " max-w-3xl",
            )}
          >
            <p
              className="text-xl md:text-[32px] mb-0 font-medium tracking-[-0.6px] md:tracking-[-0.96px] leading-[1.4] md:leading-[1.25]"
              ref={ref}
            >
              {description}
            </p>
            {ctaButton && ctaButtonHref && (
              <div className="mt-6 xl:mt-8">
                <a
                  href={ctaButtonHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-white text-black px-5 py-2.5 text-base md:text-lg font-medium hover:bg-white/90 transition-colors tracking-[-0.16px] md:tracking-[-0.18px]"
                >
                  {ctaButton}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
