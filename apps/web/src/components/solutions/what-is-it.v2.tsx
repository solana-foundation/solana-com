"use client";

import React, { useCallback, useId } from "react";
import { useScrollTextHighlight } from "../../hooks/useScrollTextHighlight";
import Image from "next/image";
import { useViewportVisibility } from "@/hooks/useViewportVisibility";
import { debounce } from "lodash";

export type WhatIsItProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  highlightColor?: string;
  imageSrc?: string;
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

      const debouncedMouseMoveHandler = debounce(
        (event: MouseEvent) => {
          // Calculate normalized mouse position (-1 to 1)
          const mouseX = (event.clientX / node.clientWidth) * 2 - 1;
          const mouseY = (event.clientY / node.clientHeight) * 2 - 1;

          // Parallax effect: different layers move at different speeds
          // part1 (closest layer) - moves more
          const part1X = mouseX * 10; // 10% movement
          const part1Y = mouseY * 10;

          // part2 (middle layer) - moves moderately
          const part2X = mouseX * 6; // 6% movement
          const part2Y = mouseY * 6;

          // part3 (farthest layer) - moves least
          const part3X = mouseX * 4; // 4% movement
          const part3Y = mouseY * 4;

          if (part1X && part1Y)
            part1.style.transform = `translateX(${part1X}%) translateY(${part1Y}%)`;
          if (part2X && part2Y)
            part2.style.transform = `translateX(${part2X}%) translateY(${part2Y}%)`;
          if (part3X && part3Y)
            part3.style.transform = `translateX(${part3X}%) translateY(${part3Y}%)`;
        },
        50,
        { leading: true, maxWait: 100 },
      );

      node.addEventListener("mousemove", debouncedMouseMoveHandler);

      return () => {
        node.removeEventListener("mousemove", debouncedMouseMoveHandler);
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
      <div className="max-w-sm md:max-w-3xl xl:max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[40px] pt-[64px] md:pt-[112px] xl:pt-[160px] pb-5 md:pb-[32px] xl:pb-[40px]">
        <h2 className="font-brand font-medium leading-none text-[40px] md:text-[48px] xl:text-[80px] max-w-2xl mb-[32px] xl:mb-[64px]">
          {title}
        </h2>
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-16">
          <div className="w-[35%] max-xl:hidden">
            {imageSrc && (
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
            )}
          </div>
          <div className="relative w-full xl:w-3/5 max-w-2xl">
            <p className="text-xl md:text-3xl mb-0 font-medium" ref={ref}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
