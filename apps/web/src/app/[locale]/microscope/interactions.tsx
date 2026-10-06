"use client";

import { ChevronLeft } from "@boxicons/react/ChevronLeft";
import { ChevronRight } from "@boxicons/react/ChevronRight";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export function Tabs({
  label,
  items,
}: {
  label: string;
  items: { name: string; content: ReactNode }[];
}) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function selectHashTarget() {
      const target = document.getElementById(window.location.hash.slice(1));
      const panel = target?.closest<HTMLElement>("[role='tabpanel']");
      if (panel && root.current?.contains(panel)) {
        setSelected(Number(panel.dataset.index));
      }
    }
    selectHashTarget();
    window.addEventListener("hashchange", selectHashTarget);
    return () => window.removeEventListener("hashchange", selectHashTarget);
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      (index + (event.key === "ArrowRight" ? 1 : -1) + items.length) %
      items.length;
    setSelected(next);
    buttons.current[next]?.focus();
  }

  return (
    <div ref={root} className="min-w-0 space-y-3">
      <div
        role="tablist"
        aria-label={label}
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/15 bg-white/[0.04] p-1 font-sans"
      >
        {items.map((item, index) => (
          <button
            key={item.name}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${label.replaceAll(" ", "-")}-tab-${index}`}
            aria-controls={`${label.replaceAll(" ", "-")}-panel-${index}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14F195] sm:px-4 sm:text-sm ${selected === index ? "bg-[#14F195] text-black" : "text-white/65 hover:bg-white/[0.07] hover:text-white"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.name}
          role="tabpanel"
          data-index={index}
          id={`${label.replaceAll(" ", "-")}-panel-${index}`}
          aria-labelledby={`${label.replaceAll(" ", "-")}-tab-${index}`}
          hidden={selected !== index}
          className="min-w-0"
        >
          {item.content}
        </div>
      ))}
    </div>
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
              className="flex h-64 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#111318] p-2 transition-colors hover:border-[#14F195]/50 focus-visible:outline-2 focus-visible:outline-[#14F195] sm:h-96"
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
            <figcaption className="mt-2 text-sm leading-relaxed text-white/60">
              <span className="mr-2 font-mono text-[#14F195]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="text-white">{panel.title}.</strong>{" "}
              {panel.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <div
        className="flex items-center justify-center gap-4"
        aria-label="Carousel controls"
      >
        <button
          type="button"
          onClick={() => go(selected - 1)}
          aria-label="Previous panel"
          className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors hover:border-[#14F195] hover:text-[#14F195] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14F195]"
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
              className={`size-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14F195] ${selected === index ? "bg-[#14F195]" : "bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(selected + 1)}
          aria-label="Next panel"
          className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/[0.04] text-white transition-colors hover:border-[#14F195] hover:text-[#14F195] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14F195]"
        >
          <ChevronRight pack="filled" className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
