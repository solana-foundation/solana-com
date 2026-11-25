"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { ProjectDiagram, type DiagramLabels } from "./privacy-diagrams";

export type EcosystemShowcaseItem = {
  key: string;
  title: string;
  category: string;
  description: string;
  href: string;
  host: string;
};

const DWELL_MS = 4500;
const EASE = [0.22, 1, 0.36, 1] as const;

function isExternal(href: string) {
  return /^(https?:)?\/\//i.test(href);
}

export function EcosystemShowcase({
  items,
  visitLabel,
  listLabel,
  diagramLabels,
}: {
  items: EcosystemShowcaseItem[];
  diagramLabels: DiagramLabels;
  /** Receives the project name, returns the link label. */
  visitLabel: (name: string) => string;
  listLabel: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const autoplay = !reduce && !paused && !focusWithin && !interacted && inView;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % items.length),
      DWELL_MS,
    );
    return () => window.clearTimeout(id);
  }, [autoplay, active, items.length]);

  const select = (index: number) => {
    setInteracted(true);
    setActive(index);
  };

  const item = items[active];
  const external = isExternal(item.href);

  return (
    <div
      ref={rootRef}
      className="mt-12 grid gap-8 md:mt-16 xl:grid-cols-[0.9fr_1.1fr] xl:gap-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Keep the focused link in place for keyboard users.
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
    >
      <div
        role="group"
        aria-label={listLabel}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] xl:mx-0 xl:flex-col xl:gap-0 xl:overflow-visible xl:px-0 xl:pb-0"
      >
        {items.map((entry, index) => {
          const selected = index === active;
          return (
            <button
              key={entry.key}
              type="button"
              aria-pressed={selected}
              aria-controls="privacy-eco-panel"
              onClick={() => select(index)}
              className={`group relative shrink-0 !bg-transparent text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nd-highlight-green xl:w-full xl:border-b xl:border-nd-border-light xl:py-3 ${selected ? "text-white" : "text-white/40 hover:text-white/80"} max-xl:rounded-full max-xl:border max-xl:px-4 max-xl:py-2 ${selected ? "max-xl:border-white/40" : "max-xl:border-nd-border-light"}`}
            >
              <span className="flex items-baseline gap-4">
                <span className="font-brand text-sm font-medium tracking-[-0.02em] xl:text-[28px] xl:leading-tight">
                  {entry.title}
                </span>
              </span>
              {selected && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-[-1px] hidden h-px overflow-hidden xl:block"
                >
                  <motion.span
                    key={`${active}-${autoplay}`}
                    className="block h-full origin-left bg-nd-highlight-green"
                    initial={{ scaleX: autoplay ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: autoplay ? DWELL_MS / 1000 : 0,
                      ease: "linear",
                    }}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        id="privacy-eco-panel"
        className="relative flex flex-col justify-center overflow-hidden rounded-3xl border border-nd-border-prominent bg-white/[0.03] p-6 md:p-10"
      >
        <div className="relative grid gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`diagram-${item.key}`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="rounded-2xl border border-nd-border-light bg-black/40 p-4"
            >
              <ProjectDiagram
                project={item.key}
                labels={diagramLabels}
                reduce={reduce}
              />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={item.key}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <span className="inline-block rounded-full border border-nd-border-prominent px-3 py-1 font-brand-mono text-[10px] uppercase tracking-[0.14em] text-nd-mid-em-text">
                {item.category}
              </span>
              <h3 className="nd-heading-m mt-5">{item.title}</h3>
              <p className="nd-body-m mt-4 text-nd-mid-em-text">
                {item.description}
              </p>
              <a
                href={item.href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={visitLabel(item.title)}
              >
                {item.host}
                <ArrowUpRight className="!size-4" aria-hidden="true" />
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
