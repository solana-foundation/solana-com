"use client";

import { ChevronLeft } from "@boxicons/react/ChevronLeft";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SelectionColor } from "@/component-library/selection-color";
import { SafeUnicornScene } from "@/components/shared/SafeUnicornScene";
import { useScrollTextHighlight } from "@/hooks/useScrollTextHighlight";

export function PageSelectionColor() {
  return (
    <SelectionColor selectionColor="#14F195" selectionTextColor="#000000" />
  );
}

export function HeroScene() {
  return (
    <SafeUnicornScene
      projectId="microscope-hero"
      className="!absolute inset-0 z-0 !h-full !w-full motion-reduce:hidden"
      jsonFilePath="/src/img/solutions/defi/hero-bg.json"
      width="100%"
      height="100%"
      scale={1}
      fps={30}
      lazyLoad
      production
      onError={(error) => console.error("UnicornScene error:", error)}
    />
  );
}

export function Lead({ children }: { children: ReactNode }) {
  const { ref } = useScrollTextHighlight<HTMLParagraphElement>({
    // solana-green; the hook paints highlighted text black, so it needs a solid fill.
    highlightColor: "#14F195",
  });
  return (
    <p
      ref={ref}
      className="mb-0 max-w-[56rem] text-xl font-medium leading-[1.4] tracking-[-0.6px] text-white md:text-[32px] md:leading-[1.25] md:tracking-[-0.96px]"
    >
      {children}
    </p>
  );
}

export type Panel = {
  src: string;
  title: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export function DashboardCarousel({ panels }: { panels: Panel[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);

  function go(index: number) {
    const next = (index + panels.length) % panels.length;
    const element = track.current;
    if (!element) return;
    const slide = element.children[next] as HTMLElement;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollTo({
      left: slide.offsetLeft - (element.children[0] as HTMLElement).offsetLeft,
      behavior:
        reduce || index < 0 || index >= panels.length ? "instant" : "smooth",
    });
    setSelected(next);
  }

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setSelected(Number((entry.target as HTMLElement).dataset.index));
      },
      { root: element, threshold: 0.6 },
    );
    Array.from(element.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Dashboard panels"
      className="space-y-3"
    >
      <div
        ref={track}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            go(selected + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 focus-visible:outline-2 focus-visible:outline-[#14F195] motion-reduce:scroll-auto"
      >
        {panels.map((panel, index) => (
          <figure
            key={panel.src}
            data-index={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${panels.length}: ${panel.title}`}
            className="min-w-0 basis-full shrink-0 snap-start"
          >
            <a
              href={panel.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${panel.title} full size`}
              className="flex h-64 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-2 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-[#14F195] sm:h-96"
            >
              <img
                src={panel.src}
                alt={panel.alt}
                width={panel.width}
                height={panel.height}
                loading="lazy"
                className="max-h-full max-w-full rounded object-contain"
              />
            </a>
            <figcaption className="mt-4 max-w-3xl text-base leading-[1.5] tracking-[-0.16px] text-[#ABABBA]">
              <span className="mr-2 font-medium tabular-nums text-[#14F195]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="font-medium text-white">{panel.title}.</strong>{" "}
              {panel.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <div
        className="flex items-center justify-start gap-4"
        aria-label="Carousel controls"
      >
        <button
          type="button"
          onClick={() => go(selected - 1)}
          aria-label="Previous panel"
          className="grid size-10 place-items-center rounded-full !bg-white/[0.08] text-white transition-colors hover:!bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14F195]"
        >
          <ChevronLeft pack="filled" className="size-5" aria-hidden="true" />
        </button>
        <div className="flex gap-2">
          {panels.map((panel, index) => (
            <button
              key={panel.src}
              type="button"
              onClick={() => go(index)}
              aria-label={`Go to panel ${index + 1}`}
              aria-current={selected === index ? "true" : undefined}
              className={`size-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14F195] ${selected === index ? "!bg-white" : "!bg-white/30 hover:!bg-white/60"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(selected + 1)}
          aria-label="Next panel"
          className="grid size-10 place-items-center rounded-full !bg-white/[0.08] text-white transition-colors hover:!bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14F195]"
        >
          <ChevronRight pack="filled" className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
