"use client";

import { useState } from "react";

const reasons = [
  {
    title: "The institutional turn",
    body: "Last year, J.P. Morgan, Goldman Sachs, BlackRock, State Street, and Citigroup all deployed production capital on Solana. At Breakpoint, the teams behind these integrations share what's next - and what they need from builders.",
    imageSrc: "/img/gallery/photo-6.jpg",
    imageAlt: "Breakpoint attendees watching a main stage presentation",
  },
  {
    title: "The infrastructure leap",
    body: "Alpenglow. Firedancer. P-Token. Constellation. The Solana network is shipping the most significant upgrades in its history. Hear directly from the engineers building the consensus and execution layers that will power global finance.",
    imageSrc: "/img/gallery/photo-1.jpg",
    imageAlt: "Breakpoint attendees talking with a Solana ecosystem team",
  },
  {
    title: "The builder economy",
    body: "75+ products launched at Breakpoint 2025. From tokenized equities and AI agents to stablecoin payroll and machine-to-machine payments - Breakpoint is where the Solana ecosystem ships. This year, it ships in London.",
    imageSrc: "/img/gallery/photo-7.jpg",
    imageAlt: "Breakpoint attendees entering the general admission area",
  },
] as const;

function ImageMask({ activeIndex }: { activeIndex: number }) {
  const activeReason = reasons[activeIndex] ?? reasons[0];

  return (
    <div
      className="relative aspect-square w-full max-w-[589px] overflow-hidden bg-neutral-800 md:size-[589px] md:max-w-none"
      style={{
        clipPath:
          "polygon(0 0, 78% 0, 78% 6%, 83% 6%, 83% 12%, 90% 12%, 90% 18%, 100% 18%, 100% 88%, 94% 88%, 94% 94%, 87% 94%, 87% 100%, 0 100%)",
      }}
    >
      <img
        key={activeReason.imageSrc}
        src={activeReason.imageSrc}
        alt={activeReason.imageAlt}
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-300"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-blue mix-blend-color"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/35 mix-blend-multiply"
      />
    </div>
  );
}

function AccordionItem({
  body,
  index,
  isOpen,
  onSelect,
  title,
}: {
  body: string;
  index: number;
  isOpen: boolean;
  onSelect: () => void;
  title: string;
}) {
  const panelId = `why-breakpoint-panel-${index}`;
  const buttonId = `why-breakpoint-trigger-${index}`;

  return (
    <div
      className={`border-t pb-3 pt-6 ${
        isOpen ? "border-white" : "border-neutral-700"
      }`}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onSelect}
        className="accordion-control group flex w-full cursor-pointer items-start text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span
          className={`type-p-large-bold transition-colors ${
            isOpen
              ? "text-white"
              : "text-text-secondary opacity-60 group-hover:text-white group-hover:opacity-100"
          }`}
        >
          {title}
        </span>
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="pt-3"
        >
          <p className="type-paragraph text-white">{body}</p>
        </div>
      )}
    </div>
  );
}

export default function WhyAttendSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-black pt-[80px] md:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1376px] flex-col items-center gap-l px-xs md:px-0">
        <h2 className="type-h3 text-center text-white">Why Breakpoint</h2>

        <div className="flex w-full flex-col items-center gap-l md:flex-row md:items-start md:justify-center md:gap-[111px]">
          <ImageMask activeIndex={activeIndex} />

          <div className="flex w-full flex-col gap-xs md:w-[676px] md:shrink-0">
            {reasons.map((reason, index) => (
              <AccordionItem
                key={reason.title}
                body={reason.body}
                index={index}
                isOpen={activeIndex === index}
                onSelect={() => setActiveIndex(index)}
                title={reason.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
