"use client";

import { useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import ImageTreatment from "@/components/ImageTreatment";

const reasons = [
  {
    id: "institutional",
    imageSrc: "/img/gallery/photo-6.jpg",
  },
  {
    id: "infrastructure",
    imageSrc: "/img/gallery/photo-1.jpg",
  },
  {
    id: "builders",
    imageSrc: "/img/gallery/photo-7.jpg",
  },
] as const;

function ImageMask({
  activeIndex,
  t,
}: {
  activeIndex: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const activeReason = reasons[activeIndex] ?? reasons[0];

  return (
    <div
      className="relative aspect-square w-full max-w-[589px] overflow-hidden bg-neutral-800 md:size-[589px] md:max-w-none"
      style={{
        clipPath:
          "polygon(0 0, 78% 0, 78% 6%, 83% 6%, 83% 12%, 90% 12%, 90% 18%, 100% 18%, 100% 88%, 94% 88%, 94% 94%, 87% 94%, 87% 100%, 0 100%)",
      }}
    >
      <ImageTreatment
        key={activeReason.imageSrc}
        src={activeReason.imageSrc}
        alt={t(`items.${activeReason.id}.imageAlt`)}
        glitchPattern="p1"
        intensity={40}
        lighting="even"
        color="blue"
        motion
        flicker
        mouseReactive
        mouseRadius={120}
        objectFit="cover"
        className="absolute inset-0 h-full w-full opacity-90 transition-opacity duration-300"
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
  const t = useTranslations("breakpoint.whyAttend");
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-black pt-[80px] md:pt-[120px] mb-[120px] md:mb-0">
      <div className="mx-auto flex w-full max-w-[1376px] flex-col items-center gap-l px-xs md:px-0">
        <h2 className="type-h3 text-center text-white">{t("headline")}</h2>

        <div className="flex w-full flex-col items-center gap-l md:flex-row md:items-start md:justify-center md:gap-[111px]">
          <ImageMask activeIndex={activeIndex} t={t} />

          <div className="flex w-full flex-col gap-xs md:w-[676px] md:shrink-0">
            {reasons.map((reason, index) => (
              <AccordionItem
                key={reason.id}
                body={t(`items.${reason.id}.body`)}
                index={index}
                isOpen={activeIndex === index}
                onSelect={() => setActiveIndex(index)}
                title={t(`items.${reason.id}.title`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
